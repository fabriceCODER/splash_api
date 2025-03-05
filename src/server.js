import http from "http";
import app from "./app.js";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
