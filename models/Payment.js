import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    order         : { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    user          : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // Provider fields — designed to support multiple gateways
    provider      : { type: String, enum: ["razorpay", "stripe", "cod", "wallet"], required: true },

    // Razorpay fields
    razorpayOrderId   : { type: String, index: true, sparse: true },
    razorpayPaymentId : { type: String, index: true, sparse: true },
    razorpaySignature : String,

    // TODO: Stripe fields (Phase 4)
    // stripePaymentIntentId : String,
    // stripeClientSecret    : String,

    amount        : { type: Number, required: true },
    currency      : { type: String, default: "INR" },
    status        : {
      type    : String,
      enum    : ["created", "pending", "paid", "failed", "refunded"],
      default : "created",
      index   : true,
    },

    // Refund tracking
    refundId     : String,
    refundAmount : Number,
    refundedAt   : Date,

    // Raw gateway response for debugging
    gatewayResponse : mongoose.Schema.Types.Mixed,

    // Invoice
    invoiceNumber : String,
    invoiceUrl    : String,
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
