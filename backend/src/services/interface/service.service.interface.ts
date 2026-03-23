import {
  IServiceFilters,
  IServiceListResponse,
  IServicePayload,
  IServiceResponse,
} from "../../types/service.types";
import { AuthenticatedUser } from "../../types/express.types";

export interface IServiceService {
  createService(
    provider: AuthenticatedUser,
    payload: IServicePayload,
  ): Promise<IServiceResponse>;
  getAllServices(filters: IServiceFilters): Promise<IServiceListResponse>;
  getServiceById(id: string): Promise<IServiceResponse>;
  updateService(
    serviceId: string,
    provider: AuthenticatedUser,
    payload: IServicePayload,
  ): Promise<IServiceResponse>;
  deleteService(
    serviceId: string,
    provider: AuthenticatedUser,
  ): Promise<{ message: string }>;
}
