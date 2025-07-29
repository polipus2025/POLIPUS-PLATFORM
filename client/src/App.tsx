import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import FrontPage from "@/pages/front-page";
import Landing from "@/pages/landing";
import RegulatoryLogin from "@/pages/auth/regulatory-login";
import FarmerLogin from "@/pages/auth/farmer-login";
import FieldAgentLogin from "@/pages/auth/field-agent-login";
import ExporterLogin from "@/pages/auth/exporter-login";
import Dashboard from "@/pages/dashboard-isms";
import EconomicReportingPage from "@/pages/economic-reporting";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Authentication Routes */}
          <Route path="/regulatory-login" component={RegulatoryLogin} />
          <Route path="/farmer-login" component={FarmerLogin} />
          <Route path="/field-agent-login" component={FieldAgentLogin} />
          <Route path="/exporter-login" component={ExporterLogin} />
          
          {/* Main Routes */}
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/economic-reporting" component={EconomicReportingPage} />
          <Route path="/landing" component={Landing} />
          <Route path="/portals" component={Landing} />
          
          {/* Root Routes */}
          <Route path="/">
            {(() => {
              const authToken = localStorage.getItem("authToken");
              if (authToken) {
                return <Dashboard />;
              } else {
                return <FrontPage />;
              }
            })()}
          </Route>
          
          {/* Fallback */}
          <Route>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h1>
                <p className="text-slate-600">The requested page could not be found.</p>
              </div>
            </div>
          </Route>
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;