import { catchError } from "../errors/catchError"
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/appError";
import { Schema } from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: { userId: Schema.Types.ObjectId ,
    role: string;
    email:string
  };
  
}
export const verifyToken = catchError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next(new AppError("No token provided", 401));

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
  
    console.log("Authorization Header:", req.headers["authorization"]);
    if (!token) {
        return next(new AppError("No token provided", 401));
    }

    jwt.verify(token, "thisisLineCoffeeProj", (err, decoded: any) => {
        if (err) {
            return next(new AppError("Invalid token", 401));
        }
        console.log("Received Token:", token);
        console.log("TOKEN from header:", req.headers.authorization);
       


        
        req.user = { userId: decoded.userId,  role: decoded.role, email: decoded.email };
        console.log("Decoded user:", req.user);
        console.log("Token verified, proceeding to next middleware...");
        next();
    });
});


