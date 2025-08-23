import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";

// DIRECT IMPORT - Essential pages
import FrontPage from "@/pages/front-page";
import Landing from "@/pages/landing";
import FarmerDashboard from "@/pages/farmer-dashboard";
import BuyerDashboard from "@/pages/agricultural-buyer-dashboard";
import FarmerLogin from "@/pages/auth/farmer-login";
import FarmerLoginPortal from "@/pages/farmer-login-portal";
import WarehouseInspectorDashboard from "@/pages/warehouse-inspector-dashboard";

// AGRICULTURAL SYSTEM PORTALS
import PortInspectorDashboard from "@/pages/port-inspector-dashboard";
import ExporterDashboard from "@/pages/exporter-dashboard";
import UnifiedLandInspectorDashboard from "@/pages/unified-land-inspector-dashboard";
import RegulatoryPortalClassic from "@/pages/regulatory-portal-classic";
import DDGAFDashboard from "@/pages/ddgaf-dashboard";
import DDGOTSDashboard from "@/pages/ddgots-dashboard";
import DGDashboard from "@/pages/dg-dashboard";
import AgriTraceAdminPortal from "@/pages/agritrace-admin-portal";

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

// POLIPUS MODULE PORTALS - All 7 modules
import LiveTracePortal from "@/pages/portals/live-trace-portal";
import LandMap360Portal from "@/pages/portals/land-map360-portal";
import MineWatchPortal from "@/pages/portals/mine-watch-portal";
import ForestGuardPortal from "@/pages/portals/forest-guard-portal";
import AquaTracePortal from "@/pages/portals/aqua-trace-portal";
import BlueCarbon360Portal from "@/pages/portals/blue-carbon360-portal";
import CarbonTracePortal from "@/pages/portals/carbon-trace-portal";

// EXPORTER PAGES
import WorldMarketPricing from "@/pages/world-market-pricing";
import ExporterOrders from "@/pages/exporter/orders";
import ExporterMarketplace from "@/pages/exporter/marketplace";
import ExporterCertificates from "@/pages/exporter/certificates";
import ExporterMessages from "@/pages/exporter/messages";
import ExporterShipments from "@/pages/exporter/shipments";
import ExporterAnalytics from "@/pages/exporter/analytics";
import ExporterPaymentServices from "@/pages/exporter/exporter-payment-services";

// AGRICULTURAL PORTAL PAGES
import OnboardFarmer from "@/pages/onboard-farmer";
import CreateLandPlot from "@/pages/create-land-plot";
import EudrAssessment from "@/pages/eudr-assessment";
import GenerateReports from "@/pages/generate-reports";
import FarmersList from "@/pages/farmers-list";
import LandPlotsList from "@/pages/land-plots-list";
import LandPlotDetails from "@/pages/land-plot-details";

// ADDITIONAL AGRICULTURAL PAGES
import EudrCompliance from "@/pages/eudr-compliance";
import MobileAppDashboard from "@/pages/mobile-app-dashboard";
import BuyerDashboardOld from "@/pages/buyer-dashboard";
import Dashboard from "@/pages/dashboard";
import MonitoringDashboard from "@/pages/monitoring-dashboard";
import IntegratedDashboard from "@/pages/integrated-dashboard";

// MISSING AGRICULTURAL PAGES
import FarmPlots from "@/pages/farm-plots";
import LandMappingDashboard from "@/pages/land-mapping-dashboard";
import FieldAgentDashboard from "@/pages/field-agent-dashboard";
import MobileAppDownload from "@/pages/mobile-app-download";
import PwaTest from "@/pages/pwa-test";
import BuyerExporterNetwork from "@/pages/buyer-exporter-network";
import InspectorFarmerLandManagement from "@/pages/inspector-farmer-land-management";

