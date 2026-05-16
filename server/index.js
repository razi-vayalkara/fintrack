import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import lockerRoutes from "./routes/lockers.js";
import transactionRoutes from "./routes/transactions.js";
import suggestionRoutes from "./routes/suggestions.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config({ path: "../.env" });
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/lockers", lockerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  });
