import mongoose from "mongoose";
import { Schema } from "mongoose";
import type { UserSchema } from "../types";

const userSchema = new Schema<UserSchema>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const User = mongoose.model<UserSchema>("User", userSchema);

export default User;
