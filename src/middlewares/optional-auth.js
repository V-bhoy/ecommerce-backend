import {verifyAccessToken} from "../jwt/jwt-service.js";

export function optionalAuth(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
       req.user = null;
       return next();
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = verifyAccessToken(token);
        req.user = {
            id: decoded.id,
            email: decoded.email
        }
    }catch(err){
       req.user = null;
    }
    next();
}