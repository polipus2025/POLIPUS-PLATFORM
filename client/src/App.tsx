import React, { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";

// Loading component for lazy pages
const PageLoadingSpinner = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 text-sm">Caricamento portale...</p>
    </div>
  </div>
);

// Wrapper function for lazy routes
const createLazyRoute = (LazyComponent: React.LazyExoticComponent<any>) => {
  return () => (
    <Suspense fallback={<PageLoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
};

// DIRECT IMPORT - Essential pages only
import FrontPage from "@/pages/front-page";
import Landing from "@/pages/landing";
import FarmerLogin from "@/pages/auth/farmer-login";
import FarmerLoginPortal from "@/pages/farmer-login-portal";

// LAZY LOADING - Heavy dashboard pages
const FarmerDashboard = lazy(() => import("@/pages/farmer-dashboard"));
const BuyerDashboard = lazy(() => import("@/pages/agricultural-buyer-dashboard"));
const WarehouseInspectorDashboard = lazy(() => import("@/pages/warehouse-inspector-dashboard"));

// LAZY LOADING - Heavy agricultural system portals
const PortInspectorDashboard = lazy(() => import("@/pages/port-inspector-dashboard"));
const ExporterDashboard = lazy(() => import("@/pages/exporter-dashboard"));
const UnifiedLandInspectorDashboard = lazy(() => import("@/pages/unified-land-inspector-dashboard"));
const RegulatoryPortalClassic = lazy(() => import("@/pages/regulatory-portal-classic"));
const DDGAFDashboard = lazy(() => import("@/pages/ddgaf-dashboard"));
const DDGOTSDashboard = lazy(() => import("@/pages/ddgots-dashboard"));
const DGDashboard = lazy(() => import("@/pages/dg-dashboard"));
const AgriTraceAdminPortal = lazy(() => import("@/pages/agritrace-admin-portal"));
const BuyerManagement = lazy(() => import("@/pages/buyer-management"));
const InspectorManagement = lazy(() => import("@/pages/inspector-management"));
const ExporterManagement = lazy(() => import("@/pages/exporter-management"));

// AGRICULTURAL LOGIN PAGES
import RegulatoryLogin from "@/pages/auth/regulatory-login";
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

// NEW SEPARATE PORTAL LOGINS
import FarmerPortalLogin from "@/pages/auth/farmer-portal-login";
import BuyerPortalLogin from "@/pages/auth/buyer-portal-login";

// LAZY LOADING - Polipus module portals (7 modules)
const LiveTracePortal = lazy(() => import("@/pages/portals/live-trace-portal"));
const LandMap360Portal = lazy(() => import("@/pages/portals/land-map360-portal"));
const MineWatchPortal = lazy(() => import("@/pages/portals/mine-watch-portal"));
const ForestGuardPortal = lazy(() => import("@/pages/portals/forest-guard-portal"));
const AquaTracePortal = lazy(() => import("@/pages/portals/aqua-trace-portal"));
const BlueCarbon360Portal = lazy(() => import("@/pages/portals/blue-carbon360-portal"));
const CarbonTracePortal = lazy(() => import("@/pages/portals/carbon-trace-portal"));

// LAZY LOADING - Exporter pages
const WorldMarketPricing = lazy(() => import("@/pages/world-market-pricing"));
const SellersHub = lazy(() => import("@/pages/sellers-hub"));
const ExporterOrders = lazy(() => import("@/pages/exporter/orders"));
const ExporterMarketplace = lazy(() => import("@/pages/exporter/marketplace"));
const ExporterCertificates = lazy(() => import("@/pages/exporter/certificates"));
const ExporterMessages = lazy(() => import("@/pages/exporter/messages"));
const ExporterShipments = lazy(() => import("@/pages/exporter/shipments"));
const ExporterAnalytics = lazy(() => import("@/pages/exporter/analytics"));
const ExporterPaymentServices = lazy(() => import("@/pages/exporter/exporter-payment-services"));

// LAZY LOADING - Agricultural portal pages
const OnboardFarmer = lazy(() => import("@/pages/onboard-farmer"));
const CreateLandPlot = lazy(() => import("@/pages/create-land-plot"));
const EudrAssessment = lazy(() => import("@/pages/eudr-assessment"));
const GenerateReports = lazy(() => import("@/pages/generate-reports"));
const FarmersList = lazy(() => import("@/pages/farmers-list"));
const LandPlotsList = lazy(() => import("@/pages/land-plots-list"));
const LandPlotDetails = lazy(() => import("@/pages/land-plot-details"));

// LAZY LOADING - Additional heavy pages
const EudrCompliance = lazy(() => import("@/pages/eudr-compliance"));
const MobileAppDashboard = lazy(() => import("@/pages/mobile-app-dashboard"));
const BuyerDashboardOld = lazy(() => import("@/pages/buyer-dashboard"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const MonitoringDashboard = lazy(() => import("@/pages/monitoring-dashboard"));
const IntegratedDashboard = lazy(() => import("@/pages/integrated-dashboard"));

// LAZY LOADING - Specialized agricultural pages
const FarmPlots = lazy(() => import("@/pages/farm-plots"));
const LandMappingDashboard = lazy(() => import("@/pages/land-mapping-dashboard"));
const FieldAgentDashboard = lazy(() => import("@/pages/field-agent-dashboard"));
const MobileAppDownload = lazy(() => import("@/pages/mobile-app-download"));
const PwaTest = lazy(() => import("@/pages/pwa-test"));
const BuyerExporterNetwork = lazy(() => import("@/pages/buyer-exporter-network"));
const InspectorFarmerLandManagement = lazy(() => import("@/pages/inspector-farmer-land-management"));

// LAZY LOADING - Farmer subpages
const FarmerLandMapping = lazy(() => import("@/pages/farmer/farmer-land-mapping"));
const FarmerPaymentServices = lazy(() => import("@/pages/farmer/farmer-payment-services"));

// PROFILE MANAGEMENT SYSTEM - Universal for all user types
const ProfileRouter = lazy(() => import("@/pages/profile"));

// ADDITIONAL AUTH PAGES
import MonitoringLogin from "@/pages/auth/monitoring-login";

function App() {
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
            
            {/* POLIPUS MODULE PORTALS - All 7 modules - LAZY LOADED */}
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
            
            {/* NEW SEPARATE PORTAL ROUTES */}
            <Route path="/farmer-portal-login" component={FarmerPortalLogin} />
            <Route path="/buyer-portal-login" component={BuyerPortalLogin} />
            <Route path="/regulatory-login" component={RegulatoryLogin} />
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
            
            {/* AGRICULTURAL DASHBOARD ROUTES - LAZY LOADED */}
            <Route path="/farmer-dashboard" component={createLazyRoute(FarmerDashboard)} />
            <Route path="/buyer-dashboard" component={createLazyRoute(BuyerDashboard)} />
            
            {/* AGRICULTURAL INSPECTOR PORTALS - LAZY LOADED */}
            <Route path="/warehouse-inspector-dashboard" component={createLazyRoute(WarehouseInspectorDashboard)} />
            <Route path="/port-inspector-dashboard" component={createLazyRoute(PortInspectorDashboard)} />
            <Route path="/unified-land-inspector-dashboard" component={createLazyRoute(UnifiedLandInspectorDashboard)} />
            
            {/* REGULATORY PORTALS - LAZY LOADED */}
            <Route path="/regulatory-portal-classic" component={createLazyRoute(RegulatoryPortalClassic)} />
            <Route path="/ddgaf-dashboard" component={createLazyRoute(DDGAFDashboard)} />
            <Route path="/ddgots-dashboard" component={createLazyRoute(DDGOTSDashboard)} />
            <Route path="/dg-dashboard" component={createLazyRoute(DGDashboard)} />
            
            {/* MANAGEMENT PAGES */}
            <Route path="/buyer-management" component={createLazyRoute(BuyerManagement)} />
            <Route path="/inspector-management" component={createLazyRoute(InspectorManagement)} />
            <Route path="/exporter-management" component={createLazyRoute(ExporterManagement)} />
            
            {/* EXPORTER PORTAL - LAZY LOADED */}
            <Route path="/exporter-dashboard" component={createLazyRoute(ExporterDashboard)} />
            <Route path="/world-market-pricing" component={createLazyRoute(WorldMarketPricing)} />
            <Route path="/sellers-hub" component={createLazyRoute(SellersHub)} />
            <Route path="/exporter/orders" component={createLazyRoute(ExporterOrders)} />
            <Route path="/exporter/marketplace" component={createLazyRoute(ExporterMarketplace)} />
            <Route path="/exporter/certificates" component={createLazyRoute(ExporterCertificates)} />
            <Route path="/exporter/messages" component={createLazyRoute(ExporterMessages)} />
            <Route path="/exporter/shipments" component={createLazyRoute(ExporterShipments)} />
            <Route path="/exporter/analytics" component={createLazyRoute(ExporterAnalytics)} />
            <Route path="/exporter-payment-services" component={createLazyRoute(ExporterPaymentServices)} />
            
            {/* SYSTEM ADMIN PORTAL - LAZY LOADED */}
            <Route path="/agritrace-admin-portal" component={createLazyRoute(AgriTraceAdminPortal)} />
            
            {/* AGRICULTURAL PORTAL PAGES - LAZY LOADED */}
            <Route path="/onboard-farmer" component={createLazyRoute(OnboardFarmer)} />
            <Route path="/create-land-plot" component={createLazyRoute(CreateLandPlot)} />
            <Route path="/eudr-assessment" component={createLazyRoute(EudrAssessment)} />
            <Route path="/generate-reports" component={createLazyRoute(GenerateReports)} />
            <Route path="/farmers-list" component={createLazyRoute(FarmersList)} />
            <Route path="/land-plots-list" component={createLazyRoute(LandPlotsList)} />
            <Route path="/land-plot-details/:id" component={createLazyRoute(LandPlotDetails)} />
            
            {/* ADDITIONAL AGRICULTURAL PAGES - LAZY LOADED */}
            <Route path="/eudr-compliance" component={createLazyRoute(EudrCompliance)} />
            <Route path="/mobile-app-dashboard" component={createLazyRoute(MobileAppDashboard)} />
            <Route path="/buyer-dashboard-old" component={createLazyRoute(BuyerDashboardOld)} />
            <Route path="/dashboard" component={createLazyRoute(Dashboard)} />
            <Route path="/monitoring-dashboard" component={createLazyRoute(MonitoringDashboard)} />
            <Route path="/integrated-dashboard" component={createLazyRoute(IntegratedDashboard)} />
            
            {/* SPECIALIZED AGRICULTURAL PAGES - LAZY LOADED */}
            <Route path="/farm-plots" component={createLazyRoute(FarmPlots)} />
            <Route path="/land-mapping-dashboard" component={createLazyRoute(LandMappingDashboard)} />
            <Route path="/field-agent-dashboard" component={createLazyRoute(FieldAgentDashboard)} />
            <Route path="/mobile-app-download" component={createLazyRoute(MobileAppDownload)} />
            <Route path="/pwa-test" component={createLazyRoute(PwaTest)} />
            <Route path="/buyer-exporter-network" component={createLazyRoute(BuyerExporterNetwork)} />
            <Route path="/inspector-farmer-land-management" component={createLazyRoute(InspectorFarmerLandManagement)} />
            
            {/* FARMER SUBPAGES - LAZY LOADED */}
            <Route path="/farmer-land-mapping" component={createLazyRoute(FarmerLandMapping)} />
            <Route path="/farmer-payment-services" component={createLazyRoute(FarmerPaymentServices)} />
            
            {/* ADDITIONAL AUTH PAGES */}
            <Route path="/monitoring-login" component={MonitoringLogin} />
            
            {/* UTILITY REDIRECTS - LAZY LOADED */}
            <Route path="/install-app" component={createLazyRoute(MobileAppDownload)} />
            
            {/* PROFILE MANAGEMENT SYSTEM - Universal for all user types */}
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