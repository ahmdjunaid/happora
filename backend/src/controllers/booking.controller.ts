import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import HttpStatus from "../constants/http.statuscodes";
import { TYPES } from "../DI/types";
import { IBookingController } from "./interface/booking.controller.interface";
import { IBookingService } from "../services/interface/booking.service.interface";
import { AuthenticatedRequest } from "../types/express.types";
import { validateCreateBookingPayload } from "../utils/booking.validation";

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject(TYPES.BookingService) private _bookingService: IBookingService,
  ) {}

  bookService = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const payload = validateCreateBookingPayload(req.body as Record<string, unknown>);
      const response = await this._bookingService.bookService(req.user!, payload);

      res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  getMyBookings = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const response = await this._bookingService.getMyBookings(req.user!);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
