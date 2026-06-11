import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/subCategory.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { Store } from "../models/store.model.js";
import { Product } from "../models/product.model.js";

export const upsertCategory = async (req, res) => {
  try {
    const category = req.body;
    if (!category) {
      return res.status(400).json({ error: "Please provide category data." });
    }

    const { _id, name, url, image, featured } = category;

    // Check if name or URL already exists, excluding the current _id if updating
    const existing = await Category.findOne({
      $or: [{ name }, { url }],
      ...(!!_id && { _id: { $ne: _id } }),
    });

    if (existing) {
      const msg =
        existing.name === name
          ? "A category with this name already exists"
          : "A category with this URL already exists";
      return res.status(400).json({ error: msg });
    }

    // If _id is provided → update; otherwise → create new
    let updated;
    if (_id) {
      updated = await Category.findByIdAndUpdate(
        _id,
        { name, image, url, featured },
        { new: true },
      );
    } else {
      updated = await Category.create({ name, image, url, featured });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Get all categories (Public)
export const getAllCategories = async (req, res) => {
  try {
    const { storeUrl } = req.query;

    let storeId;

    if (storeUrl) {
      const store = await Store.findOne({ url: storeUrl });

      if (!store) {
        return res.status(200).json([]);
      }

      storeId = store._id;
    }

    const filter = storeId
      ? {
          products: {
            $elemMatch: {
              storeId: storeId,
            },
          },
        }
      : {};

    const categories = await Category.find(filter)
      .populate("subCategories")
      .sort({ updatedAt: -1 });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};
// Get single category by ID (Public)
export const getCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ error: "Please provide category ID." });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE category (Admin only)
export const deleteCategory = async (req, res) => {
  //const { userId } = getAuth(req);
  try {
    const { userId } = req.auth; // from Clerk middleware

    if (!userId) {
      return res.status(401).json({ error: "Unauthenticated." });
    }

    // Find user in MongoDB to verify role
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Assuming role is stored in user document, e.g., user.role === "ADMIN"
    if (user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Unauthorized Access: Admin Privileges Required." });
    }

    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ error: "Missing category ID." });
    }

    const deleted = await Category.findByIdAndDelete(categoryId);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSubCategoriesForCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("Invalid category ID format.");
    }

    const category = await SubCategory.find({ categoryId })
      .sort({ updatedAt: -1 })
      .exec();

    if (!category) throw new Error("Category not found.");
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};
