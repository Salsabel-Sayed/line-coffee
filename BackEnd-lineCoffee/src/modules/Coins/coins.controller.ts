import { NextFunction, Request, Response } from "express";
import { catchError } from "../../middlewares/errors/catchError";
import { AppError } from "../../middlewares/errors/appError";
import { User } from "../Users/users.models";
import { AuthenticatedRequest } from "../../types/custom";
import { sendNotification } from "../Notifications/notification.controller";
import { Coins } from "./coins.model";
import { GeneralLog } from "../Logs/Logs.models";
import { Wallet } from "../Wallet/wallet.model";
import { createLog } from "../../utils/Logs";
import mongoose from "mongoose";



//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? add coins by admin 
  export const addCoinsToUser = catchError(async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { userId, coins } = req.body;
    console.log("body before", req.body);
    

    if (!userId || !coins) {
      return next(new AppError("User ID and coins amount are required!", 400));
    }

    let userCoins = await Coins.findOne({ userId });

    if (!userCoins) {
      // If no coins document exists for the user, create one
      userCoins = new Coins({
        userId,
        coins: coins,
      });
    } else {
      // If coins document exists, update the coins
      userCoins.coins += coins;
    }

    await userCoins.save();

    // Log the action in CoinsLog
  await createLog({
    userId,
    type: "coins",
    action: "add",
    amount: coins,
    description: "Coins added manually by admin",
  });



    // Send notification
    await sendNotification(
      String(userId),
      "Coins Earned!",
      `You've earned ${coins} coins from admin.`,
      "coins"
    );
    console.log("body after", req.body);

    res
      .status(200)
      .json({ message: "Coins added successfully!", userCoins: userCoins.coins });
  })

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? redeem(use) Coins 
export const redeemCoins = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const userIdFromParams = req.params.id;

    if (userId !== userIdFromParams) {
      return next(new AppError("Unauthorized access!", 403));
    }
    const { coinsToRedeem, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    const userCoins = await Coins.findOne({ userId });
    if (!userCoins) return next(new AppError("No coins record found", 404));

    if (userCoins.coins < coinsToRedeem)
      return next(new AppError("Not enough coins", 400));

    userCoins.coins -= coinsToRedeem;
    await userCoins.save();

    // نضيف الفلوس للمحفظة
    const wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) return next(new AppError("Wallet not found", 404));
    const amount = coinsToRedeem;

    wallet.balance += amount;

    wallet.transactions.push({
      type: "deposit",
      amount,
      reason: reason || `Redeemed ${coinsToRedeem} coins`,
      date: new Date(),
    });

    await wallet.save();
    // تسجّل العملية في الـ Logs
    await GeneralLog.create({
      userId: user._id,
      type: "coins",
      action: "coins to money",
      amount: coinsToRedeem,
      date: new Date(),
    });

    // إشعار للمستخدم
    await sendNotification(
      String(user._id),
      "Coins Redeemed!",
      `You've successfully redeemed ${coinsToRedeem} coins and received ${amount} EGP in your wallet.`,
      "coins"
    );

    res.status(200).json({
      message: "Coins redeemed successfully!",
      coinsLeft: user.coins,
      walletBalance: wallet.balance,
    });
  }
);

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get User Coins 
export const getUserCoins = catchError(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user?.userId;
    const userIdFromParams = req.params.id;
    console.log("userId", userId);
    console.log("userIdFromParams", userIdFromParams);
    if (userId !== userIdFromParams) {
      return next(new AppError("Unauthorized access!", 403));
    }
    

    const userCoins = await Coins.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    console.log("userCoins", userCoins);

    if (!userCoins) {
      return next(new AppError("User coins not found!", 404));
    }
    const coinLogs = await GeneralLog.find({
      userId,
      type: "coins",
    }).sort({ createdAt: -1 });

    
    res.status(200).json({
      coins: userCoins.coins,
      logs: coinLogs,
    });
  }
);


//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? action Coins for coins
export const calculateCoins = (action: string, amount?: number): number => {
    switch (action) {
        case "purchase":
            if (!amount) return 0;
            return Math.floor(amount / 1000) * 20; // ✅ كل 1000 جنيه = 20 كوين
        case "comment":
        case "like":
        case "share":
            return 5; // ✅ كل تعليق أو لايك أو شير يضيف 5 كوينز
        default:
            return 0;
    }
};

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? add Coins For Action(like, share, comment)
export const addCoinsForAction = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { action } = req.body;

    if (!action || !["comment", "like", "share"].includes(action)) {
      return next(new AppError("Invalid action type!", 400));
    }

    const userId = req.user?.userId;
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found!", 404));

    // ✅ حساب الكوينز بناءً على نوع الفعل
    const earnedCoins = calculateCoins(action);

    // ✅ البحث عن رصيد الكوينز الخاص بالمستخدم أو إنشاؤه لو مش موجود
    let userCoins = await Coins.findOne({ userId });
    if (!userCoins) {
      userCoins = new Coins({ userId, coins: 0 });
    }

    userCoins.coins += earnedCoins;
    await userCoins.save();

    // ✅ إرسال إشعار للمستخدم
    await sendNotification(
      String(user._id),
      "Coins Earned!",
      `You've earned ${earnedCoins} coins for your ${action}. Keep it up!`,
      "coins"
    );

    res.status(200).json({
      message: `You earned ${earnedCoins} coins for ${action}!`,
      totalCoins: userCoins.coins,
    });
  }
);