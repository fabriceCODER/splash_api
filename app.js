import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import "./cronJobs.js";
import plumberRoutes from "./src/routes/plumberRoutes.js";
import channelRoutes from "./src/routes/channelRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js"
import reportRoutes from "./src/routes/reportRoutes.js"
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import { swaggerDocs } from "./src/swaggerConfig.js";
import swaggerUi from "swagger-ui-express";
import http from "http";
import {Server} from "socket.io";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`⚡ New client connected: ${socket.id}`);

    socket.on("join_channel", (channelId) => {
        socket.join(channelId);
        console.log(`✅ Plumber joined channel: ${channelId}`);
    });

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected");
    });
});


// Swagger UI for API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));  // Swagger UI route

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/plumbers", plumberRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/analytics", analyticsRoutes);

export { app, io, server};
