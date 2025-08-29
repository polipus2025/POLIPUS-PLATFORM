import React, { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";

// ⚡ SUPER FAST LOADING COMPONENT - Optimized for perceived performance
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="text-center space-y-4 animate-fadeIn">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
      <div className="space-y-2">
        <p className="text-slate-700 font-medium">Loading portal...</p>
        <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto">
          <div className="h-1 bg-blue-600 rounded-full animate-pulse" style={{width: '70%'}}></div>
        </div>
      </div>
    </div>
  </div>
);

// Simplified route wrapper
const createLazyRoute = (LazyComponent: React.LazyExoticComponent<any>) => {
  return () => (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent />
    </Suspense>
  );
};

// ESSENTIAL PAGES - Direct imports for instant loading
import FrontPage from "@/pages/front-page";
import Landing from "@/pages/landing";
import FarmerLogin from "@/pages/auth/farmer-login";
import FarmerLoginPortal from "@/pages/farmer-login-portal";

// LAZY LOADING - Heavy dashboard pages only
const FarmerDashboard = lazy(() => import("@/pages/farmer-dashboard"));
const BuyerDashboard = lazy(() => import("@/pages/agricultural-buyer-dashboard"));
const WarehouseInspectorDashboard = lazy(() => import("@/pages/warehouse-inspector-dashboard"));
const PortInspectorDashboard = lazy(() => import("@/pages/port-inspector-dashboard"));
const ExporterDashboard = lazy(() => import("@/pages/exporter-dashboard"));
const UnifiedLandInspectorDashboard = lazy(() => import("@/pages/unified-land-inspector-dashboard"));
const RegulatoryPortalClassic = lazy(() => import("@/pages/regulatory-portal-classic"));
const OfficeAdministrationPortal = lazy(() => import("@/pages/office-administration-portal"));
const DDGAFDashboard = lazy(() => import("@/pages/ddgaf-dashboard"));
const DDGOTSDashboard = lazy(() => import("@/pages/ddgots-dashboard"));
const DGDashboard = lazy(() => import("@/pages/dg-dashboard"));
const AgriTraceAdminPortal = lazy(() => import("@/pages/agritrace-admin-portal"));
const SystemMonitoring = lazy(() => import("@/pages/system-monitoring"));
const MonitoringDashboard = lazy(() => import("@/pages/monitoring-dashboard"));

// POLIPUS MODULE PORTALS - 7 modules
const LiveTracePortal = lazy(() => import("@/pages/portals/live-trace-portal"));
const LandMap360Portal = lazy(() => import("@/pages/portals/land-map360-portal"));
const MineWatchPortal = lazy(() => import("@/pages/portals/mine-watch-portal"));
const ForestGuardPortal = lazy(() => import("@/pages/portals/forest-guard-portal"));
const AquaTracePortal = lazy(() => import("@/pages/portals/aqua-trace-portal"));
const BlueCarbon360Portal = lazy(() => import("@/pages/portals/blue-carbon360-portal"));
const CarbonTracePortal = lazy(() => import("@/pages/portals/carbon-trace-portal"));

// AUTH PAGES - Direct imports for fast access
import OfficeAdministrationLogin from "@/pages/auth/regulatory-classic-login";
import InspectorLogin from "@/pages/auth/inspector-login";
import WarehouseInspectorLogin from "@/pages/auth/warehouse-inspector-login";
import PortInspectorLogin from "@/pages/auth/port-inspector-login";
import LandInspectorLogin from "@/pages/auth/land-inspector-login";
import ExporterLogin from "@/pages/auth/exporter-login";
import DDGAFLogin from "@/pages/auth/ddgaf-login";
import DDGOTSLogin from "@/pages/auth/ddgots-login";
import DGLogin from "@/pages/auth/dg-login";
import RegulatoryClassicLogin from "@/pages/auth/regulatory-classic-login";
import SystemAdminLogin from "@/pages/auth/system-admin-login";
import MonitoringLogin from "@/pages/auth/monitoring-login";

// MANAGEMENT PAGES
const BuyerManagement = lazy(() => import("@/pages/buyer-management"));
const InspectorManagement = lazy(() => import("@/pages/inspector-management"));
const ExporterManagement = lazy(() => import("@/pages/exporter-management"));

// ADDITIONAL PAGES - Lazy loaded
const ProfileRouter = lazy(() => import("@/pages/profile"));
const WorldMarketPricing = lazy(() => import("@/pages/world-market-pricing"));
const SellersHub = lazy(() => import("@/pages/sellers-hub"));

// AGRICULTURAL PAGES - Required for land inspector navigation
const OnboardFarmer = lazy(() => import("@/pages/onboard-farmer"));
const CreateLandPlot = lazy(() => import("@/pages/create-land-plot"));
const EudrAssessment = lazy(() => import("@/pages/eudr-assessment"));
const GenerateReports = lazy(() => import("@/pages/generate-reports"));

