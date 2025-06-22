
    import mongoose, { Schema, model, Document, Types } from "mongoose";
import { UserCoupon } from "../Coupons/coupons.model";
import { IWallet } from "../Wallet/wallet.model";
import { CoinsDocument } from "../Coins/coins.model";

    // تعريف واجهة TypeScript لمستخدم
    interface IUser extends Document {
      userName: string;
      email: string;
      password: string;
      userPhone: string;
      address:string;
      coins?: Types.ObjectId | CoinsDocument; // 🪙 عدد الكوينز اللي عند المستخدم
      coupons: {
        couponId: Types.ObjectId;
        used: boolean;
        usedAt?: Date;
      }[];

      wallet: Types.ObjectId | IWallet;
      firstLoginCouponUsed: Schema.Types.ObjectId;
      role: "admin" | "user";
      logging: boolean;
      createdAt?: Date;
      currentDiscounts: any;
    }

    // إنشاء مخطط Mongoose مع تحديد الأنواع
    const userSchema = new Schema<IUser>(
      {
        userName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        userPhone: {
          type: String,
          required: true,
          match: /^01[0125][0-9]{8}$/,
        },
        address: String,
        coins: { type: Schema.Types.ObjectId, ref: 'Coins' },
        coupons: [
          {
            couponId: {
              type: Schema.Types.ObjectId,
              ref: "Coupon",
            },
            used: { type: Boolean, default: false },
            usedAt: { type: Date },
          },
        ],
        firstLoginCouponUsed: { type: Boolean, default: false },
        currentDiscounts: Array<{
          code: string;
          discountPercentage: number;
          expiresAt: Date;
        }>, // تخزين خصومات المستخدم
        role: {
          type: String,
          enum: ["admin", "user"],
          default: "user",
        },
        wallet: {
          type: Schema.Types.ObjectId,
          ref: "Wallet",
        },
        logging: {
          type: Boolean,
          default: false,
        },
      },

      {
        timestamps: { createdAt: true, updatedAt: false },
      }
    );

    // إنشاء الموديل بناءً على المخطط
    export const User = model<IUser>("User", userSchema);
    export type { IUser };
