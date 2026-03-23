import { UserDocument } from "../../model/user.model";
import { IUser } from "../../types/user.types";

export interface IUserRepository {
    saveUser(data: Partial<IUser>): Promise<UserDocument>;
}