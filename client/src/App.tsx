import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import ErrorBoundary from "@/components/ErrorBoundary";

// ⚡ INSTANT LOADING - Core pages (preloaded)
import FrontPage from "@/pages/front-page";
import RegulatoryLogin from "@/pages/auth/regulatory-login";

// ⚡ LAZY LOADING - All other components for speed
const Landing = lazy(() => import("@/pages/landing"));
const GPSTest = lazy(() => import("@/pages/gps-test"));
const SystemAdminLogin = lazy(() => import("@/pages/auth/system-admin-login"));
const RegulatoryClassicLogin = lazy(() => import("@/pages/auth/regulatory-classic-login"));
const SystemAdminPortal = lazy(() => import("@/pages/system-admin-portal"));
const RegulatoryPortalClassic = lazy(() => import("@/pages/regulatory-portal-classic"));
const FarmerLogin = lazy(() => import("@/pages/auth/farmer-login"));
const FarmerLoginPortal = lazy(() => import("@/pages/farmer-login-portal"));
const FarmerDashboard = lazy(() => import("@/pages/farmer-dashboard"));
const FarmerTestDemo = lazy(() => import("@/pages/farmer-test-demo"));
const FieldAgentLogin = lazy(() => import("@/pages/auth/field-agent-login"));
const TestFieldAgentLogin = lazy(() => import("@/pages/auth/test-field-agent-login"));
const MobileFieldAgentLogin = lazy(() => import("@/pages/auth/mobile-field-agent-login"));
const ExporterLogin = lazy(() => import("@/pages/auth/exporter-login"));
const MonitoringLogin = lazy(() => import("@/pages/auth/monitoring-login"));

// Three-Tier Regulatory Department Authentication (Lazy)
const DGLogin = lazy(() => import("@/pages/auth/dg-login"));
const DDGOTSLogin = lazy(() => import("@/pages/auth/ddgots-login"));
const DDGAFLogin = lazy(() => import("@/pages/auth/ddgaf-login"));

// Three-Tier Regulatory Department Dashboards (Lazy)
const DGDashboard = lazy(() => import("@/pages/dg-dashboard"));
const DDGOTSDashboard = lazy(() => import("@/pages/ddgots-dashboard"));
const DDGAFDashboard = lazy(() => import("@/pages/ddgaf-dashboard"));

// LiveTrace Authentication (Lazy)
const LiveTraceRegulatoryLogin = lazy(() => import("@/pages/auth/live-trace-regulatory-login"));
const LiveTraceFarmerLogin = lazy(() => import("@/pages/auth/live-trace-farmer-login"));
const LiveTraceFieldAgentLogin = lazy(() => import("@/pages/auth/live-trace-field-agent-login"));
const LiveTraceExporterLogin = lazy(() => import("@/pages/auth/live-trace-exporter-login"));

// Land Map360 Authentication (Lazy)
const LandMap360Login = lazy(() => import("@/pages/auth/landmap360-login"));

// Mine Watch Authentication (Lazy)
const MineWatchRegulatoryLogin = lazy(() => import("@/pages/auth/mine-watch-regulatory-login"));
const MineWatchMiningEngineerLogin = lazy(() => import("@/pages/auth/mine-watch-mining-engineer-login"));
const MineWatchMineOperatorLogin = lazy(() => import("@/pages/auth/mine-watch-mine-operator-login"));
const MineWatchEnvironmentalPortalLogin = lazy(() => import("@/pages/auth/mine-watch-environmental-portal-login"));
const MineWatchTransportCoordinatorLogin = lazy(() => import("@/pages/auth/mine-watch-transport-coordinator-login"));

// Forest Guard Authentication (Lazy)
const ForestGuardRegulatoryLogin = lazy(() => import("@/pages/auth/forest-guard-regulatory-login"));
const ForestGuardRangerLogin = lazy(() => import("@/pages/auth/forest-guard-ranger-login"));
const ForestGuardConservationOfficerLogin = lazy(() => import("@/pages/auth/forest-guard-conservation-officer-login"));
const ForestGuardWildlifeBiologistLogin = lazy(() => import("@/pages/auth/forest-guard-wildlife-biologist-login"));
const ForestGuardCommunityLiaisonLogin = lazy(() => import("@/pages/auth/forest-guard-community-liaison-login"));

// Aqua Trace Authentication (Lazy)
const AquaTraceRegulatoryLogin = lazy(() => import("@/pages/auth/aqua-trace-regulatory-login"));
const AquaTraceMarineBiologistLogin = lazy(() => import("@/pages/auth/aqua-trace-marine-biologist-login"));
const AquaTraceCoastGuardLogin = lazy(() => import("@/pages/auth/aqua-trace-coast-guard-login"));
const AquaTraceHarborMasterLogin = lazy(() => import("@/pages/auth/aqua-trace-harbor-master-login"));

// Blue Carbon 360 Authentication (Lazy)
const BlueCarbon360RegulatoryLogin = lazy(() => import("@/pages/auth/blue-carbon360-regulatory-login"));
const BlueCarbonConservationEconomistLogin = lazy(() => import("@/pages/auth/blue-carbon-conservation-economist-login"));
const BlueCarbonMarineConservationLogin = lazy(() => import("@/pages/auth/blue-carbon-marine-conservation-login"));
const BlueCarbonPolicyAdvisoryLogin = lazy(() => import("@/pages/auth/blue-carbon-policy-advisory-login"));

