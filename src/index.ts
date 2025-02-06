import express from "express";
import type { Express } from "express";
import authRoutes from "./routes/auth.route";
import "dotenv/config";
import { connectDB } from "./lib/db";

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 5001;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  connectDB();
});
