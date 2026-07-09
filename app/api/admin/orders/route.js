/**
 * GET   /api/admin/orders   — paginated order list
 * (Create handled by checkout API)
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import "@/models/User";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit  = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
    const skip   = (page - 1) * limit;
    const status = searchParams.get("status");
    const q      = searchParams.get("q");

    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (q) filter.$or = [
      { orderNumber: { $regex: q, $options: "i" } },
    ];

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit)
        .populate("user", "name email")
        .select("orderNumber status paymentStatus total createdAt items user shippingAddress couponCode")
        .lean(),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json({ orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}
