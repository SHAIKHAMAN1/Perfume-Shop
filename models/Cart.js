import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product  : { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity : { type: Number, required: true, min: 1, default: 1 },
  volume   : String,
  price    : { type: Number, required: true }, // snapshot at time of add
});

const CartSchema = new mongoose.Schema(
  {
    // For logged-in users
    user      : { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, sparse: true },
    // For guest sessions
    sessionId : { type: String, index: true, sparse: true },
    items     : [CartItemSchema],
    couponCode    : String,
    couponDiscount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // TTL 30 days for guest carts

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
