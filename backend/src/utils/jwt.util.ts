import jwt, { SignOptions } from "jsonwebtoken";
import { DecodedUser, IUserProfile } from "../types/user.types";
import HttpStatus from "../constants/http.statuscodes";
import { NextFunction, Request, Response } from "express";


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

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(HttpStatus.UNAUTHORIZED || 401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedUser;

    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(HttpStatus.UNAUTHORIZED || 401).json({ message: "Invalid or expired token" });
  }
};
