import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		clerkId: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true } //  createdAt, updatedAt
);

const ShippingAddressSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String }, // optional
    state: { type: String, required: true },
    city: { type: String, required: true },
    zip_code: { type: String, required: true },
    default: { type: Boolean, default: false },

    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // corresponds to @@index([userId])
    },

    // Reference to Country
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
      index: true, // corresponds to @@index([countryId])
    },

    // Reference to Orders (one-to-many)
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
  }
);


export const User = mongoose.model("User", userSchema);
export const ShippingAddress =  mongoose.model("ShippingAddress", ShippingAddressSchema);