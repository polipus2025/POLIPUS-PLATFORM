import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import ErrorBoundary from "@/components/ErrorBoundary";
import FrontPage from "@/pages/front-page";
import Landing from "@/pages/landing";
import GPSTest from "@/pages/gps-test";
import RegulatoryLogin from "@/pages/auth/regulatory-login";
import FarmerLogin from "@/pages/auth/farmer-login";
import FieldAgentLogin from "@/pages/auth/field-agent-login";
import TestFieldAgentLogin from "@/pages/auth/test-field-agent-login";
import MobileFieldAgentLogin from "@/pages/auth/mobile-field-agent-login";
import ExporterLogin from "@/pages/auth/exporter-login";
import MonitoringLogin from "@/pages/auth/monitoring-login";

// Three-Tier Regulatory Department Authentication
import DGLogin from "@/pages/auth/dg-login";
import DDGOTSLogin from "@/pages/auth/ddgots-login";
import DDGAFLogin from "@/pages/auth/ddgaf-login";

// Three-Tier Regulatory Department Dashboards
import DGDashboard from "@/pages/dg-dashboard";
import DDGOTSDashboard from "@/pages/ddgots-dashboard";
import DDGAFDashboard from "@/pages/ddgaf-dashboard";

// LiveTrace Authentication
import LiveTraceRegulatoryLogin from "@/pages/auth/live-trace-regulatory-login";
import LiveTraceFarmerLogin from "@/pages/auth/live-trace-farmer-login";
import LiveTraceFieldAgentLogin from "@/pages/auth/live-trace-field-agent-login";
import LiveTraceExporterLogin from "@/pages/auth/live-trace-exporter-login";

// Land Map360 Authentication
import LandMap360Login from "@/pages/auth/landmap360-login";

// Mine Watch Authentication
import MineWatchRegulatoryLogin from "@/pages/auth/mine-watch-regulatory-login";
import MineWatchMiningEngineerLogin from "@/pages/auth/mine-watch-mining-engineer-login";
import MineWatchMineOperatorLogin from "@/pages/auth/mine-watch-mine-operator-login";
import MineWatchEnvironmentalPortalLogin from "@/pages/auth/mine-watch-environmental-portal-login";
import MineWatchTransportCoordinatorLogin from "@/pages/auth/mine-watch-transport-coordinator-login";

// Forest Guard Authentication
import ForestGuardRegulatoryLogin from "@/pages/auth/forest-guard-regulatory-login";
import ForestGuardRangerLogin from "@/pages/auth/forest-guard-ranger-login";
import ForestGuardConservationOfficerLogin from "@/pages/auth/forest-guard-conservation-officer-login";
import ForestGuardWildlifeBiologistLogin from "@/pages/auth/forest-guard-wildlife-biologist-login";
import ForestGuardCommunityLiaisonLogin from "@/pages/auth/forest-guard-community-liaison-login";

// Aqua Trace Authentication
import AquaTraceRegulatoryLogin from "@/pages/auth/aqua-trace-regulatory-login";
import AquaTraceMarineBiologistLogin from "@/pages/auth/aqua-trace-marine-biologist-login";
import AquaTraceCoastGuardLogin from "@/pages/auth/aqua-trace-coast-guard-login";
import AquaTraceHarborMasterLogin from "@/pages/auth/aqua-trace-harbor-master-login";

// Blue Carbon 360 Authentication
import BlueCarbon360RegulatoryLogin from "@/pages/auth/blue-carbon360-regulatory-login";
import BlueCarbonConservationEconomistLogin from "@/pages/auth/blue-carbon-conservation-economist-login";
import BlueCarbonMarineConservationLogin from "@/pages/auth/blue-carbon-marine-conservation-login";
import BlueCarbonPolicyAdvisoryLogin from "@/pages/auth/blue-carbon-policy-advisory-login";

// Carbon Trace Authentication
import CarbonTraceRegulatoryLogin from "@/pages/auth/carbon-trace-regulatory-login";
import CarbonTraceSustainabilityManagerLogin from "@/pages/auth/carbon-trace-sustainability-manager-login";
import CarbonTraceCarbonAuditorLogin from "@/pages/auth/carbon-trace-carbon-auditor-login";
import CarbonTraceClimatePolicyAnalystLogin from "@/pages/auth/carbon-trace-climate-policy-analyst-login";

