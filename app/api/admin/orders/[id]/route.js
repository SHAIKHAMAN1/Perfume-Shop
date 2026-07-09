/**
 * GET   /api/admin/orders/[id]  — full order detail
 * PATCH /api/admin/orders/[id]  — update status / tracking
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import "@/models/User";
import { requireAdmin } from "@/lib/adminAuth";
import { getSessionUser } from "@/lib/getSessionUser";

export async function GET(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  await connectDB();
  const { id } = await params;
  const order = await Order.findById(id).populate("user", "name email phone").lean();
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await connectDB();
    const { id } = await params;
    const admin  = await getSessionUser(request);
    const { status, trackingNumber, trackingUrl, note } = await request.json();

    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const VALID = ["pending","confirmed","packed","dispatched","out_for_delivery","shipped","delivered","cancelled","returned","refunded"];
    if (status && !VALID.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    if (status) {
      order.status = status;
      order.timeline.push({
        status,
        message   : note ?? `Status updated to ${status}`,
        updatedBy : admin?._id,
      });
      if (status === "delivered") order.deliveredAt = new Date();
    }
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl)    order.trackingUrl    = trackingUrl;

    await order.save();
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
