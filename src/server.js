import http from "http";
import {app} from "./app.js";
import rateLimit from "express-rate-limit";
import {Server} from "socket.io";
const PORT = process.env.PORT || 5000;

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

//Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
});

app.use(limiter);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
