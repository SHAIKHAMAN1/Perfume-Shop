import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
// Pre-import so Mongoose has the schemas registered before populate() runs
import "@/models/Brand";
import "@/models/Category";

/**
 * GET /api/products
 * Query params:
 *   q, gender, category, brand, sort, page, limit,
 *   featured, bestSeller, newArrival, minPrice, maxPrice, discount
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page       = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit      = Math.min(48, parseInt(searchParams.get("limit") ?? "12"));
    const skip       = (page - 1) * limit;

    /* ── Build filter ── */
    const filter = { isActive: true };

    const q = searchParams.get("q");
    if (q) filter.$text = { $search: q };

    const gender = searchParams.get("gender");
    if (gender) filter.gender = gender;

    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      // Category is a ref — resolve slug first
      const Category = (await import("@/models/Category")).default;
      const cat = await Category.findOne({ slug: categorySlug }).lean();
      if (cat) filter.category = cat._id;
    }

    const brandSlug = searchParams.get("brand");
    if (brandSlug) {
      const Brand = (await import("@/models/Brand")).default;
      const br = await Brand.findOne({ slug: brandSlug }).lean();
      if (br) filter.brand = br._id;
    }

    if (searchParams.get("featured")   === "true") filter.isFeatured   = true;
    if (searchParams.get("bestSeller") === "true") filter.isBestSeller = true;
    if (searchParams.get("newArrival") === "true") filter.isNewArrival = true;
    if (searchParams.get("discount")   === "true") filter.salePrice    = { $exists: true, $gt: 0 };

    const minPrice = parseFloat(searchParams.get("minPrice") ?? "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") ?? "0");
    if (maxPrice > 0) filter.price = { $gte: minPrice, $lte: maxPrice };

    /* ── Build sort ── */
    const sortParam = searchParams.get("sort") ?? "newest";
    const sortMap = {
      newest       : { createdAt: -1 },
      oldest       : { createdAt:  1 },
      "price-asc"  : { price:      1 },
      "price-desc" : { price:     -1 },
      "best-selling": { soldCount: -1 },
      "top-rated"  : { rating:    -1 },
    };
    const sort = sortMap[sortParam] ?? { createdAt: -1 };

    /* ── Query ── */
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("brand", "name slug")
        .populate("category", "name slug")
        .select("-description -ingredients -metaTitle -metaDescription")
        .lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[products/GET]", error);
    return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}
