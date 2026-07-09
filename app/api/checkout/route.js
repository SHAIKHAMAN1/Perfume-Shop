/**
 * POST /api/checkout
 * Creates a Razorpay order and a pending Order document in MongoDB.
 * The client then opens the Razorpay payment modal using the returned order ID.
 *
 * Body:
 * {
 *   items         : [{ productId, name, image, price, quantity, volume, sku }],
 *   shippingAddress: { fullName, phone, line1, line2, city, state, pincode },
 *   couponCode    : string | null,
 *   giftWrap      : boolean,
 *   giftMessage   : string,
 * }
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import { getRazorpay, isRazorpayConfigured } from "@/lib/razorpay";
import { getSessionUser } from "@/lib/getSessionUser";

const SHIPPING_FREE_THRESHOLD = 1999;
const SHIPPING_CHARGE         = 149;

export async function POST(request) {
  try {
    await connectDB();

    // Auth check
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Please sign in to checkout." }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, couponCode, giftWrap = false, giftMessage = "" } = body;

    // Validate items
    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }
    if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.pincode) {
      return NextResponse.json({ error: "Incomplete shipping address." }, { status: 400 });
    }

    // Re-fetch prices from DB (never trust client-side prices)
    const productIds = items.map((i) => i.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds }, isActive: true }).lean();

    const verifiedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const dbProduct = dbProducts.find((p) => String(p._id) === String(item.productId));
      if (!dbProduct) {
        return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 400 });
      }
      if (dbProduct.stock < item.quantity) {
        return NextResponse.json({
          error: `Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stock}`,
        }, { status: 400 });
      }

      const price = dbProduct.salePrice ?? dbProduct.price;
      subtotal   += price * item.quantity;

      verifiedItems.push({
        product  : dbProduct._id,
        name     : dbProduct.name,
        image    : dbProduct.images?.[0] ?? "",
        price,
        quantity : item.quantity,
        volume   : item.volume ?? null,
        sku      : dbProduct.sku ?? "",
      });
    }

    // Coupon
    let couponDiscount = 0;
    let appliedCoupon  = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && subtotal >= coupon.minOrderValue) {
        if (coupon.type === "flat") {
          couponDiscount = coupon.value;
        } else {
          couponDiscount = (subtotal * coupon.value) / 100;
          if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
        }
        couponDiscount = Math.round(Math.min(couponDiscount, subtotal));
        appliedCoupon  = coupon;
      }
    }

    // Shipping
    const shippingCharge = subtotal - couponDiscount >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_CHARGE;
    const total          = Math.round(subtotal - couponDiscount + shippingCharge);

    // Create MongoDB order (pending)
    const order = await Order.create({
      user           : user._id,
      items          : verifiedItems,
      shippingAddress,
      billingAddress : shippingAddress,
      subtotal,
      couponCode     : appliedCoupon?.code ?? null,
      couponDiscount,
      shippingCharge,
      total,
      paymentMethod  : "razorpay",
      paymentStatus  : "pending",
      status         : "pending",
      giftWrap,
      giftMessage,
      timeline       : [{ status: "pending", message: "Order created, awaiting payment." }],
    });

    // Create Razorpay order (amounts in paise)
    if (!isRazorpayConfigured()) {
      // Return order without Razorpay for COD / testing
      return NextResponse.json({
        orderId        : order._id,
        orderNumber    : order.orderNumber,
        razorpayOrderId: null,
        amount         : total,
        currency       : "INR",
        key            : null,
        prefill        : { name: shippingAddress.fullName, contact: shippingAddress.phone, email: user.email },
        razorpayMissing: true,
      });
    }

    const rzp = getRazorpay();
    const rzpOrder = await rzp.orders.create({
      amount  : total * 100,            // paise
      currency: "INR",
      receipt : String(order._id),
      notes   : { orderNumber: order.orderNumber, userId: String(user._id) },
    });

    // Store Razorpay order ID in our order
    order.set("razorpayOrderId", rzpOrder.id);
    await order.save();

    return NextResponse.json({
      orderId        : order._id,
      orderNumber    : order.orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount         : total,
      currency       : "INR",
      key            : process.env.RAZORPAY_KEY_ID,
      prefill        : {
        name   : shippingAddress.fullName,
        contact: shippingAddress.phone,
        email  : user.email ?? "",
      },
    });
  } catch (error) {
    console.error("[checkout/POST]", error);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}
