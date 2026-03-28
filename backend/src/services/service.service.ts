import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../DI/types";
import { IServiceRepository } from "../repositories/interface/service.repository.interface";
import { IServiceService } from "./interface/service.service.interface";
import {
  IServiceDto,
  IServiceFilters,
  IServiceListResponse,
  IServicePayload,
  IServiceResponse,
} from "../types/service.types";
import { AppError } from "../middlewares/error.middleware";
import HttpStatus from "../constants/http.statuscodes";
import { MESSAGES } from "../constants/messages";
import { UserRole } from "../types/user.types";
import { DecodedUser } from "../types/user.types";

@injectable()
export class ServiceService implements IServiceService {
  constructor(
    @inject(TYPES.ServiceRepository)
    private _serviceRepository: IServiceRepository,
  ) {}

  private sanitizeService(service: {
    _id?: { toString(): string };
    title: string;
    description: string;
    category: string;
    location: string;
    pricePerDay: number;
    totalSlots: number;
    providerId: Types.ObjectId;
  }): IServiceDto {
    return {
      id: service._id?.toString() ?? "",
      title: service.title,
      description: service.description,
      category: service.category,
      location: service.location,
      pricePerDay: service.pricePerDay,
      totalSlots: service.totalSlots,
      availableSlots: service.totalSlots,
      providerId: service.providerId.toString(),
    };
  }

  private ensureAdminAccess(provider?: DecodedUser): DecodedUser {
    if (!provider?.sub) {
      throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const normalizedRole = provider.role.toUpperCase();

    if (normalizedRole !== UserRole.ADMIN) {
      throw new AppError(HttpStatus.FORBIDDEN, MESSAGES.SERVICE.ADMIN_ONLY);
    }

    return provider;
  }

  private ensureServiceOwnership(
    providerId: Types.ObjectId,
    currentAdminId: string,
  ): void {
    if (providerId.toString() !== currentAdminId) {
      throw new AppError(HttpStatus.FORBIDDEN, MESSAGES.SERVICE.UNAUTHORIZED_ACCESS);
    }
  }

  async createService(
    provider: DecodedUser,
    payload: IServicePayload,
  ): Promise<IServiceResponse> {
    const currentProvider = this.ensureAdminAccess(provider);

    const service = await this._serviceRepository.createService({
      ...payload,
      providerId: new Types.ObjectId(currentProvider.sub),
    });

    return {
      message: MESSAGES.SERVICE.CREATED_SUCCESS,
      service: this.sanitizeService(service),
    };
  }

  async getAllServices(filters: IServiceFilters): Promise<IServiceListResponse> {
    const services = await this._serviceRepository.findServices(filters);

    return {
      message: MESSAGES.SERVICE.FETCHED_SUCCESS,
      services: services.map((service) => this.sanitizeService(service)),
    };
  }

  async getAdminServices(provider: DecodedUser): Promise<IServiceListResponse> {
    const currentProvider = this.ensureAdminAccess(provider);
    const services = await this._serviceRepository.findServicesByProvider(
      currentProvider.sub,
    );

    return {
      message: MESSAGES.SERVICE.FETCHED_SUCCESS,
      services: services.map((service) => this.sanitizeService(service)),
    };
  }

  async getServiceById(id: string): Promise<IServiceResponse> {
    const service = await this._serviceRepository.findServiceById(id);

    if (!service) {
      throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.SERVICE.SERVICE_NOT_FOUND);
    }

    return {
      message: MESSAGES.SERVICE.DETAILS_FETCHED_SUCCESS,
      service: this.sanitizeService(service),
    };
  }

  async updateService(
    serviceId: string,
    provider: DecodedUser,
    payload: IServicePayload,
  ): Promise<IServiceResponse> {
    const currentProvider = this.ensureAdminAccess(provider);
    const existingService = await this._serviceRepository.findServiceById(serviceId);

    if (!existingService) {
      throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.SERVICE.SERVICE_NOT_FOUND);
    }

    this.ensureServiceOwnership(existingService.providerId, currentProvider.sub);

    const updatedService = await this._serviceRepository.updateService(serviceId, payload);

    if (!updatedService) {
      throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.SERVICE.SERVICE_NOT_FOUND);
    }

    return {
      message: MESSAGES.SERVICE.UPDATED_SUCCESS,
      service: this.sanitizeService(updatedService),
    };
  }

  async deleteService(
    serviceId: string,
    provider: DecodedUser,
  ): Promise<{ message: string }> {
    const currentProvider = this.ensureAdminAccess(provider);
    const existingService = await this._serviceRepository.findServiceById(serviceId);

    if (!existingService) {
      throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.SERVICE.SERVICE_NOT_FOUND);
    }

    this.ensureServiceOwnership(existingService.providerId, currentProvider.sub);

    await this._serviceRepository.updateService(serviceId, { isDeleted: true });

    return {
      message: MESSAGES.SERVICE.DELETED_SUCCESS,
    };
  }
}
