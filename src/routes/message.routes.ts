import express, { Router } from "express";
import { protectRoute } from "../middlewares/auth.protectRoute";
import {
  getUsersForSidebar,
  getMessages,
  sendMessages,
} from "../controllers/message.controllers";

const router: Router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessages);

export default router;
