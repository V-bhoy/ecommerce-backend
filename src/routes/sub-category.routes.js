import express from "express";
import * as subCategoryService from "../controllers/subCategory.controller.js";
import {authMiddleware} from "../middlewares/auth-middleware.js";

export function  createSubCategoryRouter(){
    const subCategoryRouter = express.Router();
    subCategoryRouter.post("/create", authMiddleware, subCategoryService.createSubCategory);
    subCategoryRouter.get("/all", subCategoryService.getAllSubCategories);
    return subCategoryRouter;
}
