import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Safety check for DOM readiness
function initializeApp() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  // Clear any loading content
  rootElement.innerHTML = "";

  try {
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error("Failed to initialize React app:", error);
    // Fallback: Show basic error message
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; font-family: system-ui;">
        <div style="text-align: center;">
          <h2>Platform Loading...</h2>
          <p>Please refresh your browser (Ctrl+Shift+R)</p>
        </div>
      </div>
    `;
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
