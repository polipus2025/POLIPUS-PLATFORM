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
            {/* Main Polipus page */}
            <Route path="/" component={FrontPage} />
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
            
            {/* Farmer Portal Routes */}
            <Route path="/farmer-login" component={FarmerLogin} />
            <Route path="/farmer-login-portal" component={FarmerLoginPortal} />
            <Route path="/farmer-dashboard" component={FarmerDashboard} />
            
            {/* Buyer Portal Routes */}
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