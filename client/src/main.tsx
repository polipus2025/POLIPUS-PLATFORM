import { createRoot } from "react-dom/client";
import App from "./App-minimal";
import "./index.css";

// Ensure DOM is fully loaded
function initializeApp() {
  console.log("Initializing React app...");
  
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    document.body.innerHTML = '<div style="padding: 20px; color: red;">ERROR: Root element not found</div>';
    return;
  }

  // Clear loading content and add fallback
  rootElement.innerHTML = '<div style="padding: 20px; text-align: center; font-family: system-ui;">Loading Polipus Platform...</div>';

  // Give a moment for the DOM to settle
  setTimeout(() => {
    try {
      const root = createRoot(rootElement);
      root.render(<App />);
      console.log("✅ React app mounted successfully");
    } catch (error) {
      console.error("❌ Failed to mount React app:", error);
      rootElement.innerHTML = `
        <div style="padding: 20px; background: #fee2e2; color: #991b1b; font-family: system-ui; border-radius: 8px; margin: 20px;">
          <h2>Application Mount Error</h2>
          <p>The React application failed to initialize. This could be due to:</p>
          <ul>
            <li>CSS compilation issues</li>
            <li>Import/dependency problems</li>
            <li>JavaScript runtime errors</li>
          </ul>
          <details style="margin-top: 12px;">
            <summary style="cursor: pointer; font-weight: bold;">Technical Details</summary>
            <pre style="background: #f3f4f6; padding: 12px; border-radius: 4px; overflow: auto; font-size: 12px;">${error}</pre>
          </details>
          <button onclick="location.reload()" style="margin-top: 12px; padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Reload Page
          </button>
        </div>
      `;
    }
  }, 100);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Register service worker for offline functionality (non-blocking)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  });
}
