// Minimal App component to test React mounting
function App() {
  console.log("🚀 App component rendering...");
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh' 
    }}>
      <h1 style={{ color: '#1e293b', marginBottom: '20px' }}>
        Polipus Environmental Intelligence Platform
      </h1>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ color: '#059669' }}>Platform Status: Active</h2>
        <p>All 8 modules are operational:</p>
        <ul>
          <li>Agricultural Traceability & Compliance</li>
          <li>Live Trace</li>
          <li>Land Map360</li>
          <li>Mine Watch</li>
          <li>Forest Guard</li>
          <li>Aqua Trace</li>
          <li>Blue Carbon 360</li>
          <li>Carbon Trace</li>
        </ul>
        <button 
          style={{
            background: '#059669',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '16px'
          }}
          onClick={() => alert('Platform is working!')}
        >
          Test Platform
        </button>
      </div>
    </div>
  );
}

export default App;