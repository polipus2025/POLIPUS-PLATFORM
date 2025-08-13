import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Simplified service worker registration without auto-reload
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      console.log('✅ Service Worker registered successfully', registration);
    } catch (error) {
      console.error('❌ Service worker registration failed:', error);
    }
  });
}

// Render the main React app
const rootElement = document.getElementById("root");
if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('✅ Polipus Platform rendered successfully');
  } catch (error) {
    console.error('❌ App render error:', error);
    // Simple fallback without endless reload
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 20px; font-family: system-ui; text-align: center;">
        <h1>🌿 Polipus Platform</h1>
        <div style="background: #ef4444; padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 600px;">
          <h2>Application Error</h2>
          <p>There was an issue loading the React app. Please refresh the page.</p>
          <button onclick="window.location.reload()" style="background: #059669; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Reload Page</button>
        </div>
      </div>
    `;
  }
}
