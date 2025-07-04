import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RoomJoin() {
    const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();

    const handleJoin = (e) => {
        e.preventDefault();
        if (roomCode.trim().length >= 6 && roomCode.trim().length <= 8) {
            navigate(`/${roomCode.trim()}`);
        } else {
            alert("Room code must be 6-8 alphanumeric characters.");
        }
    };

    return (
        <div className="join-container">
            <h1>Collaborative Whiteboard</h1>
            <form onSubmit={handleJoin}>
                <input
                    type="text"
                    placeholder="Enter Room Code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                />
                <button type="submit">Join / Create Room</button>
            </form>
        </div>
    );
}

export default RoomJoin;
