import { AppError } from "../middlewares/error.middleware";
import HttpStatus from "../constants/http.statuscodes";
import { MESSAGES } from "../constants/messages";
import { IServiceFilters, IServicePayload } from "../types/service.types";

const getTrimmedValue = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const parsePriceValue = (value: unknown): number => {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.SERVICE.INVALID_PRICE);
  }

  return parsedValue;
};

const parseSlotsValue = (value: unknown): number => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.SERVICE.INVALID_TOTAL_SLOTS);
  }

  return parsedValue;
};

export const validateServicePayload = (
  payload: Record<string, unknown>,
): IServicePayload => {
  const title = getTrimmedValue(payload.title);
  const description = getTrimmedValue(payload.description);
  const category = getTrimmedValue(payload.category);
  const location = getTrimmedValue(payload.location);

  if (!title) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.SERVICE.TITLE_REQUIRED);
  }

  if (!description) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.SERVICE.DESCRIPTION_REQUIRED);
  }

  if (!category) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.SERVICE.CATEGORY_REQUIRED);
  }

  if (!location) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.SERVICE.LOCATION_REQUIRED);
  }

  if (payload.pricePerDay === undefined || payload.pricePerDay === null || payload.pricePerDay === "") {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.SERVICE.PRICE_REQUIRED);
  }

  if (payload.totalSlots === undefined || payload.totalSlots === null || payload.totalSlots === "") {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.SERVICE.TOTAL_SLOTS_REQUIRED);
  }

  return {
    title,
    description,
    category,
    location,
    pricePerDay: parsePriceValue(payload.pricePerDay),
    totalSlots: parseSlotsValue(payload.totalSlots),
  };
};

export const validateServiceFilters = (
  query: Record<string, unknown>,
): IServiceFilters => {
  const filters: IServiceFilters = {
    keyword: getTrimmedValue(query.keyword),
    category: getTrimmedValue(query.category),
    location: getTrimmedValue(query.location),
  };

  if (query.minPrice !== undefined && query.minPrice !== "") {
    filters.minPrice = parsePriceValue(query.minPrice);
  }

  if (query.maxPrice !== undefined && query.maxPrice !== "") {
    filters.maxPrice = parsePriceValue(query.maxPrice);
  }

  if (
    filters.minPrice !== undefined &&
    filters.maxPrice !== undefined &&
    filters.minPrice > filters.maxPrice
  ) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.SERVICE.INVALID_PRICE_RANGE);
  }

  return filters;
};
