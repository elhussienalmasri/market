import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
      match: [/^[a-zA-Z0-9\s]+$/, "Only letters, numbers, and spaces allowed"],
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    url: {
      type: String,
      required: [true, "Category URL is required"],
      unique: true,
      minlength: [2, "Category URL must be at least 2 characters"],
      maxlength: [50, "Category URL cannot exceed 50 characters"],
      match: [/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, "Invalid category URL format"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export const Category = mongoose.model("Category", CategorySchema);
