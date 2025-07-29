import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import FrontPage from "@/pages/front-page";
import Landing from "@/pages/landing";
import RegulatoryLogin from "@/pages/auth/regulatory-login";
import DashboardTest from "@/pages/dashboard-test";

function SimpleApp() {
  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Authentication Routes */}
          <Route path="/regulatory-login" component={RegulatoryLogin} />
          <Route path="/farmer-login" component={RegulatoryLogin} />
          <Route path="/field-agent-login" component={RegulatoryLogin} />
          <Route path="/exporter-login" component={RegulatoryLogin} />
          
          {/* Protected Dashboard */}
          {authToken ? (
            <Route path="/dashboard">
              <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 min-w-0 overflow-hidden">
                    <DashboardTest />
                  </main>
                </div>
              </div>
            </Route>
          ) : null}
          
          {/* Root route */}
          {authToken ? (
            <Route path="/">
              <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 min-w-0 overflow-hidden">
                    <DashboardTest />
                  </main>
                </div>
              </div>
            </Route>
          ) : (
            <Route path="/" component={FrontPage} />
          )}
          
          {/* Landing page */}
          <Route path="/landing" component={Landing} />
          <Route path="/portals" component={Landing} />
          
          {/* Fallback */}
          <Route>
            <div className="min-h-screen bg-green-100 flex items-center justify-center">
              <div className="text-center p-8">
                <h1 className="text-4xl font-bold text-green-800 mb-4">
                  ✅ APP SEMPLIFICATA FUNZIONA!
                </h1>
                <p className="text-green-700 text-xl mb-4">
                  Token: {authToken ? "PRESENTE" : "MANCANTE"}
                </p>
                <p className="text-green-700 text-xl mb-4">
                  User Type: {userType || "NON DEFINITO"}
                </p>
                <p className="text-green-600">
                  Vai su /regulatory-login per accedere
                </p>
              </div>
            </div>
          </Route>
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default SimpleApp;