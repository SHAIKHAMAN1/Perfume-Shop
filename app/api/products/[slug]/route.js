import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import "@/models/Brand";
import "@/models/Category";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { slug } = await params;

    const product = await Product.findOne({ slug, isActive: true })
      .populate("brand", "name slug logo")
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // Fetch related products (same brand or category, exclude this product)
    const related = await Product.find({
      isActive: true,
      _id: { $ne: product._id },
      $or: [{ brand: product.brand?._id }, { category: product.category?._id }],
    })
      .limit(8)
      .populate("brand", "name slug")
      .select("name slug images price salePrice rating reviewCount brand isBestSeller isNewArrival concentration gender stock")
      .lean();

    return NextResponse.json({ product, related });
  } catch (error) {
    console.error("[products/slug/GET]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
