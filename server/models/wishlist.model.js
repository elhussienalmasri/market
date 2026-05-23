import mongoose from "mongoose";

const { Schema } = mongoose;

const wishlistSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
      index: true,
    },
    sizeId: {
      type: Schema.Types.ObjectId,
      ref: "Size",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Wishlist", wishlistSchema);
