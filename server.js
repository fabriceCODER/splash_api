import { app, server } from "./app.js";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import { validationResult, check } from "express-validator";

const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
});

app.use(limiter);

// Validation middleware
const validateTestData = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
];

// Testing route with validation
app.post('/test', validateTestData, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    res.status(200).json({
        success: true,
        message: 'Data is valid!',
        data: req.body
    });
});

// Test route to check server status
app.get('/status', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running fine!'
    });
});

// Handle rate-limiting by sending a specific message
app.get('/test-rate-limit', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Rate limit test passed!',
    });
});

// Handle invalid routes gracefully with 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
