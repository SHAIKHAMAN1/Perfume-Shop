import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  label     : { type: String, default: "Home" },
  fullName  : { type: String, required: true },
  phone     : { type: String, required: true },
  line1     : { type: String, required: true },
  line2     : String,
  city      : { type: String, required: true },
  state     : { type: String, required: true },
  pincode   : { type: String, required: true },
  country   : { type: String, default: "India" },
  isDefault : { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema(
  {
    firebaseUid     : { type: String, required: true, unique: true, index: true },
    email           : { type: String, required: true, unique: true, index: true, lowercase: true },
    name            : { type: String, required: true, trim: true },
    role            : {
      type    : String,
      enum    : ["customer", "admin", "super_admin"],
      default : "customer",
      index   : true,
    },
    avatar          : String,
    phone           : String,
    isEmailVerified : { type: Boolean, default: false },
    isBlocked       : { type: Boolean, default: false },
    addresses       : [AddressSchema],
    loyaltyPoints   : { type: Number, default: 0 },
    lastLoginAt     : Date,
    // Architecture-ready fields
    referralCode    : { type: String, unique: true, sparse: true },
    referredBy      : { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    giftCardBalance : { type: Number, default: 0 },
    preferredLang   : { type: String, default: "en" },
  },
  { timestamps: true }
);

// Compound indexes for common queries
UserSchema.index({ createdAt: -1 });
UserSchema.index({ role: 1, isBlocked: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
