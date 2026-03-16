
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
    offerTag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OfferTag',
      required: false,
    },
    specs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Spec'
    }],
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }],
    sales: {
      type: Number,
      default: 0
    },
    shippingFeeMethod: {
      type: String,
      enum: ["ITEM", "WEIGHT", "FIXED"],
      default: "ITEM"
    },

    freeShipping: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FreeShipping",
      required: false,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      }
    ],
  },
  { timestamps: true } 
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
    variantImage: {
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
    saleEndDate: {
    type: String, // Could be Date if it represents a date
    default: null,
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
    specs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spec', // Make sure Spec model is defined and exported
  }],
    sales: {
      type: Number,
      default: 0
    }
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
    order: {
      type: Number,
      required: false, 
      default: null, // optional but can be null if needed
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
  { timestamps: true } 
);


const SpecSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    default: null,
  },
}, {
  timestamps: true, 
});

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
}, {
  timestamps: true, 
});

const ReviewSchema = new mongoose.Schema(
  {
    variant: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: String, required: true },

    likes: { type: Number, default: 0 },

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReviewImage",
      },
    ],

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // single-field index for faster queries
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true, 
    },
  },
  {
    timestamps: true, 
  }
);


const ReviewImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: "",
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId, // references Review _id
      ref: "Review",
      required: true,
      index: true, 
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", ProductSchema);
export const ProductVariant = mongoose.model("ProductVariant", ProductVariantSchema);
export const Size = mongoose.model("Size", SizeSchema);

export const ProductVariantImage =mongoose.model("ProductVariantImage", ProductVariantImageSchema);
export const Color = mongoose.model("Color", ColorSchema);

export const Spec = mongoose.model("Spec", SpecSchema);
export const Question = mongoose.model("Question", QuestionSchema);

export const Review =   mongoose.model("Review", ReviewSchema);
export const ReviewImage =   mongoose.model("ReviewImage", ReviewImageSchema);