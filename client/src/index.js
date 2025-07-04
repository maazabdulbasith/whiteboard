import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// 1. Find the element with the ID 'root' in public/index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// 2. Render your main App component into that element
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
