import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense, lazy } from "react";

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
// TEMPORARILY COMMENTED OUT TO DEBUG LOADING ISSUES
// import Landing from "@/pages/landing";
// TESTING ONE LOGIN COMPONENT AT A TIME
import FarmerLoginSimple from "@/pages/auth/farmer-login-simple";
// import FarmerLoginPortal from "@/pages/farmer-login-portal";

// LAZY LOADING - Heavy dashboard pages - TEMPORARILY DISABLED
// const FarmerDashboard = lazy(() => import("@/pages/farmer-dashboard"));
// const BuyerDashboard = lazy(() => import("@/pages/agricultural-buyer-dashboard"));
// const WarehouseInspectorDashboard = lazy(() => import("@/pages/warehouse-inspector-dashboard"));

// LAZY LOADING - Heavy agricultural system portals - TEMPORARILY DISABLED  
// const PortInspectorDashboard = lazy(() => import("@/pages/port-inspector-dashboard"));
// const ExporterDashboard = lazy(() => import("@/pages/exporter-dashboard"));
// const UnifiedLandInspectorDashboard = lazy(() => import("@/pages/unified-land-inspector-dashboard"));
// const RegulatoryPortalClassic = lazy(() => import("@/pages/regulatory-portal-classic"));
// const DDGAFDashboard = lazy(() => import("@/pages/ddgaf-dashboard"));
// const DDGOTSDashboard = lazy(() => import("@/pages/ddgots-dashboard"));
// const DGDashboard = lazy(() => import("@/pages/dg-dashboard"));
// const AgriTraceAdminPortal = lazy(() => import("@/pages/agritrace-admin-portal"));
// const BuyerManagement = lazy(() => import("@/pages/buyer-management"));
// const InspectorManagement = lazy(() => import("@/pages/inspector-management"));
// const ExporterManagement = lazy(() => import("@/pages/exporter-management"));

// AGRICULTURAL LOGIN PAGES - ALL TEMPORARILY COMMENTED OUT
// import RegulatoryLoginSimple from "@/pages/auth/regulatory-login-simple";
// import InspectorLoginSimple from "@/pages/auth/inspector-login-simple";
// import WarehouseInspectorLogin from "@/pages/auth/warehouse-inspector-login";
// import PortInspectorLogin from "@/pages/auth/port-inspector-login";
// import LandInspectorLogin from "@/pages/auth/land-inspector-login";
// import ExporterLoginSimple from "@/pages/auth/exporter-login-simple";
// import DDGAFLogin from "@/pages/auth/ddgaf-login";
// import DDGOTSLogin from "@/pages/auth/ddgots-login";
// import DGLogin from "@/pages/auth/dg-login";
// import RegulatoryClassicLogin from "@/pages/auth/regulatory-classic-login";
// import SystemAdminLogin from "@/pages/auth/system-admin-login";

// LAZY LOADING - Polipus module portals (7 modules) - TEMPORARILY DISABLED
// const LiveTracePortal = lazy(() => import("@/pages/portals/live-trace-portal"));
// const LandMap360Portal = lazy(() => import("@/pages/portals/land-map360-portal"));
// const MineWatchPortal = lazy(() => import("@/pages/portals/mine-watch-portal"));
// const ForestGuardPortal = lazy(() => import("@/pages/portals/forest-guard-portal"));
// const AquaTracePortal = lazy(() => import("@/pages/portals/aqua-trace-portal"));
// const BlueCarbon360Portal = lazy(() => import("@/pages/portals/blue-carbon360-portal"));
// const CarbonTracePortal = lazy(() => import("@/pages/portals/carbon-trace-portal"));

