
export enum UserRole {
  CUSTOMER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isDeleted: boolean;
  isBlocked: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpiresAt?: Date | null;
}

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
}

export interface IAuthResponse {
  message: string;
  user: IUserProfile;
}

export interface IForgotPasswordResponse {
  message: string;
  resetToken: string;
  expiresAt: Date;
}
