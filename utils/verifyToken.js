import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No Token provided." })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized token" })
        }
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: error, success: false });
    }
}