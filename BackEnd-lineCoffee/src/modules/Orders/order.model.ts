  import mongoose, { Schema, Document } from "mongoose";
import { PopulatedCoupon } from "../Coupons/coupons.model";

export interface PopulatedOrder {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  status: string;
  totalAmount: number;
  finalAmount: number;
  discount: number;
  walletAmount?: number;
  coupon?: PopulatedCoupon | Schema.Types.ObjectId; // بقت متوافقة مع IOrder
}

interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  items: { product: Schema.Types.ObjectId; quantity: number }[];
  totalAmount: number;
  discount?: number;
  finalAmount: number;
  coinsEarned: number;
  coupon?: any; // ← بقت optional
  walletAmount?: number;
  paymentMethod?: string; // ← كمان خلتها optional زي ما انت كاتب في schema
  status: "pending" | "delivered" | "canceled" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    coinsEarned: { type: Number, default: 0 },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon", default: null },
    walletAmount: { type: Number, default: 0 }, // ← إضافته هنا
    paymentMethod: {
      type: String,
      enum: ["vodafone", "cash", "insta"],
      required: false,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "delivered", "canceled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);

