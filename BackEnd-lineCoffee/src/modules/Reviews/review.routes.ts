import { Router } from "express";
import { verifyToken } from './../../middlewares/token/token';
import { addReview, deleteReview, getProductReviews } from "./review.controller";




const ReviewRouter = Router()

ReviewRouter.post('/addReview',verifyToken,addReview);
ReviewRouter.get('/getProductReviews/:productId',getProductReviews);
ReviewRouter.delete('/deleteReview/:reviewId', verifyToken, deleteReview);



export default ReviewRouter