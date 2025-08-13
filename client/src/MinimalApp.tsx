// Absolute minimal app to test React mounting
export default function MinimalApp() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Polipus Platform</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Environmental Intelligence Platform - React Mounted Successfully!</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button 
            onClick={() => window.location.href = '/field-agent-login'}
            style={{
              background: '#059669',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#047857'}
            onMouseOut={(e) => e.currentTarget.style.background = '#059669'}
          >
            Field Agent Login
          </button>
          
          <button 
            onClick={() => window.location.href = '/regulatory-login'}
            style={{
              background: '#1e40af',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.background = '#1e40af'}
          >
            Regulatory Login
          </button>
          
          <button 
            onClick={() => window.location.href = '/farmer-login'}
            style={{
              background: '#d97706',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#b45309'}
            onMouseOut={(e) => e.currentTarget.style.background = '#d97706'}
          >
            Farmer Login
          </button>
          
          <button 
            onClick={() => window.location.href = '/landing'}
            style={{
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#6d28d9'}
            onMouseOut={(e) => e.currentTarget.style.background = '#7c3aed'}
          >
            Main Portal
          </button>
        </div>
        
        <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
          <p>All 8 Polipus modules: AgriTrace360, Live Trace, Land Map360, Mine Watch, Forest Guard, Aqua Trace, Blue Carbon 360, Carbon Trace</p>
          <p>Test credentials: agent001/password123, agent002/password123, field001/password123</p>
        </div>
      </div>
    </div>
  );
}