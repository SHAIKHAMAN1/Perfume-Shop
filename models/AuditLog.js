import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    user     : { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    action   : { type: String, required: true, index: true }, // e.g. "PRODUCT_CREATED"
    entity   : { type: String, required: true, index: true }, // e.g. "Product"
    entityId : mongoose.Schema.Types.ObjectId,
    diff     : mongoose.Schema.Types.Mixed,  // before/after snapshot
    ip       : String,
    userAgent: String,
    metadata : mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
    // Only createdAt is needed; disable updatedAt for immutable audit logs
    capped: false,
  }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ entity: 1, entityId: 1 });
// Auto-delete logs after 1 year
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
