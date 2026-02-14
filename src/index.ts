import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import express, { Express } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import { swaggerSpec } from "./config/swagger";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol;
  res.json({
    message: "LinkedIn Backend API",
    version: "1.0.0",
    status: "running",
    documentation: `${protocol}://${host}/api-docs`,
    endpoints: {
      auth: `${protocol}://${host}/api/auth`,
      posts: `${protocol}://${host}/api/posts`
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
