import express from "express";
import { getUserLogs } from "./Logs.controller";
import { verifyToken } from "../../middlewares/token/token";


const logsRouter = express.Router();

logsRouter.get("/getUserLogs/:userId", verifyToken, getUserLogs);

export default logsRouter;