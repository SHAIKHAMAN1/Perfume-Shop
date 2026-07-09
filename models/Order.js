import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product    : { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name       : { type: String, required: true },
  image      : String,
  price      : { type: Number, required: true },
  quantity   : { type: Number, required: true, min: 1 },
  volume     : String,
  sku        : String,
});

const ShippingAddressSchema = new mongoose.Schema({
  fullName : { type: String, required: true },
  phone    : { type: String, required: true },
  line1    : { type: String, required: true },
  line2    : String,
  city     : { type: String, required: true },
  state    : { type: String, required: true },
  pincode  : { type: String, required: true },
  country  : { type: String, default: "India" },
});

const TimelineEventSchema = new mongoose.Schema({
  status    : { type: String, required: true },
  message   : String,
  timestamp : { type: Date, default: Date.now },
  updatedBy : { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber   : { type: String, unique: true, index: true },
    user          : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items         : [OrderItemSchema],
    shippingAddress : ShippingAddressSchema,
    billingAddress  : ShippingAddressSchema,

    // Pricing breakdown
    subtotal      : { type: Number, required: true },
    discount      : { type: Number, default: 0 },
    couponCode    : String,
    couponDiscount: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    tax           : { type: Number, default: 0 },
    total         : { type: Number, required: true },

    // Status flow: pending → confirmed → packed → dispatched → out_for_delivery → delivered | cancelled | returned | refunded
    status        : {
      type    : String,
      enum    : ["pending", "confirmed", "packed", "dispatched", "out_for_delivery", "shipped", "delivered", "cancelled", "returned", "refunded"],
      default : "pending",
      index   : true,
    },

    // Payment
    paymentMethod    : { type: String, enum: ["razorpay", "stripe", "cod", "wallet"], required: true },
    paymentStatus    : { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending", index: true },
    payment          : { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    razorpayOrderId  : { type: String, index: true, sparse: true },

    // Delivery
    trackingNumber  : String,
    trackingUrl     : String,
    estimatedDelivery: Date,
    deliveredAt     : Date,

    // Extras
    giftWrap    : { type: Boolean, default: false },
    giftMessage : String,
    notes       : String,

    // Timeline audit
    timeline    : [TimelineEventSchema],

    // Invoice
    invoiceUrl  : String,
    invoiceNumber: String,
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1, paymentStatus: 1 });

// Auto-generate order number before save
OrderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const count = await mongoose.models.Order.countDocuments();
    this.orderNumber = `LPS-${Date.now()}-${String(count + 1).padStart(4, "0")}`;
  }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
