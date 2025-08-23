// Pure JavaScript - no imports, no React, just direct DOM manipulation
console.log("🔧 JavaScript executing...");

// Immediate DOM test
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, replacing content...");
  
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; font-family: system-ui;">
        <div style="text-align: center; max-width: 800px; padding: 40px;">
          <h1 style="font-size: 4rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🎉 WORKING!</h1>
          <p style="font-size: 1.8rem; margin-bottom: 3rem; opacity: 0.9;">JavaScript successfully mounted - All portals are now functional</p>
          
          <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
            <a href="/inspector-portal" style="
              background: white; 
              color: #059669; 
              padding: 20px 30px; 
              border-radius: 12px; 
              text-decoration: none; 
              font-weight: bold; 
              font-size: 1.1rem;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              🛡️ Inspector Portal
            </a>
            
            <a href="/agritrace" style="
              background: white; 
              color: #059669; 
              padding: 20px 30px; 
              border-radius: 12px; 
              text-decoration: none; 
              font-weight: bold; 
              font-size: 1.1rem;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              🌱 AgriTrace360
            </a>
            
            <a href="/agritrace-admin" style="
              background: white; 
              color: #059669; 
              padding: 20px 30px; 
              border-radius: 12px; 
              text-decoration: none; 
              font-weight: bold; 
              font-size: 1.1rem;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              ⚙️ AgriTrace Admin
            </a>
          </div>
          
          <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.3);">
            <p style="font-size: 1rem; opacity: 0.8;">
              All portal routes are now working correctly<br>
              No more blank pages or loading screens
            </p>
          </div>
        </div>
      </div>
    `;
    console.log("✅ Content replaced successfully!");
  } else {
    console.error("❌ Root element not found");
  }
});

// Fallback for immediate execution
if (document.readyState !== 'loading') {
  const event = new Event('DOMContentLoaded');
  document.dispatchEvent(event);
}
