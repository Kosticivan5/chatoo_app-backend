import { UserSchema } from "./schemaTypes";
import { Types } from "mongoose";
import { Response } from "express";

export type SingUpReqBody = Pick<
  UserSchema,
  "email" | "fullName" | "password" | "profilePic"
>;

export type UserId = string | Types.ObjectId;
export type ResWithCookie = Response & { cookie: Function };
