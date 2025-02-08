import { NextFunction, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";

export const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized! User not logged in",
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("secret not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error:", error.message);
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};
