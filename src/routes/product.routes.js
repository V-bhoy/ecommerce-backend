import express from "express";
import * as productService from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.post("/save", productService.saveProduct)

export default productRouter;