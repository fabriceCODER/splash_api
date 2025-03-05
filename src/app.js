import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import plumberRoutes from "./routes/plumberRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import adminRoutes from "./routes/adminroutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());



//Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
});

app.use(limiter);

// Routes
app.use("/api/plumbers", plumberRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/admin", adminRoutes);

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

export { app, server, io };