function App() {
  // TARGETED MEMORY RESET - Only block problematic monitoring redirects
  React.useEffect(() => {
    const currentPath = window.location.pathname;
    
    // Only clear monitoring-related tokens and block monitoring-login specifically
    if (currentPath.includes("monitoring-login") || localStorage.getItem("userType") === "monitoring") {
      console.log("🚨 MONITORING LOGIN DETECTED - Redirecting to Polipus front page");
      
      // Clear only monitoring-related storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userType");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      
      // Redirect away from monitoring-login only
      window.location.replace("/");
      return;
    }
    
    console.log("✅ Login access allowed for:", currentPath);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Switch>
            {/* Main Polipus Platform Homepage */}
            <Route path="/" component={FrontPage} />
            <Route path="/front-page" component={FrontPage} />
            
            {/* Agricultural Traceability Portal */}
            <Route path="/portals" component={Landing} />
            
            {/* POLIPUS MODULE PORTALS - All 7 modules */}
            <Route path="/live-trace" component={createLazyRoute(LiveTracePortal)} />
            <Route path="/landmap360-portal" component={createLazyRoute(LandMap360Portal)} />
            <Route path="/mine-watch" component={createLazyRoute(MineWatchPortal)} />
            <Route path="/forest-guard" component={createLazyRoute(ForestGuardPortal)} />
            <Route path="/aqua-trace" component={createLazyRoute(AquaTracePortal)} />
            <Route path="/blue-carbon360" component={createLazyRoute(BlueCarbon360Portal)} />
            <Route path="/carbon-trace" component={createLazyRoute(CarbonTracePortal)} />
            
            {/* AGRICULTURAL AUTHENTICATION ROUTES */}
            <Route path="/farmer-login" component={FarmerLogin} />
            <Route path="/farmer-login-portal" component={FarmerLoginPortal} />
            <Route path="/regulatory-login" component={OfficeAdministrationLogin} />
            <Route path="/inspector-login" component={InspectorLogin} />
            <Route path="/warehouse-inspector-login" component={WarehouseInspectorLogin} />
            <Route path="/port-inspector-login" component={PortInspectorLogin} />
            <Route path="/land-inspector-login" component={LandInspectorLogin} />
            <Route path="/exporter-login" component={ExporterLogin} />
            <Route path="/ddgaf-login" component={DDGAFLogin} />
            <Route path="/ddgots-login" component={DDGOTSLogin} />
            <Route path="/dg-login" component={DGLogin} />
            <Route path="/regulatory-classic-login" component={RegulatoryClassicLogin} />
            <Route path="/system-admin-login" component={SystemAdminLogin} />
            <Route path="/monitoring-login" component={MonitoringLogin} />
            
            {/* SYSTEM MONITORING */}
            <Route path="/system-monitoring" component={createLazyRoute(SystemMonitoring)} />
            <Route path="/monitoring-dashboard" component={createLazyRoute(MonitoringDashboard)} />
            
            {/* AGRICULTURAL DASHBOARD ROUTES */}
            <Route path="/farmer-dashboard" component={createLazyRoute(FarmerDashboard)} />
            <Route path="/agricultural-buyer-dashboard" component={createLazyRoute(BuyerDashboard)} />
            
            {/* AGRICULTURAL PAGES - Land Inspector Navigation */}
            <Route path="/onboard-farmer" component={createLazyRoute(OnboardFarmer)} />
            <Route path="/create-land-plot" component={createLazyRoute(CreateLandPlot)} />
            <Route path="/eudr-assessment" component={createLazyRoute(EudrAssessment)} />
            <Route path="/generate-reports" component={createLazyRoute(GenerateReports)} />
            
            {/* INSPECTOR PORTALS */}
            <Route path="/warehouse-inspector-dashboard" component={createLazyRoute(WarehouseInspectorDashboard)} />
            <Route path="/port-inspector-dashboard" component={createLazyRoute(PortInspectorDashboard)} />
            <Route path="/unified-land-inspector-dashboard" component={createLazyRoute(UnifiedLandInspectorDashboard)} />
            
            {/* REGULATORY PORTALS */}
            <Route path="/regulatory-portal-classic" component={createLazyRoute(RegulatoryPortalClassic)} />
            <Route path="/office-administration-portal" component={createLazyRoute(OfficeAdministrationPortal)} />
            <Route path="/ddgaf-dashboard" component={createLazyRoute(DDGAFDashboard)} />
            <Route path="/ddgots-dashboard" component={createLazyRoute(DDGOTSDashboard)} />
            <Route path="/dg-dashboard" component={createLazyRoute(DGDashboard)} />
            
            {/* MANAGEMENT PAGES */}
            <Route path="/buyer-management" component={createLazyRoute(BuyerManagement)} />
            <Route path="/inspector-management" component={createLazyRoute(InspectorManagement)} />
            <Route path="/exporter-management" component={createLazyRoute(ExporterManagement)} />
            
            {/* EXPORTER PORTAL */}
            <Route path="/exporter-dashboard" component={createLazyRoute(ExporterDashboard)} />
            <Route path="/world-market-pricing" component={createLazyRoute(WorldMarketPricing)} />
            <Route path="/sellers-hub" component={createLazyRoute(SellersHub)} />
            <Route path="/exporter/orders" component={createLazyRoute(lazy(() => import('./pages/exporter/orders')))} />
            <Route path="/exporter/marketplace" component={createLazyRoute(lazy(() => import('./pages/exporter/marketplace')))} />
            <Route path="/exporter/certificates" component={createLazyRoute(lazy(() => import('./pages/exporter/certificates')))} />
            <Route path="/exporter/messages" component={createLazyRoute(lazy(() => import('./pages/exporter/messages')))} />
            <Route path="/exporter/shipments" component={createLazyRoute(lazy(() => import('./pages/exporter/shipments')))} />
            <Route path="/exporter/analytics" component={createLazyRoute(lazy(() => import('./pages/exporter/analytics')))} />
            <Route path="/exporter-payment-services" component={createLazyRoute(lazy(() => import('./pages/exporter/exporter-payment-services')))} />
            
            {/* SYSTEM ADMIN PORTAL */}
            <Route path="/agritrace-admin-portal" component={createLazyRoute(AgriTraceAdminPortal)} />
            
            {/* PROFILE MANAGEMENT SYSTEM */}
            <Route path="/profile/:path*" component={createLazyRoute(ProfileRouter)} />
            <Route path="/profile" component={createLazyRoute(ProfileRouter)} />

            {/* POLIPUS REDIRECT */}
            <Route path="/polipus" component={FrontPage} />
            
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