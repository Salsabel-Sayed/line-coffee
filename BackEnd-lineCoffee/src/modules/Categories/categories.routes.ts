import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoriesWithProductCount, getCategoryById, updateCategory } from "./categories.controller";



const categoriesRouter = Router()

categoriesRouter.post('/addCategory', createCategory);
categoriesRouter.get('/getAllCategories',getAllCategories)
categoriesRouter.get('/getCategoryById/:id',getCategoryById)
categoriesRouter.put('/updateCategory/:id',updateCategory)
categoriesRouter.delete('/deleteCategory/:id',deleteCategory)

categoriesRouter.get('/getCategoriesWithProductCount/',getCategoriesWithProductCount)

export default categoriesRouter


