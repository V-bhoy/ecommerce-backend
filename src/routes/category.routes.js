import express from "express";
import * as categoryService from "../controllers/category.controller.js";
import {authMiddleware} from "../middlewares/auth-middleware.js";

export function  createCategoryRouter(){
    const categoryRouter = express.Router();
    categoryRouter.post("/create", authMiddleware, categoryService.createCategory);
    categoryRouter.get("/all", categoryService.getAllCategories);
    return categoryRouter;
}
