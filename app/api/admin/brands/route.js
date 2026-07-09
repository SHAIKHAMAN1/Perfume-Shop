import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Brand from "@/models/Brand";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await connectDB();
    const brands = await Brand.find({}).sort({ name: 1 }).lean();
    return NextResponse.json({ brands });
  } catch (error) {
    console.error("[admin/brands GET]", error);
    return NextResponse.json({ error: "Failed to fetch brands." }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body  = await request.json();
    const brand = await Brand.create(body);
    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    console.error("[admin/brands POST]", error);
    return NextResponse.json({ error: error.message || "Failed to create brand." }, { status: 500 });
  }
}
