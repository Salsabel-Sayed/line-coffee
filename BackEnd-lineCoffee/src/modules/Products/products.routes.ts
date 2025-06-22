import { Router } from "express";
import { addReview, createProduct, deleteProduct, getAllProducts, getProductById, searchProducts, updateProduct } from "./products.controller";
// import {cloudinaryUploadMiddleware} from "../../utils/cloudinary"
import { verifyToken } from "../../middlewares/token/token";
import upload from "../../middlewares/multer/uploads";




const ProductsRouter = Router()

ProductsRouter.post('/addProduct',upload.single("image"), createProduct);
console.log("📦 Request received to addProduct");
ProductsRouter.get('/getAllProducts',getAllProducts)
ProductsRouter.get('/getProductById/:id',getProductById)
ProductsRouter.put('/updateProduct/:id',upload.single("image"),updateProduct)
ProductsRouter.delete('/deleteProduct/:id',deleteProduct)
ProductsRouter.get('/searchProducts/',searchProducts)
ProductsRouter.put('/addReview/:id',verifyToken,addReview)

export default ProductsRouter