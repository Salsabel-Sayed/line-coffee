import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./database";
import { globalError } from "./middlewares/errors/globalError";
import { AppError } from "./middlewares/errors/appError";
import userRouter from "./modules/Users/users.routes";
import categoriesRouter from "./modules/Categories/categories.routes";
import fileUpload from "express-fileupload";
import ProductsRouter from "./modules/Products/products.routes";
import notificationRouter from "./modules/Notifications/notification.routes";
import orderRouter from "./modules/Orders/order.routes";
import ReviewRouter from "./modules/Reviews/review.routes";
import coinsRouter from "./modules/Coins/coins.routes";
import CouponsRouter from "./modules/Coupons/coupons.routes";
import logsRouter from "./modules/Logs/Logs.routes";
import walletRouter from "./modules/Wallet/Wallet.routes";
import paymentsRouter from "./modules/Payments/Payment.routes";
import i18n from "./config/i18n";
import cors from "cors";
import wishListRouter from "./modules/WishList/WishList.routes";
import reportsRouter from "./modules/Reports/Reports.routes";







dotenv.config();
// Connect to Database
connectDB();
const app: Application = express();



const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://line-coffee-ik9k.vercel.app',
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ دلوقتي corsOptions معروف هنا



app.use(i18n.init);

// ميدلوير يقرأ اللغة من الهيدر
app.use((req, res, next) => {
  const lang = req.headers["accept-language"];
  if (lang && ["en", "ar"].includes(lang)) {
    req.setLocale(lang);
  } else {
    req.setLocale("en");
  }
  next();
});
// multer 
app.use("/uploads", express.static("uploads")); // Serve images


// cloudinary

 // ضروري لرفع الصور
 // مهم لفهم بيانات الفورم

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware routers
app.use('/users', userRouter)
app.use('/categories', categoriesRouter)
app.use('/products', ProductsRouter)
app.use('/notifications', notificationRouter)
app.use('/orders', orderRouter)
app.use('/reviews', ReviewRouter)
app.use('/coins', coinsRouter)
app.use('/logs', logsRouter);
app.use('/coupons', CouponsRouter)
app.use('/wallets', walletRouter);
app.use('/payments', paymentsRouter);
app.use('/wishList', wishListRouter);
app.use('/reports', reportsRouter);



// Simple Route
app.get("/", (req, res) => {
  res.send("LineCoffee API is running...");
});

// Handle unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalError);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


