import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Landing from "@/pages/landing";
import RegulatoryLogin from "@/pages/auth/regulatory-login";
import FarmerLogin from "@/pages/auth/farmer-login";
import FieldAgentLogin from "@/pages/auth/field-agent-login";
import Dashboard from "@/pages/dashboard";
import Commodities from "@/pages/commodities";
import Inspections from "@/pages/inspections";
import Certifications from "@/pages/certifications";
import Reports from "@/pages/reports";
import Analytics from "@/pages/analytics";
import AuditSystem from "@/pages/audit-system";
import DataEntry from "@/pages/data-entry";
import Farmers from "@/pages/farmers";
import FarmPlots from "@/pages/farm-plots";
import CropPlanning from "@/pages/crop-planning";

import GovernmentIntegration from "@/pages/government-integration";
import GpsMapping from "@/pages/gps-mapping";
import InternationalStandards from "@/pages/international-standards";
import Verification from "@/pages/verification";
import BatchCodeGenerator from "@/pages/batch-code-generator";
import NotFound from "@/pages/not-found";

function Router() {
  // Check if user is logged in and has valid role
  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  
  return (
    <Switch>
      {/* Authentication Routes - Public */}
      <Route path="/regulatory-login" component={RegulatoryLogin} />
      <Route path="/farmer-login" component={FarmerLogin} />
      <Route path="/field-agent-login" component={FieldAgentLogin} />
      
      {/* Protected Routes - Require Authentication */}
      {authToken && userType ? (
        <>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/commodities" component={Commodities} />
          <Route path="/inspections" component={Inspections} />
          <Route path="/certifications" component={Certifications} />
          <Route path="/reports" component={Reports} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/audit-system" component={AuditSystem} />
          <Route path="/data-entry" component={DataEntry} />
          <Route path="/farmers" component={Farmers} />
          <Route path="/farm-plots" component={FarmPlots} />
          <Route path="/crop-planning" component={CropPlanning} />
          <Route path="/government-integration" component={GovernmentIntegration} />
          <Route path="/gps-mapping" component={GpsMapping} />
          <Route path="/international-standards" component={InternationalStandards} />
          <Route path="/verification" component={Verification} />
          <Route path="/batch-code-generator" component={BatchCodeGenerator} />
          
          {/* Redirect authenticated users to dashboard */}
          <Route path="/" component={Dashboard} />
        </>
      ) : (
        <>
          {/* Redirect unauthenticated users to landing page */}
          <Route path="/" component={Landing} />
        </>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  
  // Check if user is on authentication pages or landing page
  const isAuthPage = window.location.pathname.includes("-login");
  const isLandingPage = window.location.pathname === "/" && !authToken;
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {(isAuthPage || isLandingPage) ? (
          // Render auth/landing pages without layout
          <div className="min-h-screen">
            <Router />
          </div>
        ) : (
          // Render authenticated pages with full layout
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1">
                <Router />
              </main>
            </div>
          </div>
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
