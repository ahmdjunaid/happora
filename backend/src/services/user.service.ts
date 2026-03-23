import { injectable } from "inversify";
import {
  IAuthResponse,
  IUser,
  IUserProfile,
} from "../types/user.types";
import { IUserService } from "./interface/user.service.interface";
import { inject } from "inversify";
import { TYPES } from "../DI/types";
import { IUserRepository } from "../repositories/interface/user.repository.interface";
import { AppError } from "../middlewares/error.middleware";
import HttpStatus from "../constants/http.statuscodes";
import { MESSAGES } from "../constants/messages";
import {
  comparePassword,
  hashPassword,
  normalizeEmail,
} from "../utils/auth.util";
import { generateAuthToken } from "../utils/jwt.util";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    ){}

    private sanitizeUser(user: IUser & { _id?: { toString(): string } }): IUserProfile {
        return {
            id: user._id?.toString() ?? "",
            name: user.name,
            email: user.email,
            role: user.role,
            isBlocked: user.isBlocked,
        };
    }

    async register(data: Partial<IUser>): Promise<IAuthResponse> {
        const email = normalizeEmail(data.email ?? "");
        const existingUser = await this._userRepo.findOne({ email, isDeleted: false });

        if (existingUser) {
            throw new AppError(HttpStatus.CONFLICT, MESSAGES.AUTH.USER_ALREADY_EXISTS);
        }

        const hashedPassword = await hashPassword(data.password ?? "");
        const user = await this._userRepo.saveUser({
            ...data,
            email,
            password: hashedPassword,
        });

        const sanitizedUser = this.sanitizeUser(user);

        return {
            message: MESSAGES.AUTH.REGISTER_SUCCESS,
            user: sanitizedUser,
            token: generateAuthToken(sanitizedUser),
        };
    }

    async login(data: Pick<IUser, "email" | "password">): Promise<IAuthResponse> {
        const email = normalizeEmail(data.email);
        const user = await this._userRepo.findOne({ email, isDeleted: false });

        if (!user) {
            throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
        }

        if (user.isBlocked) {
            throw new AppError(HttpStatus.FORBIDDEN, MESSAGES.AUTH.USER_BLOCKED);
        }

        const isPasswordValid = await comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
        }

        const sanitizedUser = this.sanitizeUser(user);

        return {
            message: MESSAGES.AUTH.LOGIN_SUCCESS,
            user: sanitizedUser,
            token: generateAuthToken(sanitizedUser),
        };
    }
}
