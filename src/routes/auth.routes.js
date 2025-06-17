import express from "express";
import * as authService from "../controllers/auth.controller.js";

export function  createAuthRouter(){
    const authRouter = express.Router();
    authRouter.post("/register", authService.registerCustomer);
    return authRouter;
}
