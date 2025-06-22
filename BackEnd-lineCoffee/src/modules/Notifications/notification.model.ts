import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  user: Schema.Types.ObjectId;
  title: string;
  message: string;
  type: "order" | "coins" | "promo" | "general" | "report";
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["order", "coins", "promo", "general", "report"],
      required: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
