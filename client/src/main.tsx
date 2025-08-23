import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Ensure DOM is ready and mount React app
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
});

// Fallback - try immediate mount if DOM already loaded
if (document.readyState === 'loading') {
  // DOM not ready, wait for DOMContentLoaded
} else {
  // DOM is ready, mount immediately
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
}
