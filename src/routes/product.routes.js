import express from "express";
import * as productService from "../controllers/product.controller.js";
import {authMiddleware} from "../middlewares/auth-middleware.js";

export function  createProductRouter(){
    const productRouter = express.Router();
    productRouter.post("/create", authMiddleware, productService.saveProduct)
    return productRouter;
}
