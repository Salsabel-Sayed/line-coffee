import { Router } from "express";
import { checkEmail } from "../../middlewares/CheckEmail/checkEmail";
import { adminDeleteUser, adminUpdateUser, createUserByAdmin, deleteUser, finduserInfo, getAllUsers, loginUser, logoutUser, registerUser, updateUser } from "./users.controller";
import { verifyToken } from './../../middlewares/token/token';
import { validate } from "../../middlewares/validate/validate";
import { loginSchema, registerSchema } from "./userValidation";




const userRouter = Router()

userRouter.post('/addUser', checkEmail, validate(registerSchema), registerUser);
userRouter.post('/createUserByAdmin',checkEmail, validate(registerSchema),verifyToken,createUserByAdmin);
userRouter.post('/logIn', validate(loginSchema), loginUser);
userRouter.put('/updateUser/:id',verifyToken,updateUser)
userRouter.delete('/deleteUser/:id',verifyToken,deleteUser)
userRouter.put('/logoutUser/:id',verifyToken,logoutUser)
userRouter.get('/finduserInfo/:id',verifyToken,finduserInfo)
userRouter.get('/getAllUsers/', verifyToken, getAllUsers);//admin
userRouter.put('/adminUpdateUser/:id', verifyToken, adminUpdateUser); //admin
userRouter.delete('/adminDeleteUser/:id', verifyToken, adminDeleteUser);//admin

export default userRouter