import { createRoot } from "react-dom/client";
import SimpleApp from "./SimpleApp";
import "./index.css";

// Simple version to test if React is working
createRoot(document.getElementById("root")!).render(<SimpleApp />);
