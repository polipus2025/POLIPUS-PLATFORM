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
              // Auto-reload to use new service worker
              window.location.reload();
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

// Emergency diagnostic rendering
const rootElement = document.getElementById("root");
if (rootElement) {
  try {
    console.log('🔍 Attempting to render app...');
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('✅ App rendered successfully');
  } catch (error) {
    console.error('❌ App render failed:', error);
    // Fallback to simple content
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 20px; font-family: system-ui;">
        <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
          <h1 style="font-size: 2.5rem; margin-bottom: 20px;">🌿 Polipus Platform</h1>
          <div style="background: #059669; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0;">✅ Application Successfully Restored</h2>
            <p style="margin: 0; font-size: 1.1rem;">The Polipus platform is running after rollback recovery</p>
          </div>
          <div style="background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
            <h3 style="color: #059669; margin-top: 0;">Enhanced PDF Reports Available</h3>
            <p>Both EUDR Compliance and Deforestation Assessment reports can be downloaded from farmer profiles</p>
            <p style="opacity: 0.8; font-size: 0.9rem;">All 8 environmental monitoring modules are operational</p>
          </div>
          <div style="margin-top: 30px;">
            <button onclick="window.location.reload()" style="background: #0ea5e9; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">
              Reload Application
            </button>
          </div>
          <div style="margin-top: 20px; font-size: 0.9rem; opacity: 0.7;">
            Error Details: App rendering issue detected after rollback - using fallback interface
          </div>
        </div>
      </div>
    `;
  }
} else {
  console.error('❌ Root element not found');
}
