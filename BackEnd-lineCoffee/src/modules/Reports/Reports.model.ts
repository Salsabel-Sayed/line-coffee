// models/Report.ts
import { Schema, model, Document } from "mongoose";

export interface IReport extends Document {
  user: Schema.Types.ObjectId;
  reportId: Schema.Types.ObjectId;
  subject: string;
  message: string;
  isRead: boolean;
}

const reportSchema = new Schema<IReport>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    reportId: { type: Schema.Types.ObjectId, ref: "Report" },
  },
  { timestamps: true }
);

const Report = model<IReport>("Report", reportSchema);
export default Report;
