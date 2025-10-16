import {
  getAllOfferTags,
  getOfferTag,
  upsertOfferTag,
  deleteOfferTag,
} from  "../controller/offerTag.controller.js";
import express from  "express";
const router = express.Router();

router.get('/', getAllOfferTags);
router.get('/:id', getOfferTag);

router.post('/upsert', upsertOfferTag);

router.delete('/:id', deleteOfferTag);

export default router;