// Carbon Trace Authentication (Lazy)
const CarbonTraceRegulatoryLogin = lazy(() => import("@/pages/auth/carbon-trace-regulatory-login"));
const CarbonTraceSustainabilityManagerLogin = lazy(() => import("@/pages/auth/carbon-trace-sustainability-manager-login"));
const CarbonTraceCarbonAuditorLogin = lazy(() => import("@/pages/auth/carbon-trace-carbon-auditor-login"));
const CarbonTraceClimatePolicyAnalystLogin = lazy(() => import("@/pages/auth/carbon-trace-climate-policy-analyst-login"));

// ⚡ ALL DASHBOARD PAGES (LAZY) - Massive Performance Boost
const LiveTraceMainDashboard = lazy(() => import("@/pages/livetrace/live-trace-main-dashboard"));
const SystemOverview = lazy(() => import("@/pages/livetrace/system-overview"));
const PolicyManagement = lazy(() => import("@/pages/livetrace/policy-management"));
const LiveTraceMessaging = lazy(() => import("@/pages/livetrace/messaging"));
const FarmRegistrations = lazy(() => import("@/pages/livetrace/farm-registrations"));
const VeterinaryDashboard = lazy(() => import("@/pages/livetrace/veterinary-dashboard"));
const HealthMonitoring = lazy(() => import("@/pages/livetrace/health-monitoring"));
const DiseaseTracking = lazy(() => import("@/pages/livetrace/disease-tracking"));
const VaccinationRecords = lazy(() => import("@/pages/livetrace/vaccination-records"));
const TreatmentPlans = lazy(() => import("@/pages/livetrace/treatment-plans"));
const RancherDashboard = lazy(() => import("@/pages/livetrace/rancher-dashboard"));
const LiveTraceFarmerDashboard = lazy(() => import("@/pages/livetrace/farmer-dashboard"));
const LiveTraceFieldAgentDashboard = lazy(() => import("@/pages/livetrace/field-agent-dashboard"));
const TransportDashboard = lazy(() => import("@/pages/livetrace/transport-dashboard"));

const LandMap360MainDashboard = lazy(() => import("@/pages/landmap360/main-dashboard"));
const SurveyorDashboard = lazy(() => import("@/pages/landmap360/surveyor-dashboard"));
const AdministratorDashboard = lazy(() => import("@/pages/landmap360/administrator-dashboard"));
const RegistrarDashboard = lazy(() => import("@/pages/landmap360/registrar-dashboard"));
const InspectorDashboard = lazy(() => import("@/pages/landmap360/inspector-dashboard"));

const MonitoringDashboard = lazy(() => import("@/pages/monitoring-dashboard"));
const Dashboard = lazy(() => import("@/pages/dashboard"));

// ⚡ CORE FUNCTIONALITY PAGES (LAZY) - Speed Optimization  
const Commodities = lazy(() => import("@/pages/commodities"));
const ExporterDashboard = lazy(() => import("@/pages/exporter-dashboard"));
const WorldMarketPricing = lazy(() => import("@/pages/world-market-pricing"));
const ExporterOrders = lazy(() => import("@/pages/exporter/orders"));
const ExporterMarketplace = lazy(() => import("@/pages/exporter/marketplace"));
const ExporterCertificates = lazy(() => import("@/pages/exporter/certificates"));
const ExporterMessages = lazy(() => import("@/pages/exporter/messages"));
const ExportLicense = lazy(() => import("@/pages/export-license"));
const Inspections = lazy(() => import("@/pages/inspections"));
const Certifications = lazy(() => import("@/pages/certifications"));
const Reports = lazy(() => import("@/pages/reports"));
const EudrCompliancePage = lazy(() => import("@/pages/eudr-compliance"));
const EudrAutoCompliancePage = lazy(() => import("@/pages/eudr-auto-compliance"));
const Analytics = lazy(() => import("@/pages/analytics"));
const AuditSystem = lazy(() => import("@/pages/audit-system"));
const DataEntry = lazy(() => import("@/pages/data-entry"));
const Farmers = lazy(() => import("@/pages/farmers"));
const FarmPlots = lazy(() => import("@/pages/farm-plots"));
const CropPlanning = lazy(() => import("@/pages/crop-planning"));
const GovernmentIntegration = lazy(() => import("@/pages/government-integration"));
const GISMapping = lazy(() => import("@/pages/gis-mapping"));
// ⚡ REMAINING CORE PAGES (LAZY) - Performance Critical
const FarmerGPSMapping = lazy(() => import("@/pages/farmer-gps-mapping"));
const InternationalStandards = lazy(() => import("@/pages/international-standards"));
const Verification = lazy(() => import("@/pages/verification"));
const BatchCodeGenerator = lazy(() => import("@/pages/batch-code-generator"));
const DirectorDashboard = lazy(() => import("@/pages/director-dashboard"));
const FieldAgentDashboard = lazy(() => import("@/pages/field-agent-dashboard"));
const FieldAgentFarmMapping = lazy(() => import("@/pages/field-agent-farm-mapping"));
const BuyerDashboard = lazy(() => import("@/pages/agricultural-buyer-dashboard"));
const BuyerFarmerConnections = lazy(() => import("@/pages/buyer-farmer-connections"));
const BuyerExporterNetwork = lazy(() => import("@/pages/buyer-exporter-network"));
const BuyerTransactionDashboard = lazy(() => import("@/pages/buyer-transaction-dashboard"));
const BuyerHarvestTracking = lazy(() => import("@/pages/buyer-harvest-tracking"));
const BuyerBusinessMetrics = lazy(() => import("@/pages/buyer-business-metrics"));
const PlatformDocumentation = lazy(() => import("@/pages/platform-documentation"));
const Messaging = lazy(() => import("@/pages/messaging"));

