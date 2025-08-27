import React from "react";
import { createRoot } from "react-dom/client";
import SimpleTestApp from "./SimpleTestApp";
import "./index.css";

createRoot(document.getElementById("root")!).render(<SimpleTestApp />);
