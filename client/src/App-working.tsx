import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import { TestHome, TestFieldLogin } from "./test-components";

// Test if these basic pages work
import FrontPage from "@/pages/front-page";
import Landing from "@/pages/landing";
import GPSTest from "@/pages/gps-test";

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
      {/* GPS Testing - Public Access */}
      <Route path="/gps-test" component={GPSTest} />
      
      {/* Test Routes */}
      <Route path="/field-agent-login" component={TestFieldLogin} />
      <Route path="/test-login" component={TestFieldLogin} />
      
      {/* Working Routes */}
      <Route path="/gps-test" component={GPSTest} />
      <Route path="/landing" component={Landing} />
      <Route path="/portals" component={Landing} />
      
      {/* Force Root Route to Always Show Test Page */}
      <Route path="/" component={TestHome} />
      
      {/* Default fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  
  // Check if user is on authentication pages, landing page, or front page
  const isAuthPage = window.location.pathname.includes("-login");
  const isLandingPage = window.location.pathname === "/landing";
  const isFrontPage = window.location.pathname === "/" || 
                      window.location.pathname === "/front-page" || 
                      window.location.pathname === "/home" ||
                      window.location.pathname === "/main";
  const isDashboardPage = window.location.pathname === "/dashboard";
  const isExporterDashboard = window.location.pathname === "/exporter-dashboard" && userType === 'exporter';
  const isMonitoringDashboard = window.location.pathname === "/monitoring-dashboard" && authToken && userType === 'monitoring';
  
  // Special modules that should use their own independent layout
  const isLiveTracePage = window.location.pathname.startsWith("/livetrace");
  const isLandMap360Page = window.location.pathname.startsWith("/landmap360") || window.location.pathname === "/land-map360";
  const isBlueCarbon360Page = window.location.pathname.startsWith("/blue-carbon360");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {(isAuthPage || isLandingPage || isFrontPage || (isMonitoringDashboard && !isDashboardPage) || isLiveTracePage || isLandMap360Page || isBlueCarbon360Page) ? (
          // Render auth/landing pages, special dashboards, LiveTrace, LandMap360, or Blue Carbon 360 pages without AgriTrace layout
          <div className="min-h-screen">
            <Router />
          </div>
        ) : (
          // Render authenticated pages with full layout
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 min-w-0 overflow-hidden pb-16 lg:pb-0">
                <Router />
              </main>
            </div>
            <MobileNav />
          </div>
        )}
        
        {/* PWA Install Prompt - Show on all pages */}
        <PWAInstallPrompt />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;