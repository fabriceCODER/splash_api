import {app, server} from "./app.js";
import rateLimit from "express-rate-limit";
const PORT = process.env.PORT || 5000;

//Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
});

app.use(limiter);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
