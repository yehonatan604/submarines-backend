import { Server } from "socket.io";
import { verifyToken } from "../Services/Jwt/jwt.service.js";
import { print } from "../Services/Logger/print.service.js";

export const getIo = (socketServer) => new Server(socketServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

export const connectSocket = (io) => io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    const userData = verifyToken(token);

    if (!userData) {
        print("Invalid or missing token during socket connection", "error");
        return next(new Error("Unauthorized"));
    }

    socket.data.user = userData;
    socket.join(userData._id);
    next();
});