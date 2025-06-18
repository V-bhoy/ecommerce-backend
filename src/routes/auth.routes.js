import express from "express";
import * as authService from "../controllers/auth.controller.js";

export function  createAuthRouter(){
    const authRouter = express.Router();
    authRouter.post("/register", authService.registerCustomer);
    authRouter.post("/login", authService.loginCustomer);
    authRouter.get("/refresh", authService.refreshToken);
    authRouter.post("/logout", authService.logoutCustomer);
    return authRouter;
}