// LAZY LOADING - Exporter pages - TEMPORARILY DISABLED
// const WorldMarketPricing = lazy(() => import("@/pages/world-market-pricing"));
// const SellersHub = lazy(() => import("@/pages/sellers-hub"));
// const ExporterOrders = lazy(() => import("@/pages/exporter/orders"));
// const ExporterMarketplace = lazy(() => import("@/pages/exporter/marketplace"));
// const ExporterCertificates = lazy(() => import("@/pages/exporter/certificates"));
// const ExporterMessages = lazy(() => import("@/pages/exporter/messages"));
// const ExporterShipments = lazy(() => import("@/pages/exporter/shipments"));
// const ExporterAnalytics = lazy(() => import("@/pages/exporter/analytics"));
// const ExporterPaymentServices = lazy(() => import("@/pages/exporter/exporter-payment-services"));

// LAZY LOADING - Agricultural portal pages - TEMPORARILY DISABLED
// const OnboardFarmer = lazy(() => import("@/pages/onboard-farmer"));
// const CreateLandPlot = lazy(() => import("@/pages/create-land-plot"));
// const EudrAssessment = lazy(() => import("@/pages/eudr-assessment"));
// const GenerateReports = lazy(() => import("@/pages/generate-reports"));
// const FarmersList = lazy(() => import("@/pages/farmers-list"));
// const LandPlotsList = lazy(() => import("@/pages/land-plots-list"));
// const LandPlotDetails = lazy(() => import("@/pages/land-plot-details"));

