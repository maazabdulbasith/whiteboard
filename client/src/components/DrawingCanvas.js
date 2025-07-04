import React, { useEffect, useState, useRef } from "react";

function DrawingCanvas({ socket, roomId, color, strokeWidth, canvasRef }) {
    const [isDrawing, setIsDrawing] = useState(false);
    const contextRef = useRef(null);
    const otherDrawings = useRef({}); // To track other users' drawing states

    useEffect(() => {
        const canvas = canvasRef.current;
        // Adjust for device pixel ratio for sharper drawing
        const scale = window.devicePixelRatio;
        canvas.width = window.innerWidth * scale;
        canvas.height = window.innerHeight * scale;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        const context = canvas.getContext("2d");
        context.scale(scale, scale);
        context.lineCap = "round";
        context.lineJoin = "round";
        contextRef.current = context;
    }, [canvasRef]);

    // Loads thr initial drawing data
    useEffect(() => {
        socket.on("load-drawing", (commands) => {
            commands.forEach((cmd) => {
                if (cmd.type === "stroke") {
                    drawStroke(cmd.data);
                }
            });
        });

        return () => socket.off("load-drawing");
    }, [socket]);

    // Strokes drawing function
    const drawStroke = (data) => {
        const { path, color: strokeColor, width } = data;
        if (!path || path.length < 2) return;

        const ctx = contextRef.current;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        path.forEach((point) => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
    };

    // Real-time drawing listeners
    useEffect(() => {
        const handleDrawStart = ({ id, x, y, color, width }) => {
            otherDrawings.current[id] = { x, y, color, width };
        };

        const handleDrawMove = ({ id, x, y }) => {
            const userDrawing = otherDrawings.current[id];
            if (userDrawing) {
                const ctx = contextRef.current;
                ctx.strokeStyle = userDrawing.color;
                ctx.lineWidth = userDrawing.width;
                ctx.beginPath();
                ctx.moveTo(userDrawing.x, userDrawing.y);
                ctx.lineTo(x, y);
                ctx.stroke();
                userDrawing.x = x;
                userDrawing.y = y;
            }
        };

        const handleDrawEnd = ({ id }) => {
            delete otherDrawings.current[id];
        };

        const handleClear = () => {
            const canvas = canvasRef.current;
            contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
        };

        socket.on("draw-start", handleDrawStart);
        socket.on("draw-move", handleDrawMove);
        socket.on("draw-end", handleDrawEnd);
        socket.on("clear-canvas", handleClear);

        return () => {
            socket.off("draw-start", handleDrawStart);
            socket.off("draw-move", handleDrawMove);
            socket.off("draw-end", handleDrawEnd);
            socket.off("clear-canvas", handleClear);
        };
    }, [socket]);

    // Local drawing handlers
    const currentPath = useRef([]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        setIsDrawing(true);
        contextRef.current.strokeStyle = color;
        contextRef.current.lineWidth = strokeWidth;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        currentPath.current = [{ x: offsetX, y: offsetY }];
        socket.emit("draw-start", {
            roomId,
            x: offsetX,
            y: offsetY,
            color,
            width: strokeWidth,
        });
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        currentPath.current.push({ x: offsetX, y: offsetY });
        socket.emit("draw-move", { roomId, x: offsetX, y: offsetY });
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        contextRef.current.closePath();
        setIsDrawing(false);
        socket.emit("draw-end", {
            roomId,
            path: currentPath.current,
            color: color,
            width: strokeWidth,
        });
        currentPath.current = [];
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing} // Stop if mouse leaves canvas
            onTouchStart={(e) => startDrawing({ nativeEvent: e.touches[0] })}
            onTouchMove={(e) => draw({ nativeEvent: e.touches[0] })}
            onTouchEnd={stopDrawing}
        />
    );
}

export default DrawingCanvas;
