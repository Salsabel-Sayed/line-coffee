import { Request, Response, NextFunction } from "express";
import { catchError } from "../../middlewares/errors/catchError";
import { AppError } from "../../middlewares/errors/appError";
import { AuthenticatedRequest } from "../../types/custom";
import { User } from "../Users/users.models";
import mongoose from "mongoose";
import { Coupon } from "../Coupons/coupons.model";


//? create coupons
// إضافة خصم جديد إلى currentDiscounts في User
export const createCoupon = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const uId = req.user?.userId;
    console.log("uid",uId);
    
    const { couponCode, discountPercentage, expiresAt, userId } = req.body;
    console.log("body",req.body);
    

    if (!couponCode || !discountPercentage || !expiresAt) {
      return next(new AppError("Missing required fields!", 400));
    }

    // التأكد من أن الكود مش فارغ أو null
    if (!couponCode.trim()) {
      return next(new AppError("Coupon code cannot be empty!", 400));
    }

    // التحقق من صلاحية الـ userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError("Invalid userId", 400));
    }
    try {
      const newCoupon = await Coupon.create({
        couponCode,
        discountPercentage,
        expiresAt,
        userId,
      });
      console.log("create coupon", newCoupon);

      if (uId) {
        // تحديث الـ User ليشمل الخصم الجديد
        const user = await User.findById(userId);
        console.log("user", user);

        if (user) {
          user.currentDiscounts.push({
            couponCode,
            discountPercentage,
            expiresAt,
          });
          user.coupons.push(newCoupon.id);
          await user.save();
          console.log("User discounts updated:", user.currentDiscounts);
        }
      }

      res
        .status(201)
        .json({ message: "Coupon created successfully", coupon: newCoupon });
      
    } catch (error:any) {
       if (error.code === 11000) {
         // Duplicate Key Error
         return next(new AppError("Coupon code already exists!", 400));
       }
       return next(error);
      
    }

    
  }
);

//* ////////////////////////////////////////////////////////////////////////////////////////////////////