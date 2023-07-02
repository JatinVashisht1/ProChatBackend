import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IUserRequest extends Request {
  jwt: JwtPayload | string;
  token: string;
}
