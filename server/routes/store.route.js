import express from "express";
import {
  getStoresByUser,
  getStoreByUrl,
  upsertStore,
  getStoreDefaultShippingDetails,
  updateStoreDefaultShippingDetails,
  getStoreShippingRates,
  upsertShippingRate
} from "../controller/store.controller.js"

const router = express.Router();


// Upsert (create or update) a store
router.post("/upsert", upsertStore);
router.get("/:userId", getStoresByUser);
router.get("/url/:storeUrl", getStoreByUrl);
router.get('/:storeUrl/shipping-defaults', getStoreDefaultShippingDetails);
router.put('/:storeUrl/shipping',  updateStoreDefaultShippingDetails);
router.get('/:storeUrl/shipping-rates',  getStoreShippingRates);
router.put('/:storeUrl/shipping-rates',  upsertShippingRate);

export default router;