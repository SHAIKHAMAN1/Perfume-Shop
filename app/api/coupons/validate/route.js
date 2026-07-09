/**
 * POST /api/coupons/validate
 * Validates a coupon code against the database and returns the discount amount.
 * Body: { code: string, subtotal: number }
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Coupon from "@/models/Coupon";
import { getSessionUser } from "@/lib/getSessionUser";

export async function POST(request) {
  try {
    await connectDB();
    const { code, subtotal = 0 } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
    }

    const coupon = await Coupon.findOne({
      code    : code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid or expired coupon code." }, { status: 404 });
    }

    // Check expiry
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
    }

    // Check max uses
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 400 });
    }

    // Check min order value
    if (subtotal < coupon.minOrderValue) {
      return NextResponse.json({
        error: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon.`,
      }, { status: 400 });
    }

    // Check per-user limit (if user is logged in)
    const user = await getSessionUser(request).catch(() => null);
    if (user && coupon.perUserLimit > 0) {
      const userUsages = coupon.usedBy.filter((id) => String(id) === String(user._id)).length;
      if (userUsages >= coupon.perUserLimit) {
        return NextResponse.json({ error: "You have already used this coupon." }, { status: 400 });
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === "flat") {
      discount = coupon.value;
    } else if (coupon.type === "percentage") {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    }
    discount = Math.round(Math.min(discount, subtotal));

    return NextResponse.json({
      valid   : true,
      discount,
      code    : coupon.code,
      message : `${coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`} off applied!`,
    });
  } catch (error) {
    console.error("[coupons/validate]", error);
    return NextResponse.json({ error: "Failed to validate coupon." }, { status: 500 });
  }
}
