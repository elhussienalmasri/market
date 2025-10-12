import express from "express";
import { Category } from "../models/category.model.js";

import {
  getAllCategories,
  getCategory,
  deleteCategory,
  getAllSubCategoriesForCategory
} from "../controller/category.controller.js";

const router = express.Router();

// Upsert (create or update) category
router.post("/upsert", async (req, res) => {
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
        { new: true }
      );
    } else {
      updated = await Category.create({ name, image, url, featured });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/", getAllCategories);
router.get("/:categoryId", getCategory);
router.delete("/:categoryId", deleteCategory);

router.get("/:categoryId/subcategories", getAllSubCategoriesForCategory);

export default router;
