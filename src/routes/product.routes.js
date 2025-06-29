import express from "express";
import * as productService from "../controllers/product.controller.js";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import {optionalAuth} from "../middlewares/optional-auth.js";

export function  createProductRouter(){
    const productRouter = express.Router();
    productRouter.post("/create", authMiddleware, productService.saveProduct);
    productRouter.get("/id", productService.getIdByCategoryAndSubCategory);
    productRouter.post("/all", optionalAuth, productService.getAllProducts);
    productRouter.get("/home/all", productService.getAllHomePageProducts);
    productRouter.get("/popular/:categoryId/all", productService.getAllPopularProducts);
    productRouter.post("/:category/all", optionalAuth, productService.getAllProductsByCategory);
    productRouter.get("/:productId", optionalAuth, productService.getProductDetailsById);
    return productRouter;
}
