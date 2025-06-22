import { Router } from "express";
import { verifyToken } from './../../middlewares/token/token';
import { createReport, getAllReports, markReportAsRead } from "./Reports.controller";




const reportsRouter = Router()

reportsRouter.post('/createReport', verifyToken, createReport);
reportsRouter.get('/getAllReports', verifyToken, getAllReports);
reportsRouter.put('/markReportAsRead/:id', verifyToken, markReportAsRead);






export default reportsRouter;