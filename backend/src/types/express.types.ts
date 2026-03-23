import { Request } from "express";
import { DecodedUser } from "./user.types";

export interface AuthenticatedRequest extends Request {
  user?: DecodedUser;
}
