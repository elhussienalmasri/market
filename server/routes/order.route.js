import express from "express";

const router = express.Router();
import {
  getOrderById,
  updatePaymentStatus,
  capturePayment,
  upsertPaymentDetails,
  getOrder,
  getUserOrders,
} from "../controller/order.controller.js";

router.get("/user-orders", getUserOrders);

router.get("/:orderId", getOrder);
router.get("/:id", getOrderById);

router.put("/:id/payment-status", updatePaymentStatus);
router.put("/capture-payment/:orderId", capturePayment);

router.post("/upsert-payment-details", upsertPaymentDetails);

export default router;
