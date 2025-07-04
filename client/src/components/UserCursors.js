import React, { useState, useEffect } from "react";

const CURSOR_COLORS = [
    "#FF0000",
    "#0000FF",
    "#00FF00",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
];
let colorIndex = 0;

function UserCursors({ socket, roomId }) {
    const [cursors, setCursors] = useState({});
    const cursorColors = React.useRef({});

    useEffect(() => {
        let inactivityTimer;
        let isActive = true;
        const handleCursorMove = (data) => {
            if (!cursorColors.current[data.id]) {
                cursorColors.current[data.id] =
                    CURSOR_COLORS[colorIndex % CURSOR_COLORS.length];
                colorIndex++;
            }
            setCursors((prev) => ({
                ...prev,
                [data.id]: {
                    ...data,
                    color: cursorColors.current[data.id],
                    visible: true,
                },
            }));
        };
        const handleCursorInactive = (data) => {
            setCursors((prev) => ({
                ...prev,
                [data.id]: { ...prev[data.id], visible: false },
            }));
        };
        const handleUserLeft = ({ id }) => {
            setCursors((prev) => {
                const newCursors = { ...prev };
                delete newCursors[id];
                return newCursors;
            });
            delete cursorColors.current[id];
        };
        // Throttle on the client side too for sending our own position
        const handleMouseMove = (e) => {
            if (!isActive) {
                isActive = true;
                socket.emit("cursor-move", {
                    roomId,
                    x: e.clientX,
                    y: e.clientY,
                });
            }
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                isActive = false;
                socket.emit("cursor-inactive", { roomId });
            }, 5000);
            socket.emit("cursor-move", { roomId, x: e.clientX, y: e.clientY });
        };
        const throttledMove = (e) => {
            handleMouseMove(e);
        };
        window.addEventListener("mousemove", throttledMove);
        socket.on("cursor-move", handleCursorMove);
        socket.on("cursor-inactive", handleCursorInactive);
        socket.on("user-left", handleUserLeft);
        return () => {
            window.removeEventListener("mousemove", throttledMove);
            socket.off("cursor-move", handleCursorMove);
            socket.off("cursor-inactive", handleCursorInactive);
            socket.off("user-left", handleUserLeft);
            clearTimeout(inactivityTimer);
        };
    }, [socket, roomId]);

    return (
        <div className="cursors-container">
            {Object.values(cursors).map(
                (cursor) =>
                    cursor.visible !== false && (
                        <div
                            key={cursor.id}
                            className="user-cursor"
                            style={{
                                left: `${cursor.x}px`,
                                top: `${cursor.y}px`,
                                backgroundColor: cursor.color,
                            }}
                        />
                    )
            )}
        </div>
    );
}
export default UserCursors;
