import { Router } from "express";
import { verifyToken } from './../../middlewares/token/token';
import { adminSendNotification, broadcastNotification, deleteNotification, editNotification, getAllNotifications, getUserNotifications, markNotificationAsRead } from "./notification.controller";




const notificationRouter = Router()

notificationRouter.get('/getUserNotifications',verifyToken,getUserNotifications);
notificationRouter.patch('/:notificationId/read',verifyToken,markNotificationAsRead)
notificationRouter.post('/adminSendNotification',verifyToken,adminSendNotification)
notificationRouter.get('/adminGetNotifications', verifyToken, getAllNotifications);
notificationRouter.delete('/:notificationId', verifyToken, deleteNotification);
notificationRouter.patch('/:notificationId/edit', verifyToken, editNotification);
notificationRouter.post("/adminBroadcast", verifyToken, broadcastNotification);





export default notificationRouter