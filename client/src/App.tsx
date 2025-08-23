import { Switch, Route } from "wouter";
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
import WarehouseInspectorDashboard from "@/pages/warehouse-inspector-dashboard";

// AGRICULTURAL SYSTEM PORTALS
import PortInspectorDashboard from "@/pages/port-inspector-dashboard";
import ExporterDashboard from "@/pages/exporter-dashboard";
import UnifiedLandInspectorDashboard from "@/pages/unified-land-inspector-dashboard";
import RegulatoryPortalClassic from "@/pages/regulatory-portal-classic";
import DDGAFDashboard from "@/pages/ddgaf-dashboard";
import DDGOTSDashboard from "@/pages/ddgots-dashboard";
import DGDashboard from "@/pages/dg-dashboard";
import AgriTraceAdminPortal from "@/pages/agritrace-admin-portal";

// AGRICULTURAL LOGIN PAGES
import RegulatoryLogin from "@/pages/auth/regulatory-login";
import WarehouseInspectorLogin from "@/pages/auth/warehouse-inspector-login";
import PortInspectorLogin from "@/pages/auth/port-inspector-login";
import LandInspectorLogin from "@/pages/auth/land-inspector-login";
import ExporterLogin from "@/pages/auth/exporter-login";
import DDGAFLogin from "@/pages/auth/ddgaf-login";
import DDGOTSLogin from "@/pages/auth/ddgots-login";
import DGLogin from "@/pages/auth/dg-login";
import RegulatoryClassicLogin from "@/pages/auth/regulatory-classic-login";
import SystemAdminLogin from "@/pages/auth/system-admin-login";

// POLIPUS MODULE PORTALS - All 7 modules
import LiveTracePortal from "@/pages/portals/live-trace-portal";
import LandMap360Portal from "@/pages/portals/land-map360-portal";
import MineWatchPortal from "@/pages/portals/mine-watch-portal";
import ForestGuardPortal from "@/pages/portals/forest-guard-portal";
import AquaTracePortal from "@/pages/portals/aqua-trace-portal";
import BlueCarbon360Portal from "@/pages/portals/blue-carbon360-portal";
import CarbonTracePortal from "@/pages/portals/carbon-trace-portal";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Switch>
            {/* TEMPORARY: Simple working root to bypass loading issues */}
            <Route path="/" component={() => <div className="min-h-screen bg-slate-100 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold">Polipus Platform</h1><p className="mt-4">System is operational</p><div className="mt-8 space-y-2"><a href="/warehouse-inspector-login" className="block p-2 bg-blue-500 text-white rounded">Warehouse Inspector Login</a><a href="/port-inspector-login" className="block p-2 bg-green-500 text-white rounded">Port Inspector Login</a><a href="/land-inspector-login" className="block p-2 bg-orange-500 text-white rounded">Land Inspector Login</a></div></div></div>} />
            <Route path="/front-page" component={FrontPage} />
            
            {/* Agricultural Traceability Portal */}
            <Route path="/portals" component={Landing} />
            
            {/* POLIPUS MODULE PORTALS - All 7 modules */}
            <Route path="/live-trace" component={LiveTracePortal} />
            <Route path="/landmap360-portal" component={LandMap360Portal} />
            <Route path="/mine-watch" component={MineWatchPortal} />
            <Route path="/forest-guard" component={ForestGuardPortal} />
            <Route path="/aqua-trace" component={AquaTracePortal} />
            <Route path="/blue-carbon360" component={BlueCarbon360Portal} />
            <Route path="/carbon-trace" component={CarbonTracePortal} />
            
            {/* TEST ROUTE - SIMPLE INLINE COMPONENT */}
            <Route path="/test-routing" component={() => <div style={{background: 'red', color: 'white', fontSize: '30px', padding: '50px', textAlign: 'center'}}>🚨 TEST ROUTE WORKS 🚨</div>} />
            
            {/* DIRECT HTML TEST FOR INSPECTOR LOGIN */}
            <Route path="/inspector-test" component={() => <div style={{background: 'green', color: 'white', fontSize: '20px', padding: '30px', textAlign: 'center'}}><h1>INSPECTOR TEST PAGE</h1><p>This is a direct HTML test for inspector routing</p></div>} />
            
            {/* AGRICULTURAL AUTHENTICATION ROUTES */}
            <Route path="/farmer-login" component={FarmerLogin} />
            <Route path="/farmer-login-portal" component={FarmerLoginPortal} />
            <Route path="/regulatory-login" component={RegulatoryLogin} />
            <Route path="/warehouse-inspector-login" component={WarehouseInspectorLogin} />
            <Route path="/port-inspector-login" component={PortInspectorLogin} />
            <Route path="/land-inspector-login" component={LandInspectorLogin} />
            <Route path="/exporter-login" component={ExporterLogin} />
            <Route path="/ddgaf-login" component={DDGAFLogin} />
            <Route path="/ddgots-login" component={DDGOTSLogin} />
            <Route path="/dg-login" component={DGLogin} />
            <Route path="/regulatory-classic-login" component={RegulatoryClassicLogin} />
            <Route path="/system-admin-login" component={SystemAdminLogin} />
            
            {/* AGRICULTURAL DASHBOARD ROUTES */}
            <Route path="/farmer-dashboard" component={FarmerDashboard} />
            <Route path="/buyer-dashboard" component={BuyerDashboard} />
            
            {/* AGRICULTURAL INSPECTOR PORTALS */}
            <Route path="/warehouse-inspector-dashboard" component={WarehouseInspectorDashboard} />
            <Route path="/port-inspector-dashboard" component={PortInspectorDashboard} />
            <Route path="/unified-land-inspector-dashboard" component={UnifiedLandInspectorDashboard} />
            
            {/* REGULATORY PORTALS */}
            <Route path="/regulatory-portal-classic" component={RegulatoryPortalClassic} />
            <Route path="/ddgaf-dashboard" component={DDGAFDashboard} />
            <Route path="/ddgots-dashboard" component={DDGOTSDashboard} />
            <Route path="/dg-dashboard" component={DGDashboard} />
            
            {/* EXPORTER PORTAL */}
            <Route path="/exporter-dashboard" component={ExporterDashboard} />
            
            {/* SYSTEM ADMIN PORTAL */}
            <Route path="/agritrace-admin-portal" component={AgriTraceAdminPortal} />
            
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