import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { BookingDocument, BookingModel } from "../model/booking.model";
import { IBooking } from "../types/booking.types";
import { IBookingRepository } from "./interface/booking.repository.interface";

@injectable()
export class BookingRepository
  extends BaseRepository<IBooking>
  implements IBookingRepository
{
  constructor() {
    super(BookingModel);
  }

  createBooking(data: Partial<IBooking>): Promise<BookingDocument> {
    return this.create(data);
  }

  findBookingsByUser(userId: string): Promise<BookingDocument[]> {
    return BookingModel.find({ userId, isDeleted: false }).sort({ createdAt: -1 });
  }
}
