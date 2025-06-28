import express from "express";
import * as ordersService from "../controllers/orders.controller.js";
import {authMiddleware} from "../middlewares/auth-middleware.js";

export function  createOrdersRouter(){
    const ordersRouter = express.Router();
    ordersRouter.post("/create", authMiddleware, ordersService.createOrder );
    ordersRouter.post("/payment/verify", authMiddleware, ordersService.verifyOrderPayment);
    ordersRouter.post("/payment/failed", authMiddleware, ordersService.updateOrderPaymentFailed)
    return ordersRouter;
}
