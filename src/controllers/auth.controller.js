import {verifyEmail} from "../util/verify-email.js";
import * as CustomerModel from "../models/customer.model.js";
import * as jwtService from "../jwt/jwt-service.js";
import bcrypt from "bcryptjs";
import appConfig from "../index.js";
import {sendWelcomeEmail} from "../util/send-welcome-email.js";
import {generateOtp} from "../util/generate-otp.js";
import {generateAccessToken, verifyRefreshToken} from "../jwt/jwt-service.js";

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
            accessToken
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
            accessToken
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
        console.log(err);
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
        const newAccessToken = generateAccessToken({id: user.id, email: user.email});
        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        })
    } catch (err) {
        console.log(err)
        return res.status(403).json({
            success: false,
            message: "Invalid Refresh Token"
        })
    }
}

export const verifyOtp = async (req, res) => {
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
        const otp = generateOtp();
        console.log(otp)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}