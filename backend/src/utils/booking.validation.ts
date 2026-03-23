import { AppError } from "../middlewares/error.middleware";
import HttpStatus from "../constants/http.statuscodes";
import { MESSAGES } from "../constants/messages";
import { ICreateBookingPayload } from "../types/booking.types";

const getTrimmedValue = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const isValidDate = (value: string): boolean => !Number.isNaN(new Date(value).getTime());

const validateBookingDatesPayload = (
  payload: Record<string, unknown>,
): ICreateBookingPayload => {
  const serviceId = getTrimmedValue(payload.serviceId);
  const startDate = getTrimmedValue(payload.startDate);
  const endDate = getTrimmedValue(payload.endDate);

  if (!serviceId) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.BOOKING.SERVICE_REQUIRED);
  }

  if (!startDate) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.BOOKING.START_DATE_REQUIRED);
  }

  if (!endDate) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.BOOKING.END_DATE_REQUIRED);
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.BOOKING.INVALID_DATE);
  }

  return {
    serviceId,
    startDate,
    endDate,
  };
};

export const validateCreateBookingPayload = (
  payload: Record<string, unknown>,
): ICreateBookingPayload => validateBookingDatesPayload(payload);

export const validateBookingAvailabilityPayload = (
  payload: Record<string, unknown>,
): ICreateBookingPayload => validateBookingDatesPayload(payload);
