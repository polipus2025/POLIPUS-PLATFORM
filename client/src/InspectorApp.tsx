import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";

// Inspector Portal imports
import InspectorPortal from "@/pages/inspector-portal";
import LandInspectorLogin from "@/pages/auth/land-inspector-login";
import WarehouseInspectorLogin from "@/pages/auth/warehouse-inspector-login";
import PortInspectorLogin from "@/pages/auth/port-inspector-login";
import UnifiedLandInspectorDashboard from "@/pages/unified-land-inspector-dashboard";
import PortInspectorDashboard from "@/pages/port-inspector-dashboard";
import WarehouseInspectorDashboard from "@/pages/warehouse-inspector-dashboard";

function InspectorApp() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Switch>
            {/* Inspector Portal Routes - DEDICATED APP */}
            <Route path="/inspector-portal" component={InspectorPortal} />
            <Route path="/land-inspector-login" component={LandInspectorLogin} />
            <Route path="/warehouse-inspector-login" component={WarehouseInspectorLogin} />
            <Route path="/port-inspector-login" component={PortInspectorLogin} />
            
            {/* Inspector Dashboard Routes */}
            <Route path="/warehouse-inspector-dashboard" component={WarehouseInspectorDashboard} />
            <Route path="/unified-land-inspector-dashboard" component={UnifiedLandInspectorDashboard} />
            <Route path="/port-inspector-dashboard" component={PortInspectorDashboard} />
            
            {/* Default to main inspector portal */}
            <Route component={InspectorPortal} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default InspectorApp;