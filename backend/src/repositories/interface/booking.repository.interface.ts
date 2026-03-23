import { BookingDocument } from "../../model/booking.model";
import { IBooking } from "../../types/booking.types";

export interface IAdminBookingRecord {
  _id?: { toString(): string };
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: string;
  serviceId: {
    _id?: { toString(): string };
    title: string;
    category: string;
  };
  userId: {
    _id?: { toString(): string };
    name: string;
    email: string;
  };
}

export interface IBookingRepository {
  createBooking(data: Partial<IBooking>): Promise<BookingDocument>;
  findBookingsByUser(userId: string): Promise<BookingDocument[]>;
  findBookingsByServiceIds(serviceIds: string[]): Promise<IAdminBookingRecord[]>;
  findOverlappingBookings(
    serviceId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<BookingDocument[]>;
}
