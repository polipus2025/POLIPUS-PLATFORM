import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import FrontPage from "@/pages/front-page";
import Landing from "@/pages/landing";
import RegulatoryLogin from "@/pages/auth/regulatory-login";
import FarmerLogin from "@/pages/auth/farmer-login";
import FieldAgentLogin from "@/pages/auth/field-agent-login";
import ExporterLogin from "@/pages/auth/exporter-login";
import Dashboard from "@/pages/dashboard";
import TestDashboard from "@/pages/test-dashboard";
import Commodities from "@/pages/commodities";
import ExporterDashboard from "@/pages/exporter-dashboard";
import ExportLicense from "@/pages/export-license";
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
import GISMapping from "@/pages/gis-mapping";
import InternationalStandards from "@/pages/international-standards";
import Verification from "@/pages/verification";
import BatchCodeGenerator from "@/pages/batch-code-generator";
import OfflineSync from "@/pages/offline-sync";
import DirectorDashboard from "@/pages/director-dashboard";
import MobileAlertDemo from "@/pages/mobile-alert-demo";
import FieldAgentDashboard from "@/pages/field-agent-dashboard";
import FarmerDashboard from "@/pages/farmer-dashboard";
import Messaging from "@/pages/messaging";
import LoginTest from "@/pages/login-test";
import ExportPermitSubmission from "@/pages/export-permit-submission";
import RealTimeVerificationDashboard from "@/pages/verification-dashboard";
import EconomicReportingPage from "@/pages/economic-reporting";

import NotFound from "@/pages/not-found";

// Helper component to check user access to routes
function ProtectedRoute({ component: Component, allowedUserTypes, ...props }: any) {
  const userType = localStorage.getItem("userType");
  
  if (!allowedUserTypes.includes(userType)) {
    return <NotFound />;
  }
  
  return <Component {...props} />;
}

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
      <Route path="/exporter-login" component={ExporterLogin} />
      <Route path="/login-test" component={LoginTest} />
      
      {/* Protected Routes */}
      {authToken ? (
        <>
          {/* Dashboard - Fixed to show correct component based on user type */}
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/farmer-dashboard" component={FarmerDashboard} />
          <Route path="/field-agent-dashboard" component={FieldAgentDashboard} />
          <Route path="/exporter-dashboard" component={ExporterDashboard} />
          <Route path="/director-dashboard" component={DirectorDashboard} />
          <Route path="/" component={Dashboard} />
          
          {/* Exporter Portal Routes */}
          <Route path="/exporter-dashboard">
            <ProtectedRoute 
              component={ExporterDashboard} 
              allowedUserTypes={['exporter']} 
            />
          </Route>
          <Route path="/export-permit-submission">
            <ProtectedRoute 
              component={ExportPermitSubmission} 
              allowedUserTypes={['exporter']} 
            />
          </Route>
          <Route path="/export-license">
            <ProtectedRoute 
              component={ExportLicense} 
              allowedUserTypes={['exporter']} 
            />
          </Route>
          
          {/* Regulatory Staff Only Routes */}
          <Route path="/commodities">
            <ProtectedRoute 
              component={Commodities} 
              allowedUserTypes={['regulatory', 'field_agent']} 
            />
          </Route>
          <Route path="/inspections">
            <ProtectedRoute 
              component={Inspections} 
              allowedUserTypes={['regulatory', 'field_agent']} 
            />
          </Route>
          <Route path="/certifications">
            <ProtectedRoute 
              component={Certifications} 
              allowedUserTypes={['regulatory']} 
            />
          </Route>
          <Route path="/reports">
            <ProtectedRoute 
              component={Reports} 
              allowedUserTypes={['regulatory']} 
            />
          </Route>
          <Route path="/analytics">
            <ProtectedRoute 
              component={Analytics} 
              allowedUserTypes={['regulatory']} 
            />
          </Route>
          <Route path="/audit-system">
            <ProtectedRoute 
              component={AuditSystem} 
              allowedUserTypes={['regulatory']} 
            />
          </Route>
          <Route path="/data-entry">
            <ProtectedRoute 
              component={DataEntry} 
              allowedUserTypes={['regulatory', 'field_agent']} 
            />
          </Route>
          <Route path="/government-integration">
            <ProtectedRoute 
              component={GovernmentIntegration} 
              allowedUserTypes={['regulatory']} 
            />
          </Route>
          <Route path="/international-standards">
            <ProtectedRoute 
              component={InternationalStandards} 
              allowedUserTypes={['regulatory']} 
            />
          </Route>
          
          {/* Farmer & Field Agent Routes */}
          <Route path="/farmers">
            <ProtectedRoute 
              component={Farmers} 
              allowedUserTypes={['farmer', 'field_agent']} 
            />
          </Route>
          <Route path="/farm-plots">
            <ProtectedRoute 
              component={FarmPlots} 
              allowedUserTypes={['farmer', 'field_agent']} 
            />
          </Route>
          <Route path="/crop-planning">
            <ProtectedRoute 
              component={CropPlanning} 
              allowedUserTypes={['regulatory']} 
            />
          </Route>
          <Route path="/gis-mapping">
            <ProtectedRoute 
              component={GISMapping} 
              allowedUserTypes={['regulatory']} 
            />
          </Route>
          <Route path="/economic-reporting">
            <ProtectedRoute 
              component={EconomicReportingPage} 
              allowedUserTypes={['regulatory']} 
            />
          </Route>
          <Route path="/batch-code-generator">
            <ProtectedRoute 
              component={BatchCodeGenerator} 
              allowedUserTypes={['farmer']} 
            />
          </Route>
          
          {/* Document Verification - Available to all */}
          <Route path="/verification" component={Verification} />
          <Route path="/verification-dashboard">
            <ProtectedRoute 
              component={RealTimeVerificationDashboard} 
              allowedUserTypes={['regulatory', 'field_agent']} 
            />
          </Route>
          
          {/* Offline Sync - Available to all authenticated users */}
          <Route path="/offline-sync" component={OfflineSync} />
          <Route path="/director-dashboard" component={DirectorDashboard} />
          <Route path="/mobile-alert-demo" component={MobileAlertDemo} />
          <Route path="/messaging">
            <ProtectedRoute 
              component={Messaging} 
              allowedUserTypes={['regulatory', 'field_agent', 'exporter']} 
            />
          </Route>
          
        </>
      ) : (
        <>
          {/* Front Page - Main Landing */}
          <Route path="/" component={FrontPage} />
          {/* Landing page for portals */}
          <Route path="/landing" component={Landing} />
          {/* Also handle /dashboard for logged out users */}
          <Route path="/dashboard" component={FrontPage} />
        </>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  

  
  // Check if user is on authentication pages, landing page, or front page
  const isAuthPage = window.location.pathname.includes("-login");
  const isLandingPage = window.location.pathname === "/landing" && !authToken;
  const isFrontPage = window.location.pathname === "/" && !authToken;
  const isExporterDashboard = window.location.pathname === "/exporter-dashboard" && userType === 'exporter';
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {(isAuthPage || isLandingPage || isFrontPage) ? (
          // Render auth/landing pages without layout
          <div className="min-h-screen">
            <Router />
          </div>
        ) : authToken ? (
          // Render authenticated pages with full layout
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 min-w-0 overflow-hidden">
                <Router />
              </main>
            </div>
          </div>
        ) : (
          // Fallback to front page if no token
          <div className="min-h-screen">
            <Router />
          </div>
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
