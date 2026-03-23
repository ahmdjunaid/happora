import { NextFunction, Request, Response } from "express";

export interface IServiceController {
  createService(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllServices(req: Request, res: Response, next: NextFunction): Promise<void>;
  getServiceById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateService(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteService(req: Request, res: Response, next: NextFunction): Promise<void>;
}
