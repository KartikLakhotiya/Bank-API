import jwt from 'jsonwebtoken';
import logger from './logger.js';

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        logger.warn('Middleware', 'Token verification failed - No token provided', { 
            path: req.originalUrl, 
            method: req.method 
        });
        return res.status(401).json({ message: "No Token provided." })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            logger.warn('Middleware', 'Token verification failed - Invalid token', { 
                path: req.originalUrl 
            });
            return res.status(401).json({ message: "Unauthorized token" })
        }
        
        logger.debug('Middleware', 'Token verified successfully', { 
            userId: decoded.userId, 
            path: req.originalUrl 
        });
        
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        logger.error('Middleware', 'Token verification error', error);
        res.status(500).json({ message: error, success: false });
    }
}