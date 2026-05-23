import express from "express";
import {
  upsertCoupon,
  getStoreCoupons,
  getCoupon,
  deleteCoupon,
  applyCoupon,
} from "../controller/coupon.controller.js";

const router = express.Router();

router.post("/upsert", upsertCoupon);

router.get("/store/:storeUrl", getStoreCoupons);
router.get("/:couponId", getCoupon);

router.delete("/:storeUrl/:couponId", deleteCoupon);

router.post("/apply", applyCoupon);

export default router;
