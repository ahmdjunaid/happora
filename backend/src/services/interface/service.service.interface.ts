import {
  IServiceFilters,
  IServiceListResponse,
  IServicePayload,
  IServiceResponse,
} from "../../types/service.types";
import { DecodedUser } from "../../types/user.types";

export interface IServiceService {
  createService(
    provider: DecodedUser,
    payload: IServicePayload,
  ): Promise<IServiceResponse>;
  getAllServices(filters: IServiceFilters): Promise<IServiceListResponse>;
  getAdminServices(provider: DecodedUser): Promise<IServiceListResponse>;
  getServiceById(id: string): Promise<IServiceResponse>;
  updateService(
    serviceId: string,
    provider: DecodedUser,
    payload: IServicePayload,
  ): Promise<IServiceResponse>;
  deleteService(
    serviceId: string,
    provider: DecodedUser,
  ): Promise<{ message: string }>;
}
