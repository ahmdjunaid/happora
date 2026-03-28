import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../DI/types";
import { IBookingRepository } from "../repositories/interface/booking.repository.interface";
import { IServiceRepository } from "../repositories/interface/service.repository.interface";
import { IBookingService } from "./interface/booking.service.interface";
import {
  IAdminBookingDto,
  IAdminBookingListResponse,
  BookingStatus,
  IBookingAvailabilityResponse,
  IBookingDto,
  IBookingListResponse,
  IBookingResponse,
  ICreateBookingPayload,
} from "../types/booking.types";
import { AppError } from "../middlewares/error.middleware";
import HttpStatus from "../constants/http.statuscodes";
import { MESSAGES } from "../constants/messages";
import { DecodedUser, UserRole } from "../types/user.types";
import { IAdminBookingRecord } from "../repositories/interface/booking.repository.interface";

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

  private ensureAuthenticatedUser(user?: DecodedUser): DecodedUser {
    if (!user?.sub) {
      throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    return user;
  }

  private ensureAdminAccess(user?: DecodedUser): DecodedUser {
    const currentUser = this.ensureAuthenticatedUser(user);

    if (currentUser.role.toUpperCase() !== UserRole.ADMIN) {
      throw new AppError(HttpStatus.FORBIDDEN, MESSAGES.BOOKING.ADMIN_ONLY);
    }

    return currentUser;
  }

  private sanitizeAdminBooking(booking: IAdminBookingRecord): IAdminBookingDto {
    return {
      bookingId: booking._id?.toString() ?? "",
      serviceTitle: booking.serviceId?.title ?? "",
      serviceCategory: booking.serviceId?.category ?? "",
      user: {
        id: booking.userId?._id?.toString() ?? "",
        name: booking.userId?.name ?? "",
        email: booking.userId?.email ?? "",
      },
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalPrice: booking.totalPrice,
      status: booking.status as BookingStatus,
    };
  }

  private parseBookingDates(payload: ICreateBookingPayload): {
    startDate: Date;
    endDate: Date;
    numberOfDays: number;
  } {
    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate.getTime() < today.getTime()) {
      throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.BOOKING.PAST_DATE_NOT_ALLOWED);
    }

    if (startDate.getTime() >= endDate.getTime()) {
      throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.BOOKING.INVALID_DATE_RANGE);
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / millisecondsPerDay,
    );

    return { startDate, endDate, numberOfDays };
  }

  private getMinAvailableSlots(
    totalSlots: number,
    bookings: Array<{ startDate: Date; endDate: Date }>,
    startDate: Date,
    endDate: Date,
  ): number {
    let minimumAvailableSlots = totalSlots;
    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const overlappingCount = bookings.filter(
        (booking) =>
          booking.startDate.getTime() <= currentDate.getTime() &&
          booking.endDate.getTime() > currentDate.getTime(),
      ).length;
      const availableSlots = totalSlots - overlappingCount;

      minimumAvailableSlots = Math.min(minimumAvailableSlots, availableSlots);
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return minimumAvailableSlots;
  }

  private async resolveAvailability(
    serviceId: string,
    totalSlots: number,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const overlappingBookings = await this._bookingRepository.findOverlappingBookings(
      serviceId,
      startDate,
      endDate,
    );

    return this.getMinAvailableSlots(
      totalSlots,
      overlappingBookings,
      startDate,
      endDate,
    );
  }

  async checkAvailability(
    payload: ICreateBookingPayload,
  ): Promise<IBookingAvailabilityResponse> {
    const service = await this._serviceRepository.findServiceById(payload.serviceId);

    if (!service) {
      throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.SERVICE.SERVICE_NOT_FOUND);
    }

    const { startDate, endDate } = this.parseBookingDates(payload);
    const availableSlots = await this.resolveAvailability(
      payload.serviceId,
      service.totalSlots,
      startDate,
      endDate,
    );

    return {
      message: MESSAGES.BOOKING.AVAILABILITY_FETCHED_SUCCESS,
      available: availableSlots > 0,
      availableSlots: Math.max(availableSlots, 0),
    };
  }

  async bookService(
    user: DecodedUser,
    payload: ICreateBookingPayload,
  ): Promise<IBookingResponse> {
    const currentUser = this.ensureAuthenticatedUser(user);
    const service = await this._serviceRepository.findServiceById(payload.serviceId);

    if (!service) {
      throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.SERVICE.SERVICE_NOT_FOUND);
    }

    const { startDate, endDate, numberOfDays } = this.parseBookingDates(payload);
    const availableSlots = await this.resolveAvailability(
      payload.serviceId,
      service.totalSlots,
      startDate,
      endDate,
    );

    if (availableSlots <= 0) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        MESSAGES.BOOKING.NO_SLOTS_AVAILABLE_FOR_DATE,
      );
    }

    const booking = await this._bookingRepository.createBooking({
      userId: new Types.ObjectId(currentUser.sub),
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

  async getMyBookings(user: DecodedUser): Promise<IBookingListResponse> {
    const currentUser = this.ensureAuthenticatedUser(user);
    const bookings = await this._bookingRepository.findBookingsByUser(currentUser.sub);

    return {
      message: MESSAGES.BOOKING.FETCHED_SUCCESS,
      bookings: bookings.map((booking) => this.sanitizeBooking(booking)),
    };
  }

  async getAdminBookings(user: DecodedUser): Promise<IAdminBookingListResponse> {
    const currentAdmin = this.ensureAdminAccess(user);
    const services = await this._serviceRepository.findServicesByProvider(currentAdmin.sub);
    const serviceIds = services.map((service) => service._id.toString());

    if (serviceIds.length === 0) {
      return {
        message: MESSAGES.BOOKING.ADMIN_FETCHED_SUCCESS,
        bookings: [],
      };
    }

    const bookings = await this._bookingRepository.findBookingsByServiceIds(serviceIds);

    return {
      message: MESSAGES.BOOKING.ADMIN_FETCHED_SUCCESS,
      bookings: bookings.map((booking) => this.sanitizeAdminBooking(booking)),
    };
  }
}
