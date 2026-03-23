import { NextFunction, Request, Response } from "express";

export interface IBookingController {
  bookService(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMyBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
}
