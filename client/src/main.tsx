import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register enhanced service worker for comprehensive offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Unregister any existing service worker first
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
        console.log('🗑️ Unregistered old service worker');
      }
      
      // Register new enhanced service worker with cache busting
      const registration = await navigator.serviceWorker.register(`/sw.js?v=${Date.now()}`, {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('✅ Enhanced Service Worker registered successfully', registration);
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 New service worker available');
              // Don't auto-reload to prevent infinite loops - let user decide
            }
          });
        }
      });
      
      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'SYNC_FARMERS') {
          console.log('🔄 Service worker requested farmer sync');
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
