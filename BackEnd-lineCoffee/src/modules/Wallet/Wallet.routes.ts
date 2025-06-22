// routes/payment.routes.ts
import express from "express";
import { addBalance, getUserWallet, getUserLogs, updateWalletBalance, validateWalletAmount } from "./Wallet.controller";
import { verifyToken } from "../../middlewares/token/token";
import { checkAdmin } from "../../middlewares/verifyAdmin/roleAdmin";


const walletRouter = express.Router();

walletRouter.post("/addBalance/", verifyToken,addBalance);
walletRouter.get("/getUserWallet/:id", verifyToken,getUserWallet); // for admin
walletRouter.get("/getUserLogs/:id", verifyToken, getUserLogs); // for admin
walletRouter.put("/updateWalletBalance/:id",verifyToken,updateWalletBalance); // for admin
walletRouter.post("/validateWalletAmount/",verifyToken,validateWalletAmount); // for admin


export default walletRouter;