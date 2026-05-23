import express from "express";
import {
  followStore,
  saveUserCart,
  getUserShippingAddresses,
  upsertShippingAddress,
  placeOrder,
  emptyUserCart,
  getUserCart,
  getCountries,
  updateCart,
  addToWishlist,
  updateCheckoutProductstWithLatest
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
router.post("/cart/save", saveUserCart);
router.delete("/cart/empty", requireAuth, emptyUserCart);

// -----------------------
// SHIPPING ADDRESS ROUTES
// -----------------------
router.get("/shipping-addresses", getUserShippingAddresses);
router.post("/shipping-addresses/upsert", upsertShippingAddress);

// -----------------------
// PLACE ORDER
// -----------------------
router.post("/order/place", requireAuth, placeOrder);

router.get("/countries", getCountries);

router.post("/cart/update", updateCart);
router.post("/wishlist", addToWishlist);
router.post("/checkout/update",  updateCheckoutProductstWithLatest);


export default router;