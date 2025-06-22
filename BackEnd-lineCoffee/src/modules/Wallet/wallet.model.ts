import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction {
  type: "deposit" | "withdrawal";
  amount: number;
  reason: string;
  date: Date;
}

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
  coins: number;
  transactions: ITransaction[];
}

const walletSchema = new Schema<IWallet>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  balance: { type: Number, required: true, default: 0 },
  coins: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ["deposit", "withdrawal"],
        required: true,
      },
      amount: { type: Number, required: true },
      reason: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
});

export  const Wallet =mongoose.model<IWallet>("Wallet", walletSchema);