// ⚡ MOBILE & PORTAL PAGES (LAZY) - Final Performance Boost
const ExportPermitSubmission = lazy(() => import("@/pages/export-permit-submission"));
const RealTimeVerificationDashboard = lazy(() => import("@/pages/verification-dashboard"));
const EconomicReportingPage = lazy(() => import("@/pages/economic-reporting"));
const MobileAppDashboard = lazy(() => import("@/pages/mobile-app-dashboard"));
const MobileDemo = lazy(() => import("@/pages/mobile-demo"));
const MobileAppSimulator = lazy(() => import("@/pages/mobile-app-simulator"));
const MobileQRDisplay = lazy(() => import("@/pages/mobile-qr-display"));
const MobileAppDownload = lazy(() => import("@/pages/mobile-app-download"));
const PWATest = lazy(() => import("@/pages/pwa-test"));

const LiveTracePortal = lazy(() => import("@/pages/portals/live-trace-portal"));
const LandMap360Portal = lazy(() => import("@/pages/portals/land-map360-portal"));
const MineWatchPortal = lazy(() => import("@/pages/portals/mine-watch-portal"));
const ForestGuardPortal = lazy(() => import("@/pages/portals/forest-guard-portal"));
const AquaTracePortal = lazy(() => import("@/pages/portals/aqua-trace-portal"));
const BlueCarbon360Portal = lazy(() => import("@/pages/portals/blue-carbon360-portal"));
const SatelliteMonitoring = lazy(() => import("@/pages/satellite-monitoring"));
const CarbonTracePortal = lazy(() => import("@/pages/portals/carbon-trace-portal"));

// ⚡ MODULE DASHBOARDS (LAZY) - Maximum Performance
const LiveTraceDashboard = lazy(() => import("@/pages/portals/live-trace-dashboard"));
const LandMap360Dashboard = lazy(() => import("@/pages/portals/land-map360-dashboard"));
const MineWatchDashboard = lazy(() => import("@/pages/portals/mine-watch-dashboard"));
const ForestGuardDashboard = lazy(() => import("@/pages/portals/forest-guard-dashboard"));
const AquaTraceDashboard = lazy(() => import("@/pages/portals/aqua-trace-dashboard"));
const BlueCarbon360Dashboard = lazy(() => import("@/pages/portals/blue-carbon360-dashboard"));
const EcosystemMonitoringPage = lazy(() => import("@/pages/blue-carbon360/ecosystem-monitoring-page"));
// ⚡ BLUE CARBON 360 PAGES (LAZY) - Performance Critical
const ConservationProjectsPage = lazy(() => import("@/pages/blue-carbon360/conservation-projects-page"));
const CarbonMarketplacePage = lazy(() => import("@/pages/blue-carbon360/carbon-marketplace-page"));
const EconomicImpactPage = lazy(() => import("@/pages/blue-carbon360/economic-impact-page"));
const ConservationEconomicsPage = lazy(() => import("@/pages/blue-carbon360/conservation-economics-page"));
const ImpactReportsPage = lazy(() => import("@/pages/blue-carbon360/impact-reports-page"));
const ConservationNetworkPage = lazy(() => import("@/pages/blue-carbon360/conservation-network-page"));
const GlobalStandardsPage = lazy(() => import("@/pages/blue-carbon360/global-standards-page"));
const ConservationMessagingPage = lazy(() => import("@/pages/blue-carbon360/conservation-messaging-page"));
const EPAInspectorPage = lazy(() => import("@/pages/blue-carbon360/epa-inspector-page"));
const ConservationMetricsPage = lazy(() => import("@/pages/blue-carbon360/conservation-metrics-page"));
const CarbonTradingPage = lazy(() => import("@/pages/blue-carbon360/carbon-trading-page"));
const MangroveManagementPage = lazy(() => import("@/pages/blue-carbon360/mangrove-management-page"));
const MarineProtectionPage = lazy(() => import("@/pages/blue-carbon360/marine-protection-page"));
const CarbonTraceDashboard = lazy(() => import("@/pages/portals/carbon-trace-dashboard"));
const IntegratedDashboard = lazy(() => import("@/pages/integrated-dashboard"));

