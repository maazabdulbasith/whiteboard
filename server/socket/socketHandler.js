const Room = require("../models/Room");
const { throttle } = require("lodash"); // For throttling cursor updates

function initializeSocket(io) {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Join Room
        socket.on("join-room", async ({ roomId }) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);

            // Send existing drawing data to the new user
            const room = await Room.findOne({ roomId });
            if (room) {
                socket.emit("load-drawing", room.drawingData);
            }

            // Update and broadcast user count
            const roomClients =
                io.sockets.adapter.rooms.get(roomId) || new Set();
            io.to(roomId).emit("user-count-update", roomClients.size);
        });

        // Cursor Movement
        const throttledCursorEmit = throttle((roomId, cursorData) => {
            socket.to(roomId).emit("cursor-move", cursorData);
        }, 16); // ~60fps

        socket.on("cursor-move", ({ roomId, x, y }) => {
            throttledCursorEmit(roomId, { id: socket.id, x, y });
        });

        // Drawing Events
        socket.on("draw-start", ({ roomId, ...data }) => {
            socket.to(roomId).emit("draw-start", { id: socket.id, ...data });
        });

        socket.on("draw-move", ({ roomId, ...data }) => {
            socket.to(roomId).emit("draw-move", { id: socket.id, ...data });
            // For persistence, we only need to store the final stroke.
        });

        socket.on("draw-end", async ({ roomId, ...data }) => {
            socket.to(roomId).emit("draw-end", { id: socket.id, ...data });

            // Persist the completed drawing stroke to MongoDB
            const command = { type: "stroke", data, timestamp: new Date() };
            await Room.updateOne(
                { roomId },
                {
                    $push: { drawingData: command },
                    $set: { lastActivity: new Date() },
                }
            );
        });

        // Clear Canvas
        socket.on("clear-canvas", async ({ roomId }) => {
            io.to(roomId).emit("clear-canvas"); // Broadcast to all clients

            // Persist the clear action
            await Room.updateOne(
                { roomId },
                { $set: { drawingData: [], lastActivity: new Date() } }
            );
        });

        // Leave Room event
        socket.on("leave-room", ({ roomId }) => {
            socket.leave(roomId);
            const roomClients =
                io.sockets.adapter.rooms.get(roomId) || new Set();
            io.to(roomId).emit("user-count-update", roomClients.size);
            io.to(roomId).emit("user-left", { id: socket.id });
        });

        // Leave Room / Disconnect
        socket.on("disconnecting", () => {
            const rooms = Array.from(socket.rooms);
            rooms.forEach((roomId) => {
                if (roomId !== socket.id) {
                    const roomClients =
                        io.sockets.adapter.rooms.get(roomId) || new Set();
                    // We subtract 1 because the disconnecting client is still in the set
                    io.to(roomId).emit(
                        "user-count-update",
                        roomClients.size - 1
                    );
                    io.to(roomId).emit("user-left", { id: socket.id });
                }
            });
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });

        // Cursor Inactive
        socket.on("cursor-inactive", ({ roomId }) => {
            socket.to(roomId).emit("cursor-inactive", { id: socket.id });
        });
    });
}

module.exports = initializeSocket;
