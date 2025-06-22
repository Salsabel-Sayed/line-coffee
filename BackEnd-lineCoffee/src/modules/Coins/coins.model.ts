import mongoose, { Schema, Types } from "mongoose";

interface ICoins extends Document {
  userId: Types.ObjectId;
  coins: number;
}

interface CoinsDocument extends ICoins, Document {}

const CoinsSchema = new Schema<CoinsDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    coins: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Coins = mongoose.model<CoinsDocument>("Coins", CoinsSchema);
export type { ICoins, CoinsDocument };
