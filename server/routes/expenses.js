import express from "express";
import Expense from "../models/Expense.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Add a new expense
router.post("/add", authenticate, async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const expense = new Expense({
      userId: req.userId,
      title,
      amount,
      category,
    });
    await expense.save();
    res.json({ message: "Expense added successfully", expense });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add expense", error: err.message });
  }
});

// Get all expenses for a user
router.get("/", authenticate, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch expenses", error: err.message });
  }
});

// Update an expense
// Update an expense
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, amount, category },
      { new: true } // This ensures the updated document is returned
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense); // Return the updated expense
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update expense", error: err.message });
  }
});

// Delete an expense
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully", expense });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete expense", error: err.message });
  }
});

export default router;
