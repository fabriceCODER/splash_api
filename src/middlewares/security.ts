import rateLimit from "express-rate-limit";
import cors from "cors";
import helmet from "helmet";
import express from "express";

// Rate Limiting
export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
});

// CORS Configuration
export const corsOptions = cors({
    origin: ["https://yourfrontend.com"], // Allow frontend domain
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
});

// Apply all security middleware
export const applySecurityMiddleware = (app: express.Application) => {
    app.use(rateLimiter);
    app.use(corsOptions);
    app.use(helmet()); // Secure headers
};
