require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const initializeSocket = require("./socket/socketHandler");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors()); // Allow requests from the React client
app.use(express.json());

// API Routes
app.use("/api/rooms", require("./routes/rooms"));

// Database Connection
mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.error("MongoDB connection error:", err));

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Reacts URL
        methods: ["GET", "POST"],
    },
});

// Initialize socket event handlers
initializeSocket(io);

// Simple cron job for cleanup (example)
const Room = require("./models/Room");
setInterval(async () => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    try {
        const result = await Room.deleteMany({
            lastActivity: { $lt: twentyFourHoursAgo },
        });
        if (result.deletedCount > 0) {
            console.log(`Cleaned up ${result.deletedCount} old rooms.`);
        }
    } catch (error) {
        console.error("Error cleaning up old rooms:", error);
    }
}, 60 * 60 * 1000); // Run every hour

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
