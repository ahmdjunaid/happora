import { injectable } from "inversify";
import {
  IAuthResponse,
  IOtpDispatchResponse,
  IUser,
  IUserProfile,
  UserRole,
} from "../types/user.types";
import { IUserService } from "./interface/user.service.interface";
import { inject } from "inversify";
import { TYPES } from "../DI/types";
import { IUserRepository } from "../repositories/interface/user.repository.interface";
import { IPendingSignupRepository } from "../repositories/interface/pendingSignup.repository.interface";
import { AppError } from "../middlewares/error.middleware";
import HttpStatus from "../constants/http.statuscodes";
import { MESSAGES } from "../constants/messages";
import {
  comparePassword,
  generateOtp,
  hashPassword,
  normalizeEmail,
} from "../utils/auth.util";
import { generateAuthToken } from "../utils/jwt.util";
import { sendSignupOtpEmail } from "../utils/mail.util";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
        @inject(TYPES.PendingSignupRepository)
        private _pendingSignupRepo: IPendingSignupRepository,
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

    private ensureEmailServiceConfigured(): void {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new AppError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                MESSAGES.AUTH.EMAIL_SERVICE_NOT_CONFIGURED,
            );
        }
    }

    async register(data: Partial<IUser>): Promise<IOtpDispatchResponse> {
        const email = normalizeEmail(data.email ?? "");
        const existingUser = await this._userRepo.findOne({ email, isDeleted: false });

        if (existingUser) {
            throw new AppError(HttpStatus.CONFLICT, MESSAGES.AUTH.USER_ALREADY_EXISTS);
        }

        this.ensureEmailServiceConfigured();

        const hashedPassword = await hashPassword(data.password ?? "");
        const otp = generateOtp();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await this._pendingSignupRepo.upsertPendingSignup(email, {
            name: data.name,
            email,
            password: hashedPassword,
            role: data.role ?? UserRole.CUSTOMER,
            otp,
            otpExpiresAt,
        });

        try {
            await sendSignupOtpEmail(email, data.name ?? "User", otp);
        } catch (error) {
            console.error("OTP email send failed:", error);
            throw new AppError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                MESSAGES.AUTH.EMAIL_SEND_FAILED,
            );
        }

        return {
            message: MESSAGES.AUTH.REGISTER_SUCCESS,
            email,
        };
    }

    async verifyOtp(emailValue: string, otp: string): Promise<IAuthResponse> {
        const email = normalizeEmail(emailValue);
        const existingUser = await this._userRepo.findOne({ email, isDeleted: false });

        if (existingUser) {
            throw new AppError(HttpStatus.CONFLICT, MESSAGES.AUTH.USER_ALREADY_EXISTS);
        }

        const pendingSignup = await this._pendingSignupRepo.findPendingSignupByEmail(email);

        if (
            !pendingSignup ||
            pendingSignup.otp !== otp ||
            pendingSignup.otpExpiresAt.getTime() < Date.now()
        ) {
            throw new AppError(
                HttpStatus.BAD_REQUEST,
                MESSAGES.AUTH.INVALID_OR_EXPIRED_OTP,
            );
        }

        const user = await this._userRepo.saveUser({
            name: pendingSignup.name,
            email: pendingSignup.email,
            password: pendingSignup.password,
            role: pendingSignup.role,
            isVerified: true,
        });

        await this._pendingSignupRepo.deletePendingSignupByEmail(email);

        const sanitizedUser = this.sanitizeUser(user);

        return {
            message: MESSAGES.AUTH.OTP_VERIFIED_SUCCESS,
            user: sanitizedUser,
            token: generateAuthToken(sanitizedUser),
        };
    }

    async resendOtp(emailValue: string): Promise<IOtpDispatchResponse> {
        const email = normalizeEmail(emailValue);
        const pendingSignup = await this._pendingSignupRepo.findPendingSignupByEmail(email);

        if (!pendingSignup) {
            throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.AUTH.USER_NOT_FOUND);
        }

        this.ensureEmailServiceConfigured();

        const otp = generateOtp();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await this._pendingSignupRepo.upsertPendingSignup(email, {
            otp,
            otpExpiresAt,
        });

        try {
            await sendSignupOtpEmail(email, pendingSignup.name, otp);
        } catch (error) {
            console.error("OTP email resend failed:", error);
            throw new AppError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                MESSAGES.AUTH.EMAIL_SEND_FAILED,
            );
        }

        return {
            message: MESSAGES.AUTH.OTP_RESENT_SUCCESS,
            email,
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
