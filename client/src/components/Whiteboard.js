import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toolbar from "./Toolbar";
import DrawingCanvas from "./DrawingCanvas";
import UserCursors from "./UserCursors";

function Whiteboard({ socket }) {
    const { roomId } = useParams();
    const [color, setColor] = useState("#000000");
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [userCount, setUserCount] = useState(0);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Join the room on component mount
        socket.emit("join-room", { roomId });

        // Listen for user count updates
        socket.on("user-count-update", (count) => {
            setUserCount(count);
        });

        // Cleanup on component unmount
        return () => {
            socket.off("user-count-update");
            // Note: Leaving room is handled by server on 'disconnect'
        };
    }, [roomId, socket]);

    const handleClearCanvas = () => {
        if (window.confirm("Are you sure you want to clear the canvas?")) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            socket.emit("clear-canvas", { roomId });
        }
    };

    const handleLeaveRoom = () => {
        socket.emit("leave-room", { roomId });
        navigate("/");
    };

    return (
        <div className="whiteboard-container">
            <div className="header">
                <h2>Room: {roomId}</h2>
                <div className="user-info">
                    <span className="user-count">
                        Active Users: {userCount}
                    </span>
                    <span className="connection-status connected">
                        ● Connected
                    </span>
                    <button
                        className="leave-room-btn"
                        onClick={handleLeaveRoom}
                    >
                        Leave Room
                    </button>
                </div>
            </div>
            <Toolbar
                color={color}
                setColor={setColor}
                strokeWidth={strokeWidth}
                setStrokeWidth={setStrokeWidth}
                handleClearCanvas={handleClearCanvas}
            />
            <UserCursors socket={socket} roomId={roomId} />
            <DrawingCanvas
                socket={socket}
                roomId={roomId}
                color={color}
                strokeWidth={strokeWidth}
                canvasRef={canvasRef}
            />
        </div>
    );
}

export default Whiteboard;
