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
  getProductBySlug,
  getProductShippingFee,
  getProductsByIds,
} from "../controller/product.controller.js";

import { requireAuth } from "@clerk/express";

const router = express.Router();

router.get("/", getProducts);
router.get("/shipping-fee", getProductShippingFee);
router.get("/:productId/variant/:variantId", getProductVariant);
router.get("/reviews/:storeUrl", getProductFilteredReviews);
router.get("/:productId/info", getProductMainInfo);
router.get("/store/:storeUrl", getAllStoreProducts);
router.get("/:productSlug/:variantSlug", getProductPageData);
router.get("/:productSlug", getProductBySlug);

router.delete("/:productId", requireAuth(), deleteProduct);

router.post("/upsert/:storeUrl", requireAuth(), upsertProduct);
router.post("/by-ids", getProductsByIds);

export default router;
