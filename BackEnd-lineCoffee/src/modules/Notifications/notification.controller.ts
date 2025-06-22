import { NextFunction, Response } from "express";
import { catchError } from "../../middlewares/errors/catchError";
import { AuthenticatedRequest } from "../../types/custom";
import { Notification } from "./notification.model";
import { Types } from "mongoose";
import { AppError } from "../../middlewares/errors/appError";
import { User } from "../Users/users.models";




//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? send Notification
export const sendNotification = async (userId: string | Types.ObjectId, title: string, message: string, type: "order" | "coins" | "promo" | "general") => {
    await Notification.create({ user: userId, title, message, type });
};

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get User Notifications
export const getUserNotifications = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;

    const notifications = await Notification.find({
      $or: [
        { user: userId }, // الرسائل الخاصة بالمستخدم
        { type: "general" }, // رسائل البث العام
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  }
);


//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? mark Notification As Read
export const markNotificationAsRead = catchError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) return next(new AppError("Notification not found!", 404));

    if (notification.user.toString() !== req.user?.userId)
        return next(new AppError("You can only mark your own notifications as read!", 403));

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read!" });
});
//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? send Notification to users(admin)
export const adminSendNotification = catchError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId, title, body } = req.body;

    if (!userId || !title || !body) {
      return next(new AppError("Missing notification data", 400));
    }

    await Notification.create({
      user: userId,
      title,
      message: body,
      type: "general",
    });

    res.status(200).json({ message: "Notification sent!" });
})
//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//?  Get all notifications (admin)

export const getAllNotifications = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const notifications = await Notification.find()
      .populate('user', 'email') 
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  }
);
//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//?  delete notification(admin)
export const deleteNotification = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted" });
  }
);

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//?  edit Notification(admin)
export const editNotification = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { title, message } = req.body;
    const { notificationId } = req.params;

    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      { title, message },
      { new: true }
    );
    if (!updated) return next(new AppError("Notification not found", 404));

    res
      .status(200)
      .json({ message: "Notification updated", notification: updated });
  }
);

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//?  broadcast Notification(admin)
export const broadcastNotification = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { title, message } = req.body;
    if (!title || !message)
      return next(new AppError("Title and message are required", 400));

    const users = await User.find({}, "_id");
    const notifications = users.map((u) => ({
      user: u._id,
      title,
      message,
      type: "general",
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({ message: "Broadcast sent to all users!" });
  }
);

