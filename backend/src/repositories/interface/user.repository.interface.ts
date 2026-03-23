import { UserDocument } from "../../model/user.model";
import { IUser } from "../../types/user.types";

export interface IUserRepository {
    saveUser(data: Partial<IUser>): Promise<UserDocument>;
    findOne(filter: Record<string, unknown>): Promise<UserDocument | null>;
    updateOne(
      filter: Record<string, unknown>,
      data: Partial<IUser>,
    ): Promise<UserDocument | null>;
}
