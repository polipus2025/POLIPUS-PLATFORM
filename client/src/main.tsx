import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Enhanced service worker registration (simplified)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.log('✅ Enhanced Service Worker registered successfully', registration);
      
      // Check for pending farmers to sync
      const pendingFarmers = localStorage.getItem('offlineFarmers');
      if (!pendingFarmers || JSON.parse(pendingFarmers).length === 0) {
        console.log('📝 No pending farmers to sync');
      }
    } catch (error) {
      console.error('❌ Service worker registration failed:', error);
    }
  });
}

// Mount the app
const rootElement = document.getElementById("root");
if (rootElement) {
  // Clear any existing content to avoid conflicts
  rootElement.innerHTML = '';
  createRoot(rootElement).render(<App />);
} else {
  console.error('Root element not found!');
}
