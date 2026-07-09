import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    key      : { type: String, required: true, unique: true, index: true },
    value    : mongoose.Schema.Types.Mixed,
    category : {
      type    : String,
      enum    : ["general", "payment", "shipping", "email", "seo", "social", "policy"],
      default : "general",
      index   : true,
    },
    label       : String,
    description : String,
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
