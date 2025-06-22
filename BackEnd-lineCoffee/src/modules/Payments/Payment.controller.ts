import { NextFunction, Request, Response } from "express";
import { catchError } from "../../middlewares/errors/catchError";
import { Payment } from "./Payment.model";
import { AppError } from "../../middlewares/errors/appError";
import { Order } from "../Orders/order.model";
import { GeneralLog } from "../Logs/Logs.models";
import { AuthenticatedRequest } from "../../types/custom";
import { User } from "../Users/users.models";
import { Coupon, PopulatedCoupon } from "../Coupons/coupons.model";
import { IWallet } from "../Wallet/wallet.model";
import { Schema } from "mongoose";
import { Coins } from "../Coins/coins.model";




//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get User Payments (user) done
export const getUserPayments = catchError(
  async (req: AuthenticatedRequest, res: Response,  next: NextFunction) => {
    const userId = req.user?.userId;
    console.log("userId",userId); 

    if(!userId) return next(new AppError("user not found!", 400))

    const payments = await Payment.find({ userId });
    res.status(200).json({ payments });
  }
);

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? Get All Payments (admin) done
export const getAllPayments = catchError(
  async (_req: Request, res: Response) => {
    const payments = await Payment.find().populate("userId orderId");
    res.status(200).json({ payments });
  }
);
//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? Get Payment By Order ID  done
export const getPaymentByOrderId = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    console.log("orderId", orderId);
    const payment = await Payment.findOne({ orderId });
    console.log("payment",payment);
    
    if (!payment) return next(new AppError("Payment not found", 404));
    res.status(200).json({ payment });
  }
);

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? confirm Payments (admin)
export const confirmManualPayment = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user")
      .populate("coupon");

    if (!order) return next(new AppError("Order not found", 404));
    if (order.status === "completed")
      return next(new AppError("Order already marked as completed", 400));

    const user = await User.findById(order.user).populate<{ wallet: IWallet }>(
      "wallet"
    );
    if (!user) return next(new AppError("User not found", 404));

    // 1. تحديث حالة الأوردر الأول
    order.status = "completed";
    await order.save();

    // 2. تحديث الدفع
    await Payment.findOneAndUpdate(
      { orderId: order._id },
      { status: "success" }
    );

    // 2. تسجيل استخدام الكوبون لو فيه
    const populatedCoupon = order.coupon as
      | (PopulatedCoupon & { _id: Schema.Types.ObjectId })
      | null;
    // 3. تحديث حالة الكوبون لو موجود ولسه متستخدمش
    if (populatedCoupon) {
    await Coupon.findByIdAndUpdate(populatedCoupon._id, { status: "used" });

    await GeneralLog.create({
      user: user._id,
      action: "coupon_used",
      type: "coupon",
      amount: populatedCoupon.discountValue,
      message: `Used coupon ${populatedCoupon.couponCode} with discount ${populatedCoupon.discountValue} on order #${order._id}`,
    });
    }

    // 4. كوينز أو مكافآت بعد الدفع
    const rewardCoins = Math.floor(order.finalAmount / 10);
    if (rewardCoins > 0) {
      let userCoins = await Coins.findOne({ userId: user._id });

      if (!userCoins) {
        userCoins = new Coins({
          userId: user._id,
          coins: rewardCoins,
        });
      } else {
        userCoins.coins += rewardCoins;
      }

      await userCoins.save();

      await GeneralLog.create({
        userId: user._id,
        orderId: order._id,
        coins: rewardCoins,
        type: "reward",
        action: "coins earned",
        description: "Coins earned from manual payment confirmation",
      });
    }
    

    // 5. إرسال إشعار (لو محتاجة تفعلِيه)
    // try {
    //   await sendWhatsAppOrderConfirmed(order);
    // } catch (err) {
    //   console.error("Failed to send WhatsApp message", err);
    // }

    res.status(200).json({
      message: "Manual payment confirmed and order marked as completed",
      couponUsed: order.coupon || null,
      rewardCoins,
    });
  }
);

