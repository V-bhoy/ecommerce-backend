import express from "express";
import * as stripeService from "../controllers/stripe.controller.js";

export function  createStripeRouter(){
    const stripeRouter = express.Router();
    stripeRouter.post("/create-checkout-session", stripeService.createCheckoutSession );
    return stripeRouter;
}