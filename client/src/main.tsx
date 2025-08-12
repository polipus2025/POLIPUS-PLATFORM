import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Temporarily disable service worker to fix loading issue
console.log('🔧 Service worker registration temporarily disabled for debugging');

createRoot(document.getElementById("root")!).render(<App />);
