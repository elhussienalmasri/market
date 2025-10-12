import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      minlength: [2, "Subcategory name must be at least 2 characters"],
      maxlength: [50, "Subcategory name cannot exceed 50 characters"],
      match: [/^[a-zA-Z0-9\s]+$/, "Only letters, numbers, and spaces allowed"],
    },
    image: {
      type: String,
      required: [true, "Subcategory image is required"],
    },
    url: {
      type: String,
      required: [true, "Subcategory URL is required"],
      unique: true,
      minlength: [2, "Subcategory URL must be at least 2 characters"],
      maxlength: [50, "Subcategory URL cannot exceed 50 characters"],
      match: [
        /^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/,
        "Invalid subcategory URL format",
      ],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
      products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export const SubCategory = mongoose.model("SubCategory", SubCategorySchema);