import express from "express";
import {
  upsertProduct,
  getProductVariant,
  getProductMainInfo,
  getAllStoreProducts,
  deleteProduct,
  getProducts,
  getProductPageData,
  getProductFilteredReviews,
  getProductBySlug
} from "../controller/product.controller.js";

import { requireAuth } from "@clerk/express";


const router = express.Router();

router.post("/upsert/:storeUrl", requireAuth(), upsertProduct);
router.get("/:productId/variant/:variantId", getProductVariant);
router.get("/:productId/info", getProductMainInfo);
router.get("/:storeUrl", getAllStoreProducts);
router.get("/reviews/:storeUrl", getProductFilteredReviews);
                       
router.delete("/:productId", requireAuth(), deleteProduct);
router.get("/:productSlug/:variantSlug", getProductPageData);
router.get("/:productSlug", getProductBySlug);
router.get('/', getProducts);

export default router;
