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