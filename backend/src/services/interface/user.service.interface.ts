import {
  IAuthResponse,
  IUser,
} from "../../types/user.types";

export interface IUserService {
    register(data: Partial<IUser>): Promise<IAuthResponse>;
    login(data: Pick<IUser, "email" | "password">): Promise<IAuthResponse>;
}
