import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoomJoin from "./components/RoomJoin";
import Whiteboard from "./components/Whiteboard";
import { io } from "socket.io-client";
import "./App.css";

// Establish socket connection
const socket = io("http://localhost:5000"); // Your server URL

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<RoomJoin />} />
                    <Route
                        path="/:roomId"
                        element={<Whiteboard socket={socket} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
