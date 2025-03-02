
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Create root only once to prevent multiple renderings
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app in strict mode for development checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
