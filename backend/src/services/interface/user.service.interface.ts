import {
  IAuthResponse,
  IForgotPasswordResponse,
  IUser,
} from "../../types/user.types";

export interface IUserService {
    register(data: Partial<IUser>): Promise<IAuthResponse>;
    login(data: Pick<IUser, "email" | "password">): Promise<IAuthResponse>;
    forgotPassword(email: string): Promise<IForgotPasswordResponse>;
    resetPassword(data: { token: string; password: string }): Promise<{ message: string }>;
}
