import { Router } from "express";
import { verifyToken } from './../../middlewares/token/token';
import { deleteCoupon, generateFirstOrderCoupon, generateSecondOrderCoupon, getAllCoupons, getCouponById, updateCoupon, validateCoupon } from "./coupons.controller";
import { checkAdmin } from "../../middlewares/verifyAdmin/roleAdmin";
import { createCoupon } from "../Admins/Coupons.controller";




const CouponsRouter = Router()

// special cases
CouponsRouter.post('/FirstOrCo',generateFirstOrderCoupon);
CouponsRouter.post('/SecondOrCo',generateSecondOrderCoupon)
CouponsRouter.post('/validateCoupon/', verifyToken,validateCoupon);

// CRUD
CouponsRouter.post("/addCoupons",verifyToken,checkAdmin, createCoupon);
CouponsRouter.get("/getAllCoupons", getAllCoupons);
CouponsRouter.get("/getCouponById/:id", getCouponById);
CouponsRouter.put("/updateCoupon/:id", verifyToken, updateCoupon);
CouponsRouter.delete("/deleteCoupon/:id", verifyToken, deleteCoupon);

export default CouponsRouter