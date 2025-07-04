import React from "react";

function Toolbar({
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
    handleClearCanvas,
}) {
    return (
        <div className="toolbar">
            <label>
                Color:
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
            </label>
            <label>
                Stroke Width:
                <input
                    type="range"
                    min="1"
                    max="30"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                />
                <span>{strokeWidth}px</span>
            </label>
            <button className="clear-btn" onClick={handleClearCanvas}>
                Clear Canvas
            </button>
        </div>
    );
}

export default Toolbar;
