export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const hasMinimumPasswordLength = (password: string): boolean =>
  password.trim().length >= 6
