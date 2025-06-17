import {verifyEmail} from "../util/verify-email.js";
import * as CustomerModel from "../models/customer.model.js";
import * as jwtService from "../jwt/jwt-service.js";
import bcrypt from "bcryptjs";

export const registerCustomer = async(req, res)=>{
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName || !email || !password){
        return res.status(400).json({
            success: false,
            message: "Missing fields in request data!"
        })
    }
    if(!verifyEmail(email)){
        return res.status(400).json({
            success: false,
            message: "Invalid email"
        })
    }
    try{
        const existingCustomer = await CustomerModel.findByEmail(email);
        if(existingCustomer){
            return res.status(409).json({
                success: false,
                message: "Email already registered!"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [{id}] = await CustomerModel.save({
            first_name: firstName,
            last_name: lastName,
            email,
            password: hashedPassword
        })

        const accessToken = jwtService.generateAccessToken({customerId: id, email});
        const refreshToken = jwtService.generateRefreshToken({customerId: id, email });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7*24*60*60*1000
        })

        return res.status(201).json({
            success: true,
            message: "Registration successful!",
            accessToken
        })

    }catch (err){
       console.log(err);
       res.status(500).json({
           message: "Server Error"
       })
    }
}