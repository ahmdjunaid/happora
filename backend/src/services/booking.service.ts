import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../DI/types";
import { IBookingRepository } from "../repositories/interface/booking.repository.interface";
import { IServiceRepository } from "../repositories/interface/service.repository.interface";
import { IBookingService } from "./interface/booking.service.interface";
import {
  BookingStatus,
  IBookingDto,
  IBookingListResponse,
  IBookingResponse,
  ICreateBookingPayload,
} from "../types/booking.types";
import { AuthenticatedUser } from "../types/express.types";
import { AppError } from "../middlewares/error.middleware";
import HttpStatus from "../constants/http.statuscodes";
import { MESSAGES } from "../constants/messages";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.BookingRepository)
    private _bookingRepository: IBookingRepository,
    @inject(TYPES.ServiceRepository)
    private _serviceRepository: IServiceRepository,
  ) {}

  private sanitizeBooking(booking: {
    _id?: { toString(): string };
    serviceId: Types.ObjectId;
    userId: Types.ObjectId;
    providerId: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    numberOfDays: number;
    totalPrice: number;
    status: BookingStatus;
  }): IBookingDto {
    return {
      id: booking._id?.toString() ?? "",
      serviceId: booking.serviceId.toString(),
      userId: booking.userId.toString(),
      providerId: booking.providerId.toString(),
      startDate: booking.startDate,
      endDate: booking.endDate,
      numberOfDays: booking.numberOfDays,
      totalPrice: booking.totalPrice,
      status: booking.status,
    };
  }

  private ensureAuthenticatedUser(user?: AuthenticatedUser): AuthenticatedUser {
    if (!user?.id) {
      throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    return user;
  }

  async bookService(
    user: AuthenticatedUser,
    payload: ICreateBookingPayload,
  ): Promise<IBookingResponse> {
    const currentUser = this.ensureAuthenticatedUser(user);
    const service = await this._serviceRepository.findServiceById(payload.serviceId);

    if (!service) {
      throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.SERVICE.SERVICE_NOT_FOUND);
    }

    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);

    if (startDate.getTime() >= endDate.getTime()) {
      throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.BOOKING.INVALID_DATE_RANGE);
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / millisecondsPerDay,
    );

    const booking = await this._bookingRepository.createBooking({
      userId: new Types.ObjectId(currentUser.id),
      serviceId: new Types.ObjectId(payload.serviceId),
      providerId: service.providerId,
      startDate,
      endDate,
      numberOfDays,
      totalPrice: service.pricePerDay * numberOfDays,
      status: BookingStatus.CONFIRMED,
    });

    return {
      message: MESSAGES.BOOKING.CREATED_SUCCESS,
      booking: this.sanitizeBooking(booking),
    };
  }

  async getMyBookings(user: AuthenticatedUser): Promise<IBookingListResponse> {
    const currentUser = this.ensureAuthenticatedUser(user);
    const bookings = await this._bookingRepository.findBookingsByUser(currentUser.id);

    return {
      message: MESSAGES.BOOKING.FETCHED_SUCCESS,
      bookings: bookings.map((booking) => this.sanitizeBooking(booking)),
    };
  }
}
