import "reflect-metadata";
import { Container } from "inversify";
import { IUserRepository } from "../repositories/interface/user.repository.interface";
import { TYPES } from "./types";
import { UserRepository } from "../repositories/user.repository";
import { IUserService } from "../services/interface/user.service.interface";
import { UserService } from "../services/user.service";
import { IAuthController } from "../controllers/interface/auth.controller.interface";
import { AuthController } from "../controllers/auth.controller";
import { IServiceRepository } from "../repositories/interface/service.repository.interface";
import { ServiceRepository } from "../repositories/service.repository";
import { IServiceService } from "../services/interface/service.service.interface";
import { ServiceService } from "../services/service.service";
import { IServiceController } from "../controllers/interface/service.controller.interface";
import { ServiceController } from "../controllers/service.controller";
import { IBookingRepository } from "../repositories/interface/booking.repository.interface";
import { BookingRepository } from "../repositories/booking.repository";
import { IBookingService } from "../services/interface/booking.service.interface";
import { BookingService } from "../services/booking.service";
import { IBookingController } from "../controllers/interface/booking.controller.interface";
import { BookingController } from "../controllers/booking.controller";

const container = new Container()

//User
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IAuthController>(TYPES.AuthController).to(AuthController)
container.bind<IServiceRepository>(TYPES.ServiceRepository).to(ServiceRepository);
container.bind<IServiceService>(TYPES.ServiceService).to(ServiceService);
container.bind<IServiceController>(TYPES.ServiceController).to(ServiceController);
container.bind<IBookingRepository>(TYPES.BookingRepository).to(BookingRepository);
container.bind<IBookingService>(TYPES.BookingService).to(BookingService);
container.bind<IBookingController>(TYPES.BookingController).to(BookingController);

export { container }
