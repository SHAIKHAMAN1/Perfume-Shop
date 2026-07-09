/**
 * GET    /api/admin/products/[id]  — product detail
 * PUT    /api/admin/products/[id]  — full update
 * DELETE /api/admin/products/[id]  — soft delete (isActive = false)
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import "@/models/Brand";
import "@/models/Category";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  await connectDB();
  const { id } = await params;
  const product = await Product.findById(id).populate("brand category").lean();
  if (!product) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!product) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  await connectDB();
  const { id } = await params;
  await Product.findByIdAndUpdate(id, { isActive: false });
  return NextResponse.json({ success: true });
}
