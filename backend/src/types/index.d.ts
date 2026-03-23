import { DecodedUser } from "../utils/jwt.util";

declare global {
  namespace Express {
    export interface Request {
      user?: DecodedUser | null;
    }
  }
}
