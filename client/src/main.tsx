import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register Service Worker for offline support only - no auto-reload
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      console.log('Registering minimal service worker for offline support');
      
      // Register service worker without any reload logic
      await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('Service worker registered successfully');
      
    } catch (error) {
      console.log('Service worker registration failed:', error);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
