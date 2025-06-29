import express from "express";
import * as ordersService from "../controllers/orders.controller.js";
import {authMiddleware} from "../middlewares/auth-middleware.js";

export function  createOrdersRouter(){
    const ordersRouter = express.Router();
    ordersRouter.post("/create", ordersService.createOrder );
    ordersRouter.post("/payment/verify", ordersService.verifyOrderPayment);
    ordersRouter.post("/payment/failed", ordersService.updateOrderPaymentFailed)
    ordersRouter.get("/all", ordersService.getAllOrdersByUserId);
    return ordersRouter;
}
