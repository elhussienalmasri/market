import express from "express";

import {
  getUserPayments,
  getUserReviews,
  getUserWishlist,
  getUserFollowedStores
} from "../controller/profile.controller.js";

const router = express.Router();

router.get("/payments", getUserPayments);
router.get("/reviews", getUserReviews);
router.get("/wishlist", getUserWishlist);
router.get("/followed-stores", getUserFollowedStores);

export default router;
