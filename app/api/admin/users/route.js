/** GET /api/admin/users — paginated customer list */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
    const skip  = (page - 1) * limit;
    const q     = searchParams.get("q");
    const role  = searchParams.get("role") ?? "customer";

    const filter = { role };
    if (q) filter.$or = [
      { name : { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
        .select("name email avatar role isBlocked loyaltyPoints createdAt lastLoginAt")
        .lean(),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({ users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}
