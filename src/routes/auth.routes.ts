import express, { Router } from "express";
import {
  signUpController,
  signInController,
  logOutController,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller";
import { protectRoute } from "../middlewares/auth.protectRoute";

const router: Router = express.Router();

router.post("/signup", signUpController);

router.post("/login", signInController);

router.post("/logout", logOutController);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
