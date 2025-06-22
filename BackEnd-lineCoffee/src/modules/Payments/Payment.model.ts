// models/payment.model.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  method: "wallet" | "vodafone" | "cash";
  amount: number;
  status: "success" | "pending" | "failed";
  createdAt: Date;
  updatedAt: Date;
  transactionId?: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    method: {
      type: String,
      enum: ["wallet", "vodafone", "cash"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "success",
    },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>("Payment", paymentSchema);
