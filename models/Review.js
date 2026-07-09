import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    product  : { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    user     : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    order    : { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // verified purchase ref
    rating   : { type: Number, required: true, min: 1, max: 5 },
    title    : String,
    body     : { type: String, required: true, maxlength: 1000 },
    images   : [String], // user-uploaded review images
    isApproved : { type: Boolean, default: false, index: true },
    isVerifiedPurchase : { type: Boolean, default: false },
    helpfulCount : { type: Number, default: 0 },
    reportCount  : { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One review per user per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
ReviewSchema.index({ product: 1, isApproved: 1, rating: -1 });

// Update product rating after review save
ReviewSchema.post("save", async function () {
  await updateProductRating(this.product);
});
ReviewSchema.post("deleteOne", { document: true }, async function () {
  await updateProductRating(this.product);
});

async function updateProductRating(productId) {
  const Product = mongoose.models.Product;
  if (!Product) return;
  const result = await ReviewSchema.model("Review").aggregate([
    { $match: { product: productId, isApproved: true } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = result[0] ?? {};
  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });
}

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
