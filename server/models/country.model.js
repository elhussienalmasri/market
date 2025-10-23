import mongoose from "mongoose";
const { Schema } = mongoose;


const CountrySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  code: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true 
});

const ShippingRateSchema = new Schema({
  shippingService: {
    type: String,
    required: true
  },
  shippingFeePerItem: {
    type: Number,
    required: true
  },
  shippingFeeForAdditionalItem: {
    type: Number,
    required: true
  },
  shippingFeePerKg: {
    type: Number,
    required: true
  },
  shippingFeeFixed: {
    type: Number,
    required: true
  },
  deliveryTimeMin: {
    type: Number,
    required: true
  },
  deliveryTimeMax: {
    type: Number,
    required: true
  },
  returnPolicy: {
    type: String,
    required: true
  },
  countryId: {
    type: String,
    ref: 'Country',
    required: true,
    index: true
  },
  storeId: {
    type: String,
    ref: 'Store',
    required: true,
    index: true
  }
}, {
  timestamps: true 
});

export const Country = mongoose.model('Country', CountrySchema);
export const ShippingRate = mongoose.model('ShippingRate', ShippingRateSchema);
