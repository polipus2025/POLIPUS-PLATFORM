import React from 'react';
import { Route, Switch } from 'wouter';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "@/components/ui/toaster";
import FrontPage from "@/pages/front-page";
import PortalSelection from "@/pages/portal-selection";
import FieldAgentLogin from "@/pages/auth/field-agent-login";
import FarmerLogin from "@/pages/auth/farmer-login";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Switch>
            <Route path="/" component={FrontPage} />
            <Route path="/portals" component={PortalSelection} />
            <Route path="/field-agent-login" component={FieldAgentLogin} />
            <Route path="/farmer-login" component={FarmerLogin} />
            
            <Route>
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                  <p className="text-gray-600 mb-4">Return to the home page to access the platform.</p>
                  <a href="/" className="text-blue-600 hover:text-blue-800 underline">
                    Go to Home
                  </a>
                </div>
              </div>
            </Route>
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg bg-green-600 flex items-center justify-center border-2 border-white shadow-lg">
                  <span className="text-white font-bold text-sm sm:text-lg">P</span>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900">Polipus</h1>
                <p className="text-xs sm:text-sm text-slate-600">Environmental Intelligence Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <a href="/field-agent-login" className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium">
                Field Agent
              </a>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium">
                Mobile App
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="mb-4 sm:mb-6">
            <span className="bg-blue-100 text-blue-800 border border-blue-200 text-xs sm:text-sm px-3 py-1 rounded-full">
              Environmental Intelligence Platform
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6">
            Comprehensive <span className="text-blue-600">Environmental</span>
            <br />
            <span className="text-green-600">Monitoring Solutions</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-6 sm:mb-8">
            Advanced 8-module platform providing integrated solutions for agricultural traceability, 
            environmental monitoring, and sustainable resource management across multiple ecosystems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a href="/portals" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-lg w-full sm:w-auto">
              🌾 Start with AgriTrace360
            </a>
            <a href="/integrated-dashboard" className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-medium text-lg w-full sm:w-auto">
              📊 View Dashboard
            </a>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-16">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <span className="text-green-600 text-lg sm:text-xl">✅</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">Active</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">1</p>
            <p className="text-slate-600 text-xs sm:text-sm">Module</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <span className="text-orange-600 text-lg sm:text-xl">⚙️</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">In Development</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">7</p>
            <p className="text-slate-600 text-xs sm:text-sm">Modules</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <span className="text-purple-600 text-lg sm:text-xl">🌍</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">Platform Reach</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Global</p>
            <p className="text-slate-600 text-xs sm:text-sm">Coverage</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <span className="text-blue-600 text-lg sm:text-xl">🛰️</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">Satellite Network</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">24</p>
            <p className="text-slate-600 text-xs sm:text-sm">Satellites</p>
          </div>
        </div>

        {/* Platform Modules */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <span className="text-slate-600 text-lg sm:text-xl">⚙️</span>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Platform Modules</h2>
              <p className="text-sm sm:text-base text-slate-600">Integrated environmental monitoring solutions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Agricultural Traceability */}
            <a href="/portals" className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
              <div className="flex flex-col items-center text-center space-y-3 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl">🌾</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-2">Agricultural Traceability & Compliance</h3>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Complete agricultural commodity tracking & LACRA compliance system
                  </p>
                  <span className="bg-green-100 text-green-800 border-green-200 border px-2 py-1 rounded text-xs">
                    ✅ Active
                  </span>
                </div>
                <button className="w-full text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg">
                  → Enter Platform
                </button>
              </div>
            </a>

            {/* Live Trace */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <div className="flex flex-col items-center text-center space-y-3 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl">🚛</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-2">Live Trace</h3>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Livestock movement monitoring and control system
                  </p>
                  <span className="bg-orange-100 text-orange-800 border-orange-200 border px-2 py-1 rounded text-xs">
                    Coming Soon
                  </span>
                </div>
                <button className="w-full text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg">
                  → Enter Platform
                </button>
              </div>
            </div>

            {/* Land Map360 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <div className="flex flex-col items-center text-center space-y-3 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-purple-500 flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl">🗺️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-2">Land Map360</h3>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Land mapping and dispute prevention services
                  </p>
                  <span className="bg-orange-100 text-orange-800 border-orange-200 border px-2 py-1 rounded text-xs">
                    Coming Soon
                  </span>
                </div>
                <button className="w-full text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg">
                  → Enter Platform
                </button>
              </div>
            </div>

            {/* Mine Watch */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <div className="flex flex-col items-center text-center space-y-3 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-orange-500 flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl">⛏️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-2">Mine Watch</h3>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Mineral resource protection and community safeguarding
                  </p>
                  <span className="bg-orange-100 text-orange-800 border-orange-200 border px-2 py-1 rounded text-xs">
                    Coming Soon
                  </span>
                </div>
                <button className="w-full text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg">
                  → Enter Platform
                </button>
                </div>
            </div>

            {/* Forest Guard */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <div className="flex flex-col items-center text-center space-y-3 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-teal-500 flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl">🌲</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-2">Forest Guard</h3>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Forest protection and carbon credit management
                  </p>
                  <span className="bg-orange-100 text-orange-800 border-orange-200 border px-2 py-1 rounded text-xs">
                    Coming Soon
                  </span>
                </div>
                <button className="w-full text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg">
                  → Enter Platform
                </button>
              </div>
            </div>

            {/* Aqua Trace */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <div className="flex flex-col items-center text-center space-y-3 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500 flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl">🌊</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-2">Aqua Trace</h3>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Ocean ecosystem monitoring and protection
                  </p>
                  <span className="bg-orange-100 text-orange-800 border-orange-200 border px-2 py-1 rounded text-xs">
                    Coming Soon
                  </span>
                </div>
                <button className="w-full text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg">
                  → Enter Platform
                </button>
              </div>
            </div>

            {/* Blue Carbon 360 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <div className="flex flex-col items-center text-center space-y-3 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-indigo-500 flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl">💙</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-2">Blue Carbon 360</h3>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Marine conservation economics and carbon marketplace
                  </p>
                  <span className="bg-orange-100 text-orange-800 border-orange-200 border px-2 py-1 rounded text-xs">
                    Coming Soon
                  </span>
                </div>
                <button className="w-full text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg">
                  → Enter Platform
                </button>
              </div>
            </div>

            {/* Carbon Trace */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <div className="flex flex-col items-center text-center space-y-3 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500 flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl">🌿</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-2">Carbon Trace</h3>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Environmental monitoring and carbon footprint tracking
                  </p>
                  <span className="bg-orange-100 text-orange-800 border-orange-200 border px-2 py-1 rounded text-xs">
                    Coming Soon
                  </span>
                </div>
                <button className="w-full text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg">
                  → Enter Platform
                </button>
                </div>
            </div>

          </div>
        </div>

        {/* Cross-Module Integration */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <span className="text-white text-2xl sm:text-3xl">⚡</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
            Integrated Cross-Module Dashboard  
          </h3>
          <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Access the comprehensive integrated dashboard showing real-time connectivity and data exchange 
            between all 8 modules. Monitor cross-module integration status and system-wide performance.
          </p>
          <a href="/integrated-dashboard" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2">
            📊 View Integrated Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}