import { Document, DefaultSchemaOptions, Types } from "mongoose";
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
}