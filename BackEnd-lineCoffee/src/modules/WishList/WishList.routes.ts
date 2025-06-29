
import { Router } from "express";
import { getWishlist, toggleWishlistItem } from './WishList.controller';
import { verifyToken } from "../../middlewares/token/token";



const wishListRouter = Router();

wishListRouter.get("/wishlist/:userId",verifyToken,getWishlist);
wishListRouter.post("/toggleWishlist/", verifyToken, toggleWishlistItem);

export default wishListRouter;