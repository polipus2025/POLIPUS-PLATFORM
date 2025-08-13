import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => 
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
          <h1>🌟 Polipus Environmental Intelligence Platform</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
            <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '30px', borderRadius: '12px' }}>
              <h2>Agricultural Traceability & Compliance</h2>
              <p>Complete agricultural commodity tracking & LACRA compliance system</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', padding: '30px', borderRadius: '12px' }}>
              <h2>Live Trace</h2>
              <p>Livestock movement monitoring and control system</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white', padding: '30px', borderRadius: '12px' }}>
              <h2>Land Map360</h2>
              <p>Land mapping and dispute prevention services</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', padding: '30px', borderRadius: '12px' }}>
              <h2>Mine Watch</h2>
              <p>Mineral resource protection and community safeguarding</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)', color: 'white', padding: '30px', borderRadius: '12px' }}>
              <h2>Forest Guard</h2>
              <p>Forest protection and carbon credit management</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: 'white', padding: '30px', borderRadius: '12px' }}>
              <h2>Aqua Trace</h2>
              <p>Ocean ecosystem monitoring and protection</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', padding: '30px', borderRadius: '12px' }}>
              <h2>Blue Carbon 360</h2>
              <p>Marine conservation economics and carbon marketplace</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', padding: '30px', borderRadius: '12px' }}>
              <h2>Carbon Trace</h2>
              <p>Environmental monitoring and carbon footprint tracking</p>
            </div>
          </div>
        </div>
      } />
    </Switch>
  );
}

function App() {
  console.log('🔍 Step 1 App rendering with basic components...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Router />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;