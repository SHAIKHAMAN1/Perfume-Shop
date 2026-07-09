import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    name        : { type: String, required: true, trim: true },
    slug        : { type: String, required: true, unique: true, index: true, lowercase: true },
    logo        : String,
    banner      : String,
    description : String,
    country     : String,
    website     : String,
    isFeatured  : { type: Boolean, default: false, index: true },
    isActive    : { type: Boolean, default: true,  index: true },
    order       : { type: Number, default: 0 },
    metaTitle   : String,
    metaDescription : String,
  },
  { timestamps: true }
);

export default mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
