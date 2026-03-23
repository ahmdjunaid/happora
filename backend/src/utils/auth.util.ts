import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual, createHash } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  return `${salt}:${derivedKey.toString("hex")}`;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const [salt, storedHash] = hashedPassword.split(":");
  if (!salt || !storedHash) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (storedBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derivedKey);
};

export const generateResetToken = (): { plainToken: string; hashedToken: string } => {
  const plainToken = `${randomUUID()}${randomBytes(24).toString("hex")}`;
  const hashedToken = createHash("sha256").update(plainToken).digest("hex");

  return { plainToken, hashedToken };
};

export const hashResetToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");
