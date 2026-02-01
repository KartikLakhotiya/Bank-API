import jwt from 'jsonwebtoken';
import logger from './logger.js';

export const generateTokenAndSetCookie = async (res, userId) => {
    logger.debug('AuthService', 'Generating JWT token', { userId });
    
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set true only in production with HTTPS
        sameSite: 'lax', // or 'none' if cross-origin
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

    logger.success('AuthService', 'JWT token generated and cookie set', { userId, expiresIn: '7d' });
    
    return token;
}