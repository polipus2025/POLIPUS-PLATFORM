import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Service worker temporarily disabled during debugging

console.log('🚀 Main.tsx executing, mounting React app...');

const root = document.getElementById("root");
if (!root) {
  console.error('❌ Root element not found!');
} else {
  console.log('✅ Root element found, creating React root...');
  try {
    const reactRoot = createRoot(root);
    console.log('✅ React root created, rendering App...');
    reactRoot.render(<App />);
    console.log('✅ App render call completed');
  } catch (error) {
    console.error('❌ Error during React mounting:', error);
  }
}
