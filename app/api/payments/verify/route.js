/**
 * POST /api/payments/verify
 * Called by the CLIENT immediately after Razorpay modal closes successfully.
 * Verifies the HMAC signature and confirms the order.
 *
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { getSessionUser } from "@/lib/getSessionUser";

export async function POST(request) {
  try {
    await connectDB();

    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await request.json();

    // Find order
    const order = await Order.findOne({ _id: orderId, user: user._id });
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    if (order.paymentStatus === "paid") {
      return NextResponse.json({ success: true, orderNumber: order.orderNumber }); // idempotent
    }

    // Verify signature
    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      order.paymentStatus = "failed";
      order.status        = "cancelled";
      order.timeline.push({ status: "cancelled", message: "Payment signature verification failed." });
      await order.save();
      return NextResponse.json({ error: "Payment verification failed. Please contact support." }, { status: 400 });
    }

    // Save Payment document
    const paymentDoc = await Payment.create({
      order             : order._id,
      user              : user._id,
      provider          : "razorpay",
      razorpayOrderId   : razorpay_order_id,
      razorpayPaymentId : razorpay_payment_id,
      razorpaySignature : razorpay_signature,
      amount            : order.total,
      currency          : "INR",
      status            : "paid",
    });

    // Update order
    order.paymentStatus = "paid";
    order.status        = "confirmed";
    order.payment       = paymentDoc._id;
    order.timeline.push({ status: "confirmed", message: `Payment verified (ID: ${razorpay_payment_id})` });
    await order.save();

    // Decrement stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
    }

    // Increment coupon usage
    if (order.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: order.couponCode },
        { $inc: { usedCount: 1 }, $addToSet: { usedBy: user._id } }
      );
    }

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("[payments/verify]", error);
    return NextResponse.json({ error: "Payment verification failed." }, { status: 500 });
  }
}
