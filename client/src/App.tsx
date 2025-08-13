import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import FrontPage from "@/pages/front-page";

// Login Components
import RegulatoryLogin from "@/pages/auth/regulatory-login";
import FarmerLogin from "@/pages/auth/farmer-login";
import FieldAgentLogin from "@/pages/auth/field-agent-login";
import TestFieldAgentLogin from "@/pages/auth/test-field-agent-login";
import MobileFieldAgentLogin from "@/pages/auth/mobile-field-agent-login";
import ExporterLogin from "@/pages/auth/exporter-login";
import MonitoringLogin from "@/pages/auth/monitoring-login";

// LiveTrace Login Components
import LiveTraceRegulatoryLogin from "@/pages/auth/live-trace-regulatory-login";
import LiveTraceFarmerLogin from "@/pages/auth/live-trace-farmer-login";
import LiveTraceFieldAgentLogin from "@/pages/auth/live-trace-field-agent-login";
import LiveTraceExporterLogin from "@/pages/auth/live-trace-exporter-login";

// LandMap360 Login
import LandMap360Login from "@/pages/auth/landmap360-login";

// Mine Watch Login Components
import MineWatchRegulatoryLogin from "@/pages/auth/mine-watch-regulatory-login";
import MineWatchMiningEngineerLogin from "@/pages/auth/mine-watch-mining-engineer-login";
import MineWatchMineOperatorLogin from "@/pages/auth/mine-watch-mine-operator-login";
import MineWatchEnvironmentalPortalLogin from "@/pages/auth/mine-watch-environmental-portal-login";
import MineWatchTransportCoordinatorLogin from "@/pages/auth/mine-watch-transport-coordinator-login";

// Forest Guard Login Components
import ForestGuardRegulatoryLogin from "@/pages/auth/forest-guard-regulatory-login";
import ForestGuardRangerLogin from "@/pages/auth/forest-guard-ranger-login";
import ForestGuardConservationOfficerLogin from "@/pages/auth/forest-guard-conservation-officer-login";
import ForestGuardWildlifeBiologistLogin from "@/pages/auth/forest-guard-wildlife-biologist-login";
import ForestGuardCommunityLiaisonLogin from "@/pages/auth/forest-guard-community-liaison-login";

// Aqua Trace Login Components
import AquaTraceRegulatoryLogin from "@/pages/auth/aqua-trace-regulatory-login";
import AquaTraceMarineBiologistLogin from "@/pages/auth/aqua-trace-marine-biologist-login";
import AquaTraceCoastGuardLogin from "@/pages/auth/aqua-trace-coast-guard-login";
import AquaTraceHarborMasterLogin from "@/pages/auth/aqua-trace-harbor-master-login";

// Blue Carbon 360 Login Components
import BlueCarbon360RegulatoryLogin from "@/pages/auth/blue-carbon360-regulatory-login";
import BlueCarbonConservationEconomistLogin from "@/pages/auth/blue-carbon-conservation-economist-login";
import BlueCarbonMarineConservationLogin from "@/pages/auth/blue-carbon-marine-conservation-login";
import BlueCarbonPolicyAdvisoryLogin from "@/pages/auth/blue-carbon-policy-advisory-login";

// Carbon Trace Login Components
import CarbonTraceRegulatoryLogin from "@/pages/auth/carbon-trace-regulatory-login";
import CarbonTraceSustainabilityManagerLogin from "@/pages/auth/carbon-trace-sustainability-manager-login";
import CarbonTraceCarbonAuditorLogin from "@/pages/auth/carbon-trace-carbon-auditor-login";
import CarbonTraceClimatePolicyAnalystLogin from "@/pages/auth/carbon-trace-climate-policy-analyst-login";

// Other essential components
import GPSTest from "@/pages/gps-test";
import Landing from "@/pages/landing";

// Portal Components
import LiveTracePortal from "@/pages/portals/live-trace-portal";
import LandMap360Portal from "@/pages/portals/land-map360-portal";
import MineWatchPortal from "@/pages/portals/mine-watch-portal";
import ForestGuardPortal from "@/pages/portals/forest-guard-portal";
import AquaTracePortal from "@/pages/portals/aqua-trace-portal";
import BlueCarbon360Portal from "@/pages/portals/blue-carbon360-portal";
import CarbonTracePortal from "@/pages/portals/carbon-trace-portal";

