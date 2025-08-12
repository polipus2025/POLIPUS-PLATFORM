import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Simplified service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {
    console.log('Service worker registration failed');
  });
}

console.log('🚀 Main.tsx: Starting React app...');
const root = document.getElementById("root");
if (root) {
  console.log('✅ Root element found, rendering App...');
  createRoot(root).render(<App />);
} else {
  console.error('❌ Root element not found!');
}
