// token.ts
import { catchError } from "../errors/catchError";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/appError";
import { Schema } from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: Schema.Types.ObjectId;
    role: string;
    email: string;
  };
}

export const verifyToken = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token; // ✅ بنجيب التوكن من الكوكي
    if (!token) return next(new AppError("No token provided", 401));
    console.log("🔐 Cookie Token:", token);


    jwt.verify(
      token,
      process.env.PASSWORD_TOKEN || "thisisLineCoffeeProj",
      (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) return next(new AppError("Invalid token", 401));

        req.user = {
          userId: decoded.userId,
          role: decoded.role,
          email: decoded.email,
        };
        console.log("🍪 Incoming cookies in verifyToken:", req.cookies);


        next();
      }
    );
  }
);
