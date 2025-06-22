import { Request, Response, NextFunction } from "express";
import { catchError } from "../../middlewares/errors/catchError";
import { AppError } from "../../middlewares/errors/appError";
import { AuthenticatedRequest } from "../../types/custom";
import { Coupon } from "./coupons.model";
import { Order } from "../Orders/order.model";
import { User } from "../Users/users.models";
import mongoose, { Types } from "mongoose";

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//* ============================================================================
//? ADMIN || Create coupon (عام أو خاص بمستخدم)
//* لو محدد userId → خاص. لو مش محدد → عام ويوصل إشعار لكل اليوزرز.
export const createCoupon = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { couponCode, discountPercentage, expiresAt, userId } = req.body;

    if (!couponCode || !discountPercentage || !expiresAt) {
      return next(new AppError("Missing required fields!", 400));
    }

    if (!couponCode.trim()) {
      return next(new AppError("Coupon code cannot be empty!", 400));
    }

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError("Invalid userId", 400));
    }

    try {
      const newCoupon = await Coupon.create({
        couponCode,
        discountPercentage,
        expiresAt,
        userId: userId || null,
      });

      if (userId) {
        // كوبون خاص: اربطه باليوزر
        const user = await User.findById(userId);
        if (user) {
          user.currentDiscounts.push({
            couponCode,
            discountPercentage,
            expiresAt,
          });
          user.coupons.push({
            couponId: newCoupon._id as Types.ObjectId,
            used: false,
          });
          
          await user.save();
        }
      } else {
        // كوبون عام: ابعت إشعار لكل المستخدمين
        const allUsers = await User.find();
        for (const user of allUsers) {
          user.currentDiscounts.push({
            couponCode,
            discountPercentage,
            expiresAt,
          });
          user.coupons.push({
            couponId: newCoupon._id as Types.ObjectId,
            used: false,
          });
          await user.save();
        }
      }

      res
        .status(201)
        .json({ message: "Coupon created successfully", coupon: newCoupon });

    } catch (error: any) {
      if (error.code === 11000) {
        return next(new AppError("Coupon code already exists!", 400));
      }
      return next(error);
    }
  }
);

//* ============================================================================
//? ADMIN || Get all coupons
export const getAllCoupons = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({ coupons });
});

//* ============================================================================
//? ADMIN || Get coupon by ID
export const getCouponById = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const coupon = await Coupon.findById(id);
  if (!coupon) return next(new AppError("Coupon not found!", 404));

  res.status(200).json({ coupon });
});

//* ============================================================================
//? ADMIN || Update coupon
export const updateCoupon = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedCoupon = await Coupon.findByIdAndUpdate(id, updates, { new: true });
  if (!updatedCoupon) return next(new AppError("Coupon not found!", 404));

  res.status(200).json({ message: "Coupon updated successfully", coupon: updatedCoupon });
});

//* ============================================================================
//? ADMIN || Delete coupon
export const deleteCoupon = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const deleted = await Coupon.findByIdAndDelete(id);
  if (!deleted) return next(new AppError("Coupon not found!", 404));

  res.status(200).json({ message: "Coupon deleted successfully" });
});

//* ============================================================================
//? USER || First Order Coupon - 10% (خاص بيوزر فقط)
export const generateFirstOrderCoupon = catchError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  if (!userId) return next(new AppError("Unauthorized: No user ID found", 401));

  const previousOrders = await Order.find({ userId });
  if (previousOrders.length > 0) return next(new AppError("User already placed an order", 400));

  const newCoupon = await Coupon.create({
    couponCode: `FIRST10-${userId}`,
    discountPercentage: 10,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId,
  });

  const user = await User.findById(userId);
  if (user) {
    user.currentDiscounts.push({
      couponCode: newCoupon.couponCode,
      discountPercentage: newCoupon.discountPercentage,
      expiresAt: newCoupon.expiresAt,
    });
    user.coupons.push({
            couponId: newCoupon._id as Types.ObjectId,
            used: false,
          });
    await user.save();
  }

  res.status(201).json({ message: "First order coupon created!", coupon: newCoupon });
});

//* ============================================================================
//?  || Second Order Coupon - 15% (خاص بيوزر فقط)
export const generateSecondOrderCoupon = catchError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  if (!userId) return next(new AppError("Unauthorized: No user ID found", 401));

  const existingCoupon = await Coupon.findOne({ userId, discountPercentage: 15 });
  if (existingCoupon) return next(new AppError("Second order coupon already exists!", 400));

  const newCoupon = await Coupon.create({
    couponCode: `SECOND15-${userId}`,
    discountPercentage: 15,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userId,
  });

  const user = await User.findById(userId);
  if (user) {
    user.currentDiscounts.push({
      couponCode: newCoupon.couponCode,
      discountPercentage: newCoupon.discountPercentage,
      expiresAt: newCoupon.expiresAt,
    });
    user.coupons.push({
            couponId: newCoupon._id as Types.ObjectId,
            used: false,
          });
    await user.save();
  }

  res.status(201).json({ message: "Second order coupon created!", coupon: newCoupon });
});

//* ============================================================================
//? USER || Validate coupon before use (يتأكد من الصلاحية وملكية الكوبون)
// export const validateCoupon = catchError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   const { couponCode } = req.body;
//   const userId = req.user?.userId;

//   const coupon = await Coupon.findOne({ couponCode });

//   if (!coupon) return next(new AppError("Invalid coupon!", 400));
//   if (!coupon.isActive) return next(new AppError("Coupon is not active!", 400));
//   if (coupon.isUsed) return next(new AppError("Coupon has already been used!", 400));
//   if (new Date() > coupon.expiresAt) return next(new AppError("Coupon has expired!", 400));

//   // لو الكوبون خاص بيوزر معين، اتأكد إنه هو اللي بيستخدمه
//   if (coupon.userId && coupon.userId.toString() !== userId) {
//     return next(new AppError("This coupon is not for you!", 403));
//   }

//   res.status(200).json({ message: "Coupon is valid!", discount: coupon.discountPercentage });
// });

//* ============================================================================
//? USER || Validate coupon before use 
export const validateCoupon = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>=> {
    const { couponCode, totalAmount } = req.body;

    if (!couponCode || !totalAmount) {
      return next(
        new AppError("Coupon code and total amount are required!", 400)
      );
    }

    const coupon = await Coupon.findOne({
      couponCode,
      isActive: true,
      isUsed: false,
    });

    if (!coupon) {
      return void res.status(200).json({
        valid: false,
        message: "Invalid or expired coupon.",
      });
    }
    

    // نحسب الخصم
    const discountPercentage = coupon.discountPercentage;
    const discountValue = (totalAmount * discountPercentage) / 100;

    return void  res.status(200).json({
      valid: true,
      discountPercentage,
      discountValue,
      message: `Coupon is valid with ${discountPercentage}% discount.`,
    });
  }
);

// const accountSid = 'ACabc88dbe489ef732addce681a3becc8b';
// const authToken = '3cfb18c31e3e482fcf185851969aa936';