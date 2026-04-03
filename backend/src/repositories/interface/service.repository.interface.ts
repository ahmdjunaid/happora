import { ServiceDocument } from "../../model/service.model";
import {
  IService,
  IServiceFilters,
  IServicePagination,
} from "../../types/service.types";

export interface IServiceSearchResult {
  services: ServiceDocument[];
  pagination: IServicePagination;
}

export interface IServiceRepository {
  createService(data: Partial<IService>): Promise<ServiceDocument>;
  findServices(filters: IServiceFilters): Promise<IServiceSearchResult>;
  findServicesByProvider(providerId: string): Promise<ServiceDocument[]>;
  findServiceById(id: string): Promise<ServiceDocument | null>;
  updateService(id: string, data: Partial<IService>): Promise<ServiceDocument | null>;
}
