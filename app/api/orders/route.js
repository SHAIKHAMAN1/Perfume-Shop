/**
 * GET  /api/orders          — list current user's orders
 * POST /api/orders          — (internal) create order (used by checkout)
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import { getSessionUser } from "@/lib/getSessionUser";

export async function GET(request) {
  try {
    await connectDB();
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(20, parseInt(searchParams.get("limit") ?? "10"));
    const skip  = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-timeline -billingAddress -gatewayResponse")
        .lean(),
      Order.countDocuments({ user: user._id }),
    ]);

    return NextResponse.json({ orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("[orders/GET]", error);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}
