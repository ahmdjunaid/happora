import { PendingSignupDocument } from "../../model/pendingSignup.model";
import { IPendingSignup } from "../../types/user.types";

export interface IPendingSignupRepository {
  upsertPendingSignup(
    email: string,
    data: Partial<IPendingSignup>,
  ): Promise<PendingSignupDocument>;
  findPendingSignupByEmail(email: string): Promise<PendingSignupDocument | null>;
  deletePendingSignupByEmail(email: string): Promise<void>;
}
