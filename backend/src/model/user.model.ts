import mongoose, { HydratedDocument, Schema } from 'mongoose';
import { IUser, UserRole } from '../types/user.types';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
export type UserDocument = HydratedDocument<IUser>;
