import mongoose from "mongoose";
import { Schema } from "mongoose";
import type { MessageSchema } from "../types";

const messageSchema = new Schema<MessageSchema>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model<MessageSchema>("Message", messageSchema);

export default Message;