// LAZY LOADING - Additional heavy pages - TEMPORARILY DISABLED
// const EudrCompliance = lazy(() => import("@/pages/eudr-compliance"));
// const MobileAppDashboard = lazy(() => import("@/pages/mobile-app-dashboard"));
// const BuyerDashboardOld = lazy(() => import("@/pages/buyer-dashboard"));
// const Dashboard = lazy(() => import("@/pages/dashboard"));
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
            <Route path="/portals" component={FrontPage} />
            
            {/* POLIPUS MODULE PORTALS - TEMPORARILY DISABLED FOR DEBUGGING */}
            {/* <Route path="/live-trace" component={createLazyRoute(LiveTracePortal)} />
            <Route path="/landmap360-portal" component={createLazyRoute(LandMap360Portal)} />
            <Route path="/mine-watch" component={createLazyRoute(MineWatchPortal)} />
            <Route path="/forest-guard" component={createLazyRoute(ForestGuardPortal)} />
            <Route path="/aqua-trace" component={createLazyRoute(AquaTracePortal)} />
            <Route path="/blue-carbon360" component={createLazyRoute(BlueCarbon360Portal)} />
            <Route path="/carbon-trace" component={createLazyRoute(CarbonTracePortal)} /> */}
            
            
            {/* TESTING SIMPLE ROUTE INSTEAD */}
            <Route path="/farmer-login">
              <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h1 className="text-2xl font-bold mb-4">Farmer Login</h1>
                  <p className="text-gray-600 mb-6">AgriTrace360 Portal Access</p>
                  <a href="/portals" className="text-blue-600 hover:underline">← Back to Portals</a>
                </div>
              </div>
            </Route>
            {/* <Route path="/farmer-login-portal" component={FarmerLoginPortal} />
            <Route path="/farmer-login-portal" component={FarmerLoginPortal} />
            <Route path="/regulatory-login" component={RegulatoryLoginSimple} />
            <Route path="/inspector-login" component={InspectorLoginSimple} />
            <Route path="/warehouse-inspector-login" component={WarehouseInspectorLogin} />
            <Route path="/port-inspector-login" component={PortInspectorLogin} />
            <Route path="/land-inspector-login" component={LandInspectorLogin} />
            <Route path="/exporter-login" component={ExporterLoginSimple} />
            <Route path="/ddgaf-login" component={DDGAFLogin} />
            <Route path="/ddgots-login" component={DDGOTSLogin} />
            <Route path="/dg-login" component={DGLogin} />
            <Route path="/regulatory-classic-login" component={RegulatoryClassicLogin} />
            <Route path="/system-admin-login" component={SystemAdminLogin} /> */}
            
            {/* AGRICULTURAL DASHBOARD ROUTES - TEMPORARILY DISABLED */}
            {/* <Route path="/farmer-dashboard" component={createLazyRoute(FarmerDashboard)} />
            <Route path="/buyer-dashboard" component={createLazyRoute(BuyerDashboard)} />
            
            <Route path="/warehouse-inspector-dashboard" component={createLazyRoute(WarehouseInspectorDashboard)} />
            <Route path="/port-inspector-dashboard" component={createLazyRoute(PortInspectorDashboard)} />
            <Route path="/unified-land-inspector-dashboard" component={createLazyRoute(UnifiedLandInspectorDashboard)} />
            
            <Route path="/regulatory-portal-classic" component={createLazyRoute(RegulatoryPortalClassic)} />
            <Route path="/ddgaf-dashboard" component={createLazyRoute(DDGAFDashboard)} />
            <Route path="/ddgots-dashboard" component={createLazyRoute(DDGOTSDashboard)} />
            <Route path="/dg-dashboard" component={createLazyRoute(DGDashboard)} />
            
            <Route path="/buyer-management" component={createLazyRoute(BuyerManagement)} />
            <Route path="/inspector-management" component={createLazyRoute(InspectorManagement)} />
            <Route path="/exporter-management" component={createLazyRoute(ExporterManagement)} />
            
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
            
            <Route path="/agritrace-admin-portal" component={createLazyRoute(AgriTraceAdminPortal)} /> */}
            
            {/* AGRICULTURAL PORTAL PAGES - TEMPORARILY DISABLED */}
            {/* <Route path="/onboard-farmer" component={createLazyRoute(OnboardFarmer)} />
            <Route path="/create-land-plot" component={createLazyRoute(CreateLandPlot)} />
            <Route path="/eudr-assessment" component={createLazyRoute(EudrAssessment)} />
            <Route path="/generate-reports" component={createLazyRoute(GenerateReports)} />
            <Route path="/farmers-list" component={createLazyRoute(FarmersList)} />
            <Route path="/land-plots-list" component={createLazyRoute(LandPlotsList)} />
            <Route path="/land-plot-details/:id" component={createLazyRoute(LandPlotDetails)} /> */}
            
            {/* ALL ADDITIONAL PAGES TEMPORARILY DISABLED FOR DEBUGGING */}
            {/* <Route path="/eudr-compliance" component={createLazyRoute(EudrCompliance)} />
            <Route path="/mobile-app-dashboard" component={createLazyRoute(MobileAppDashboard)} />
            <Route path="/buyer-dashboard-old" component={createLazyRoute(BuyerDashboardOld)} />
            <Route path="/dashboard" component={createLazyRoute(Dashboard)} />
            <Route path="/monitoring-dashboard" component={createLazyRoute(MonitoringDashboard)} />
            <Route path="/integrated-dashboard" component={createLazyRoute(IntegratedDashboard)} />
            
            <Route path="/farm-plots" component={createLazyRoute(FarmPlots)} />
            <Route path="/land-mapping-dashboard" component={createLazyRoute(LandMappingDashboard)} />
            <Route path="/field-agent-dashboard" component={createLazyRoute(FieldAgentDashboard)} />
            <Route path="/mobile-app-download" component={createLazyRoute(MobileAppDownload)} />
            <Route path="/pwa-test" component={createLazyRoute(PwaTest)} />
            <Route path="/buyer-exporter-network" component={createLazyRoute(BuyerExporterNetwork)} />
            <Route path="/inspector-farmer-land-management" component={createLazyRoute(InspectorFarmerLandManagement)} />
            
            <Route path="/farmer-land-mapping" component={createLazyRoute(FarmerLandMapping)} />
            <Route path="/farmer-payment-services" component={createLazyRoute(FarmerPaymentServices)} /> */}
            
            {/* ALL ADDITIONAL ROUTES TEMPORARILY DISABLED FOR DEBUGGING */}
            {/* <Route path="/monitoring-login" component={MonitoringLogin} />
            <Route path="/install-app" component={createLazyRoute(MobileAppDownload)} /> */}
            
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