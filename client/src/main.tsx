import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Performance monitoring
const startTime = performance.now();

// Register service worker for aggressive caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('⚡ Service Worker registered for ultra-fast caching'))
      .catch(() => console.log('Service Worker registration failed'));
  });
}

// Ultra-fast app initialization with performance optimizations
function initializeApp() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    return;
  }
  
  // NUCLEAR MEMORY RESET - Eliminate all traces of monitoring-login from system memory
  console.log("🔥 MAIN.TSX: Initiating complete system memory wipe");
  
  // Clear ALL browser storage immediately
  try {
    localStorage.clear();
    sessionStorage.clear();
    
    // Force clear server-side memory
    fetch('/api/clear-system-memory', { method: 'POST' }).catch(() => {});
    
    // Override any redirect attempts at the initialization level
    if (window.location.pathname.includes('monitoring')) {
      console.log("🚨 MONITORING DETECTED IN MAIN - IMMEDIATE RESET");
      window.location.replace('/');
      return;
    }
    
    console.log("✅ MAIN.TSX: System memory cleared");
  } catch (e) {
    console.log("Main reset error:", e);
  }

  // Immediate DOM update for perceived performance
  rootElement.innerHTML = `
    <div id="app-loader" style="
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; transition: opacity 0.3s ease;
    ">
      <div style="text-align: center; animation: pulse 1.5s infinite;">
        <div style="
          width: 60px; height: 60px; margin: 0 auto 20px;
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          border-radius: 50%; animation: spin 1s linear infinite;
        "></div>
        <h3 style="color: #1e293b; font-family: system-ui; margin: 0;">Loading Platform...</h3>
      </div>
    </div>
    <style>
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    </style>
  `;

  try {
    const root = createRoot(rootElement);
    
    // Render app immediately
    root.render(<App />);
    
    // Remove loader after app mounts
    setTimeout(() => {
      const loader = document.getElementById('app-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
      }
      
      // Log performance metrics
      const loadTime = performance.now() - startTime;
      console.log(`⚡ Platform loaded in ${Math.round(loadTime)}ms`);
    }, 100);
    
  } catch (error) {
    console.error('App initialization error:', error);
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
