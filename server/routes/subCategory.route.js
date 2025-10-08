import express from "express";
import {
  upsertSubCategory,
  getAllSubCategories,
  getSubCategory,
  deleteSubCategory,
} from "../controller/subCategory.controller.js";

const router = express.Router();

router.post("/", upsertSubCategory);
router.get("/", getAllSubCategories);
router.get("/:id", getSubCategory);
router.delete("/:id", deleteSubCategory);

export default router;
