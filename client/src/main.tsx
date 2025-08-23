import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Mount React App now that we know JavaScript executes properly
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
