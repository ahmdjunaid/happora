import {
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
  getMyBookings(user: DecodedUser): Promise<IBookingListResponse>;
}
