import { UserSchema } from "./schemaTypes";
import { Types } from "mongoose";
import { Response, Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";

export interface SignUpReqBody {
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
}

export interface SigninReqBody {
  email: string;
  password: string;
}

export interface AuthRequest<T extends ParamsDictionary = {}> extends Request {
  user?: UserSchema;
  params: T;
}

export type UserId = string | Types.ObjectId;
export type ResWithCookie = Response & { cookie: Function };
