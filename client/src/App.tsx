import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";

// DIRECT IMPORT - Essential pages
import FrontPage from "@/pages/front-page";
import Landing from "@/pages/landing";
import FarmerDashboard from "@/pages/farmer-dashboard";
import BuyerDashboard from "@/pages/agricultural-buyer-dashboard";
import FarmerLogin from "@/pages/auth/farmer-login";
import FarmerLoginPortal from "@/pages/farmer-login-portal";

// Inspector Portal imports - FULL FUNCTIONALITY RESTORED
import InspectorPortal from "@/pages/inspector-portal";
import LandInspectorLogin from "@/pages/auth/land-inspector-login";
import WarehouseInspectorLogin from "@/pages/auth/warehouse-inspector-login";
import PortInspectorLogin from "@/pages/auth/port-inspector-login";
import UnifiedLandInspectorDashboard from "@/pages/unified-land-inspector-dashboard";
import PortInspectorDashboard from "@/pages/port-inspector-dashboard";
import WarehouseInspectorDashboard from "@/pages/warehouse-inspector-dashboard";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Switch>
            {/* WILDCARD INSPECTOR PORTAL ROUTING */}
            <Route path="/:path*">
              {(params) => {
                if (params.path === 'inspector-portal') {
                  return (
                    <div style={{ 
                      minHeight: '100vh', 
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '16px'
                    }}>
                      <div style={{ maxWidth: '1200px', width: '100%' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                            🚀 Inspector Portal - FULLY OPERATIONAL!
                          </h1>
                          <p style={{ fontSize: '18px', color: '#6b7280' }}>
                            Choose your inspector type below
                          </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                          <div style={{ background: 'white', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>🌱 Land Inspector</h3>
                            <a href="/land-inspector-login" style={{ 
                              display: 'inline-block', 
                              background: '#059669', 
                              color: 'white', 
                              padding: '12px 24px', 
                              borderRadius: '8px', 
                              textDecoration: 'none',
                              fontWeight: '600'
                            }}>
                              Access Land Portal
                            </a>
                          </div>
                          <div style={{ background: 'white', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>🏢 Warehouse Inspector</h3>
                            <a href="/warehouse-inspector-login" style={{ 
                              display: 'inline-block', 
                              background: '#7c3aed', 
                              color: 'white', 
                              padding: '12px 24px', 
                              borderRadius: '8px', 
                              textDecoration: 'none',
                              fontWeight: '600'
                            }}>
                              Access Warehouse Portal
                            </a>
                          </div>
                          <div style={{ background: 'white', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>🚢 Port Inspector</h3>
                            <a href="/port-inspector-login" style={{ 
                              display: 'inline-block', 
                              background: '#2563eb', 
                              color: 'white', 
                              padding: '12px 24px', 
                              borderRadius: '8px', 
                              textDecoration: 'none',
                              fontWeight: '600'
                            }}>
                              Access Port Portal
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                if (params.path === 'land-inspector-login') {
                  return <LandInspectorLogin />;
                }
                if (params.path === 'warehouse-inspector-login') {
                  return <WarehouseInspectorLogin />;
                }
                if (params.path === 'port-inspector-login') {
                  return <PortInspectorLogin />;
                }
                if (params.path === 'warehouse-inspector-dashboard') {
                  return <WarehouseInspectorDashboard />;
                }
                if (params.path === 'unified-land-inspector-dashboard') {
                  return <UnifiedLandInspectorDashboard />;
                }
                if (params.path === 'port-inspector-dashboard') {
                  return <PortInspectorDashboard />;
                }
                if (params.path === 'portals') {
                  return <Landing />;
                }
                if (params.path === 'farmer-login') {
                  return <FarmerLogin />;
                }
                if (params.path === 'farmer-login-portal') {
                  return <FarmerLoginPortal />;
                }
                if (params.path === 'farmer-dashboard') {
                  return <FarmerDashboard />;
                }
                if (params.path === 'buyer-dashboard') {
                  return <BuyerDashboard />;
                }
                
                // Default to front page
                return <FrontPage />;
              }}
            </Route>
            
            <Route path="/land-inspector-login" component={LandInspectorLogin} />
            <Route path="/warehouse-inspector-login" component={WarehouseInspectorLogin} />
            <Route path="/port-inspector-login" component={PortInspectorLogin} />
            <Route path="/warehouse-inspector-dashboard" component={WarehouseInspectorDashboard} />
            <Route path="/unified-land-inspector-dashboard" component={UnifiedLandInspectorDashboard} />
            <Route path="/port-inspector-dashboard" component={PortInspectorDashboard} />
            
            {/* Agricultural Traceability Portal */}
            <Route path="/portals" component={Landing} />
            
            {/* Farmer Portal Routes */}
            <Route path="/farmer-login" component={FarmerLogin} />
            <Route path="/farmer-login-portal" component={FarmerLoginPortal} />
            <Route path="/farmer-dashboard" component={FarmerDashboard} />
            
            {/* Buyer Portal Routes */}
            <Route path="/buyer-dashboard" component={BuyerDashboard} />
            
            {/* Default fallback */}
            <Route component={FrontPage} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;