const mongoose = require("mongoose");

// This schema can be embedded, no need for a separate model unless it gets very complex.
const DrawingCommandSchema = new mongoose.Schema({
    type: { type: String, required: true }, // 'stroke', 'clear'
    data: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now },
});

const RoomSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        drawingData: [DrawingCommandSchema], // Array of drawing commands
        lastActivity: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
); // `createdAt` is included automatically

// Middleware to update lastActivity on save
RoomSchema.pre("save", function (next) {
    this.lastActivity = new Date();
    next();
});

module.exports = mongoose.model("Room", RoomSchema);
