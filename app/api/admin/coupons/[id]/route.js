/** PUT/DELETE /api/admin/coupons/[id] */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Coupon from "@/models/Coupon";
import { requireAdmin } from "@/lib/adminAuth";

export async function PUT(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const { id } = await params;
    const body   = await request.json();
    const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!coupon) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ coupon });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  await connectDB();
  const { id } = await params;
  await Coupon.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
