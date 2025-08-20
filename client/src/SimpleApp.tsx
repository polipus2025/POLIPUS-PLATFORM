import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Landing from "@/pages/landing";
import FrontPage from "@/pages/front-page";
import ExporterDashboard from "@/pages/exporter-dashboard";
import ExporterLogin from "@/pages/auth/exporter-login";
// Import only existing pages
import Dashboard from "@/pages/dashboard";

function SimpleRouter() {
  return (
    <Switch>
      {/* Public pages */}
      <Route path="/" component={FrontPage} />
      <Route path="/landing" component={Landing} />
      <Route path="/front-page" component={FrontPage} />
      
      {/* Authentication */}
      <Route path="/exporter-login" component={ExporterLogin} />
      
      {/* AgriTrace Core Functionality */}
      <Route path="/dashboard" component={Dashboard} />
      
      {/* Placeholder routes for other AgriTrace features */}
      <Route path="/farmer-registration">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Farmer Registration</h1>
          <p>AgriTrace360™ Farmer Registration Module</p>
        </div>
      </Route>
      <Route path="/farm-management">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Farm Management</h1>
          <p>AgriTrace360™ Farm Management Module</p>
        </div>
      </Route>
      <Route path="/inspection-dashboard">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Inspection Dashboard</h1>
          <p>AgriTrace360™ Inspection Management Module</p>
        </div>
      </Route>
      <Route path="/compliance-monitoring">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Compliance Monitoring</h1>
          <p>AgriTrace360™ Compliance Monitoring Module</p>
        </div>
      </Route>
      <Route path="/eudr-dashboard">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">EUDR Dashboard</h1>
          <p>AgriTrace360™ EU Deforestation Regulation Module</p>
        </div>
      </Route>
      <Route path="/reports">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Reports</h1>
          <p>AgriTrace360™ Reporting Module</p>
        </div>
      </Route>
      <Route path="/analytics">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Analytics</h1>
          <p>AgriTrace360™ Analytics Module</p>
        </div>
      </Route>
      
      {/* Exporter Portal */}
      <Route path="/exporter-dashboard" component={ExporterDashboard} />
      
      <Route>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Polipus Platform</h1>
            <p className="text-gray-600">Page not found</p>
            <p className="text-sm text-gray-500 mt-2">Available routes: /dashboard, /farmer-registration, /farm-management, /inspection-dashboard, /compliance-monitoring, /eudr-dashboard, /reports, /analytics</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function SimpleApp() {
  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  
  // Check if user is on authentication pages or public pages
  const isAuthPage = window.location.pathname.includes("-login");
  const isLandingPage = window.location.pathname === "/landing";
  const isFrontPage = window.location.pathname === "/" || 
                      window.location.pathname === "/front-page";
  const isExporterDashboard = window.location.pathname === "/exporter-dashboard" && userType === 'exporter';
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {(isAuthPage || isLandingPage || isFrontPage || isExporterDashboard) ? (
          // Render auth/landing/exporter pages without AgriTrace layout
          <div className="min-h-screen">
            <SimpleRouter />
          </div>
        ) : (
          // Render AgriTrace pages with full layout
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 min-w-0 overflow-hidden pb-16 lg:pb-0">
                <SimpleRouter />
              </main>
            </div>
            <MobileNav />
          </div>
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default SimpleApp;