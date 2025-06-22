import mongoose, { Schema, Document } from "mongoose";



export interface PopulatedCoupon {
  _id: Schema.Types.ObjectId;
  couponCode: string;
  discountValue: number;
  status?: "valid" | "used" | string;
}


export interface UserCoupon {
  _id: Schema.Types.ObjectId;
  name: string;
  status: 'valid' | 'used';
}



interface ICoupon extends Document {
  couponCode: string;
  discountPercentage: number;
  expiresAt: Date;
  userId?: Schema.Types.ObjectId; // لو الكوبون مخصص لمستخدم معين
  isUsed: boolean;
  isActive:boolean;
  isGlobal:boolean;
  isUsedBy:Schema.Types.ObjectId;

}

const CouponSchema = new Schema<ICoupon>({
  couponCode: { type: String, required: true, unique: true }, // كود الخصم
  discountPercentage: { type: Number, required: true }, // نسبة الخصم
  expiresAt: { type: Date, required: true }, // تاريخ الانتهاء
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null, // لو null يبقى الكوبون عام لكل المستخدمين
  },// لمستخدم معين
  isUsed: { type: Boolean, default: false }, // تم استخدامه أم لا
  isActive: { type: Boolean, default: true },
  isGlobal: {
    type: Boolean,
    default: false, // true = كوبون عام لكل المستخدمين
  },
  isUsedBy: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      usedAt: Date,
    }]
})

export const Coupon = mongoose.model<ICoupon>("Coupon", CouponSchema);
