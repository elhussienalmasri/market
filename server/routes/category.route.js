import express from "express";
import { Category } from "../models/category.model.js";

import {
  upsertCategory,
  getAllCategories,
  getCategory,
  deleteCategory,
  getAllSubCategoriesForCategory,
} from "../controller/category.controller.js";

const router = express.Router();

// Upsert (create or update) category
router.post("/upsert", upsertCategory);

router.get("/", getAllCategories);
router.get("/:categoryId", getCategory);
router.get("/:categoryId/subcategories", getAllSubCategoriesForCategory);

router.delete("/:categoryId", deleteCategory);

export default router;
