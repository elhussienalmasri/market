import express from "express";
import { upsertReview } from "../controller/review.controller.js";

const router = express.Router();

router.post("/:productId/", upsertReview);

export default router;
