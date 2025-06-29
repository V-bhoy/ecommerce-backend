import express from "express";
import * as wishlistService from "../controllers/wishlist.controller.js";
import {getAllProducts} from "../controllers/product.controller.js";

export function  createWishlistRouter(){
    const wishlistRouter = express.Router();
    wishlistRouter.post("/add", wishlistService.wishlistProduct);
    wishlistRouter.post("/remove", wishlistService.removeWishlistProduct);
    wishlistRouter.post("/all", getAllProducts);
    return wishlistRouter;
}