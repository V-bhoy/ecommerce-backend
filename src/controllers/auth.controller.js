import {verifyEmail} from "../util/verify-email.js";
import * as CustomerModel from "../models/customer.model.js";
import * as OtpVerificationModel from "../models/otpVerification.model.js"
import * as jwtService from "../jwt/jwt-service.js";
import bcrypt from "bcryptjs";
import appConfig from "../index.js";
import {sendWelcomeEmail} from "../util/send-welcome-email.js";
import {generateOtp} from "../util/generate-otp.js";
import {generateAccessToken, verifyRefreshToken} from "../jwt/jwt-service.js";
import {sendOtp} from "../util/send-otp.js";

export const registerCustomer = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing fields in request data!"
        })
    }
    if (!verifyEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email"
        })
    }
    try {
        const existingCustomer = await CustomerModel.findByEmail(email);
        if (existingCustomer) {
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

        const accessToken = jwtService.generateAccessToken({id, email});
        const refreshToken = jwtService.generateRefreshToken({id, email});

        await sendWelcomeEmail(email);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: appConfig.env === "production",
            sameSite: appConfig.env === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            success: true,
            message: "Registration successful!",
            accessToken,
            user: {
                id,
                firstName,
                lastName,
                email
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        })
    }
}

export const loginCustomer = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing fields in request data!"
        })
    }
    if (!verifyEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email"
        })
    }
    try {
        const existingCustomer = await CustomerModel.findByEmail(email);
        if (!existingCustomer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found!"
            })
        }
        const isValidPassword = await bcrypt.compare(password, existingCustomer.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }

        const accessToken = jwtService.generateAccessToken({id: existingCustomer.id, email});
        const refreshToken = jwtService.generateRefreshToken({id: existingCustomer.id, email});

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: appConfig.env === "production",
            sameSite: appConfig.env === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            success: true,
            message: "Login successful!",
            accessToken,
            user: {
                id: existingCustomer?.id,
                firstName: existingCustomer?.first_name,
                lastName: existingCustomer?.last_name,
                email
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        })
    }
}

export const logoutCustomer = async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: appConfig.env === "production",
            sameSite: appConfig.env === "production" ? "none" : "strict"
        });
        return res.status(200).json({
            success: true,
            message: "Logout successful!"
        })
    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Missing refresh token!"
        })
    }
    try {
        const user = verifyRefreshToken(refreshToken);
        const userDetails = CustomerModel.findByEmail(user.email);
        const newAccessToken = generateAccessToken({id: user.id, email: user.email});
        return res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            user: {
                id: user.id,
                firstName: userDetails?.firstName,
                lastName: userDetails?.lastName,
                email: user.email
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(403).json({
            success: false,
            message: "Invalid Refresh Token"
        })
    }
}

export const requestOtp = async (req, res) => {
    const {email} = req.body;
    if (!email || !verifyEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Bad request: Enter valid email."
        })
    }
    try {
        const existingCustomer = await CustomerModel.findByEmail(email);
        if (!existingCustomer) {
            return res.status(404).json({
                success: "false",
                message: "Invalid email. Customer not found."
            })
        }
        const existingOtp = await OtpVerificationModel.findByCustomerId(existingCustomer.id);
        const RESEND_TIMEOUT = 60 * 1000;
        if(existingOtp && new Date(existingOtp.updated_at).getTime() > Date.now() - RESEND_TIMEOUT){
            const secondsLeft = Math.ceil(
                (RESEND_TIMEOUT - (Date.now() - new Date(existingOtp.updated_at).getTime()))/1000
            );
            return res.status(429).json({
                success: false,
                message: `Please wait ${secondsLeft}s before requesting another otp!`
            })
        }
        const otp = generateOtp();
        await OtpVerificationModel.save({
            customer_id: existingCustomer.id,
            otp,
            expiry: new Date(Date.now() + 5*60*1000),
        })
        await sendOtp({email, otp});

        return res.status(200).json({
            success: true,
            message: "Otp sent successfully!"
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const resetPasswordByOtpVerification = async(req, res)=>{
    const {email, otp, password} = req.body;
    if (!email || !verifyEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Bad request: Enter valid email."
        })
    }
    try {
        const existingCustomer = await CustomerModel.findByEmail(email);
        if (!existingCustomer) {
            return res.status(404).json({
                success: "false",
                message: "Invalid email. Customer not found."
            })
        }
        const generatedOtp = await OtpVerificationModel.findByCustomerId(existingCustomer.id);
        if (!generatedOtp) {
            return res.status(404).json({
                success: false,
                message: "OTP not found for this customer.",
            });
        }
        if(generatedOtp.expiry < Date.now()){
            return res.status(400).json({
                success: false,
                message: "OTP has expired!"
            })
        }
        if(generatedOtp.otp !== otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP!"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await CustomerModel.updatePassword({
            email: existingCustomer.email,
            password: hashedPassword
        })
        return res.status(200).json({
            success: true,
            message: "OTP verified, reset password successfully!"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        })
    }
}

export const generateApiAccessToken = async(req, res)=>{
    const {email} = req.body;
    if(!email || !verifyEmail(email)){
        return res.status(400).json({
            success: false,
            message: "Invalid email!"
        })
    }
    try {
        const existing = await CustomerModel.findByEmail(email);
        if(!existing){
            return res.status(404).json({
                success: false,
                message: "Customer not found!"
            })
        }
        const accessToken = jwtService.generateAccessToken({id: existing.id, email});
        return res.status(200).json({
            success: true,
            accessToken
        })
    }catch (err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Something went wrong!"
        })
    }
}