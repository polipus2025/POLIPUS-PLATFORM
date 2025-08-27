import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Force cache clear
console.log("Platform starting:", new Date().toISOString());

createRoot(document.getElementById("root")!).render(<App />);
