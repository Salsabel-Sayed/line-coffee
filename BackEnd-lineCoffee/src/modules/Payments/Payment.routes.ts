
import express from "express";
import {
  getUserPayments,
  getAllPayments,
  getPaymentByOrderId,
  confirmManualPayment,
// confirmManualPayment,
} from "./Payment.controller";
import { verifyToken } from "../../middlewares/token/token";
import { checkAdmin } from "../../middlewares/verifyAdmin/roleAdmin";

const paymentsRouter = express.Router();


paymentsRouter.get("/getUserPayments/:id", verifyToken, getUserPayments);
paymentsRouter.get("/order/:orderId", verifyToken,getPaymentByOrderId);
paymentsRouter.get("/getAllPayments/",verifyToken,getAllPayments); // for admin
paymentsRouter.put("/confirmManualPayment/:orderId", confirmManualPayment); // for admin


export default paymentsRouter;
