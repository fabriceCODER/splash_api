import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import plumberRoutes from "./routes/plumber.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

// Routes
app.use("/api/plumbers", plumberRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/admin", adminRoutes);

export default app;
