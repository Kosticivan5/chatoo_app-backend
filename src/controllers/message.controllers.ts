import { Response } from "express";
import User from "../models/user.model";
import { AuthRequest } from "../types";
import Message from "../models/message.model";
import { MessageSchema } from "../types";
import cloudinary from "../lib/cloudinary";

export const getUsersForSidebar = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInUserId = req.user?._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    if (!filteredUsers) {
      res.status(404).json({
        success: false,
        message: "No users found",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Users successfully fetched",
      data: filteredUsers,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error fetching users", error.message);
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

export const getMessages = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user?._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Messages successfully fetched",
      data: messages,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error fetching messages", error.message);
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

export const sendMessages = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
) => {
  try {
    const { text, image } = req.body as MessageSchema;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // realtime messaging to do with socket.io
    // ...

    res.status(201).json({
      success: true,
      message: "successfully sent a message",
      data: newMessage,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error ", error.message);
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};
