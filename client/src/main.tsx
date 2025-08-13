import { createRoot } from "react-dom/client";
import App from "./App-debug";
import "./index.css";

console.log('🚀 Main.tsx: Starting React mount process...');

const rootElement = document.getElementById("root");
console.log('🔍 Root element found:', !!rootElement);

if (rootElement) {
  console.log('✅ Creating React root...');
  const root = createRoot(rootElement);
  console.log('✅ React root created, rendering App...');
  root.render(<App />);
  console.log('✅ App render completed');
} else {
  console.error('❌ Root element not found!');
}
