import mongoose, { HydratedDocument, Schema } from "mongoose";
import { IPendingSignup, UserRole } from "../types/user.types";

const pendingSignupSchema = new Schema<IPendingSignup>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER },
    otp: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export const PendingSignupModel = mongoose.model<IPendingSignup>(
  "PendingSignup",
  pendingSignupSchema,
);
export type PendingSignupDocument = HydratedDocument<IPendingSignup>;
