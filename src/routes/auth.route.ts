import express from "express";
import {
  signUpController,
  signInController,
  logOutController,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signUpController);

router.post("/login", signInController);

router.post("/logout", logOutController);

export default router;
