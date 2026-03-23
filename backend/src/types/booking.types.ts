import { Types } from "mongoose";

export enum BookingStatus {
  CONFIRMED = "CONFIRMED",
}

export interface IBooking {
  userId: Types.ObjectId;
  serviceId: Types.ObjectId;
  providerId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  totalPrice: number;
  status: BookingStatus;
  isDeleted: boolean;
}

export interface ICreateBookingPayload {
  serviceId: string;
  startDate: string;
  endDate: string;
}

export interface IBookingDto {
  id: string;
  serviceId: string;
  userId: string;
  providerId: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  totalPrice: number;
  status: BookingStatus;
}

export interface IBookingResponse {
  message: string;
  booking: IBookingDto;
}

export interface IBookingListResponse {
  message: string;
  bookings: IBookingDto[];
}
