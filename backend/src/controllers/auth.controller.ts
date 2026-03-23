import { Request, Response, NextFunction } from "express";
import { IAuthController } from "./interface/auth.controller.interface";
import { injectable } from "inversify";
import { inject } from "inversify";
import { TYPES } from "../DI/types";
import { IUserService } from "../services/interface/user.service.interface";
import { AppError } from "../middlewares/error.middleware";
import HttpStatus from "../constants/http.statuscodes";
import { MESSAGES } from "../constants/messages";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.UserService) private _userService: IUserService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password || !role)
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          MESSAGES.COMMON.ALL_FIELDS_REQUIRES,
        );

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

  
}
