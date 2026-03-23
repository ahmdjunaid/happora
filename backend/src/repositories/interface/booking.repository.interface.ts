import { BookingDocument } from "../../model/booking.model";
import { IBooking } from "../../types/booking.types";

export interface IBookingRepository {
  createBooking(data: Partial<IBooking>): Promise<BookingDocument>;
  findBookingsByUser(userId: string): Promise<BookingDocument[]>;
}
