import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Polipus PWA: Service Worker registered successfully:', registration.scope);
        
        // Force update service worker immediately
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('Polipus PWA: New content is available; please refresh.');
                  // Auto-update for better offline experience
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                } else {
                  console.log('Polipus PWA: Content is cached for offline use.');
                }
              }
            });
          }
        });
        
        // Listen for controlling service worker changes
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          window.location.reload();
          refreshing = true;
        });
      })
      .catch((error) => {
        console.log('Polipus PWA: Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
