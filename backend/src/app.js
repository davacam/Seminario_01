const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const env = require("./config/env");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const clientRoutes = require("./routes/clients");
const reportRoutes = require("./routes/reports");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Seguridad
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(","),
    credentials: true,
  })
);

// Middlewares de parseo
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Info
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TechDesk API v1",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Rutas
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/clients", clientRoutes);
app.use("/api/v1/reports", reportRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
