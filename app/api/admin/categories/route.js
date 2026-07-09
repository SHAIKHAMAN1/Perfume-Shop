import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("[admin/categories GET]", error);
    return NextResponse.json({ error: "Failed to fetch categories." }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body     = await request.json();
    const category = await Category.create(body);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("[admin/categories POST]", error);
    return NextResponse.json({ error: error.message || "Failed to create category." }, { status: 500 });
  }
}
