import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// **Generate Access Token**
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role }, // Ensure payload matches usage
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

// **Generate Refresh Token**
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id }, // Only id needed for refresh token as per usage
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

// **Verify Token Middleware**
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ message: "Access denied! No token provided." });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // Attach user data (id, role) to request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token!" });
    }
};

// **Authenticate User Middleware**
const authenticateUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || !["admin", "manager", "plumber"].includes(req.user.role)) {
            return res.status(401).json({ message: "Unauthorized! Invalid user role." });
        }
        next();
    });
};

// **Check if User is Admin**
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access forbidden! Admins only." });
    }
    next();
};

// **Check if User is Manager**
const isManager = (req, res, next) => {
    if (!req.user || req.user.role !== "manager") {
        return res.status(403).json({ message: "Access forbidden! Managers only." });
    }
    next();
};

// **Check if User is Plumber**
const isPlumber = (req, res, next) => {
    if (!req.user || req.user.role !== "plumber") {
        return res.status(403).json({ message: "Access forbidden! Plumbers only." });
    }
    next();
};

export { 
    verifyToken, 
    authenticateUser, 
    isAdmin, 
    isManager, 
    isPlumber, 
    generateAccessToken, 
    generateRefreshToken 
};