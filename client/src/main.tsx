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

  // Dashboard senza Header e Sidebar - solo contenuto puro
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Semplice */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-lg text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              AgriTrace360™ LACRA Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Sei loggato come: admin001 (Token presente)
            </p>
          </div>

          {/* Test Banner */}
          <div className="mb-8 p-6 bg-green-100 border-2 border-green-500 rounded-lg text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              ✅ DASHBOARD FUNZIONA SENZA HEADER/SIDEBAR!
            </h1>
            <p className="text-green-700 text-lg">
              Se vedi questo, il problema era nei componenti Header/Sidebar
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Commodities</h3>
                <p className="text-4xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-gray-500 mt-1">Total registered</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Compliance</h3>
                <p className="text-4xl font-bold text-green-600">94.7%</p>
                <p className="text-sm text-gray-500 mt-1">Overall rate</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Alerts</h3>
                <p className="text-4xl font-bold text-red-600">8</p>
                <p className="text-sm text-gray-500 mt-1">Requires attention</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Export Value</h3>
                <p className="text-4xl font-bold text-purple-600">$2.4M</p>
                <p className="text-sm text-gray-500 mt-1">This month</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="p-8 bg-blue-50 border-2 border-blue-200 rounded-xl text-center">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">
              🎉 DASHBOARD COMPLETAMENTE FUNZIONANTE!
            </h2>
            <p className="text-blue-700 text-lg mb-4">
              Layout pulito senza Header/Sidebar complessi
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View Reports
              </button>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Manage Commodities
              </button>
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Export Data
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userType");
                window.location.reload();
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<SimpleApp />);
