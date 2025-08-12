import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for offline functionality - fixed version
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Clear any existing service workers first
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
      
      // Register the service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('✅ Enhanced Service Worker registered successfully', registration);
      
      // Listen for service worker messages for sync
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'SYNC_FARMERS') {
          if ((window as any).syncOfflineFarmers) {
            (window as any).syncOfflineFarmers();
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Service worker registration failed:', error);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
