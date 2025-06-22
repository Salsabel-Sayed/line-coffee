import mongoose from "mongoose";
import { GeneralLog } from "../modules/Logs/Logs.models";

interface LogOptions {
  userId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  type: "wallet" | "coupon" | "coins" | "admin";
  action: string;
  amount?: number;
  description?: string;
}

export const createLog = async ({
  userId,
  orderId,
  type,
  action,
  amount,
  description,
}: LogOptions): Promise<void> => {
  try {
    await GeneralLog.create({
      userId,
      orderId,
      type,
      action,
      amount,
      description,
    });
  } catch (err) {
    console.error("Logging error:", err);
  }
};
