
export enum UserRole {
  CUSTOMER = 'USER',
  ADMIN = 'ADMIN',
}

export interface DecodedUser {
  sub: string;
  email: string;
  role: string;
}


export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
}

export interface IAuthResponse {
  message: string;
  user: IUserProfile;
  token: string;
}
