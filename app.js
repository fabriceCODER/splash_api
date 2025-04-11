import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import http from "http";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./src/swaggerConfig.js";


import authRoutes from "./src/routes/authRoutes.js";
import plumberRoutes from "./src/routes/plumberRoutes.js";
import channelRoutes from "./src/routes/channelRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import managerRoutes from "./src/routes/managerRoutes.js"; // Updated from analyticsRoutes

dotenv.config();

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🔒 Security & Performance Middleware
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());

// Create HTTP Server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"],
    },
});

// 📡 Socket.io Event Handling
io.on("connection", (socket) => {
    console.log(`⚡ New client connected: ${socket.id}`);

    // Plumbers join their own ID room for notifications
    socket.on("join_plumber", (plumberId) => {
        if (plumberId) {
            socket.join(plumberId);
            console.log(`✅ Plumber joined room: ${plumberId}`);
        }
    });

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected");
    });
});

// 📝 Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🚀 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/plumbers", plumberRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/manager", managerRoutes); // Updated from /api/analytics

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

export { app, io, server };