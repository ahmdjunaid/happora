import { injectable } from "inversify";
import { UserDocument } from "../model/user.model";
import { IUser } from "../types/user.types";
import { IUserService } from "./interface/user.service.interface";
import { inject } from "inversify";
import { TYPES } from "../DI/types";
import { IUserRepository } from "../repositories/interface/user.repository.interface";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    ){}

    async register(data: Partial<IUser>): Promise<UserDocument> {
        return await this._userRepo.saveUser(data)
    }
}