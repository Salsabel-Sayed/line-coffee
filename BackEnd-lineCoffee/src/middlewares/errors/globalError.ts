import { NextFunction, Request, Response } from "express";
import { AppError } from "./appError";

export const globalError = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const code = err.statusCode || 500;
    res.status(code).json({
        error: "middleware error",
        message: err.message,
        code: code,
        stack: err.stack
    });
};
