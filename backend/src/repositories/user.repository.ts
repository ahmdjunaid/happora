import { UserDocument, UserModel } from "../model/user.model";
import { IUser } from "../types/user.types";
import { BaseRepository } from "./base.repository";
import { IUserRepository } from "./interface/user.repository.interface";

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor(){
        super(UserModel)
    }

    saveUser(data: Partial<IUser>): Promise<UserDocument> {
        return this.create(data)
    }

    findOne(filter: Record<string, unknown>): Promise<UserDocument | null> {
        return UserModel.findOne(filter);
    }

    updateOne(filter: Record<string, unknown>, data: Partial<IUser>): Promise<UserDocument | null> {
        return UserModel.findOneAndUpdate(filter, data, { new: true });
    }
}
