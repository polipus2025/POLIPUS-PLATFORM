import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
