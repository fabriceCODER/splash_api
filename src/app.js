import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import plumberRoutes from "./routes/plumberRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import adminRoutes from "./routes/adminroutes.js";
import notificationRoutes from "./routes/notificationRoutes";
import reportRoutes from "./routes/reportRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());

// Routes
app.use("/api/plumbers", plumberRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/analytics", analyticsRoutes);



export { app };
