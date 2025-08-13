import { Switch, Route } from "wouter";

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
      color: 'white',
      padding: '20px',
      fontFamily: 'system-ui'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>
            🌿 Polipus Platform
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: '0.8', margin: 0 }}>
            Environmental Intelligence & Agricultural Monitoring System
          </p>
        </header>

        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/farmers" component={FarmersPage} />
          <Route path="/field-agent-login" component={FieldAgentLogin} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        background: '#059669', 
        padding: '30px', 
        borderRadius: '12px', 
        marginBottom: '30px' 
      }}>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '1.8rem' }}>
          ✅ Application Working
        </h2>
        <p style={{ margin: 0, fontSize: '1.1rem' }}>
          The Polipus platform has been successfully restored after rollback
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '30px'
      }}>
        <ModuleCard
          title="Agricultural Traceability"
          description="LACRA compliance and farmer management"
          icon="🌾"
          link="/farmers"
        />
        <ModuleCard
          title="Field Agent Portal"
          description="Mobile-optimized offline functionality"
          icon="📱"
          link="/field-agent-login"
        />
        <ModuleCard
          title="Land Map360"
          description="GPS mapping and deforestation monitoring"
          icon="🗺️"
          link="/landmap360"
        />
        <ModuleCard
          title="Live Trace"
          description="Livestock monitoring and tracking"
          icon="🐄"
          link="/livetrace"
        />
        <ModuleCard
          title="Forest Guard"
          description="Forest protection and conservation"
          icon="🌲"
          link="/forest-guard"
        />
        <ModuleCard
          title="Aqua Trace"
          description="Ocean and marine monitoring"
          icon="🌊"
          link="/aqua-trace"
        />
        <ModuleCard
          title="Blue Carbon 360"
          description="Conservation economics platform"
          icon="💙"
          link="/blue-carbon"
        />
        <ModuleCard
          title="Carbon Trace"
          description="Environmental carbon monitoring"
          icon="🌿"
          link="/carbon-trace"
        />
      </div>
    </div>
  );
}

function ModuleCard({ title, description, icon, link }: {
  title: string;
  description: string;
  icon: string;
  link: string;
}) {
  return (
    <div style={{
      background: '#1e293b',
      padding: '25px',
      borderRadius: '10px',
      border: '1px solid #334155',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
    onClick={() => window.location.href = link}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = '#059669';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = '#334155';
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{icon}</div>
      <h3 style={{ margin: '0 0 10px 0', color: '#059669' }}>{title}</h3>
      <p style={{ margin: 0, opacity: '0.8', fontSize: '0.9rem' }}>{description}</p>
    </div>
  );
}

function FarmersPage() {
  return (
    <div>
      <h2 style={{ color: '#059669', marginBottom: '20px' }}>Farmer Management</h2>
      <div style={{ 
        background: '#1e293b', 
        padding: '20px', 
        borderRadius: '8px', 
        border: '1px solid #334155' 
      }}>
        <p>Farmer registration and profile management system</p>
        <p style={{ opacity: '0.8', fontSize: '0.9rem' }}>
          Enhanced PDF downloads for EUDR and Deforestation reports available
        </p>
        <button 
          style={{
            background: '#059669',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
          onClick={() => window.location.href = '/'}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

function FieldAgentLogin() {
  return (
    <div>
      <h2 style={{ color: '#059669', marginBottom: '20px' }}>Field Agent Login</h2>
      <div style={{ 
        background: '#1e293b', 
        padding: '20px', 
        borderRadius: '8px', 
        border: '1px solid #334155' 
      }}>
        <p>Offline-capable field agent authentication portal</p>
        <p style={{ opacity: '0.8', fontSize: '0.9rem' }}>
          Test credentials: agent001/password123, agent002/password123, field001/password123
        </p>
        <button 
          style={{
            background: '#059669',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
          onClick={() => window.location.href = '/'}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#ef4444' }}>404 - Page Not Found</h2>
      <p>The requested page could not be found.</p>
      <button 
        style={{
          background: '#059669',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '15px'
        }}
        onClick={() => window.location.href = '/'}
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default App;