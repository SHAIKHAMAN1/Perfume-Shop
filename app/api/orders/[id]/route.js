/**
 * GET    /api/orders/[id]   — order detail
 * PATCH  /api/orders/[id]   — cancel an order (customer)
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import "@/models/Product";
import "@/models/Brand";
import "@/models/Category";
import { getSessionUser } from "@/lib/getSessionUser";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { id } = await params;
    const order = await Order.findOne({ _id: id, user: user._id })
      .populate("items.product", "name slug images")
      .lean();

    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order." }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { id } = await params;
    const { action } = await request.json();

    const order = await Order.findOne({ _id: id, user: user._id });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    if (action === "cancel") {
      const cancellableStatuses = ["pending", "confirmed"];
      if (!cancellableStatuses.includes(order.status)) {
        return NextResponse.json({
          error: `Cannot cancel an order with status "${order.status}". Please contact support.`,
        }, { status: 400 });
      }
      order.status = "cancelled";
      order.timeline.push({ status: "cancelled", message: "Cancelled by customer.", updatedBy: user._id });
      await order.save();
      return NextResponse.json({ success: true, message: "Order cancelled successfully." });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
  }
}
