import User from "../../Auth/Models/User.js";
import { connectSocket, getIo } from "../../Middlewares/ioConnection.mw.js";
import { print } from "../Logger/print.service.js";

export const initializeSocketIO = (socketServer) => {
    // Initialize Socket.IO server with the HTTP server and set up Middlewares
    const io = getIo(socketServer);
    connectSocket(io);

    // Handle socket events
    io?.on("connection", (socket) => {
        const { _id } = socket.data.user;
        print(`✅ User connected: ${_id}`, "success");
        socket.emit("user-registered", _id);

        // Join lobby
        socket.on("join-lobby", async () => {
            socket.join("lobby");
            socket.to("lobby").emit("user-joined", { userId: _id });
            print(`🎮 User ${_id} joined the lobby`, "info");

            const allUsers = await User.find({}, "_id name");

            let usersInLobby = Array.from(io.sockets.adapter.rooms.get("lobby") || []).map((socketId) => {
                const userSocket = io.sockets.sockets.get(socketId);
                const userId = userSocket?.data.user._id;
                return allUsers.find((u) => u._id.toString() === userId?.toString());
            }).filter(Boolean);

            usersInLobby = usersInLobby.sort((a, b) => {
                if (a._id.toString() === _id.toString()) return -1;
                if (b._id.toString() === _id.toString()) return 1;
                return a.name.localeCompare(b.name);
            });

            socket.emit("available-users", usersInLobby);
        });

        // Send game invitation
        socket.on("send-invitation", ({ toId }) => {
            socket.to(toId).emit("invitation", { from: _id });
            print(`📨 User ${_id} sent an invitation to ${toId}`, "info");
        });

        // Accept invitation
        socket.on("accept-invitation", ({ toId }) => {
            socket.to(toId).emit("invitation-accepted", { from: _id });
            print(`✅ User ${_id} accepted invitation from ${toId}`, "success");
        });

        // Reject invitation
        socket.on("reject-invitation", ({ toId }) => {
            socket.to(toId).emit("invitation-rejected", { from: _id });
            print(`❌ User ${_id} rejected invitation from ${toId}`, "warn");
        });

        // Join game room
        socket.on("join-room", ({ roomId }) => {
            socket.join(roomId);
            print(`🏠 User ${_id} joined room ${roomId}`, "info");
        });

        // Leave game room
        socket.on("leave-room", ({ roomId }) => {
            socket.leave(roomId);
            print(`🚪 User ${_id} left room ${roomId}`, "info");
        });

        // Send chat message
        socket.on("send-message", ({ roomId, message }) => {
            socket.to(roomId).emit("message", { from: _id, message });
            print(`💬 User ${_id} sent message to ${roomId}`, "info");
        });

        // Typing indicator
        socket.on("typing", ({ roomId }) => {
            socket.to(roomId).emit("typing", { from: _id });
            print(`⌨️ User ${_id} is typing in room ${roomId}`, "info");
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            print(`🔌 User disconnected: ${_id}`, "secondary");
        });
    });
};
