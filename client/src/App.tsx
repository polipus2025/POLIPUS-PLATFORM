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
import WarehouseInspectorDashboard from "@/pages/warehouse-inspector-dashboard";

// Inspector Portal imports
import InspectorPortal from "@/pages/inspector-portal";
import LandInspectorLogin from "@/pages/auth/land-inspector-login";
import WarehouseInspectorLogin from "@/pages/auth/warehouse-inspector-login";
import PortInspectorLogin from "@/pages/auth/port-inspector-login";
import UnifiedLandInspectorDashboard from "@/pages/unified-land-inspector-dashboard";
import PortInspectorDashboard from "@/pages/port-inspector-dashboard";

// Inspector App for dedicated routing
import InspectorApp from "./InspectorApp";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Switch>
            {/* INSPECTOR ROUTES - ABSOLUTE PRIORITY */}
            <Route path="/inspector-portal">
              {() => <InspectorPortal />}
            </Route>
            <Route path="/land-inspector-login">
              {() => <LandInspectorLogin />}
            </Route>
            <Route path="/warehouse-inspector-login">
              {() => <WarehouseInspectorLogin />}
            </Route>
            <Route path="/port-inspector-login">
              {() => <PortInspectorLogin />}
            </Route>
            <Route path="/warehouse-inspector-dashboard">
              {() => <WarehouseInspectorDashboard />}
            </Route>
            <Route path="/unified-land-inspector-dashboard">
              {() => <UnifiedLandInspectorDashboard />}
            </Route>
            <Route path="/port-inspector-dashboard">
              {() => <PortInspectorDashboard />}
            </Route>
            
            {/* Main Polipus page */}
            <Route path="/" component={FrontPage} />
            <Route path="/front-page" component={FrontPage} />
            
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