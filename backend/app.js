import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { requireAuth } from "./middleware/auth.js";

// Import Routes
import promotionRoutes from "./routes/promotionRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import couponCodeRoutes from "./routes/couponCodeRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import customizationRoutes from "./routes/customizationRoutes.js";
// Initialize dotenv
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Routes
app.use("/api/promotions", promotionRoutes);
app.use("/api/discounts", requireAuth, discountRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);
app.use("/api/coupons", couponCodeRoutes);
app.use("/api/reports", requireAuth, reportRoutes);
app.use("/api/customizations",customizationRoutes);
// MongoDB connection and server start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
