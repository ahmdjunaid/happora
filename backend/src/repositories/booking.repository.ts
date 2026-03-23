import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { BookingDocument, BookingModel } from "../model/booking.model";
import { IBooking } from "../types/booking.types";
import {
  IAdminBookingRecord,
  IBookingRepository,
} from "./interface/booking.repository.interface";

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

  findBookingsByServiceIds(serviceIds: string[]): Promise<IAdminBookingRecord[]> {
    return BookingModel.find({
      serviceId: { $in: serviceIds },
      isDeleted: false,
    })
      .populate("serviceId", "title category")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean<IAdminBookingRecord[]>()
      .exec();
  }

  findOverlappingBookings(
    serviceId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<BookingDocument[]> {
    return BookingModel.find({
      serviceId,
      isDeleted: false,
      startDate: { $lt: endDate },
      endDate: { $gt: startDate },
    }).sort({ startDate: 1 });
  }
}
