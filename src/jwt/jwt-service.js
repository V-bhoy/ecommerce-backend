import jwt from "jsonwebtoken";
import "dotenv/config.js";

export const generateAccessToken = (payload)=>{
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m"
    })
}

export const verifyAccessToken = (accessToken)=>{
    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
}

export const generateRefreshToken = (payload)=>{
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30m"
    })
}

export const verifyRefreshToken = (refreshToken)=>{
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
}