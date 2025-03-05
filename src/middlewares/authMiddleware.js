import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied!" });

    try {
        req.user = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token!" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access forbidden!" });
    next();
};

const isPlumber = (req, res, next) => {
    if (req.user.role !== "plumber") return res.status(403).json({ message: "Access forbidden!" });
    next();
};

export { verifyToken, isAdmin, isPlumber };
