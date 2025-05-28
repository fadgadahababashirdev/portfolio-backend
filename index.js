const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes/messagesRoute");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => res.send("Welcome to Fadga's API"));
app.use("/" , router)

// 404 Handler (must come AFTER all other routes)
app.use((req, res) => {
  res.status(404).json({ status: "failed", message: "Route not found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "Something went wrong!" });
});
 

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));