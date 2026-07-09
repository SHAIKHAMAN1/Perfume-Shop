/**
 * GET   /api/admin/products  — paginated product list with search/filter
 * POST  /api/admin/products  — create new product
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import "@/models/Brand";
import "@/models/Category";
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
    const q      = searchParams.get("q");
    const status = searchParams.get("status"); // active | inactive
    const sort   = searchParams.get("sort") ?? "newest";

    const filter = {};
    if (q) filter.$text = { $search: q };
    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;
    if (searchParams.get("lowStock") === "true") filter.stock = { $gt: 0, $lte: 10 };
    if (searchParams.get("outOfStock") === "true") filter.stock = 0;

    const sortMap = {
      newest     : { createdAt: -1 },
      oldest     : { createdAt:  1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      stock      : { stock: 1 },
      sold       : { soldCount: -1 },
    };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortMap[sort] ?? { createdAt: -1 })
        .skip(skip).limit(limit)
        .populate("brand", "name")
        .populate("category", "name")
        .select("name slug sku price salePrice stock images isActive isFeatured brand category soldCount rating createdAt")
        .lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({ products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("[admin/products GET]", error);
    return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();

    // ── Server-side validation ────────────────────────────────────────
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }
    if (!body.brand || body.brand === "") {
      return NextResponse.json({ error: "Brand is required." }, { status: 400 });
    }
    if (!body.category || body.category === "") {
      return NextResponse.json({ error: "Category is required." }, { status: 400 });
    }
    if (!body.price || isNaN(body.price) || body.price <= 0) {
      return NextResponse.json({ error: "A valid price is required." }, { status: 400 });
    }
    if (body.stock === undefined || body.stock === null || isNaN(body.stock) || body.stock < 0) {
      return NextResponse.json({ error: "A valid stock quantity is required." }, { status: 400 });
    }
    // ────────────────────────────────────────────────────────────────

    // Auto-generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    const product = await Product.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "A product with this slug or SKU already exists." }, { status: 409 });
    }
    console.error("[admin/products POST]", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

