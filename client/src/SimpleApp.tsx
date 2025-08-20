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
          <div className="text-center max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Polipus Environmental Intelligence Platform</h1>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">AgriTrace360™ Access</h2>
              <div className="grid grid-cols-2 gap-4">
                <a href="/dashboard" className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <h3 className="font-medium text-green-800">Main Dashboard</h3>
                  <p className="text-sm text-green-600">Agricultural overview & metrics</p>
                </a>
                <a href="/farmer-registration" className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-medium text-blue-800">Farmer Registration</h3>
                  <p className="text-sm text-blue-600">Register new farmers</p>
                </a>
                <a href="/compliance-monitoring" className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                  <h3 className="font-medium text-orange-800">Compliance Monitoring</h3>
                  <p className="text-sm text-orange-600">LACRA regulatory oversight</p>
                </a>
                <a href="/eudr-dashboard" className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                  <h3 className="font-medium text-purple-800">EUDR Dashboard</h3>
                  <p className="text-sm text-purple-600">EU Deforestation Regulation</p>
                </a>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">System Access</h2>
              <div className="flex gap-4 justify-center">
                <a href="/exporter-login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Exporter Portal Login
                </a>
                <a href="/landing" className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Platform Information
                </a>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Current path: {window.location.pathname}</p>
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
  const isExporterDashboard = window.location.pathname === "/exporter-dashboard";
  
  // AgriTrace pages should use the full layout
  const isAgriTracePage = window.location.pathname.startsWith("/dashboard") ||
                          window.location.pathname.startsWith("/farmer") ||
                          window.location.pathname.startsWith("/farm") ||
                          window.location.pathname.startsWith("/inspection") ||
                          window.location.pathname.startsWith("/compliance") ||
                          window.location.pathname.startsWith("/eudr") ||
                          window.location.pathname.startsWith("/reports") ||
                          window.location.pathname.startsWith("/analytics");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {(isAuthPage || isLandingPage || isFrontPage || isExporterDashboard) ? (
          // Render auth/landing/exporter pages without AgriTrace layout
          <div className="min-h-screen">
            <SimpleRouter />
          </div>
        ) : isAgriTracePage ? (
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
        ) : (
          // Default simple layout for other pages
          <div className="min-h-screen">
            <SimpleRouter />
          </div>
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default SimpleApp;