import express from "express";
import {
  followStore,
  saveUserCart,
  getUserShippingAddresses,
  upsertShippingAddress,
  placeOrder,
  emptyUserCart,
  getUserCart,
  getCountries
} from "../controller/user.controller.js";


import { requireAuth } from "@clerk/express";

const router = express.Router();

// -----------------------
// FOLLOW / UNFOLLOW STORE
// -----------------------
router.post("/follow-store", requireAuth(), followStore);

// -----------------------
// CART ROUTES
// -----------------------
router.get("/cart", getUserCart);
router.post("/cart/save", requireAuth, saveUserCart);
router.delete("/cart/empty", requireAuth, emptyUserCart);

// -----------------------
// SHIPPING ADDRESS ROUTES
// -----------------------
router.get("/shipping-addresses", requireAuth, getUserShippingAddresses);
router.post("/shipping-addresses/upsert", requireAuth, upsertShippingAddress);

// -----------------------
// PLACE ORDER
// -----------------------
router.post("/order/place", requireAuth, placeOrder);

router.get("/countries", getCountries);


export default router;