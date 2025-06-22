import mongoose, { Schema, Document } from "mongoose";

export interface IGeneralLog extends Document {
  userId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  type: "wallet" | "coupon" | "coins" | "admin"; // مصدر العملية
  action: string; // "deduct", "reward", "used", "refund", "manual_payment", إلخ
  amount?: number;
  description?: string;
  createdAt: Date;
}

const generalLogSchema = new Schema<IGeneralLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    type: {
      type: String,
      enum: ["wallet", "coupon", "coins", "admin"],
      required: true,
    },
    action: { type: String, required: true },
    amount: Number,
    description: String,
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export const GeneralLog = mongoose.model<IGeneralLog>(
  "GeneralLog",
  generalLogSchema
);
