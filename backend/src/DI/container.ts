import "reflect-metadata";
import { Container } from "inversify";
import { IUserRepository } from "../repositories/interface/user.repository.interface";
import { TYPES } from "./types";
import { UserRepository } from "../repositories/user.repository";
import { IUserService } from "../services/interface/user.service.interface";
import { UserService } from "../services/user.service";
import { IAuthController } from "../controllers/interface/auth.controller.interface";
import { AuthController } from "../controllers/auth.controller";

const container = new Container()

//User
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IAuthController>(TYPES.AuthController).to(AuthController)

export { container }