
import { Router } from "express";
import { getWishlist, toggleWishlistItem } from './WishList.controller';



const wishListRouter = Router();

wishListRouter.get("/wishlist/:userId", getWishlist);
wishListRouter.post("/toggleWishlist/", toggleWishlistItem);

export default wishListRouter;