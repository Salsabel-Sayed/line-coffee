import { Router } from "express";
import {  addCoinsToUser, getUserCoins, redeemCoins} from "./coins.controller";
import { verifyToken } from "../../middlewares/token/token";




const coinsRouter = Router()

coinsRouter.post('/addCoinsToUser',addCoinsToUser);
coinsRouter.get('/getUserCoins/:id',verifyToken,getUserCoins)
coinsRouter.put('/redeemCoins/:id',verifyToken, redeemCoins);

// coinsRouter.post('/addCoinsForAction/:id',addCoinsForAction)

export default coinsRouter