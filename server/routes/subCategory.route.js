import express from "express";
import {
  upsertSubCategory,
  getAllSubCategories,
  getSubCategory,
  deleteSubCategory,
  getSubcategories
} from "../controller/subCategory.controller.js";

const router = express.Router();

router.post("/", upsertSubCategory);
router.get("/", getAllSubCategories);
router.get('/limit', getSubcategories);
router.get("/:id", getSubCategory);
router.delete("/:id", deleteSubCategory);

export default router;
