import {
  IAdminBookingListResponse,
  IBookingAvailabilityResponse,
  IBookingListResponse,
  IBookingResponse,
  ICreateBookingPayload,
} from "../../types/booking.types";
import { DecodedUser } from "../../types/user.types";

export interface IBookingService {
  bookService(
    user: DecodedUser,
    payload: ICreateBookingPayload,
  ): Promise<IBookingResponse>;
  checkAvailability(
    payload: ICreateBookingPayload,
  ): Promise<IBookingAvailabilityResponse>;
  getAdminBookings(user: DecodedUser): Promise<IAdminBookingListResponse>;
  getMyBookings(user: DecodedUser): Promise<IBookingListResponse>;
}
