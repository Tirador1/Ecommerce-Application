import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    couponStatus: {
      type: String,
      default: "valid",
      enum: ["valid", "expired"],
    },
    isFixed: {
      type: Boolean,
      default: false,
    },
    isPercentage: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      required: true,
    },
    maxDiscount: {
      type: Number,
      required: true,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTill: {
      type: Date,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Coupon", couponSchema);
