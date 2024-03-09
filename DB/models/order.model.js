import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    phoneNumbers: [
      {
        type: String,
        required: true,
      },
    ],
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "stripe", "paymob"],
      required: true,
    },
    orederStatus: {
      type: String,
      enum: ["Pending", "Paid", "Delivered", "Placed", "Cancelled", "Refunded"],
      required: true,
      default: "Pending",
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: String,
    },

    paymentIntentId: {
      type: String,
    },

    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: String,
    },
    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isCancelled: {
      type: Boolean,
      required: true,
      default: false,
    },
    cancelledAt: {
      type: String,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isRefunded: {
      type: Boolean,
      required: true,
      default: false,
    },
    refundedAt: {
      type: String,
    },
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isReturned: {
      type: Boolean,
      required: true,
      default: false,
    },
    returnedAt: {
      type: String,
    },
    returnedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isShipped: {
      type: Boolean,
      required: true,
      default: false,
    },
    shippedAt: {
      type: String,
    },
    shippedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
