import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const ExpenseTracker = () => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // For edit mode
  const [editId, setEditId] = useState(null); // ID of the expense being edited
  const navigate = useNavigate(); // For navigation

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        "https://expense-calculator-server-one.vercel.app/api/expenses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err.response?.data?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update expense
        const res = await axios.put(
          `https://expense-calculator-server-one.vercel.app/api/expenses/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExpenses(
          (prev) =>
            prev.map((expense) => (expense._id === editId ? res.data : expense)) // Correct mapping here
        );
        setIsEditing(false);
        setEditId(null);
      } else {
        // Add new expense
        const res = await axios.post(
          "https://expense-calculator-server-one.vercel.app/api/expenses/add",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExpenses([res.data.expense, ...expenses]); // Restructure data to add the new expense
      }
      setFormData({ title: "", amount: "", category: "" }); // Clear form
    } catch (err) {
      console.error("Failed to save expense:", err.response?.data?.message);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
    });
    setIsEditing(true);
    setEditId(expense._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;
    try {
      await axios.delete(
        `https://expense-calculator-server-one.vercel.app/api/expenses/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
    } catch (err) {
      console.error("Failed to delete expense:", err.response?.data?.message);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      {/* Logout Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1>Expense Tracker</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.6rem 1rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          style={{ padding: "0.8rem", marginBottom: "1rem", width: "100%" }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          style={{ padding: "0.8rem", marginBottom: "1rem", width: "100%" }}
        />
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
          style={{ padding: "0.8rem", marginBottom: "1rem", width: "100%" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.8rem",
            backgroundColor: isEditing ? "#ffc107" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            width: "100%",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          {isEditing ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      <h2>Expense List</h2>
      {expenses.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {expenses.map((expense) => (
            <li
              key={expense._id}
              style={{
                padding: "1rem",
                borderBottom: "1px solid #ccc",
                marginBottom: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{expense.title}</strong> - ${expense.amount} (
                {expense.category})
              </div>
              <div>
                <button
                  onClick={() => handleEdit(expense)}
                  style={{
                    marginRight: "1rem",
                    backgroundColor: "#ffc107",
                    border: "none",
                    padding: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense._id)}
                  style={{
                    backgroundColor: "#dc3545",
                    border: "none",
                    padding: "0.5rem",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses added yet.</p>
      )}
    </div>
  );
};

export default ExpenseTracker;
