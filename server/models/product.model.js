
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    brand: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Store",
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
      index: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubCategory",
      index: true,
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant",
      },
    ],
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);


const ProductVariantSchema = new mongoose.Schema(
  {
 
    variantName: {
      type: String,
      required: true,
    },
    variantDescription: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    keywords: {
      type: [String],
      default: [],  
    },
    sku: {
      type: String,
    },
    productId: {
      type: String,
      required: true,
      ref: "Product",
      index: true,
    },
    sizes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Size",
      },
    ],
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariantImage",
      },
    ],
    colors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",
      },
    ],
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

// Size Schema
const SizeSchema = new mongoose.Schema(
   {
    size: {
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
    discount: {
      type: Number,
      default: 0,
    },
    productVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ProductVariant",
      index: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

//  ProductVariantImage Schema
const ProductVariantImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: "",
    },
    productVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ProductVariant",
      index: true,
    },
  },
  { timestamps: true } 
);


const ColorSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
    },
    productVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ProductVariant",
      index: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);


export const Product = mongoose.model("Product", ProductSchema);
export const ProductVariant = mongoose.model("ProductVariant", ProductVariantSchema);
export const Size = mongoose.model("Size", SizeSchema);

export const ProductVariantImage =mongoose.model("ProductVariantImage", ProductVariantImageSchema);
export const Color = mongoose.model("Color", ColorSchema);