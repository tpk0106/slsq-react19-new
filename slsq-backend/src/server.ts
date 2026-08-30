import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import eventsRoutes from "./routes/events.routes";
import aboutRoutes from "./routes/about.routes";
import publicationsRoutes from "./routes/publications.routes";
import galleryRoutes from "./routes/gallery.routes";

// Load environment variables
dotenv.config();

// Import routes

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// MIDDLEWARE
// =============================================

// CORS — allowed origins from env (comma-separated) with dev defaults
const allowedOrigins = (
  process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:5000"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to load cross-origin
  }),
);

// HTTP request logging
app.use(morgan("dev"));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static assets
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "public", "uploads")),
);

// =============================================
// ROUTES
// =============================================

app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/publications", publicationsRoutes);
app.use("/api/gallery", galleryRoutes);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error." });
  },
);

// =============================================
// START SERVER
// =============================================

app.listen(PORT, () => {
  console.log(`SLSQ Backend API running on http://localhost:${PORT}`);
});

export default app;
