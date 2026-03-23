
export enum UserRole {
  CUSTOMER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isDeleted: boolean;
  isBlocked: boolean;
}
