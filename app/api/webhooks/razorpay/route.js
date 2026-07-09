/**
 * POST /api/webhooks/razorpay
 * Called by Razorpay after payment is completed/failed.
 * Verifies HMAC signature, updates Order + Payment, decrements stock.
 *
 * Configure webhook in Razorpay Dashboard:
 *   URL: https://your-domain/api/webhooks/razorpay
 *   Events: payment.captured, payment.failed, order.paid
 *   Webhook Secret: set as RAZORPAY_WEBHOOK_SECRET in .env.local
 */
import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";

async function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return true; // Skip in dev if not set
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

/**
 * Find our Order document from Razorpay payment event.
 * Primary:  payment.receipt  → set to String(order._id) in checkout API
 * Fallback: payment.order_id → stored as razorpayOrderId on Order
 */
async function findOrder(payment) {
  // Primary: receipt is the MongoDB ObjectId we set during order creation
  if (payment.receipt) {
    const order = await Order.findById(payment.receipt).catch(() => null);
    if (order) return order;
  }
  // Fallback: look up by Razorpay order ID stored on our order doc
  if (payment.order_id) {
    const order = await Order.findOne({ razorpayOrderId: payment.order_id }).catch(() => null);
    if (order) return order;
  }
  return null;
}

export async function POST(request) {
  try {
    const rawBody   = await request.text();
    const signature = request.headers.get("x-razorpay-signature") ?? "";

    if (!(await verifyWebhookSignature(rawBody, signature))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    await connectDB();

    // ── payment.captured ──────────────────────────────────────
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const { order_id, id: paymentId, amount } = payment;

      const dbOrder = await findOrder(payment);
      if (!dbOrder) {
        console.warn("[webhook] Order not found for receipt:", payment.receipt, "razorpay order_id:", order_id);
        return NextResponse.json({ received: true });
      }

      // Idempotency — skip if already confirmed
      if (dbOrder.paymentStatus === "paid") {
        console.log("[webhook] Order already paid, skipping:", dbOrder.orderNumber);
        return NextResponse.json({ received: true });
      }

      // Create / update Payment document
      await Payment.findOneAndUpdate(
        { razorpayOrderId: order_id },
        {
          order             : dbOrder._id,
          user              : dbOrder.user,
          provider          : "razorpay",
          razorpayOrderId   : order_id,
          razorpayPaymentId : paymentId,
          amount            : amount / 100,
          currency          : payment.currency,
          status            : "paid",
          gatewayResponse   : payment,
        },
        { upsert: true, new: true }
      );

      // Update order status
      dbOrder.paymentStatus = "paid";
      dbOrder.status        = "confirmed";
      dbOrder.timeline.push({ status: "confirmed", message: `Payment received (ID: ${paymentId})` });
      await dbOrder.save();

      // Decrement product stock
      for (const item of dbOrder.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity, soldCount: item.quantity },
        });
      }

      // Increment coupon usage
      if (dbOrder.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: dbOrder.couponCode },
          { $inc: { usedCount: 1 }, $addToSet: { usedBy: dbOrder.user } }
        );
      }

      console.log(`[webhook] Order ${dbOrder.orderNumber} confirmed. Payment: ${paymentId}`);
    }

    // ── payment.failed ────────────────────────────────────────
    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const dbOrder = await findOrder(payment);
      if (dbOrder && dbOrder.paymentStatus !== "paid") {
        dbOrder.paymentStatus = "failed";
        dbOrder.status        = "cancelled";
        dbOrder.timeline.push({ status: "cancelled", message: "Payment failed via webhook." });
        await dbOrder.save();
      }
      // Update payment doc
      await Payment.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { status: "failed", gatewayResponse: payment },
        { upsert: true }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook/razorpay]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
