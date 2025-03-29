import { app, server } from "./app.js";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import { validationResult, check } from "express-validator";

const PORT = process.env.PORT || 5000;

// 🛡️ Apply JSON Body Parser Middleware
app.use(bodyParser.json({ limit: "10mb" })); // Set a limit for security

// 🛡️ Rate Limiting Middleware (Prevent DDoS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

//  Validation Middleware
const validateTestData = [
    check("name").trim().notEmpty().withMessage("Name is required"),
    check("email").trim().isEmail().withMessage("Valid email is required"),
];

//  Test Route with Validation
app.post("/test", validateTestData, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }

    res.status(200).json({
        success: true,
        message: "Data is valid!",
        data: req.body,
    });
});

//  Server Health Check Route
app.get("/status", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running fine!",
    });
});

//  Rate Limit Testing Route
app.get("/test-rate-limit", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Rate limit test passed!",
    });
});

// Handle 404 Errors (Invalid Routes)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

//  Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
