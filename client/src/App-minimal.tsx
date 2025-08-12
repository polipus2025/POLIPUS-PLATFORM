// Minimal App component for debugging
export default function App() {
  console.log('🚀 Minimal App component loaded');
  
  return (
    <div style={{ 
      padding: '50px', 
      backgroundColor: '#ffffff', 
      color: '#000000', 
      fontFamily: 'Arial, sans-serif', 
      fontSize: '18px',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#059669', marginBottom: '30px' }}>🎯 POLIPUS PLATFORM - MINIMAL TEST</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>✅ SUCCESS:</strong> React is now loading correctly!
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>URL:</strong> {window.location.pathname}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Time:</strong> {new Date().toLocaleString()}
      </div>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f0f9ff', 
        border: '2px solid #059669', 
        borderRadius: '8px', 
        marginTop: '30px' 
      }}>
        <strong>🔧 STATUS:</strong> This is a minimal React app without complex dependencies. 
        If you see this clearly, React is working and I can restore the full platform step by step.
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={() => alert('Button works!')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#059669', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}