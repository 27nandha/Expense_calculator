import React from "react";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("you have been logged out");

    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to the Dashboard!</h1>
      <p>This is a protected route. Only authenticated users can see this.</p>
      <button onClick={handleLogout} style={logoutButtonStyle}>
        Logout
      </button>
    </div>
  );
};
const logoutButtonStyle = {
  padding: "0.8rem 1.5rem",
  backgroundColor: "#d9534f",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "1rem",
  cursor: "pointer",
  marginTop: "1rem",
};

export default DashBoard;