// LiveTrace Portal Pages
import LiveTraceMainDashboard from "@/pages/livetrace/live-trace-main-dashboard";
import SystemOverview from "@/pages/livetrace/system-overview";
import PolicyManagement from "@/pages/livetrace/policy-management";
import LiveTraceMessaging from "@/pages/livetrace/messaging";
import FarmRegistrations from "@/pages/livetrace/farm-registrations";
import VeterinaryDashboard from "@/pages/livetrace/veterinary-dashboard";
import HealthMonitoring from "@/pages/livetrace/health-monitoring";
import DiseaseTracking from "@/pages/livetrace/disease-tracking";
import VaccinationRecords from "@/pages/livetrace/vaccination-records";
import TreatmentPlans from "@/pages/livetrace/treatment-plans";
import RancherDashboard from "@/pages/livetrace/rancher-dashboard";
import LiveTraceFarmerDashboard from "@/pages/livetrace/farmer-dashboard";
import LiveTraceFieldAgentDashboard from "@/pages/livetrace/field-agent-dashboard";
import TransportDashboard from "@/pages/livetrace/transport-dashboard";

// LandMap360 Dashboard Pages  
import LandMap360MainDashboard from "@/pages/landmap360/main-dashboard";
import SurveyorDashboard from "@/pages/landmap360/surveyor-dashboard";
import AdministratorDashboard from "@/pages/landmap360/administrator-dashboard";
import RegistrarDashboard from "@/pages/landmap360/registrar-dashboard";
import InspectorDashboard from "@/pages/landmap360/inspector-dashboard";

import MonitoringDashboard from "@/pages/monitoring-dashboard";
import Dashboard from "@/pages/dashboard";

import Commodities from "@/pages/commodities";
import ExporterDashboard from "@/pages/exporter-dashboard";
import LACRACommodityPricing from "@/pages/lacra-commodity-pricing";
import ExporterOrders from "@/pages/exporter/orders";
import ExporterMarketplace from "@/pages/exporter/marketplace";
import ExporterCertificates from "@/pages/exporter/certificates";
import ExporterMessages from "@/pages/exporter/messages";
import ExportLicense from "@/pages/export-license";
import Inspections from "@/pages/inspections";
import Certifications from "@/pages/certifications";
import Reports from "@/pages/reports";
import EudrCompliancePage from "@/pages/eudr-compliance";
import EudrAutoCompliancePage from "@/pages/eudr-auto-compliance";
import Analytics from "@/pages/analytics";
import AuditSystem from "@/pages/audit-system";
import DataEntry from "@/pages/data-entry";
import Farmers from "@/pages/farmers";
import FarmPlots from "@/pages/farm-plots";
import CropPlanning from "@/pages/crop-planning";

import GovernmentIntegration from "@/pages/government-integration";
import GISMapping from "@/pages/gis-mapping";
import FarmerGPSMapping from "@/pages/farmer-gps-mapping";
import InternationalStandards from "@/pages/international-standards";
import Verification from "@/pages/verification";
import BatchCodeGenerator from "@/pages/batch-code-generator";

import DirectorDashboard from "@/pages/director-dashboard";

import FieldAgentDashboard from "@/pages/field-agent-dashboard";
import FieldAgentFarmMapping from "@/pages/field-agent-farm-mapping";
import FarmerDashboard from "@/pages/farmer-dashboard";
import BuyerDashboard from "@/pages/agricultural-buyer-dashboard";
import BuyerFarmerConnections from "@/pages/buyer-farmer-connections";
import BuyerExporterNetwork from "@/pages/buyer-exporter-network";
import BuyerTransactionDashboard from "@/pages/buyer-transaction-dashboard";
import BuyerHarvestTracking from "@/pages/buyer-harvest-tracking";
import BuyerBusinessMetrics from "@/pages/buyer-business-metrics";
import PlatformDocumentation from "@/pages/platform-documentation";
import Messaging from "@/pages/messaging";

import ExportPermitSubmission from "@/pages/export-permit-submission";
import RealTimeVerificationDashboard from "@/pages/verification-dashboard";
import EconomicReportingPage from "@/pages/economic-reporting";
import MobileAppDashboard from "@/pages/mobile-app-dashboard";
import MobileDemo from "@/pages/mobile-demo";
import MobileAppSimulator from "@/pages/mobile-app-simulator";
import MobileQRDisplay from "@/pages/mobile-qr-display";
import MobileAppDownload from "@/pages/mobile-app-download";
import PWATest from "@/pages/pwa-test";

