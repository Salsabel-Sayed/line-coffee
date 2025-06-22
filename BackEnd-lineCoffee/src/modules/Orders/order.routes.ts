import { Router } from "express";
import { verifyToken } from './../../middlewares/token/token';
import { adminUpdateOrder, cancelOrder, completeOrder, createOrder, getAllOrders, getOrderById, getUserOrders, updateOrder, updateOrderStatus } from "./order.controller";




const orderRouter = Router()

orderRouter.post('/createOrder',verifyToken,createOrder);
orderRouter.put('/completeOrder/:orderId', verifyToken, completeOrder);

orderRouter.get('/myOrders', verifyToken, getUserOrders);

orderRouter.get('/getOrderById/:id',verifyToken,getOrderById)
orderRouter.delete('/cancelOrder/:id',verifyToken,cancelOrder)
orderRouter.put('/updateOrder/:id', verifyToken, updateOrder);
orderRouter.put('/adminUpdateOrderStatus/:id', verifyToken, updateOrderStatus);
orderRouter.get('/getAllOrders/',verifyToken,getAllOrders)
orderRouter.put('/adminUpdateOrder/:id', verifyToken, adminUpdateOrder);



export default orderRouter