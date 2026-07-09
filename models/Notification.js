import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user    : { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    type    : {
      type : String,
      enum : ["order", "payment", "review", "coupon", "system", "restock", "promotion"],
      index: true,
    },
    title   : { type: String, required: true },
    message : { type: String, required: true },
    link    : String,   // deep link e.g. /account/orders/123
    isRead  : { type: Boolean, default: false, index: true },
    isGlobal: { type: Boolean, default: false }, // broadcast to all users
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
// Auto-delete notifications older than 90 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
