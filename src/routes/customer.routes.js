import express from "express";
import * as customerService from "../controllers/customer.controller.js";

export function  createCustomerRouter(){
    const customerRouter = express.Router();
    customerRouter.post("/address/update", customerService.updateCustomerAddress);
    customerRouter.get("/address", customerService.fetchCustomerAddress);
    customerRouter.post("/password/reset", customerService.resetPassword);
    return customerRouter;
}