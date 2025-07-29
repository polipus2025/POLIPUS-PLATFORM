import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import RegulatoryLogin from "@/pages/auth/regulatory-login";
import FrontPage from "@/pages/front-page";
import "./index.css";

function SimpleApp() {
  const authToken = localStorage.getItem("authToken");
  
  if (!authToken) {
    return (
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path="/regulatory-login" component={RegulatoryLogin} />
          <Route path="/" component={FrontPage} />
          <Route>
            <div className="min-h-screen bg-blue-100 flex items-center justify-center">
              <div className="text-center p-8">
                <h1 className="text-4xl font-bold text-blue-800 mb-4">
                  🔒 Login Required
                </h1>
                <p className="text-blue-700 text-xl mb-4">
                  Accedi con admin001/admin123
                </p>
                <a href="/regulatory-login" className="text-blue-600 underline text-lg">
                  → Vai al Login
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </QueryClientProvider>
    );
  }

  // Dashboard completa con stile ISMS elegante
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header elegante semplificato */}
        <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">AgriTrace360™</h1>
                <p className="text-sm text-slate-600">LACRA - Liberia Agriculture Regulatory Authority</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">admin001</p>
                <p className="text-xs text-slate-500">Regulatory Admin</p>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("userType");
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-slate-200/50">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🌾</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Dashboard Overview</h2>
                  <p className="text-slate-600">Agricultural Commodity Compliance Management System</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics - ISMS Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-slate-200/50 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📦</span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-800">1,247</p>
                  <p className="text-sm text-slate-500">+5.2% this month</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-700">Total Commodities</h3>
              <p className="text-sm text-slate-600">Registered agricultural products</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-slate-200/50 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">✅</span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-800">94.7%</p>
                  <p className="text-sm text-slate-500">+2.1% this week</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-700">Compliance Rate</h3>
              <p className="text-sm text-slate-600">Overall system compliance</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-slate-200/50 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">⚠️</span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-800">8</p>
                  <p className="text-sm text-slate-500">-3 resolved today</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-700">Active Alerts</h3>
              <p className="text-sm text-slate-600">Requiring immediate attention</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-slate-200/50 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📈</span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-800">$2.4M</p>
                  <p className="text-sm text-slate-500">+12.5% vs last month</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-700">Export Value</h3>
              <p className="text-sm text-slate-600">Monthly export volume</p>
            </div>
          </div>

          {/* EUDR Compliance Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-slate-200/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">🌍</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">EUDR Compliance</h3>
                  <p className="text-slate-600">EU Deforestation Regulation Status</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Compliant Commodities</span>
                  <span className="text-2xl font-bold text-green-600">87%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full" style={{width: '87%'}}></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">1,084</p>
                    <p className="text-sm text-slate-600">Verified</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">163</p>
                    <p className="text-sm text-slate-600">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-slate-200/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">🛰️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Satellite Monitoring</h3>
                  <p className="text-slate-600">Real-time Deforestation Tracking</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Satellite Coverage</span>
                  <span className="text-2xl font-bold text-blue-600">98.5%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full" style={{width: '98.5%'}}></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">127</p>
                    <p className="text-sm text-slate-600">Active Satellites</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-sm text-slate-600">New Alerts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-slate-200/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">⚡</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
                <p className="text-slate-600">Frequently used functions</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium">View Reports</div>
              </button>
              <button className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-center">
                <div className="text-2xl mb-2">🌾</div>
                <div className="font-medium">Manage Commodities</div>
              </button>
              <button className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all text-center">
                <div className="text-2xl mb-2">📋</div>
                <div className="font-medium">Quality Inspections</div>
              </button>
              <button className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all text-center">
                <div className="text-2xl mb-2">🗺️</div>
                <div className="font-medium">GIS Mapping</div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<SimpleApp />);
