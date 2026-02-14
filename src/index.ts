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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "LinkedIn Backend API",
    documentation: `http://localhost:${PORT}/api-docs`
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
