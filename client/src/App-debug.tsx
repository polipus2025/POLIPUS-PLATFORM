// Debug App to isolate rendering issue
console.log('🔍 App-debug.tsx loaded');

function DebugApp() {
  console.log('🔍 DebugApp component rendering');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#ffffff', 
      color: '#000000',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#059669' }}>🔧 POLIPUS DEBUG MODE</h1>
      <p><strong>SUCCESS:</strong> React is mounting correctly!</p>
      <p><strong>Current URL:</strong> {window.location.pathname}</p>
      <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f0f9ff', 
        border: '2px solid #059669',
        borderRadius: '8px'
      }}>
        <p><strong>🎯 DIAGNOSIS:</strong> If you see this clearly, React is working. I can now restore the full platform step by step.</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export default DebugApp;