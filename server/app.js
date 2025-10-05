import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config(); // Load .env file

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({}));

app.use(express.json()); // to parse req.body
app.use(clerkMiddleware());

app.get('/', (req, res) => {
  res.send(`Server running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
  connectDB();
});