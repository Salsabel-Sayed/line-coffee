import { NextFunction, Request, Response } from "express";
import { catchError } from "../../middlewares/errors/catchError";
import { Products } from "./products.model";
import { AppError } from "../../middlewares/errors/appError";
import mongoose, { Schema } from "mongoose";
import { AuthenticatedRequest } from "../../types/custom";
import { Categories } from './../Categories/categories.models';



//? create products
export const createProduct = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      productsName,
      productsDescription,
      price,
      category,
      available,
      inStock,
    } = req.body;
    console.log(req.body);
    

    const categoryId = new mongoose.Types.ObjectId(category);
    console.log("caregoryId",categoryId);
    console.log("All Categories:", await Categories.find());

    
    const existingCategory = await Categories.findById(categoryId);
    console.log("existingCategory", existingCategory);
    if (!existingCategory)
      return next(new AppError("Category not found!", 404));

    // الصورة من multer
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    console.log("imageUrl", imageUrl);
    

    const product = await Products.create({
      productsName,
      productsDescription,
      price,
      category: categoryId,
      imageUrl,
      available,
      ratings: [],
      averageRating: 0,
      inStock,
    });
    console.log("Body Data:");
    console.log("productsName:", productsName);
    console.log("productsDescription:", productsDescription);
    console.log("price:", price);
    console.log("category:", category);
    console.log("available:", available);
    console.log("inStock:", inStock);

    console.log("product", product);
    

    res.status(201).json({ message: "Product created successfully!", product });
  }
);


//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get all products 
export const getAllProducts = catchError(async (req: Request, res: Response, next: NextFunction) => {
    let query: any = {};
    
    if (req.query.category) query.category = req.query.category;
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.available) query.available = req.query.available === "true";

    const products = await Products.find(query);
    res.status(200).json({ products });
});

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get sepecfic product by id
export const getProductById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Products.findById(req.params.id);
    if (!product) return next(new AppError("Product not found!", 404));
    res.status(200).json({ product });
});
//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? update product
export const updateProduct = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return next(new AppError("Product not found!", 404));
    res.status(200).json({ message: "Product updated successfully!", product });
});

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? delete product
export const deleteProduct = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Products.findByIdAndDelete(req.params.id);
    if (!product) return next(new AppError("Product not found!", 404));
    res.status(200).json({ message: "Product deleted successfully!" });
});

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? search product
export const searchProducts = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const search = req.query.search as string;
    if (!search) return next(new AppError("Please provide a search query!", 400));
    const products = await Products.find({ productsName: { $regex:search, $options: "i" } });
    res.status(200).json({ products });
});

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? add Review 
export const addReview = catchError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const product = await Products.findById(req.params.id);
    if (!product) return next(new AppError("Product not found!", 404));

    const { rating, comment } = req.body;
    
    // التأكد إن المستخدم مسجل دخول ومعاه `userId`
    if (!req.user?.userId) return next(new AppError("Unauthorized: No user ID found", 401));

    const userId = req.user?.userId as unknown as Schema.Types.ObjectId;
    console.log("userId",userId);
    

    // ✅ التحقق إذا كان المستخدم قيّم المنتج قبل كده
    const existingReview = product.ratings.find((review) => review.userId.toString() === userId.toString());
    if (existingReview) return next(new AppError("You have already reviewed this product!", 400));

    // ✅ التأكد من أن التقييم رقم صحيح بين 1 و 5
    if (rating < 1 || rating > 5) return next(new AppError("Rating must be between 1 and 5", 400));

    // ✅ إضافة التقييم
    product.ratings.push({ userId, rating, comment });

    // ✅ تحديث متوسط التقييم
    const totalRatings = product.ratings.length;
    product.averageRating = product.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    await product.save();
    res.status(201).json({ message: "Review added successfully!", product });
});



