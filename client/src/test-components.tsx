// Simple test components to verify routing works
export function TestHome() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Polipus Platform - Test Mode</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
        <a href="/field-agent-login" style={{ 
          background: '#059669', 
          color: 'white', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          textDecoration: 'none',
          display: 'block',
          fontWeight: 'bold'
        }}>
          Field Agent Login
        </a>
        <a href="/landing" style={{ 
          background: '#1e40af', 
          color: 'white', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          textDecoration: 'none',
          display: 'block',
          fontWeight: 'bold'
        }}>
          Landing Page
        </a>
        <a href="/regulatory-login" style={{ 
          background: '#7c2d12', 
          color: 'white', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          textDecoration: 'none',
          display: 'block',
          fontWeight: 'bold'
        }}>
          Regulatory Login
        </a>
        <a href="/gps-test" style={{ 
          background: '#be185d', 
          color: 'white', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          textDecoration: 'none',
          display: 'block',
          fontWeight: 'bold'
        }}>
          GPS Test
        </a>
      </div>
      <div style={{ marginTop: '2rem', fontSize: '0.875rem', opacity: 0.7 }}>
        Test credentials: agent001/password123, agent002/password123, field001/password123
      </div>
    </div>
  );
}

export function TestFieldLogin() {
  return (
    <div style={{ minHeight: '100vh', background: '#166534', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>Field Agent Login - Test</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Agent ID:</label>
          <input 
            type="text" 
            placeholder="agent001" 
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '0.25rem', 
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white'
            }} 
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input 
            type="password" 
            placeholder="password123" 
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '0.25rem', 
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white'
            }} 
          />
        </div>
        <button style={{ 
          width: '100%', 
          padding: '0.75rem', 
          background: '#059669', 
          color: 'white', 
          border: 'none', 
          borderRadius: '0.25rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Login (Test Mode)
        </button>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}