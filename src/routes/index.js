import express from "express";
import {createProductRouter} from "./product.routes.js";
import {createAuthRouter} from "./auth.routes.js";
import {createCategoryRouter} from "./category.routes.js";
import {createSubCategoryRouter} from "./sub-category.routes.js";
import {createProductVariantRouter} from "./product-variant.routes.js";
import {createOrdersRouter} from "./orders.routes.js";
import {createWishlistRouter} from "./wishlist.routes.js";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import {createReviewRouter} from "./review.routes.js";


export default function createAppRouter(){
    const router = express.Router();
    const authRoutes = createAuthRouter();
    const productRoutes = createProductRouter();
    const categoryRoutes = createCategoryRouter();
    const subCategoryRoutes = createSubCategoryRouter();
    const variantRoutes = createProductVariantRouter();
    const ordersRoutes = createOrdersRouter();
    const wishlistRoutes = createWishlistRouter();
    const reviewRoutes = createReviewRouter();

    router.use("/auth", authRoutes);
    router.use("/categories", categoryRoutes);
    router.use("/sub-categories", subCategoryRoutes);
    router.use("/products", productRoutes);
    router.use("/variants", variantRoutes);
    router.use("/orders", authMiddleware, ordersRoutes);
    router.use("/wishlist", authMiddleware, wishlistRoutes);
    router.use("/review", reviewRoutes);

    return router;
}
