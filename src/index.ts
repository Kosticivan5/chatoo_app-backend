import express from "express";
import type { Express } from "express";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import "dotenv/config";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 5001;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  connectDB();
});
