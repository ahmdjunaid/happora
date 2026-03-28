import { Request, Response, NextFunction } from "express";
import { IAuthController } from "./interface/auth.controller.interface";
import { injectable } from "inversify";
import { inject } from "inversify";
import { TYPES } from "../DI/types";
import { IUserService } from "../services/interface/user.service.interface";
import HttpStatus from "../constants/http.statuscodes";
import {
  validateEmail,
  validateName,
  validateOtp,
  validatePassword,
  validateRole,
} from "../utils/auth.validation";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.UserService) private _userService: IUserService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = validateName(req.body.name);
      const email = validateEmail(req.body.email);
      const password = validatePassword(req.body.password);
      const role = validateRole(req.body.role);

      const response = await this._userService.register({
        name,
        email,
        password,
        role,
      });

      res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = validateEmail(req.body.email);
      const otp = validateOtp(req.body.otp);
      const response = await this._userService.verifyOtp(email, otp);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = validateEmail(req.body.email);
      const response = await this._userService.resendOtp(email);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = validateEmail(req.body.email);
      const password = validatePassword(req.body.password);

      const response = await this._userService.login({ email, password });
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
