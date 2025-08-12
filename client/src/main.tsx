import { createRoot } from "react-dom/client";
import App from "./App-debug";
import "./index.css";

// Service worker disabled during debugging
console.log('🔧 Service worker disabled for debugging');

createRoot(document.getElementById("root")!).render(<App />);
