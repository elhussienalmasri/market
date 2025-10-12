import mongoose from "mongoose";

//  Enum equivalent for StoreStatus
const StoreStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  BANNED: "BANNED",
  DISABLED: "DISABLED",
};


const StoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    url: { type: String, unique: true, required: true },
    logo: { type: String },
    cover: { type: String },
    status: {
      type: String,
      enum: Object.values(StoreStatus),
      default: StoreStatus.PENDING,
    },
    averageRating: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    returnPolicy: { type: String },
    defaultShippingService: { type: String },
    defaultShippingFees: { type: Number },
    defaultDeliveryTimeMin: { type: Number },
    defaultDeliveryTimeMax: { type: Number },
    userId: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Store = mongoose.model("Store", StoreSchema);