import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name             : { type: String, required: true, trim: true },
    slug             : { type: String, required: true, unique: true, index: true, lowercase: true },
    brand            : { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true, index: true },
    category         : { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    description      : { type: String, required: true },
    shortDescription : { type: String, maxlength: 300 },

    // Pricing
    price      : { type: Number, required: true, min: 0 },
    salePrice  : { type: Number, min: 0 },
    sku        : { type: String, unique: true, sparse: true, uppercase: true },

    // Inventory
    stock : { type: Number, required: true, default: 0, min: 0, index: true },

    // Media
    images  : [{ type: String }],  // Cloudinary URLs
    gallery : [{ type: String }],

    // Fragrance specifications
    volumes         : [{ type: String }],          // e.g. ["30ml","50ml","100ml"]
    concentration   : {
      type : String,
      enum : ["EDC", "EDT", "EDP", "Parfum", "Pure Parfum", "Attar", "Body Mist", "Other"],
    },
    fragranceFamily : String,
    topNotes        : [{ type: String }],
    middleNotes     : [{ type: String }],
    baseNotes       : [{ type: String }],
    longevity       : { type: Number, min: 1, max: 10 }, // 1-10 scale
    projection      : { type: Number, min: 1, max: 10 }, // 1-10 scale
    occasion        : [{ type: String }],
    season          : [{
      type : String,
      enum : ["Spring", "Summer", "Autumn", "Winter", "All Season"],
    }],
    gender          : {
      type    : String,
      enum    : ["Men", "Women", "Unisex"],
      index   : true,
    },
    ingredients : String,

    // Flags
    isFeatured   : { type: Boolean, default: false, index: true },
    isBestSeller : { type: Boolean, default: false, index: true },
    isNewArrival : { type: Boolean, default: false, index: true },
    isActive     : { type: Boolean, default: true,  index: true },

    // Aggregated ratings (updated via review hooks)
    rating      : { type: Number, default: 0, min: 0, max: 5 },
    reviewCount : { type: Number, default: 0 },

    // SEO
    metaTitle       : String,
    metaDescription : String,
    tags            : [{ type: String }],

    // Analytics
    viewCount   : { type: Number, default: 0 },
    soldCount   : { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text search index for product search
ProductSchema.index({ name: "text", description: "text", tags: "text" });
// Performance indexes
ProductSchema.index({ price: 1, rating: -1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ brand: 1, category: 1, gender: 1 });
ProductSchema.index({ createdAt: -1 });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
