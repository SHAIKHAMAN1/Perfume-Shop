import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    title      : { type: String, required: true },
    subtitle   : String,
    image      : { type: String, required: true },
    mobileImage: String,
    link       : String,
    buttonText : String,
    position   : {
      type    : String,
      enum    : ["hero", "mid-page", "sidebar", "popup", "strip"],
      default : "hero",
      index   : true,
    },
    isActive   : { type: Boolean, default: true, index: true },
    order      : { type: Number, default: 0 },
    startsAt   : Date,
    endsAt     : Date,
  },
  { timestamps: true }
);

BannerSchema.index({ position: 1, isActive: 1, order: 1 });

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
