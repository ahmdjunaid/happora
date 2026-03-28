import { injectable } from "inversify";
import {
  PendingSignupDocument,
  PendingSignupModel,
} from "../model/pendingSignup.model";
import { BaseRepository } from "./base.repository";
import { IPendingSignup } from "../types/user.types";
import { IPendingSignupRepository } from "./interface/pendingSignup.repository.interface";

@injectable()
export class PendingSignupRepository
  extends BaseRepository<IPendingSignup>
  implements IPendingSignupRepository
{
  constructor() {
    super(PendingSignupModel);
  }

  async upsertPendingSignup(
    email: string,
    data: Partial<IPendingSignup>,
  ): Promise<PendingSignupDocument> {
    const pendingSignup = await PendingSignupModel.findOneAndUpdate(
      { email },
      data,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return pendingSignup as PendingSignupDocument;
  }

  findPendingSignupByEmail(email: string): Promise<PendingSignupDocument | null> {
    return PendingSignupModel.findOne({ email });
  }

  async deletePendingSignupByEmail(email: string): Promise<void> {
    await PendingSignupModel.deleteOne({ email });
  }
}
