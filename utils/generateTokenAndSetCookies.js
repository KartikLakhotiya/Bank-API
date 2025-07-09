import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = async (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set true only in production with HTTPS
        sameSite: 'lax', // or 'none' if cross-origin
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

    return token;
}