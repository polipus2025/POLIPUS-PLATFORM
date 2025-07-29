import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import DashboardTest from "@/pages/dashboard-test";
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

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto">
              {/* Test immediato - senza componente esterno */}
              <div className="mb-8 p-6 bg-green-100 border-2 border-green-500 rounded-lg text-center">
                <h1 className="text-3xl font-bold text-green-800 mb-2">
                  🎉 DASHBOARD CONTENT LOADED! 🎉
                </h1>
                <p className="text-green-700 text-lg">
                  Se vedi questo banner verde, il contenuto principale funziona!
                </p>
              </div>

              {/* Metrics Cards Simple */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Commodities</p>
                      <p className="text-3xl font-bold text-blue-600">1,247</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      📦
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Compliance</p>
                      <p className="text-3xl font-bold text-green-600">94.7%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      ✅
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Alerts</p>
                      <p className="text-3xl font-bold text-red-600">8</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      ⚠️
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Exports</p>
                      <p className="text-3xl font-bold text-purple-600">2.4M</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      📈
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Success Message */}
              <div className="p-6 bg-blue-100 border-2 border-blue-500 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-blue-800 mb-2">
                  ✅ DASHBOARD COMPLETA CARICATA!
                </h2>
                <p className="text-blue-700">
                  Header + Sidebar + Contenuto principale = Tutto funziona!
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<SimpleApp />);
