import express from "express";
import * as productVariantService from "../controllers/productVariant.controller.js";
import {authMiddleware} from "../middlewares/auth-middleware.js";

export function  createProductVariantRouter(){
    const variantRouter = express.Router();
    variantRouter.post("/create", authMiddleware, productVariantService.createProductVariant);
    variantRouter.get("/inStock/:productId", productVariantService.getInStockProductVariants);
    variantRouter.get("/:productId/all", productVariantService.getAllProductVariants);
    return variantRouter;
}
