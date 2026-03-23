import { Types } from "mongoose";

export interface IService {
  title: string;
  description: string;
  category: string;
  location: string;
  pricePerDay: number;
  totalSlots: number;
  providerId: Types.ObjectId;
  isDeleted: boolean;
}

export interface IServicePayload {
  title: string;
  description: string;
  category: string;
  location: string;
  pricePerDay: number;
  totalSlots: number;
}

export interface IServiceFilters {
  keyword?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface IServiceResponse {
  message: string;
  service: IServiceDto;
}

export interface IServiceListResponse {
  message: string;
  services: IServiceDto[];
}

export interface IServiceDto {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  pricePerDay: number;
  totalSlots: number;
  availableSlots: number;
  providerId: string;
}
