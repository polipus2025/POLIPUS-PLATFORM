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
          <Route path="/dashboard">
            {userType === 'farmer' ? <FarmerDashboard /> : 
             userType === 'field_agent' ? <FieldAgentDashboard /> : 
             userType === 'exporter' ? <ExporterDashboard /> :
             localStorage.getItem("userRole") === 'director' ? <DirectorDashboard /> : <Dashboard />}
          </Route>
          <Route path="/">
            {userType === 'farmer' ? <FarmerDashboard /> : 
             userType === 'field_agent' ? <FieldAgentDashboard /> : 
             userType === 'exporter' ? <ExporterDashboard /> :
             localStorage.getItem("userRole") === 'director' ? <DirectorDashboard /> : <Dashboard />}
          </Route>
          
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
              allowedUserTypes={['farmer']} 
            />
          </Route>
          <Route path="/gis-mapping">
            <ProtectedRoute 
              component={GISMapping} 
              allowedUserTypes={['regulatory', 'farmer', 'field_agent']} 
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
          <Route path="/messaging" component={Messaging} />
          
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
  // SITO COMPLETAMENTE BLOCCATO - NON NAVIGABILE
  return (
    <div className="min-h-screen bg-red-900 flex items-center justify-center">
      <div className="bg-white p-12 rounded-xl shadow-2xl text-center max-w-lg">
        <div className="text-8xl mb-6">🚫</div>
        <h1 className="text-4xl font-bold text-red-600 mb-6">ACCESSO NEGATO</h1>
        <div className="text-gray-700 space-y-4">
          <p className="text-xl">Il sistema AgriTrace360™ è temporaneamente non disponibile.</p>
          <p className="text-lg">Tutte le funzionalità sono state disabilitate.</p>
          <p className="text-base text-gray-500">Contattare l'amministratore di sistema per ulteriori informazioni.</p>
        </div>
        <div className="mt-8 p-4 bg-red-50 rounded-lg">
          <p className="text-red-600 font-semibold">🔒 SITO BLOCCATO PER MANUTENZIONE</p>
        </div>
      </div>
    </div>
  );
}

export default App;
