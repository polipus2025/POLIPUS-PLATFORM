import { createRoot } from "react-dom/client";
import App from "./App-minimal";
// import "./index.css"; // Temporarily disabled to test if CSS is causing issues

// Temporarily disable service worker to fix loading issue
console.log('🔧 Service worker registration temporarily disabled for debugging');

createRoot(document.getElementById("root")!).render(<App />);
