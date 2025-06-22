// controllers/wallet.controller.ts
import { Request, Response, NextFunction } from "express";
import { User } from "../Users/users.models";
import { IWallet, Wallet } from "./wallet.model";
import { AuthenticatedRequest } from "../../types/custom";
import { AppError } from "../../middlewares/errors/appError";
import { catchError } from "../../middlewares/errors/catchError";
import { GeneralLog } from "../Logs/Logs.models";

// admin token
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
//   .eyJ1c2VySWQiOiI2N2YyM2MxZjQ4ZTg3ZDdhNmFmOWY3ZDUiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImxvZ2dpbmciOnRydWUsImlhdCI6MTc0NDg5MzYwNX0
//   .q9dN5hqF6gUS9Ua6vhL69rGF44q9lYfh2BVDTJb0UqE;
//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? add To Wallet(admin) done
export const addBalance = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId, amount, reason } = req.body;

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: amount });
    } else {
      wallet.balance += amount;
    }

    wallet.transactions.push({
      type: "deposit",
      amount,
      reason: reason || "Admin deposit",
      date: new Date(),
    });

    await wallet.save();

    await GeneralLog.create({
      userId,
      action: "add to wallet",
      type: "wallet",
      amount,
      reason,
    });

    res.status(200).json({ message: "Balance added", balance: wallet.balance });
  }
);

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get Wallet Transactions (user) done
export const getUserWallet = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const userIdFromParams = req.params.id;

    if (userId !== userIdFromParams) {
      return next(new AppError("Unauthorized access!", 403));
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return next(new AppError("Wallet not found", 404));

    res.status(200).json({
      balance: wallet.balance,
      coins: wallet.coins,
      transactions: wallet.transactions,
    });
  }
);

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get User Logs (admin) 
export const getUserLogs = catchError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const userIdFromParams = req.params.id;

    if (userId !== userIdFromParams) {
      return next(new AppError("Unauthorized access!", 403));
    }

    const logs = await GeneralLog.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ logs });
  }
);

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? update Wallet Balance (admin) done
export const updateWalletBalance = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, amount, reason } = req.body;

    if (!userId || !amount) {
      return next(new AppError("User ID and amount are required!", 400));
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return next(new AppError("Wallet not found!", 404));
    }

    if (wallet.balance < amount) {
      return next(new AppError("Insufficient balance in wallet!", 400));
    }

    wallet.balance -= amount;

    wallet.transactions.push({
      type: "withdrawal",
      amount,
      reason: reason || "Manual deduction by admin",
      date: new Date(),
    });

    await wallet.save();

    await GeneralLog.create({
      userId,
      action: "wallet reduce",
      type: "admin",
      amount,
      reason: reason || "Manual deduction by admin",
    });

    res.status(200).json({
      message: `Amount of ${amount} deducted from wallet.`,
      balance: wallet.balance,
    });
  }
);

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? validate Walle tAmount
export const validateWalletAmount = catchError(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const userId = req.user?.userId;
    const { walletAmount, totalAmount } = req.body;

    if (!walletAmount || !totalAmount) {
      return next(
        new AppError("Wallet amount and total amount are required!", 400)
      );
    }

    const user = await User.findById(userId).populate<{ wallet: IWallet }>(
      "wallet"
    );

    if (!user || !user.wallet) {
      return next(new AppError("User or wallet not found", 404));
    }

    const walletBalance = user.wallet.balance;

    if (walletAmount > walletBalance) {
      return res.status(200).json({
        valid: false,
        message: "Insufficient wallet balance",
        currentBalance: walletBalance,
      });
    }

    // حساب السعر بعد خصم المحفظة
    const newTotal = Math.max(totalAmount - walletAmount, 0);

    res.status(200).json({
      valid: true,
      deducted: walletAmount,
      newTotal,
      currentBalance: walletBalance,
      message: `Wallet deduction of ${walletAmount} EGP is valid.`,
    });
  }
);





