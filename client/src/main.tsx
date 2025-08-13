import { createRoot } from "react-dom/client";
import SimpleApp from "./SimpleApp";
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

// Mount the app with error handling
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    console.log('✅ Root element found, mounting React app...');
    // Clear any existing content to avoid conflicts
    rootElement.innerHTML = '';
    const root = createRoot(rootElement);
    root.render(<SimpleApp />);
    console.log('✅ React app mounted successfully');
  } else {
    console.error('❌ Root element not found!');
    // Create root element if missing
    const body = document.body;
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    body.appendChild(newRoot);
    const root = createRoot(newRoot);
    root.render(<SimpleApp />);
    console.log('✅ Created new root and mounted React app');
  }
} catch (error) {
  console.error('❌ Failed to mount React app:', error);
  // Fallback: show basic content in HTML
  const rootElement = document.getElementById("root") || document.body;
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; display: flex; align-items: center; justify-content: center; font-family: system-ui;">
      <div style="text-align: center;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">Polipus Platform</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">React mount failed - using fallback interface</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <a href="/field-agent-login" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold;">Field Agent Login</a>
          <a href="/landing" style="background: #1e40af; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold;">Main Portal</a>
        </div>
      </div>
    </div>
  `;
}