// New Portal Pages
import LiveTracePortal from "@/pages/portals/live-trace-portal";
import LandMap360Portal from "@/pages/portals/land-map360-portal";
import MineWatchPortal from "@/pages/portals/mine-watch-portal";
import ForestGuardPortal from "@/pages/portals/forest-guard-portal";
import AquaTracePortal from "@/pages/portals/aqua-trace-portal";
import BlueCarbon360Portal from "@/pages/portals/blue-carbon360-portal";
import SatelliteMonitoring from "@/pages/satellite-monitoring";
import CarbonTracePortal from "@/pages/portals/carbon-trace-portal";

// New Module Dashboards
import LiveTraceDashboard from "@/pages/portals/live-trace-dashboard";
import LandMap360Dashboard from "@/pages/portals/land-map360-dashboard";
import MineWatchDashboard from "@/pages/portals/mine-watch-dashboard";
import ForestGuardDashboard from "@/pages/portals/forest-guard-dashboard";
import AquaTraceDashboard from "@/pages/portals/aqua-trace-dashboard";
import BlueCarbon360Dashboard from "@/pages/portals/blue-carbon360-dashboard";
import EcosystemMonitoringPage from "@/pages/blue-carbon360/ecosystem-monitoring-page";
import ConservationProjectsPage from "@/pages/blue-carbon360/conservation-projects-page";
import CarbonMarketplacePage from "@/pages/blue-carbon360/carbon-marketplace-page";
import EconomicImpactPage from "@/pages/blue-carbon360/economic-impact-page";
import ConservationEconomicsPage from "@/pages/blue-carbon360/conservation-economics-page";
import ImpactReportsPage from "@/pages/blue-carbon360/impact-reports-page";
import ConservationNetworkPage from "@/pages/blue-carbon360/conservation-network-page";
import GlobalStandardsPage from "@/pages/blue-carbon360/global-standards-page";
import ConservationMessagingPage from "@/pages/blue-carbon360/conservation-messaging-page";
import EPAInspectorPage from "@/pages/blue-carbon360/epa-inspector-page";
import ConservationMetricsPage from "@/pages/blue-carbon360/conservation-metrics-page";
import CarbonTradingPage from "@/pages/blue-carbon360/carbon-trading-page";
import MangroveManagementPage from "@/pages/blue-carbon360/mangrove-management-page";
import MarineProtectionPage from "@/pages/blue-carbon360/marine-protection-page";
import CarbonTraceDashboard from "@/pages/portals/carbon-trace-dashboard";
import IntegratedDashboard from "@/pages/integrated-dashboard";

// Payment Pages
import PaymentServices from "@/pages/payments/payment-services";
import PaymentCheckout from "@/pages/payments/payment-checkout";
import PaymentSuccess from "@/pages/payments/payment-success";
import FarmerPaymentServices from "@/pages/farmer/farmer-payment-services";
import ExporterPaymentServices from "@/pages/exporter/exporter-payment-services";
import RegulatoryPaymentServices from "@/pages/regulatory-payment-services";
import AgriTraceDashboard from "@/pages/agritrace-dashboard";
import CertificateApprovals from "@/pages/certificate-approvals";
import InspectorOnboarding from "@/pages/inspector-onboarding";
import TestInspector from "@/pages/test-inspector";
import MinimalTest from "@/pages/minimal-test";
import InspectorManagement from "@/pages/inspector-management";
import BuyerManagement from "@/pages/buyer-management";
import ExporterManagement from "@/pages/exporter-management";
import InspectorPortal from "@/pages/inspector-portal";
import LandInspectorLogin from "@/pages/auth/land-inspector-login";
import PortInspectorLogin from "@/pages/auth/port-inspector-login";
import LandMappingDashboard from "@/pages/land-mapping-dashboard";
import InspectorFarmerLandManagement from "@/pages/inspector-farmer-land-management";

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
      
      {/* Authentication Routes - Public */}
      <Route path="/regulatory-login" component={RegulatoryLogin} />
      <Route path="/auth/regulatory-login" component={RegulatoryLogin} />
      <Route path="/farmer-login" component={FarmerLogin} />
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
              allowedUserTypes={['farmer', 'field_agent']} 
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
              allowedUserTypes={['farmer']} 
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
          <Route path="/lacra-commodity-pricing" component={LACRACommodityPricing} />
          
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
