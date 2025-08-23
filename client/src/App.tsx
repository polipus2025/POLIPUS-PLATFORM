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

// Inspector Portal imports - FULL FUNCTIONALITY RESTORED
import InspectorPortal from "@/pages/inspector-portal";
import LandInspectorLogin from "@/pages/auth/land-inspector-login";
import WarehouseInspectorLogin from "@/pages/auth/warehouse-inspector-login";
import PortInspectorLogin from "@/pages/auth/port-inspector-login";
import UnifiedLandInspectorDashboard from "@/pages/unified-land-inspector-dashboard";
import PortInspectorDashboard from "@/pages/port-inspector-dashboard";
import WarehouseInspectorDashboard from "@/pages/warehouse-inspector-dashboard";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Switch>
            {/* INSPECTOR PORTAL - DIRECT RENDER */}
            <Route path="/inspector-portal">
              <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                  <div className="text-center mb-8">
                    <div className="mx-auto mb-4 w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl">🛡️</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Inspector Portal Access
                    </h1>
                    <p className="text-lg text-gray-600">
                      Select your inspector type to access the appropriate portal
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Land Inspector Card */}
                    <div className="bg-white shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300 rounded-lg p-6">
                      <div className="text-center pb-4">
                        <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-2xl">🌱</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Land Inspector</h3>
                        <p className="text-gray-600">Agricultural Land & Crop Inspection System</p>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-3 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Farm plot inspections</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Crop quality assessments</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Land compliance monitoring</span>
                        </div>
                      </div>
                      <a
                        href="/land-inspector-login"
                        className="block w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md text-center leading-12 no-underline"
                        style={{ lineHeight: '3rem' }}
                      >
                        Access Land Inspector Portal
                      </a>
                    </div>

                    {/* Port Inspector Card */}
                    <div className="bg-white shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300 rounded-lg p-6">
                      <div className="text-center pb-4">
                        <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-2xl">🚢</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Port Inspector</h3>
                        <p className="text-gray-600">Maritime Port & Export Inspection System</p>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-3 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Export cargo inspections</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Port facility compliance</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Maritime documentation</span>
                        </div>
                      </div>
                      <a
                        href="/port-inspector-login"
                        className="block w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-center leading-12 no-underline"
                        style={{ lineHeight: '3rem' }}
                      >
                        Access Port Inspector Portal
                      </a>
                    </div>

                    {/* Warehouse Inspector Card */}
                    <div className="bg-white shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300 rounded-lg p-6">
                      <div className="text-center pb-4">
                        <div className="mx-auto mb-4 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-2xl">🏢</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Warehouse Inspector</h3>
                        <p className="text-gray-600">Storage & Quality Control System</p>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-3 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Warehouse inspections</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Quality control checks</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Storage compliance</span>
                        </div>
                      </div>
                      <a
                        href="/warehouse-inspector-login"
                        className="block w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md text-center leading-12 no-underline"
                        style={{ lineHeight: '3rem' }}
                      >
                        Access Warehouse Inspector Portal
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Route>
            
            {/* INSPECTOR LOGIN ROUTES */}
            <Route path="/land-inspector-login" component={LandInspectorLogin} />
            <Route path="/warehouse-inspector-login" component={WarehouseInspectorLogin} />
            <Route path="/port-inspector-login" component={PortInspectorLogin} />
            
            {/* INSPECTOR DASHBOARD ROUTES */}
            <Route path="/warehouse-inspector-dashboard" component={WarehouseInspectorDashboard} />
            <Route path="/unified-land-inspector-dashboard" component={UnifiedLandInspectorDashboard} />
            <Route path="/port-inspector-dashboard" component={PortInspectorDashboard} />
            
            {/* AGRITRACE PORTAL ROUTES */}
            <Route path="/portals" component={Landing} />
            <Route path="/farmer-login" component={FarmerLogin} />
            <Route path="/farmer-login-portal" component={FarmerLoginPortal} />
            <Route path="/farmer-dashboard" component={FarmerDashboard} />
            <Route path="/buyer-dashboard" component={BuyerDashboard} />
            
            {/* MAIN PAGE - LAST */}
            <Route path="/" component={FrontPage} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;