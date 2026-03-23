import { ServiceDocument } from "../../model/service.model";
import { IService, IServiceFilters } from "../../types/service.types";

export interface IServiceRepository {
  createService(data: Partial<IService>): Promise<ServiceDocument>;
  findServices(filters: IServiceFilters): Promise<ServiceDocument[]>;
  findServiceById(id: string): Promise<ServiceDocument | null>;
  updateService(id: string, data: Partial<IService>): Promise<ServiceDocument | null>;
}
