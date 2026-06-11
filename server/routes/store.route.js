import express from "express";
import {
  getStoresByUser,
  getStoreByUrl,
  upsertStore,
  getStoreDefaultShippingDetails,
  updateStoreDefaultShippingDetails,
  getStoreShippingRates,
  upsertShippingRate,
  getStoreOrders,
  applySeller,
  getAllStores,
  updateStoreStatus,
  deleteStore,
  getStorePageDetails,
} from "../controller/store.controller.js";

const router = express.Router();

router.get("/admin", getAllStores);
router.get("/orders/:storeUrl", getStoreOrders);
router.get("/:userId", getStoresByUser);
router.get("/user/:storeUrl", getStorePageDetails);
router.get("/url/:storeUrl", getStoreByUrl);
router.get("/:storeUrl/shipping-defaults", getStoreDefaultShippingDetails);
router.get("/:storeUrl/shipping-rates", getStoreShippingRates);

router.put("/:storeUrl/shipping", updateStoreDefaultShippingDetails);
router.put("/:storeUrl/shipping-rates", upsertShippingRate);
// Upsert (create or update) a store
router.post("/upsert", upsertStore);
router.post("/apply-seller", applySeller);

router.patch("/admin/status", updateStoreStatus);

router.delete("/admin/:storeId", deleteStore);

export default router;
