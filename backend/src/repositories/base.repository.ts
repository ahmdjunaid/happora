import { HydratedDocument, Model } from "mongoose";
import { IBaseRepository } from "./interface/base.repository.interface";

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(private model: Model<T>) {}

  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    return await this.model.create(data);
  }

  async find(filter?: Partial<T> | undefined): Promise<HydratedDocument<T>[]> {
    return await this.model.find(filter);
  }

  async findById(id: string): Promise<HydratedDocument<T> | null> {
    return await this.model.findById(id);
  }

  async update(id: string, data: Partial<T>): Promise<HydratedDocument<T> | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<HydratedDocument<T> | null> {
    return await this.model.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }
}
