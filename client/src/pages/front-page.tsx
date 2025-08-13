export default function FrontPageBasic() {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '2rem'
        }}>
          🌟 Polipus Environmental Intelligence Platform
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          color: '#64748b',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }}>
          Comprehensive 8-module environmental monitoring system for agricultural traceability, 
          land mapping, livestock monitoring, forest protection, and carbon management.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '2rem'
        }}>
          {[
            { title: 'Agricultural Traceability & Compliance', desc: 'Complete agricultural commodity tracking & LACRA compliance system', color: '#10b981' },
            { title: 'Live Trace', desc: 'Livestock movement monitoring and control system', color: '#3b82f6' },
            { title: 'Land Map360', desc: 'Land mapping and dispute prevention services', color: '#8b5cf6' },
            { title: 'Mine Watch', desc: 'Mineral resource protection and community safeguarding', color: '#f59e0b' },
            { title: 'Forest Guard', desc: 'Forest protection and carbon credit management', color: '#14b8a6' },
            { title: 'Aqua Trace', desc: 'Ocean ecosystem monitoring and protection', color: '#06b6d4' },
            { title: 'Blue Carbon 360', desc: 'Marine conservation economics and carbon marketplace', color: '#3b82f6' },
            { title: 'Carbon Trace', desc: 'Environmental monitoring and carbon footprint tracking', color: '#22c55e' }
          ].map((module, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: module.color,
                borderRadius: '12px',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🔧
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                {module.title}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                lineHeight: '1.5',
                marginBottom: '16px'
              }}>
                {module.desc}
              </p>
              <button style={{
                width: '100%',
                padding: '8px 16px',
                background: module.color,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Access Portal
              </button>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '3rem',
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          display: 'inline-block',
          border: '1px solid #e2e8f0'
        }}>
          All 8 Modules Active • Real-time Environmental Monitoring
        </div>
      </div>
    </div>
  );
}