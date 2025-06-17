import express from "express";
import * as productService from "../controllers/product.controller.js";

export function  createProductRouter(){
    const productRouter = express.Router();
    productRouter.post("/save", productService.saveProduct)
    return productRouter;
}
