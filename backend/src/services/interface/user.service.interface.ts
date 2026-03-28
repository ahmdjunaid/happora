import {
  IAuthResponse,
  IOtpDispatchResponse,
  IUser,
} from "../../types/user.types";

export interface IUserService {
    register(data: Partial<IUser>): Promise<IOtpDispatchResponse>;
    verifyOtp(email: string, otp: string): Promise<IAuthResponse>;
    resendOtp(email: string): Promise<IOtpDispatchResponse>;
    login(data: Pick<IUser, "email" | "password">): Promise<IAuthResponse>;
}
