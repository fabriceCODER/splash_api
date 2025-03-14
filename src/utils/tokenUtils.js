import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// **Generate Access Token**
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

// **Generate Refresh Token**
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

export { generateAccessToken, generateRefreshToken };
