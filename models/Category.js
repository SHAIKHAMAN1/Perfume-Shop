import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name        : { type: String, required: true, trim: true },
    slug        : { type: String, required: true, unique: true, index: true, lowercase: true },
    description : String,
    image       : String,
    icon        : String,
    parentId    : { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    isActive    : { type: Boolean, default: true, index: true },
    order       : { type: Number, default: 0 },
    metaTitle   : String,
    metaDescription : String,
  },
  { timestamps: true }
);

CategorySchema.index({ parentId: 1, isActive: 1 });

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
