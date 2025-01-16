// config/config.js
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Access the frontend URL from the environment variable
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"; // Default to localhost if not set

export default {
  FRONTEND_URL,
};