function Router() {
  return (
    <Switch>
      {/* ORIGINAL POLIPUS FRONT PAGE */}
      <Route path="/" component={FrontPage} />
      <Route path="/home" component={FrontPage} />
      <Route path="/front-page" component={FrontPage} />
      <Route path="/main" component={FrontPage} />
      
      {/* CORE AUTHENTICATION ROUTES */}
      <Route path="/regulatory-login" component={RegulatoryLogin} />
      <Route path="/farmer-login" component={FarmerLogin} />
      <Route path="/field-agent-login" component={FieldAgentLogin} />
      <Route path="/test-field-agent-login" component={TestFieldAgentLogin} />
      <Route path="/mobile-field-agent-login" component={MobileFieldAgentLogin} />
      <Route path="/exporter-login" component={ExporterLogin} />
      <Route path="/monitoring-login" component={MonitoringLogin} />

      {/* LIVETRACE AUTHENTICATION */}
      <Route path="/live-trace-regulatory-login" component={LiveTraceRegulatoryLogin} />
      <Route path="/live-trace-farmer-login" component={LiveTraceFarmerLogin} />
      <Route path="/live-trace-field-agent-login" component={LiveTraceFieldAgentLogin} />
      <Route path="/live-trace-exporter-login" component={LiveTraceExporterLogin} />

      {/* LANDMAP360 AUTHENTICATION */}
      <Route path="/landmap360-login" component={LandMap360Login} />

      {/* MINE WATCH AUTHENTICATION */}
      <Route path="/mine-watch-regulatory-login" component={MineWatchRegulatoryLogin} />
      <Route path="/mine-watch-mining-engineer-login" component={MineWatchMiningEngineerLogin} />
      <Route path="/mine-watch-mine-operator-login" component={MineWatchMineOperatorLogin} />
      <Route path="/mine-watch-environmental-portal-login" component={MineWatchEnvironmentalPortalLogin} />
      <Route path="/mine-watch-transport-coordinator-login" component={MineWatchTransportCoordinatorLogin} />

      {/* FOREST GUARD AUTHENTICATION */}
      <Route path="/forest-guard-regulatory-login" component={ForestGuardRegulatoryLogin} />
      <Route path="/forest-guard-ranger-login" component={ForestGuardRangerLogin} />
      <Route path="/forest-guard-conservation-officer-login" component={ForestGuardConservationOfficerLogin} />
      <Route path="/forest-guard-wildlife-biologist-login" component={ForestGuardWildlifeBiologistLogin} />
      <Route path="/forest-guard-community-liaison-login" component={ForestGuardCommunityLiaisonLogin} />

      {/* AQUA TRACE AUTHENTICATION */}
      <Route path="/aqua-trace-regulatory-login" component={AquaTraceRegulatoryLogin} />
      <Route path="/aqua-trace-marine-biologist-login" component={AquaTraceMarineBiologistLogin} />
      <Route path="/aqua-trace-coast-guard-login" component={AquaTraceCoastGuardLogin} />
      <Route path="/aqua-trace-harbor-master-login" component={AquaTraceHarborMasterLogin} />

      {/* BLUE CARBON 360 AUTHENTICATION */}
      <Route path="/blue-carbon360-regulatory-login" component={BlueCarbon360RegulatoryLogin} />
      <Route path="/blue-carbon-conservation-economist-login" component={BlueCarbonConservationEconomistLogin} />
      <Route path="/blue-carbon-marine-conservation-login" component={BlueCarbonMarineConservationLogin} />
      <Route path="/blue-carbon-policy-advisory-login" component={BlueCarbonPolicyAdvisoryLogin} />

      {/* CARBON TRACE AUTHENTICATION */}
      <Route path="/carbon-trace-regulatory-login" component={CarbonTraceRegulatoryLogin} />
      <Route path="/carbon-trace-sustainability-manager-login" component={CarbonTraceSustainabilityManagerLogin} />
      <Route path="/carbon-trace-carbon-auditor-login" component={CarbonTraceCarbonAuditorLogin} />
      <Route path="/carbon-trace-climate-policy-analyst-login" component={CarbonTraceClimatePolicyAnalystLogin} />

      {/* GPS TEST PAGE */}
      <Route path="/gps-test" component={GPSTest} />

      {/* AGRITRACE PORTAL */}
      <Route path="/portals" component={Landing} />
      <Route path="/landing" component={Landing} />

      {/* MODULE PORTALS */}
      <Route path="/live-trace" component={LiveTracePortal} />
      <Route path="/landmap360-portal" component={LandMap360Portal} />
      <Route path="/land-map360" component={LandMap360Portal} />
      <Route path="/mine-watch" component={MineWatchPortal} />
      <Route path="/forest-guard" component={ForestGuardPortal} />
      <Route path="/aqua-trace" component={AquaTracePortal} />
      <Route path="/blue-carbon360" component={BlueCarbon360Portal} />
      <Route path="/carbon-trace" component={CarbonTracePortal} />
      
      {/* DEFAULT FALLBACK - SHOW FRONT PAGE */}
      <Route component={FrontPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Router />
      </div>
      <PWAInstallPrompt />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;