// ⚡ PAYMENT PAGES (LAZY) - Speed Boost
const PaymentServices = lazy(() => import("@/pages/payments/payment-services"));
const PaymentCheckout = lazy(() => import("@/pages/payments/payment-checkout"));
const PaymentSuccess = lazy(() => import("@/pages/payments/payment-success"));
const FarmerPaymentServices = lazy(() => import("@/pages/farmer/farmer-payment-services"));
const ExporterPaymentServices = lazy(() => import("@/pages/exporter/exporter-payment-services"));
const RegulatoryPaymentServices = lazy(() => import("@/pages/regulatory-payment-services"));
// ⚡ FINAL PAGES (LAZY) - Ultimate Performance
const AgriTraceDashboard = lazy(() => import("@/pages/agritrace-dashboard"));
const CertificateApprovals = lazy(() => import("@/pages/certificate-approvals"));
const InspectorOnboarding = lazy(() => import("@/pages/inspector-onboarding"));
const TestInspector = lazy(() => import("@/pages/test-inspector"));
const MinimalTest = lazy(() => import("@/pages/minimal-test"));
const InspectorManagement = lazy(() => import("@/pages/inspector-management"));
const BuyerManagement = lazy(() => import("@/pages/buyer-management"));
const ExporterManagement = lazy(() => import("@/pages/exporter-management"));
const InspectorPortal = lazy(() => import("@/pages/inspector-portal"));
const LandInspectorLogin = lazy(() => import("@/pages/auth/land-inspector-login"));
const PortInspectorLogin = lazy(() => import("@/pages/auth/port-inspector-login"));
const LandMappingDashboard = lazy(() => import("@/pages/land-mapping-dashboard"));
const InspectorFarmerLandManagement = lazy(() => import("@/pages/inspector-farmer-land-management"));
const LandMappingManager = lazy(() => import("@/pages/landmap360/land-mapping-manager"));
const UnifiedLandInspectorDashboard = lazy(() => import("@/pages/unified-land-inspector-dashboard"));
const OnboardFarmer = lazy(() => import("@/pages/onboard-farmer"));
const CreateLandPlot = lazy(() => import("@/pages/create-land-plot"));
const FarmersList = lazy(() => import("@/pages/farmers-list"));
const LandPlotsList = lazy(() => import("@/pages/land-plots-list"));
const EUDRAssessment = lazy(() => import("@/pages/eudr-assessment"));
const GenerateReports = lazy(() => import("@/pages/generate-reports"));

const NotFound = lazy(() => import("@/pages/not-found"));

// Helper component to check user access to routes
function ProtectedRoute({ component: Component, allowedUserTypes, ...props }: any) {
  const userType = localStorage.getItem("userType");
  
  if (!allowedUserTypes.includes(userType)) {
    return <NotFound />;
  }
  
  return <Component {...props} />;
}

// ⚡ LIGHTNING FAST LOADING COMPONENT - Optimized Performance
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 text-lg font-medium">Loading...</p>
        <p className="text-slate-500 text-sm mt-2">Optimized for speed</p>
      </div>
    </div>
  );
}

