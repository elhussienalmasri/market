import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import subCategoryRoutes from "./routes/subCategory.route.js";
import storeRoutes from "./routes/store.route.js";
import productRoutes from "./routes/product.route.js";
import offerTagRoutes from "./routes/offerTag.route.js";
import userRoutes from "./routes/user.route.js";
import couponRoutes from "./routes/coupon.routes.js";
import orderRoutes from "./routes/order.route.js";
import profileRoutes from "./routes/profile.route.js";
import sizeRoutes from "./routes/size.route.js";

dotenv.config(); // Load .env file

const app = express();

app.use(clerkMiddleware());

const PORT = process.env.PORT || 5000;

app.use(cors({}));

app.use(express.json()); // to parse req.body

app.get("/", (req, res) => {
  res.send(`Server running on port ${PORT}`);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subCategories", subCategoryRoutes);

app.use("/api/product", productRoutes);
app.use("/api/offer-tags", offerTagRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/sizes", sizeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
  connectDB();
});
