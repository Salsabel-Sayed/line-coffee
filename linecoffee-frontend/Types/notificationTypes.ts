export type Notification = {
  _id: string;
  title: string;
  message: string;
  type: "order" | "coins" | "promo" | "general" | "report";
  createdAt: string;
  isRead: boolean;
};
