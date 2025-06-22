import { NextFunction, Request, Response } from "express";
import { catchError } from "../../middlewares/errors/catchError";
import { Categories, ICategories } from "./categories.models";
import { AppError } from "../../middlewares/errors/appError";



//? create categories (admin)
export const createCategory = catchError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { categoryName, categoryDescription } = req.body;

    const categoryData: Partial<ICategories> = { categoryName, categoryDescription };

    // ✅ لو مفيش createdAt، هيتم إضافته يدويًا
    if (!categoryData.createdAt) {
        categoryData.createdAt = new Date();
    }

    const category = await Categories.create(categoryData);

    res.status(201).json({ message:req.__("Category created successfully!"), category });
});

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get all categories (user)
export const getAllCategories = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Categories.find();
    res.status(200).json({ message:"all categories", categories });
});

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get sepesific category (user)
export const getCategoryById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const category = await Categories.findById(req.params.id);
    if (!category) return next(new AppError("Category not found!", 404));
    res.status(200).json({ category });
});

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? update category (admin)
export const updateCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const category = await Categories.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return next(new AppError("Category not found!", 404));
    res.status(200).json({ message: "Category updated successfully!", category });
});
//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? delete category (admin)
export const deleteCategory = catchError(async (req: Request, res: Response, next: NextFunction)=>{
    const category = await Categories.findByIdAndDelete(req.params.id);
    if (!category) return next(new AppError("Category not found!", 404));
    res.status(200).json({ message: "Category deleted successfully!" });
})

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? get product in spesific category
// export const getProductsByCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const products = await Product.find({ category: req.params.id });
//     res.status(200).json({ products });
// });

//* ////////////////////////////////////////////////////////////////////////////////////////////////////
//? aggregate : Filter categories by number of products

export const getCategoriesWithProductCount = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const minProducts = parseInt(req.query.minProducts as string) || 0;

    const categories = await Categories.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "category",
                as: "products"
            }
        },
        {
            $addFields: { productCount: { $size: "$products" } }
        },
        {
            $match: { productCount: { $gte: minProducts } }
        },
        {
            $project: { products: 0 } // استبعاد المنتجات من النتيجة النهائية
        }
    ]);

    res.status(200).json({ categories });
});