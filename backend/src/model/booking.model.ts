import mongoose, { HydratedDocument, Schema } from "mongoose";
import { BookingStatus, IBooking } from "../types/booking.types";

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfDays: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.CONFIRMED,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

bookingSchema.index({ userId: 1, createdAt: -1 });

export const BookingModel = mongoose.model<IBooking>("Booking", bookingSchema);
export type BookingDocument = HydratedDocument<IBooking>;
