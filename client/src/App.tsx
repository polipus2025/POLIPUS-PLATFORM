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

// Inspector Portal imports - FULL FUNCTIONALITY RESTORED
import InspectorPortal from "@/pages/inspector-portal";
import LandInspectorLogin from "@/pages/auth/land-inspector-login";
import WarehouseInspectorLogin from "@/pages/auth/warehouse-inspector-login";
import PortInspectorLogin from "@/pages/auth/port-inspector-login";
import UnifiedLandInspectorDashboard from "@/pages/unified-land-inspector-dashboard";
import PortInspectorDashboard from "@/pages/port-inspector-dashboard";
import WarehouseInspectorDashboard from "@/pages/warehouse-inspector-dashboard";

// AgriTrace Module imports
import AgriTraceDashboard from "@/pages/agritrace-dashboard";
import AgriTraceAdminPortal from "@/pages/agritrace-admin-portal";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Switch>
            {/* INSPECTOR PORTAL - WORKING COMPONENT */}
            <Route path="/inspector-portal" component={InspectorPortal} />

            {/* Inspector Auth Routes */}
            <Route path="/land-inspector-login" component={LandInspectorLogin} />
            <Route path="/warehouse-inspector-login" component={WarehouseInspectorLogin} />
            <Route path="/port-inspector-login" component={PortInspectorLogin} />

            {/* Inspector Dashboard Routes */}
            <Route path="/unified-land-inspector-dashboard" component={UnifiedLandInspectorDashboard} />
            <Route path="/port-inspector-dashboard" component={PortInspectorDashboard} />
            <Route path="/warehouse-inspector-dashboard" component={WarehouseInspectorDashboard} />

            {/* Main Portal Routes */}
            <Route path="/" component={FrontPage} />
            <Route path="/landing" component={Landing} />
            
            {/* Farmer Routes */}
            <Route path="/farmer-dashboard" component={FarmerDashboard} />
            <Route path="/farmer-login" component={FarmerLogin} />
            <Route path="/farmer-portal" component={FarmerLoginPortal} />

            {/* Buyer Routes */}
            <Route path="/agricultural-buyer-dashboard" component={BuyerDashboard} />

            {/* AgriTrace Routes */}
            <Route path="/agritrace" component={AgriTraceDashboard} />
            <Route path="/agritrace-dashboard" component={AgriTraceDashboard} />
            <Route path="/agritrace-admin" component={AgriTraceAdminPortal} />

            {/* Fallback Route */}
            <Route>
              <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                  <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
                  <a href="/" className="text-blue-600 hover:text-blue-800">
                    Return to Home
                  </a>
                </div>
              </div>
            </Route>
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;