import mongoose from 'mongoose';

const OfferTagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, 
  }
);

export const OfferTag = mongoose.model('OfferTag', OfferTagSchema);