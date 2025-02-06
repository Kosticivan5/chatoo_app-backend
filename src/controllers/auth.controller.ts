import type { Request, Response } from "express";
import type { UserSchema } from "../types";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils";
import { SingUpReqBody } from "../types";

export const signUpController = async (
  req: Request<{}, {}, SingUpReqBody>,
  res: Response,
) => {
  const userInfo = req.body;
  const { fullName, email, password, profilePic } = userInfo;

  try {
    if (!fullName || !email || !password) {
      res.status(400).json({
        success: false,
        message: "please fill out all required fields",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "password must be at least 6 characters",
      });
      return;
    }

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({
        success: false,
        message: "Email already exists",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        success: true,
        message: "user successfully created",
        data: newUser,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "invalid user data",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("failed signing up the user", error.message);
    } else {
      res.status(501).json({
        success: false,
        message: "failed signing up",
      });
    }
  }
};
export const signInController = (req: Request, res: Response) => {
  res.send("login route");
};
export const logOutController = (req: Request, res: Response) => {
  res.send("logout route");
};
