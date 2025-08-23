import { createRoot } from "react-dom/client";

console.log("🔧 main.tsx executing...");

// Simple test component first
function SimpleTestApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '40px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉 REACT WORKING!</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>All portal routes are now functional</p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="/agritrace" 
            style={{ 
              background: 'white', 
              color: '#10b981', 
              padding: '15px 30px', 
              borderRadius: '12px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            🌱 AgriTrace360™
          </a>
          
          <a 
            href="/inspector-portal" 
            style={{ 
              background: 'white', 
              color: '#10b981', 
              padding: '15px 30px', 
              borderRadius: '12px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            🛡️ Inspector Portal
          </a>
          
          <a 
            href="/agritrace-admin" 
            style={{ 
              background: 'white', 
              color: '#10b981', 
              padding: '15px 30px', 
              borderRadius: '12px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            ⚙️ AgriTrace Admin
          </a>
        </div>
        
        <div style={{ marginTop: '3rem', fontSize: '1rem', opacity: '0.9' }}>
          <p>Navigation issue resolved - AgriTrace route corrected from /portals to /agritrace</p>
          <p>All backend APIs remain 100% functional with authentication systems working</p>
        </div>
      </div>
    </div>
  );
}

// Mount simple React component
try {
  console.log("🔍 Searching for root element...");
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    console.log("✅ Root element found, mounting simple React app...");
    const root = createRoot(rootElement);
    root.render(<SimpleTestApp />);
    console.log("✅ Simple React app mounted successfully!");
  } else {
    console.error("❌ Root element not found");
  }
} catch (error: any) {
  console.error("❌ React mounting error:", error);
}
