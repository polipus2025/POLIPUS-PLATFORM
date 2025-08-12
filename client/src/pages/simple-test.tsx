export default function SimpleTest() {
  console.log('✅ SimpleTest component loaded successfully');
  return (
    <div style={{ padding: '50px', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Arial, sans-serif', fontSize: '18px' }}>
      <h1 style={{ color: '#059669', marginBottom: '20px' }}>🎯 POLIPUS PLATFORM - LOADING TEST</h1>
      <p style={{ marginBottom: '15px' }}><strong>✅ SUCCESS: React is working correctly!</strong></p>
      <div style={{ marginBottom: '10px' }}><strong>Current URL:</strong> {window.location.pathname}</div>
      <div style={{ marginBottom: '10px' }}><strong>Time:</strong> {new Date().toLocaleString()}</div>
      <div style={{ marginBottom: '10px' }}><strong>User Agent:</strong> {navigator.userAgent.substring(0, 100)}...</div>
      <p style={{ padding: '15px', backgroundColor: '#f0f9ff', border: '2px solid #059669', borderRadius: '8px', marginTop: '20px' }}>
        <strong>🔧 DIAGNOSTIC:</strong> If you can see this message clearly, React is functioning properly and I can restore the full Polipus platform interface.
      </p>
    </div>
  );
}