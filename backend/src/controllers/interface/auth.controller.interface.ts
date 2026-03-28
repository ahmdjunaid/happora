import { NextFunction, Request, Response } from "express";

export interface IAuthController {
    register(req:Request, res:Response, next: NextFunction): Promise<void>;
    verifyOtp(req:Request, res:Response, next: NextFunction): Promise<void>;
    resendOtp(req:Request, res:Response, next: NextFunction): Promise<void>;
    login(req:Request, res:Response, next: NextFunction): Promise<void>;
}
