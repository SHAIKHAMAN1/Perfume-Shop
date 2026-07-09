/**
 * GET  /api/admin/coupons  — list all coupons
 * POST /api/admin/coupons  — create coupon
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Coupon from "@/models/Coupon";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  await connectDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ coupons });
}

export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const body   = await request.json();
    const coupon = await Coupon.create(body);
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Coupon code already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
