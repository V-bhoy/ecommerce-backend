import express from "express";
import {createProductRouter} from "./product.routes.js";
import {createAuthRouter} from "./auth.routes.js";
import {createCategoryRouter} from "./category.routes.js";
import {createSubCategoryRouter} from "./sub-category.routes.js";
import {createProductVariantRouter} from "./product-variant.routes.js";


export default function createAppRouter(){
    const router = express.Router();
    const authRoutes = createAuthRouter();
    const productRoutes = createProductRouter();
    const categoryRoutes = createCategoryRouter();
    const subCategoryRoutes = createSubCategoryRouter();
    const variantRoutes = createProductVariantRouter();

    router.use("/auth", authRoutes);
    router.use("/categories", categoryRoutes);
    router.use("/sub-categories", subCategoryRoutes);
    router.use("/products", productRoutes);
    router.use("/variants", variantRoutes);

    return router;
}
