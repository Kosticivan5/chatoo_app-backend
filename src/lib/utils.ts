import jwt from "jsonwebtoken";
import type { UserId, ResWithCookie } from "../types";

export const generateToken = (userId: UserId, res: ResWithCookie) => {
  const jwtSecret = process.env.JWT_SECRET;
  let token = null;
  if (jwtSecret) {
    token = jwt.sign({ userId }, jwtSecret, {
      expiresIn: "7d",
    });
  }

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevents XSS attacks
    sameSite: "strict", // prevents CSRF attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
