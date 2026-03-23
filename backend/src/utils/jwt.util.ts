import jwt, { SignOptions } from "jsonwebtoken";
import { IUserProfile } from "../types/user.types";

const getJwtSecret = (): string => process.env.JWT_SECRET || "happora-dev-secret";
const getJwtExpiry = (): SignOptions["expiresIn"] =>
  (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export const generateAuthToken = (user: IUserProfile): string =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: getJwtExpiry(),
    },
  );
