import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CartItem", // references CartItem documents
      },
    ],

    shippingFees: {
      type: Number,
      default: 0,
    },

    subTotal: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const CartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    variantId: { type: String, required: true },
    sizeId: { type: String, required: true },

    productSlug: { type: String, required: true },
    variantSlug: { type: String, required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    size: { type: String, required: true },

    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    shippingFee: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },

    // Reference to Cart
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
      index: true, // corresponds to @@index([cartId])
    },

    // Reference to Store
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true, // corresponds to @@index([storeId])
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);


export const Cart = mongoose.model("Cart", CartSchema);
export const CartItem = mongoose.model("CartItem", CartItemSchema);