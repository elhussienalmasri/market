import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import subCategoryRoutes from "./routes/subCategory.route.js";
import storeRoutes from "./routes/store.route.js";
import productRoutes from "./routes/product.route.js"

dotenv.config(); // Load .env file

const app = express();

app.use(clerkMiddleware());

const PORT = process.env.PORT || 5000;

app.use(cors({}));

app.use(express.json()); // to parse req.body

app.get('/', (req, res) => {
  res.send(`Server running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subCategories", subCategoryRoutes);

app.use("/api/product", productRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
  connectDB();
});