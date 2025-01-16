import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenses.js";
import config from "./config/config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/verification-link", (req, res) => {
  const verificationLink = `${config.FRONTEND_URL}/verify-email?token=sampleToken`;
  res.send(`Verification link: ${verificationLink}`);
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
