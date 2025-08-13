function ImmediateFix() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
      padding: '20px',
      fontFamily: 'system-ui, Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#1e293b',
            margin: '0 0 20px 0'
          }}>POLIPUS®</h1>
          <h2 style={{
            fontSize: '24px',
            color: '#475569',
            margin: '0 0 30px 0'
          }}>General Environmental Intelligence Platform</h2>
          <a href="/portals" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #2563eb, #16a34a)',
            color: 'white',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 'bold'
          }}>🚪 Login Portals</a>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>1/8</div>
            <div style={{ color: '#64748b' }}>Active Modules</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>EUDR 100%</div>
            <div style={{ color: '#64748b' }}>Compliance</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>7</div>
            <div style={{ color: '#64748b' }}>In Development</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>Global</div>
            <div style={{ color: '#64748b' }}>Coverage</div>
          </div>
        </div>

        {/* Modules */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '20px'
          }}>Platform Modules</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {[
              { name: 'Agricultural Traceability', link: '/portals', status: 'ACTIVE', color: '#16a34a' },
              { name: 'Live Trace', link: '/live-trace', status: 'Coming Soon', color: '#3b82f6' },
              { name: 'Land Map360', link: '/landmap360-portal', status: 'Coming Soon', color: '#8b5cf6' },
              { name: 'Mine Watch', link: '/mine-watch', status: 'Coming Soon', color: '#f59e0b' },
              { name: 'Forest Guard', link: '/forest-guard', status: 'Coming Soon', color: '#059669' },
              { name: 'Aqua Trace', link: '/aqua-trace', status: 'Coming Soon', color: '#0891b2' },
              { name: 'Blue Carbon 360', link: '/blue-carbon360', status: 'Coming Soon', color: '#06b6d4' },
              { name: 'Carbon Trace', link: '/carbon-trace', status: 'Coming Soon', color: '#10b981' }
            ].map((module, i) => (
              <div key={i} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: module.color,
                  margin: '0 auto 15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {i + 1}
                </div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: '0 0 10px 0'
                }}>{module.name}</h4>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  background: module.status === 'ACTIVE' ? '#dcfce7' : '#fef3c7',
                  color: module.status === 'ACTIVE' ? '#166534' : '#92400e',
                  marginBottom: '15px'
                }}>
                  {module.status}
                </div>
                <br />
                <a href={module.link} style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #2563eb, #16a34a)',
                  color: 'white',
                  padding: '8px 16px',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>Enter Platform →</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImmediateFix;