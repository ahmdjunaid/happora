import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import HttpStatus from "../constants/http.statuscodes";
import { TYPES } from "../DI/types";
import { IServiceService } from "../services/interface/service.service.interface";
import { IServiceController } from "./interface/service.controller.interface";
import { AuthenticatedRequest } from "../types/express.types";
import {
  validateServiceFilters,
  validateServicePayload,
} from "../utils/service.validation";

@injectable()
export class ServiceController implements IServiceController {
  constructor(
    @inject(TYPES.ServiceService) private _serviceService: IServiceService,
  ) {}

  private getRouteId(param: string | string[] | undefined): string {
    return Array.isArray(param) ? param[0] : param ?? "";
  }

  createService = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const payload = validateServicePayload(req.body as Record<string, unknown>);
      const response = await this._serviceService.createService(req.user!, payload);

      res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAllServices = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const filters = validateServiceFilters(req.query as Record<string, unknown>);
      const response = await this._serviceService.getAllServices(filters);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getServiceById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
    ) => {
    try {
      const response = await this._serviceService.getServiceById(
        this.getRouteId(req.params.id),
      );

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateService = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const payload = validateServicePayload(req.body as Record<string, unknown>);
      const response = await this._serviceService.updateService(
        this.getRouteId(req.params.id),
        req.user!,
        payload,
      );

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteService = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
    ) => {
    try {
      const response = await this._serviceService.deleteService(
        this.getRouteId(req.params.id),
        req.user!,
      );

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
