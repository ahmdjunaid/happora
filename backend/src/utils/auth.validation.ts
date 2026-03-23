import { AppError } from "../middlewares/error.middleware";
import HttpStatus from "../constants/http.statuscodes";
import { MESSAGES } from "../constants/messages";
import { EMAIL_REGEX } from "./auth.util";
import { UserRole } from "../types/user.types";

const assertString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

export const validateName = (value: unknown): string => {
  const name = assertString(value);
  if (!name) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.AUTH.NAME_REQUIRED);
  }

  if (name.length < 2) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.AUTH.INVALID_NAME);
  }

  return name;
};

export const validateEmail = (value: unknown): string => {
  const email = assertString(value).toLowerCase();
  if (!email) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.AUTH.EMAIL_REQUIRED);
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.AUTH.INVALID_EMAIL);
  }

  return email;
};

export const validatePassword = (value: unknown): string => {
  const password = assertString(value);
  if (!password) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.AUTH.PASSWORD_REQUIRED);
  }

  if (password.length < 8) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.AUTH.PASSWORD_MIN_LENGTH);
  }

  return password;
};

export const validateRole = (value: unknown): UserRole => {
  const role = assertString(value).toUpperCase() as UserRole;
  if (!role) {
    return UserRole.CUSTOMER;
  }

  if (!Object.values(UserRole).includes(role)) {
    throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.AUTH.INVALID_ROLE);
  }

  return role;
};
