import { Request, Response, NextFunction } from "express";

import { Types } from "mongoose";
import { catchError } from "../../middlewares/errors/catchError";
import { Wishlist } from "./WishList.model";
import { AppError } from "../../middlewares/errors/appError";


// ✅ Get Wishlist
export const getWishlist = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    const wishlist = await Wishlist.findOne({ user: userId }).populate("products", "productsName price");

    res.status(200).json({ wishlist: wishlist?.products || [] });
});

// ✅ Toggle Product in Wishlist
export const toggleWishlistItem = catchError(async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    const { userId, productId } = req.body;

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
        return next(new AppError("Invalid IDs provided", 400));
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, products: [productId] });
         res.status(201).json({ message: "Product added to wishlist", wishlist });
    }

    const index = wishlist.products.findIndex(p => p.toString() === productId);

    if (index > -1) {
        // Remove product
        wishlist.products.splice(index, 1);
        await wishlist.save();
         res.status(200).json({ message: "Product removed from wishlist", wishlist });
    } else {
        // Add product
        wishlist.products.push(productId);
        await wishlist.save();
         res.status(200).json({ message: "Product added to wishlist", wishlist });
    }
});
