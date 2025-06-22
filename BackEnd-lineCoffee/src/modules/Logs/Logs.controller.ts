import { Request, Response, NextFunction } from "express";
import { AppError } from "../../middlewares/errors/appError";
import { catchError } from "../../middlewares/errors/catchError";
import { GeneralLog } from "./Logs.models";
import { AuthenticatedRequest } from "../../types/custom";


//? Get coins log for a user done
// ? GET /api/logs/:userId
export const getUserLogs = catchError(async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;
  console.log("userID",userId);
  

  if (!userId) {
    return next(new AppError("User ID is required", 400));
  }

  const logs = await GeneralLog.find({ userId })
    .sort({ createdAt: -1 }) // الأحدث أولاً
    .lean();
    console.log("logs", logs);

  res.status(200).json({
    message: "User logs fetched successfully",
    logs,
  });
});

