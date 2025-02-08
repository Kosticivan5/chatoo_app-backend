import type { Request, Response } from "express";
import type { AuthRequest } from "../types";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils";
import type { SignUpReqBody, SigninReqBody } from "../types";
import cloudinary from "../lib/cloudinary";

export const signUpController = async (
  req: Request<{}, {}, SignUpReqBody>,
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
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({
        success: false,
        message: "Email already exists",
      });
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

export const signInController = async (
  req: Request<{}, {}, SigninReqBody>,
  res: Response,
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    } else {
      const isPasswordCorrect = await bcrypt.compare(password, user?.password);

      if (!isPasswordCorrect) {
        res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }
      generateToken(user._id, res);

      res.status(200).json({
        success: true,
        message: "User successfully logged in",
        data: user,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("failed logging in the user", error.message);
    } else {
      res.status(500).json({
        success: false,
        message: "failed logging in",
      });
    }
  }
};

export const logOutController = (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("failed logging out the user", error.message);
    } else {
      res.status(500).json({
        success: false,
        message: "failed logging out",
      });
    }
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const bod = req.body;
    const { profilePic } = bod;
    console.log(bod);

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized, user not found",
      });
      return;
    }

    const userId = req.user?._id;

    if (!profilePic) {
      res.status(401).json({
        success: false,
        message: "Profile picture required",
      });
      return;
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "User info updated",
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Update fail", error.message);
    } else {
      res.status(500).json({
        success: false,
        message: "failed updating user",
      });
    }
  }
};

export const checkAuth = (req: AuthRequest, res: Response) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in checkAuthController", error.message);
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};
