import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Brand from "@/models/Brand";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  await connectDB();
  const brand = await Brand.findById(params.id).lean();
  if (!brand) return NextResponse.json({ error: "Brand not found." }, { status: 404 });
  return NextResponse.json({ brand });
}

export async function PUT(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const body  = await request.json();
    const brand = await Brand.findByIdAndUpdate(params.id, body, { new: true });
    if (!brand) return NextResponse.json({ error: "Brand not found." }, { status: 404 });
    return NextResponse.json({ brand });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  await connectDB();
  await Brand.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
