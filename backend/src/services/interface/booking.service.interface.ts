import {
  IBookingListResponse,
  IBookingResponse,
  ICreateBookingPayload,
} from "../../types/booking.types";
import { AuthenticatedUser } from "../../types/express.types";

export interface IBookingService {
  bookService(
    user: AuthenticatedUser,
    payload: ICreateBookingPayload,
  ): Promise<IBookingResponse>;
  getMyBookings(user: AuthenticatedUser): Promise<IBookingListResponse>;
}
