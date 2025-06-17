import express from "express";
import {createProductRouter} from "./product.routes.js";
import {createAuthRouter} from "./auth.routes.js";


export default function createAppRouter(){
    const router = express.Router();
    const authRoutes = createAuthRouter();
    const productRoutes = createProductRouter();

    router.use("/auth", authRoutes);
    router.use("/products", productRoutes);

    return router;
}