function Router() {
  // Check if user is logged in and has valid role
  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  
  return (
    <Switch>
      {/* GPS Testing - Public Access */}
      <Route path="/gps-test" component={GPSTest} />
      
      {/* Authentication Routes - Public */}
      <Route path="/regulatory-login" component={RegulatoryLogin} />
      <Route path="/auth/regulatory-login" component={RegulatoryLogin} />
      
      {/* Independent Portal Authentication */}
      <Route path="/system-admin-login" component={SystemAdminLogin} />
      <Route path="/auth/system-admin-login" component={SystemAdminLogin} />
      <Route path="/regulatory-classic-login" component={RegulatoryClassicLogin} />
      <Route path="/auth/regulatory-classic-login" component={RegulatoryClassicLogin} />
      
      {/* Independent Portal Dashboards */}
      <Route path="/system-admin-portal" component={SystemAdminPortal} />
      <Route path="/regulatory-portal-classic" component={RegulatoryPortalClassic} />
      <Route path="/farmer-login" component={FarmerLogin} />
      <Route path="/farmer-login-portal" component={FarmerLoginPortal} />
      <Route path="/farmer-dashboard" component={FarmerDashboard} />
      <Route path="/farmer-test-demo" component={FarmerTestDemo} />
      <Route path="/field-agent-login" component={FieldAgentLogin} />
      <Route path="/inspector-login" component={InspectorPortal} />
      <Route path="/test-field-agent-login" component={TestFieldAgentLogin} />
      <Route path="/mobile-field-agent-login" component={MobileFieldAgentLogin} />
      <Route path="/exporter-login" component={ExporterLogin} />
      <Route path="/monitoring-login" component={MonitoringLogin} />
      
      {/* Three-Tier Regulatory Department Authentication */}
      <Route path="/auth/dg-login" component={DGLogin} />
      <Route path="/auth/ddgots-login" component={DDGOTSLogin} />
      <Route path="/auth/ddgaf-login" component={DDGAFLogin} />
      
      {/* Inspector Portal Routes */}
      <Route path="/inspector-portal" component={InspectorPortal} />
      <Route path="/auth/land-inspector-login" component={LandInspectorLogin} />
      <Route path="/auth/port-inspector-login" component={PortInspectorLogin} />
      <Route path="/land-inspector-login" component={LandInspectorLogin} />
      <Route path="/port-inspector-login" component={PortInspectorLogin} />
      <Route path="/inspector-onboarding" component={InspectorOnboarding} />
      <Route path="/land-mapping-dashboard" component={LandMappingDashboard} />
      <Route path="/inspector-farmer-land-management" component={InspectorFarmerLandManagement} />
      <Route path="/unified-land-inspector-dashboard" component={UnifiedLandInspectorDashboard} />
      <Route path="/onboard-farmer" component={OnboardFarmer} />
      <Route path="/create-land-plot" component={CreateLandPlot} />
      <Route path="/farmers-list" component={FarmersList} />
      <Route path="/land-plots-list" component={LandPlotsList} />
      <Route path="/eudr-assessment" component={EUDRAssessment} />
      <Route path="/generate-reports" component={GenerateReports} />
      <Route path="/minimal-test" component={MinimalTest} />

      {/* LiveTrace Authentication Routes */}
      <Route path="/live-trace-regulatory-login" component={LiveTraceRegulatoryLogin} />
      <Route path="/live-trace-farmer-login" component={LiveTraceFarmerLogin} />
      <Route path="/live-trace-field-agent-login" component={LiveTraceFieldAgentLogin} />
      <Route path="/live-trace-exporter-login" component={LiveTraceExporterLogin} />

      {/* Land Map360 Authentication Routes */}
      <Route path="/landmap360-login" component={LandMap360Login} />

      {/* Mine Watch Authentication Routes */}
      <Route path="/mine-watch-regulatory-login" component={MineWatchRegulatoryLogin} />
      <Route path="/mine-watch-mining-engineer-login" component={MineWatchMiningEngineerLogin} />
      <Route path="/mine-watch-mine-operator-login" component={MineWatchMineOperatorLogin} />
      <Route path="/mine-watch-environmental-portal-login" component={MineWatchEnvironmentalPortalLogin} />
      <Route path="/mine-watch-transport-coordinator-login" component={MineWatchTransportCoordinatorLogin} />

      {/* Forest Guard Authentication Routes */}
      <Route path="/forest-guard-regulatory-login" component={ForestGuardRegulatoryLogin} />
      <Route path="/forest-guard-ranger-login" component={ForestGuardRangerLogin} />
      <Route path="/forest-guard-conservation-officer-login" component={ForestGuardConservationOfficerLogin} />
      <Route path="/forest-guard-wildlife-biologist-login" component={ForestGuardWildlifeBiologistLogin} />
      <Route path="/forest-guard-community-liaison-login" component={ForestGuardCommunityLiaisonLogin} />

      {/* Aqua Trace Authentication Routes */}
      <Route path="/aqua-trace-regulatory-login" component={AquaTraceRegulatoryLogin} />
      <Route path="/aqua-trace-marine-biologist-login" component={AquaTraceMarineBiologistLogin} />
      <Route path="/aqua-trace-coast-guard-login" component={AquaTraceCoastGuardLogin} />
      <Route path="/aqua-trace-harbor-master-login" component={AquaTraceHarborMasterLogin} />

      {/* Blue Carbon 360 Authentication Routes */}
      <Route path="/blue-carbon360-regulatory-login" component={BlueCarbon360RegulatoryLogin} />
      <Route path="/blue-carbon-conservation-economist-login" component={BlueCarbonConservationEconomistLogin} />
      <Route path="/blue-carbon-marine-conservation-login" component={BlueCarbonMarineConservationLogin} />
      <Route path="/blue-carbon-policy-advisory-login" component={BlueCarbonPolicyAdvisoryLogin} />

      {/* Carbon Trace Authentication Routes */}
      <Route path="/carbon-trace-regulatory-login" component={CarbonTraceRegulatoryLogin} />
      <Route path="/carbon-trace-sustainability-manager-login" component={CarbonTraceSustainabilityManagerLogin} />
      <Route path="/carbon-trace-carbon-auditor-login" component={CarbonTraceCarbonAuditorLogin} />
      <Route path="/carbon-trace-climate-policy-analyst-login" component={CarbonTraceClimatePolicyAnalystLogin} />

      {/* LiveTrace Portal Routes */}
      <Route path="/livetrace/dashboard" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/health-monitoring" component={HealthMonitoring} />
      <Route path="/livetrace/disease-tracking" component={DiseaseTracking} />
      <Route path="/livetrace/vaccination-records" component={VaccinationRecords} />
      <Route path="/livetrace/treatment-plans" component={TreatmentPlans} />
      <Route path="/livetrace/system-overview" component={SystemOverview} />
      <Route path="/livetrace/compliance-monitoring" component={HealthMonitoring} />
      <Route path="/livetrace/disease-surveillance" component={DiseaseTracking} />
      <Route path="/livetrace/farm-registrations" component={FarmRegistrations} />
      <Route path="/livetrace/health-inspections" component={HealthMonitoring} />
      <Route path="/livetrace/quarantine-management" component={DiseaseTracking} />
      <Route path="/livetrace/export-certifications" component={VaccinationRecords} />
      <Route path="/livetrace/analytics" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/policy-management" component={PolicyManagement} />
      <Route path="/livetrace/messaging" component={LiveTraceMessaging} />
      <Route path="/livetrace/lab-results" component={HealthMonitoring} />
      <Route path="/livetrace/animal-registry" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/emergency-response" component={DiseaseTracking} />
      <Route path="/livetrace/reports" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/my-livestock" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/health-records" component={HealthMonitoring} />
      <Route path="/livetrace/vaccination-schedule" component={VaccinationRecords} />
      <Route path="/livetrace/feed-management" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/breeding-records" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/gps-tracking" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/farmer-dashboard" component={LiveTraceFarmerDashboard} />
      <Route path="/livetrace/farm-reports" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/qr-scanner" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/farm-inspections" component={HealthMonitoring} />
      <Route path="/livetrace/mobile-data-entry" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/gps-mapping" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/animal-tagging" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/photo-docs" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/health-assessments" component={HealthMonitoring} />
      <Route path="/livetrace/field-reports" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/emergency-alerts" component={DiseaseTracking} />
      <Route path="/livetrace/live-tracking" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/route-planning" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/vehicle-management" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/shipment-scheduling" component={VaccinationRecords} />
      <Route path="/livetrace/health-certificates" component={HealthMonitoring} />
      <Route path="/livetrace/delivery-tracking" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/transport-reports" component={LiveTraceMainDashboard} />
      <Route path="/livetrace/emergency-protocols" component={DiseaseTracking} />
      <Route path="/livetrace-veterinary-dashboard" component={VeterinaryDashboard} />
      <Route path="/livetrace-rancher-dashboard" component={RancherDashboard} />
      <Route path="/livetrace-field-agent-dashboard" component={LiveTraceFieldAgentDashboard} />
      <Route path="/livetrace-transport-dashboard" component={TransportDashboard} />



      {/* Three-Tier Regulatory Department Dashboard Routes - Outside auth check */}
      <Route path="/dg-dashboard" component={DGDashboard} />
      <Route path="/ddgots-dashboard" component={DDGOTSDashboard} />
      <Route path="/ddgaf-dashboard" component={DDGAFDashboard} />
      
      {/* DDGOTS Management Routes - Outside auth check (they have internal auth) */}
      <Route path="/regulatory/inspector-onboarding" component={InspectorOnboarding} />
      <Route path="/regulatory/inspector-management" component={InspectorManagement} />
      <Route path="/regulatory/buyer-management" component={BuyerManagement} />
      <Route path="/regulatory/exporter-management" component={ExporterManagement} />

      {/* Protected Routes */}
      {authToken ? (
        <>

          {/* Dashboard - Show correct component based on user type */}
          <Route path="/dashboard">
            {() => {
              const userType = localStorage.getItem("userType");
              switch(userType) {
                case 'farmer':
                  return <FarmerDashboard />;
                case 'field_agent':
                  return <FieldAgentDashboard />;
                case 'buyer':
                  return <BuyerDashboard />;
                case 'exporter':
                  return <ExporterDashboard />;
                case 'monitoring':
                  return <MonitoringDashboard />;
                case 'regulatory':
                  return <Dashboard />;
                default:
                  return <Dashboard />; // Default to regulatory dashboard
              }
            }}
          </Route>
          
          {/* Root route */}
          <Route path="/" component={FrontPage} />
          
          {/* Inspector Dashboard Route */}
          <Route path="/field-agent-dashboard">
            <ProtectedRoute 
              component={FieldAgentDashboard} 
              allowedUserTypes={['field_agent']} 
            />
          </Route>
          
          {/* Farmer Dashboard Route */}
          <Route path="/farmer-dashboard">
            <ProtectedRoute 
              component={FarmerDashboard} 
              allowedUserTypes={['farmer']} 
            />
          </Route>
          
          {/* Agricultural Buyer Portal Routes */}
          <Route path="/buyer-dashboard">
            <ProtectedRoute 
              component={BuyerDashboard} 
              allowedUserTypes={['buyer']} 
            />
          </Route>
          <Route path="/buyer-farmer-connections">
            <ProtectedRoute 
              component={BuyerFarmerConnections} 
              allowedUserTypes={['buyer']} 
            />
          </Route>
          <Route path="/buyer-exporter-network">
            <ProtectedRoute 
              component={BuyerExporterNetwork} 
              allowedUserTypes={['buyer']} 
            />
          </Route>
          <Route path="/buyer-transactions">
            <ProtectedRoute 
              component={BuyerTransactionDashboard} 
              allowedUserTypes={['buyer']} 
            />
          </Route>
          <Route path="/buyer-harvests">
            <ProtectedRoute 
              component={BuyerHarvestTracking} 
              allowedUserTypes={['buyer']} 
            />
          </Route>
          <Route path="/buyer-metrics">
            <ProtectedRoute 
              component={BuyerBusinessMetrics} 
              allowedUserTypes={['buyer']} 
            />
          </Route>
          
          {/* Exporter Portal Routes */}
          <Route path="/exporter-dashboard">
            <ProtectedRoute 
              component={ExporterDashboard} 
              allowedUserTypes={['exporter']} 
            />
          </Route>
          <Route path="/exporter/orders">
            <ProtectedRoute 
              component={lazy(() => import("@/pages/exporter/orders"))} 
              allowedUserTypes={['exporter']} 
            />
          </Route>
          <Route path="/exporter/marketplace">
            <ProtectedRoute 
              component={lazy(() => import("@/pages/exporter/marketplace"))} 
              allowedUserTypes={['exporter']} 
            />
          </Route>
          <Route path="/exporter/certificates">
            <ProtectedRoute 
              component={lazy(() => import("@/pages/exporter/certificates"))} 
              allowedUserTypes={['exporter']} 
            />
          </Route>
          <Route path="/exporter/messages">
            <ProtectedRoute 
              component={lazy(() => import("@/pages/exporter/messages"))} 
              allowedUserTypes={['exporter']} 
            />
          </Route>
          <Route path="/exporter/shipments">
            <ProtectedRoute 
              component={lazy(() => import("@/pages/exporter/shipments"))} 
              allowedUserTypes={['exporter']} 
            />
          </Route>
          <Route path="/exporter/analytics">
            <ProtectedRoute 
              component={lazy(() => import("@/pages/exporter/analytics"))} 
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
          <Route path="/inspections" component={Inspections} />
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
          <Route path="/eudr-compliance">
            <ProtectedRoute 
              component={EudrAutoCompliancePage} 
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
          
          {/* Inspector Specific Routes */}
          <Route path="/field-agent-farm-mapping">
            <ProtectedRoute 
              component={FieldAgentFarmMapping} 
              allowedUserTypes={['field_agent']} 
            />
          </Route>
          
          {/* Farmer & Inspector Routes */}
          <Route path="/farmers">
            <ProtectedRoute 
              component={Farmers} 
              allowedUserTypes={['farmer', 'field_agent', 'land_inspector']} 
            />
          </Route>
          <Route path="/farm-plots">
            <ProtectedRoute 
              component={FarmPlots} 
              allowedUserTypes={['farmer', 'field_agent']} 
            />
          </Route>
          <Route path="/farmer-gps-mapping">
            <ProtectedRoute 
              component={FarmerGPSMapping} 
              allowedUserTypes={['farmer', 'land_inspector']} 
            />
          </Route>
          <Route path="/field-agent-farm-mapping">
            <ProtectedRoute 
              component={FieldAgentFarmMapping} 
              allowedUserTypes={['field_agent']} 
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
          <Route path="/gps-test">
            <ProtectedRoute 
              component={GPSTest} 
              allowedUserTypes={['regulatory', 'field_agent']} 
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
          
          {/* LACRA Commodity Pricing - Available to all users */}
          <Route path="/world-market-pricing" component={WorldMarketPricing} />
          <Route path="/lacra-commodity-pricing" component={WorldMarketPricing} />
          
          {/* Exporter Portal Pages */}
          <Route path="/exporter/orders" component={ExporterOrders} />
          <Route path="/exporter/marketplace" component={ExporterMarketplace} />
          <Route path="/exporter/certificates" component={ExporterCertificates} />
          <Route path="/exporter/messages" component={ExporterMessages} />
          
          {/* Payment Routes - Available to all authenticated users */}
          <Route path="/payment-services" component={PaymentServices} />
          <Route path="/payment-checkout" component={PaymentCheckout} />
          <Route path="/payment-success" component={PaymentSuccess} />
          
          {/* Portal-specific Payment Routes */}
          <Route path="/regulatory-payment-services" component={RegulatoryPaymentServices} />
          <Route path="/certificate-approvals" component={CertificateApprovals} />
          <Route path="/farmer-payment-services" component={FarmerPaymentServices} />
          <Route path="/exporter-payment-services" component={ExporterPaymentServices} />
          
          {/* Document Verification - Available to all */}
          <Route path="/verification" component={Verification} />
          <Route path="/verification-dashboard">
            <ProtectedRoute 
              component={RealTimeVerificationDashboard} 
              allowedUserTypes={['regulatory', 'field_agent']} 
            />
          </Route>
          
          <Route path="/director-dashboard" component={DirectorDashboard} />
          <Route path="/mobile-app-dashboard">
            <ProtectedRoute 
              component={MobileAppDashboard} 
              allowedUserTypes={['monitoring']} 
            />
          </Route>

          <Route path="/messaging">
            <ProtectedRoute 
              component={Messaging} 
              allowedUserTypes={['regulatory', 'field_agent', 'exporter']} 
            />
          </Route>
          
        </>
      ) : (
        <>
          {/* MAIN LANDING PAGE - Polipus Logo + 8 Modules + Login Buttons */}
          <Route path="/" component={FrontPage} />
          <Route path="/dashboard" component={FrontPage} />
        </>
      )}
      
      {/* ALWAYS AVAILABLE - Primary Polipus Main Landing Page Routes */}
      <Route path="/front-page" component={FrontPage} />
      <Route path="/home" component={FrontPage} />
      <Route path="/main" component={FrontPage} />
      <Route path="/index" component={FrontPage} />
      <Route path="/landing" component={FrontPage} />
      
      {/* ALWAYS AVAILABLE - Monitoring Dashboard */}
      <Route path="/monitoring-dashboard" component={MonitoringDashboard} />
      
      {/* New Portal Routes - Public Access for Coming Soon Pages */}
      <Route path="/live-trace" component={LiveTracePortal} />
      <Route path="/land-map360" component={LandMap360Portal} />
      <Route path="/landmap360-portal" component={LandMap360Portal} />
      <Route path="/mine-watch" component={MineWatchPortal} />
      <Route path="/forest-guard" component={ForestGuardPortal} />
      <Route path="/aqua-trace" component={AquaTracePortal} />
      <Route path="/blue-carbon360" component={BlueCarbon360Portal} />
      <Route path="/carbon-trace" component={CarbonTracePortal} />
      
      {/* New Module Dashboard Routes - Fully Functional */}
      <Route path="/agritrace-dashboard" component={AgriTraceDashboard} />
      <Route path="/live-trace-dashboard" component={LiveTraceDashboard} />
      <Route path="/land-map360-dashboard" component={LandMap360Dashboard} />
      <Route path="/landmap360/main-dashboard" component={LandMap360MainDashboard} />
      <Route path="/landmap360/surveyor-dashboard" component={SurveyorDashboard} />
      <Route path="/landmap360/administrator-dashboard" component={AdministratorDashboard} />
      <Route path="/landmap360/registrar-dashboard" component={RegistrarDashboard} />
      <Route path="/landmap360/inspector-dashboard" component={InspectorDashboard} />
      
      {/* LandMap360 Inspector Module Routes */}
      <Route path="/landmap360/parcels" component={InspectorDashboard} />
      <Route path="/landmap360/gis-mapping" component={InspectorDashboard} />
      <Route path="/landmap360/surveys" component={InspectorDashboard} />
      <Route path="/landmap360/inspections" component={InspectorDashboard} />
      <Route path="/landmap360/compliance" component={InspectorDashboard} />
      <Route path="/landmap360/violations" component={InspectorDashboard} />
      <Route path="/landmap360/disputes" component={InspectorDashboard} />
      <Route path="/landmap360/documents" component={InspectorDashboard} />
      <Route path="/landmap360/imagery" component={InspectorDashboard} />
      <Route path="/landmap360/field-surveys" component={InspectorDashboard} />
      <Route path="/landmap360/gps-data" component={InspectorDashboard} />
      <Route path="/landmap360/measurement" component={InspectorDashboard} />
      <Route path="/landmap360/land-mapping-manager" component={LandMappingManager} />
      <Route path="/mine-watch-dashboard" component={MineWatchDashboard} />
      <Route path="/forest-guard-dashboard" component={ForestGuardDashboard} />
      <Route path="/aqua-trace-dashboard" component={AquaTraceDashboard} />
      <Route path="/blue-carbon360-dashboard" component={BlueCarbon360Dashboard} />
      <Route path="/satellite-monitoring" component={SatelliteMonitoring} />
      <Route path="/blue-carbon360/ecosystem-monitoring" component={EcosystemMonitoringPage} />
      <Route path="/blue-carbon360/projects" component={ConservationProjectsPage} />
      <Route path="/blue-carbon360/marketplace" component={CarbonMarketplacePage} />
      <Route path="/blue-carbon360/economic-impact" component={EconomicImpactPage} />
      <Route path="/blue-carbon360/economics" component={ConservationEconomicsPage} />
      <Route path="/blue-carbon360/reports" component={ImpactReportsPage} />
      <Route path="/blue-carbon360/network" component={ConservationNetworkPage} />
      <Route path="/blue-carbon360/standards" component={GlobalStandardsPage} />
      <Route path="/blue-carbon360/messaging" component={ConservationMessagingPage} />
      <Route path="/blue-carbon360/epa-inspector" component={EPAInspectorPage} />
      <Route path="/blue-carbon360/metrics" component={ConservationMetricsPage} />
      <Route path="/blue-carbon360/trading" component={CarbonTradingPage} />
      <Route path="/blue-carbon360/mangroves" component={MangroveManagementPage} />
      <Route path="/blue-carbon360/protection" component={MarineProtectionPage} />
      <Route path="/carbon-trace-dashboard" component={CarbonTraceDashboard} />
      <Route path="/integrated-dashboard" component={IntegratedDashboard} />
      
      {/* Force Root Route to Always Show Polipus Main Page */}
      <Route path="/portals" component={Landing} />
      <Route path="/mobile-demo" component={MobileDemo} />
      <Route path="/mobile-app-simulator" component={MobileAppSimulator} />
      <Route path="/mobile-app-preview" component={MobileQRDisplay} />
      <Route path="/mobile-app-download" component={MobileAppDownload} />
      <Route path="/install-app" component={MobileAppDownload} />
      <Route path="/download-app" component={MobileAppDownload} />
      <Route path="/pwa-test" component={PWATest} />
      <Route path="/platform-documentation" component={PlatformDocumentation} />
      
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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Polipus Platform...</p>
              </div>
            </div>
          }>
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
          </Suspense>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
