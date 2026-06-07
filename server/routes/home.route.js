import express from "express";
import {
  getHomeDataDynamic,
  getHomeFeaturedCategories,
} from "../controller/home.controller.js";

const router = express.Router();

router.post("/home-products", getHomeDataDynamic);

router.get("/categories/featured", getHomeFeaturedCategories);

export default router;
