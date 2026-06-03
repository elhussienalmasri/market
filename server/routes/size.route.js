import express from "express";
import { getFilteredSizes } from "../controller/size.controller.js";

const router = express.Router();

router.get("/", getFilteredSizes);

export default router;
