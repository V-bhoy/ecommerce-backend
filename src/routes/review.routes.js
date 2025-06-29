import express from "express";
import * as reviewService from "../controllers/review.controller.js";
import {authMiddleware} from "../middlewares/auth-middleware.js";

export function  createReviewRouter(){
    const reviewRouter = express.Router();
    reviewRouter.post("/create", authMiddleware, reviewService.addProductReview);
    reviewRouter.get("/all/:productId", reviewService.getProductReviews);
    reviewRouter.get("/stats/:productId", reviewService.getProductReviewStats);
    return reviewRouter;
}