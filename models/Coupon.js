import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    code        : { type: String, required: true, unique: true, uppercase: true, index: true, trim: true },
    description : String,
    type        : { type: String, enum: ["flat", "percentage"], required: true },
    value       : { type: Number, required: true, min: 0 },  // amount or %
    maxDiscount : Number,   // cap for percentage coupons
    minOrderValue : { type: Number, default: 0 },
    maxUses       : { type: Number, default: null }, // null = unlimited
    usedCount     : { type: Number, default: 0 },
    perUserLimit  : { type: Number, default: 1 },   // how many times same user can use it
    expiresAt     : { type: Date, index: true },
    isActive      : { type: Boolean, default: true, index: true },
    applicableProducts  : [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    usedBy        : [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
