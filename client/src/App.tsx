import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import Commodities from "@/pages/commodities";
import Inspections from "@/pages/inspections";
import Certifications from "@/pages/certifications";
import Reports from "@/pages/reports";
import DataEntry from "@/pages/data-entry";
import Farmers from "@/pages/farmers";
import FarmPlots from "@/pages/farm-plots";
import CropPlanning from "@/pages/crop-planning";
import InputManagement from "@/pages/input-management";
import Procurement from "@/pages/procurement";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/commodities" component={Commodities} />
      <Route path="/inspections" component={Inspections} />
      <Route path="/certifications" component={Certifications} />
      <Route path="/reports" component={Reports} />
      <Route path="/data-entry" component={DataEntry} />
      <Route path="/farmers" component={Farmers} />
      <Route path="/farm-plots" component={FarmPlots} />
      <Route path="/crop-planning" component={CropPlanning} />
      <Route path="/input-management" component={InputManagement} />
      <Route path="/procurement" component={Procurement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1">
              <Router />
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
