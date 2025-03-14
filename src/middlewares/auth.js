const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Expiration time
    );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" } // Longer expiration time
    );
};

// Middleware to Authenticate JWT
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
};

module.exports = { generateAccessToken, generateRefreshToken, authenticateUser };
