const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");

// Rate Limiting
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});

// CORS Configuration
const corsOptions = cors({
    origin: ["https://yourfrontend.com"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
});

module.exports = { rateLimiter, corsOptions };
