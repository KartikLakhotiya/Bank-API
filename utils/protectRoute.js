import jwt from 'jsonwebtoken';
import User from "../models/users.model.js";
import logger from "./logger.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            logger.warn('Middleware', 'Protected route access denied - No token provided', { 
                path: req.originalUrl, 
                method: req.method 
            });
            return res.status(401).json({ message: "Unauthorized - No token provided !!!" })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            logger.warn('Middleware', 'Protected route access denied - Invalid token', { 
                path: req.originalUrl 
            });
            return res.status(401).json({ message: "Unauthorized - token invalid !!!" })
        }
        
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            logger.warn('Middleware', 'Protected route access denied - User not found', { 
                userId: decoded.userId 
            });
            return res.status(404).json({ message: "User not found" })
        }
        
        logger.debug('Middleware', 'Route protection passed', { 
            userId: user._id, 
            path: req.originalUrl 
        });
        
        req.user = user;
        next();
    }
    catch (error) {
        logger.error('Middleware', 'Error in protected route middleware', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}