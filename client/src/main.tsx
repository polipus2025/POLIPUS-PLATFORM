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
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-hidden">
            <DashboardTest />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<SimpleApp />);
