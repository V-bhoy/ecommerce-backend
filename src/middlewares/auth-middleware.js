import {verifyAccessToken} from "../jwt/jwt-service.js";

export const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Unauthorized: No access token provided."
        })
    }
    const accessToken = authHeader.substring(7);
    try{
      const decodedToken = verifyAccessToken(accessToken);
      req.headers.user_id = decodedToken.id;
      req.headers.email = decodedToken.email;
      next();
    }catch (err){
         if(err.name === "TokenExpiredError"){
             return res.status(401).json({ message: 'Token expired.' });
         }
         return res.status(403).json({ message: 'Invalid token.' });
    }
}