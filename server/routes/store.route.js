import express from "express";
import { upsertStore } from "../controller/store.controller.js";
import {getStoresByUser, getStoreByUrl} from "../controller/store.controller.js"

const router = express.Router();


// Upsert (create or update) a store
router.post("/upsert", upsertStore);
router.get("/:userId", getStoresByUser);
router.get("/url/:storeUrl", getStoreByUrl);

export default router;