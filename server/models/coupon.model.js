import mongoose from "mongoose";

const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      required: true,
    },

    discount: {
      type: Number,
      required: true,
    },

    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    // Relations
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderGroup",
      },
    ],

    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    carts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Coupon", couponSchema);