// FARMER SUBPAGES
import FarmerLandMapping from "@/pages/farmer/farmer-land-mapping";
import FarmerPaymentServices from "@/pages/farmer/farmer-payment-services";

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
            
            {/* POLIPUS MODULE PORTALS - All 7 modules */}
            <Route path="/live-trace" component={LiveTracePortal} />
            <Route path="/landmap360-portal" component={LandMap360Portal} />
            <Route path="/mine-watch" component={MineWatchPortal} />
            <Route path="/forest-guard" component={ForestGuardPortal} />
            <Route path="/aqua-trace" component={AquaTracePortal} />
            <Route path="/blue-carbon360" component={BlueCarbon360Portal} />
            <Route path="/carbon-trace" component={CarbonTracePortal} />
            
            
            {/* AGRICULTURAL AUTHENTICATION ROUTES */}
            <Route path="/farmer-login" component={FarmerLogin} />
            <Route path="/farmer-login-portal" component={FarmerLoginPortal} />
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
            
            {/* AGRICULTURAL DASHBOARD ROUTES */}
            <Route path="/farmer-dashboard" component={FarmerDashboard} />
            <Route path="/buyer-dashboard" component={BuyerDashboard} />
            
            {/* AGRICULTURAL INSPECTOR PORTALS */}
            <Route path="/warehouse-inspector-dashboard" component={WarehouseInspectorDashboard} />
            <Route path="/port-inspector-dashboard" component={PortInspectorDashboard} />
            <Route path="/unified-land-inspector-dashboard" component={UnifiedLandInspectorDashboard} />
            
            {/* REGULATORY PORTALS */}
            <Route path="/regulatory-portal-classic" component={RegulatoryPortalClassic} />
            <Route path="/ddgaf-dashboard" component={DDGAFDashboard} />
            <Route path="/ddgots-dashboard" component={DDGOTSDashboard} />
            <Route path="/dg-dashboard" component={DGDashboard} />
            
            {/* EXPORTER PORTAL */}
            <Route path="/exporter-dashboard" component={ExporterDashboard} />
            <Route path="/world-market-pricing" component={WorldMarketPricing} />
            <Route path="/exporter/orders" component={ExporterOrders} />
            <Route path="/exporter/marketplace" component={ExporterMarketplace} />
            <Route path="/exporter/certificates" component={ExporterCertificates} />
            <Route path="/exporter/messages" component={ExporterMessages} />
            <Route path="/exporter/shipments" component={ExporterShipments} />
            <Route path="/exporter/analytics" component={ExporterAnalytics} />
            <Route path="/exporter-payment-services" component={ExporterPaymentServices} />
            
            {/* SYSTEM ADMIN PORTAL */}
            <Route path="/agritrace-admin-portal" component={AgriTraceAdminPortal} />
            
            {/* AGRICULTURAL PORTAL PAGES */}
            <Route path="/onboard-farmer" component={OnboardFarmer} />
            <Route path="/create-land-plot" component={CreateLandPlot} />
            <Route path="/eudr-assessment" component={EudrAssessment} />
            <Route path="/generate-reports" component={GenerateReports} />
            <Route path="/farmers-list" component={FarmersList} />
            <Route path="/land-plots-list" component={LandPlotsList} />
            <Route path="/land-plot-details/:id" component={LandPlotDetails} />
            
            {/* ADDITIONAL AGRICULTURAL PAGES */}
            <Route path="/eudr-compliance" component={EudrCompliance} />
            <Route path="/mobile-app-dashboard" component={MobileAppDashboard} />
            <Route path="/buyer-dashboard-old" component={BuyerDashboardOld} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/monitoring-dashboard" component={MonitoringDashboard} />
            <Route path="/integrated-dashboard" component={IntegratedDashboard} />
            
            {/* MISSING AGRICULTURAL PAGES */}
            <Route path="/farm-plots" component={FarmPlots} />
            <Route path="/land-mapping-dashboard" component={LandMappingDashboard} />
            <Route path="/field-agent-dashboard" component={FieldAgentDashboard} />
            <Route path="/mobile-app-download" component={MobileAppDownload} />
            <Route path="/pwa-test" component={PwaTest} />
            <Route path="/buyer-exporter-network" component={BuyerExporterNetwork} />
            <Route path="/inspector-farmer-land-management" component={InspectorFarmerLandManagement} />
            
            {/* FARMER SUBPAGES */}
            <Route path="/farmer-land-mapping" component={FarmerLandMapping} />
            <Route path="/farmer-payment-services" component={FarmerPaymentServices} />
            
            {/* ADDITIONAL AUTH PAGES */}
            <Route path="/monitoring-login" component={MonitoringLogin} />
            
            {/* UTILITY REDIRECTS */}
            <Route path="/install-app" component={MobileAppDownload} />
            
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