import React from 'react';
import { Route, Switch } from 'wouter';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "@/components/ui/toaster";

// Import existing pages from your original AgriTrace360 platform
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import FarmerDashboard from "@/pages/farmer-dashboard";
import FieldAgentDashboard from "@/pages/field-agent-dashboard";
import ExporterDashboard from "@/pages/exporter-dashboard";
import Farmers from "@/pages/farmers";
import Commodities from "@/pages/commodities";
import Inspections from "@/pages/inspections";
import Certifications from "@/pages/certifications";
import Reports from "@/pages/reports";
import Analytics from "@/pages/analytics";
import GISMapping from "@/pages/gis-mapping";
import Messaging from "@/pages/messaging";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Switch>
            {/* Your Original AgriTrace360 LACRA Platform Routes */}
            <Route path="/" component={Landing} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/farmer-dashboard" component={FarmerDashboard} />
            <Route path="/field-agent-dashboard" component={FieldAgentDashboard} />
            <Route path="/exporter-dashboard" component={ExporterDashboard} />
            <Route path="/farmers" component={Farmers} />
            <Route path="/commodities" component={Commodities} />
            <Route path="/inspections" component={Inspections} />
            <Route path="/certifications" component={Certifications} />
            <Route path="/reports" component={Reports} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/gis-mapping" component={GISMapping} />
            <Route path="/messaging" component={Messaging} />
            
            <Route>
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                  <p className="text-gray-600 mb-4">Return to the AgriTrace360 dashboard.</p>
                  <a href="/" className="text-blue-600 hover:text-blue-800 underline">
                    Back to AgriTrace360
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