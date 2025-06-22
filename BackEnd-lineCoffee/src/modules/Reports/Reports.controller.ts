import { NextFunction, Request, Response } from "express";
import { AppError } from "../../middlewares/errors/appError";
import { catchError } from "../../middlewares/errors/catchError";
import { AuthenticatedRequest } from "../../types/custom";
import Report from "./Reports.model";
import { Notification } from "../Notifications/notification.model";


// ? create Report
export const createReport = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { subject, message } = req.body;
    const userId = req.user?.userId;

    if (!subject || !message)
      return next(new AppError("Subject and message are required", 400));

    const report = await Report.create({ user: userId, subject, message });

    await Notification.create({
      user: userId,
      title: "تم استلام تقريرك",
      message: `تقريرك برقم ${report._id} قيد المراجعة`,
      type: "report",
    });

    res.status(201).json({ message: "Report sent successfully", report });
  }
);
  
//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get All Reports(admin)
  export const getAllReports = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const reports = await Report.find()
        .populate("user", "email")
        .sort({ createdAt: -1 });

      res.status(200).json({ reports });
    }
  );
//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? mark Report As Read(admin)
export const markReportAsRead = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // ✅ 1. Update the report
    const updated = await Report.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updated) throw new AppError("Report not found", 404);

    // ✅ 2. Update related notifications (optional)
    const notif = await Notification.findOneAndUpdate(
      {
        user: updated.user, // لأن الـ report فيه الـ user
        type: "report",
        message: { $regex: id },
        
         // لو انتي بتحطي id التقرير في الرسالة
      },
      
      { isRead: true },
      { new: true }
    );

    res.status(200).json({
      message: "Marked as read",
      report: updated,
      notification: notif || null,
      
    });
  }
);
  
  
  