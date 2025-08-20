import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/landing";
import FrontPage from "@/pages/front-page";
import ExporterDashboard from "@/pages/exporter-dashboard";
import ExporterLogin from "@/pages/auth/exporter-login";

function SimpleRouter() {
  return (
    <Switch>
      <Route path="/" component={FrontPage} />
      <Route path="/landing" component={Landing} />
      <Route path="/front-page" component={FrontPage} />
      <Route path="/exporter-login" component={ExporterLogin} />
      <Route path="/exporter-dashboard" component={ExporterDashboard} />
      <Route>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Polipus Platform</h1>
            <p className="text-gray-600">Page not found</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function SimpleApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <SimpleRouter />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default SimpleApp;