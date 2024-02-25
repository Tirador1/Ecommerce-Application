import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    folderId: { type: String, required: true, unique: true },

    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    appliedPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    rating: { type: Number, default: 0 },

    Image: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true },
      },
    ],

    specifications: [
      {
        type: Map,
        of: [String, Number],
      },
    ],

    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
