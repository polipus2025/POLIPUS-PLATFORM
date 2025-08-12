import React from 'react';

console.log('🔍 App-simple.tsx loaded');

function SimpleApp() {
  console.log('🔍 SimpleApp rendering');
  
  React.useEffect(() => {
    console.log('✅ SimpleApp mounted successfully');
  }, []);
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ color: '#059669', marginBottom: '20px' }}>🌍 POLIPUS Platform - Diagnostic Mode</h1>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <p><strong>React Status:</strong> Successfully mounted and rendering</p>
        <p><strong>Current URL:</strong> {window.location.href}</p>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#dcfce7', border: '1px solid #059669', borderRadius: '6px' }}>
          <p><strong>✅ SUCCESS:</strong> React is working correctly. Ready to restore full platform.</p>
        </div>
        
        <button 
          onClick={() => {
            console.log('🔄 Reloading page...');
            window.location.reload();
          }}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export default SimpleApp;