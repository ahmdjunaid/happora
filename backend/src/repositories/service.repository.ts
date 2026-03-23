import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { ServiceDocument, ServiceModel } from "../model/service.model";
import { IService, IServiceFilters } from "../types/service.types";
import { IServiceRepository } from "./interface/service.repository.interface";

@injectable()
export class ServiceRepository
  extends BaseRepository<IService>
  implements IServiceRepository
{
  constructor() {
    super(ServiceModel);
  }

  createService(data: Partial<IService>): Promise<ServiceDocument> {
    return this.create(data);
  }

  findServices(filters: IServiceFilters): Promise<ServiceDocument[]> {
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (filters.keyword) {
      query.title = { $regex: filters.keyword, $options: "i" };
    }

    if (filters.category) {
      query.category = { $regex: `^${filters.category}$`, $options: "i" };
    }

    if (filters.location) {
      query.location = { $regex: filters.location, $options: "i" };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.pricePerDay = {};

      if (filters.minPrice !== undefined) {
        (query.pricePerDay as Record<string, number>).$gte = filters.minPrice;
      }

      if (filters.maxPrice !== undefined) {
        (query.pricePerDay as Record<string, number>).$lte = filters.maxPrice;
      }
    }

    return ServiceModel.find(query).sort({ createdAt: -1 });
  }

  findServicesByProvider(providerId: string): Promise<ServiceDocument[]> {
    return ServiceModel.find({ providerId, isDeleted: false }).sort({ createdAt: -1 });
  }

  findServiceById(id: string): Promise<ServiceDocument | null> {
    return ServiceModel.findOne({ _id: id, isDeleted: false });
  }

  updateService(id: string, data: Partial<IService>): Promise<ServiceDocument | null> {
    return ServiceModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true },
    );
  }
}
