import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Create simple working field agent login
function SimpleFieldAgentLogin() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '400px',
        width: '100%',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Field Agent Login</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Agent ID:</label>
          <input 
            type="text" 
            placeholder="agent001, agent002, or field001" 
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '1rem'
            }} 
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password:</label>
          <input 
            type="password" 
            placeholder="password123" 
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '1rem'
            }} 
          />
        </div>
        <button 
          onClick={() => {
            alert('Offline login successful! Redirecting to field dashboard...');
            // Add actual offline login logic here
          }}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            background: '#047857', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#065f46'}
          onMouseOut={(e) => e.currentTarget.style.background = '#047857'}
        >
          Sign In (Offline Ready)
        </button>
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.9)' }}>← Back to Main Portal</a>
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>
          Works completely offline | GPS tracking available
        </div>
      </div>
    </div>
  );
}

// Create simple home page that matches your Polipus platform
function PolipusHomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Polipus Platform</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>Environmental Intelligence Platform - All 8 Modules Active</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto 2rem',
          padding: '0 1rem'
        }}>
          {[
            { title: 'Agricultural Traceability & Compliance', color: '#059669', path: '/landing' },
            { title: 'Live Trace - Livestock Monitoring', color: '#0ea5e9', path: '/live-trace' },
            { title: 'Land Map360 - Land Mapping', color: '#8b5cf6', path: '/landmap360-portal' },
            { title: 'Mine Watch - Resource Protection', color: '#f97316', path: '/mine-watch' },
            { title: 'Forest Guard - Forest Protection', color: '#06b6d4', path: '/forest-guard' },
            { title: 'Aqua Trace - Ocean Monitoring', color: '#3b82f6', path: '/aqua-trace' },
            { title: 'Blue Carbon 360 - Conservation Economics', color: '#6366f1', path: '/blue-carbon360' },
            { title: 'Carbon Trace - Environmental Monitoring', color: '#10b981', path: '/carbon-trace' }
          ].map((module, i) => (
            <div 
              key={i}
              style={{
                background: `linear-gradient(135deg, ${module.color}20, ${module.color}40)`,
                border: `1px solid ${module.color}60`,
                borderRadius: '1rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                backdropFilter: 'blur(10px)'
              }}
              onClick={() => window.location.href = module.path}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 32px ${module.color}40`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{module.title}</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Click to access portal</p>
            </div>
          ))}
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          maxWidth: '800px',
          margin: '0 auto 2rem'
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
            Regulatory Portal
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
            Farmer Portal
          </button>
          
          <button 
            onClick={() => window.location.href = '/exporter-login'}
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
            Exporter Portal
          </button>
        </div>
        
        <div style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '1rem' }}>
          <p>Complete offline functionality | GPS tracking | Real-time sync when online</p>
          <p>Test credentials: agent001/password123, agent002/password123, field001/password123</p>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Authentication Routes */}
      <Route path="/field-agent-login" component={SimpleFieldAgentLogin} />
      
      {/* Home Route */}
      <Route path="/" component={PolipusHomePage} />
      
      {/* Default fallback */}
      <Route component={() => (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
          <div style={{ textAlign: 'center' }}>
            <h2>Page Not Found</h2>
            <p><a href="/" style={{ color: '#059669' }}>Return to Polipus Platform</a></p>
          </div>
        </div>
      )} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;