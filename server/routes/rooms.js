const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// POST /api/rooms/join - A "dummy" endpoint, as room creation is dynamic.
// The main purpose is to check if a room exists and return its data.
router.post("/join", async (req, res) => {
    const { roomId } = req.body;
    if (!roomId || roomId.length < 6 || roomId.length > 8) {
        return res.status(400).json({ msg: "Invalid Room ID format." });
    }
    // `findOneAndUpdate` with `upsert` is perfect for "find or create" logic
    try {
        const room = await Room.findOneAndUpdate(
            { roomId },
            { $set: { lastActivity: new Date() } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.json({ roomId: room.roomId, drawingData: room.drawingData });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// GET /api/rooms/:roomId - Get existing drawing data for a room
router.get("/:roomId", async (req, res) => {
    try {
        const room = await Room.findOne({ roomId: req.params.roomId });
        if (!room) {
            return res.status(404).json({ msg: "Room not found" });
        }
        res.json(room);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
