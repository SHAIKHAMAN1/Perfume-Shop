import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  await connectDB();
  const category = await Category.findById(params.id).lean();
  if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
  return NextResponse.json({ category });
}

export async function PUT(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const body     = await request.json();
    const category = await Category.findByIdAndUpdate(params.id, body, { new: true });
    if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  await connectDB();
  await Category.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
