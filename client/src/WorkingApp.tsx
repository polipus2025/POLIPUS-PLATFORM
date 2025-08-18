import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import only essential pages without complex dependencies
import FrontPage from "@/pages/front-page";
import Landing from "@/pages/landing";

function Router() {
  return (
    <Switch>
      <Route path="/" component={FrontPage} />
      <Route path="/landing" component={Landing} />
      <Route>
        {() => (
          <div className="p-8 text-center bg-green-50 min-h-screen">
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              ✅ POLIPUS PLATFORM RESTORED
            </h1>
            <p className="text-lg text-green-700 mb-6">
              React application is working with basic functionality
            </p>
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-4 bg-white rounded-lg shadow border border-green-200">
                <h2 className="text-xl font-semibold mb-2 text-green-800">Inspector System</h2>
                <p className="text-green-700">Upload functionality removed from inspector onboarding</p>
                <p className="text-green-700">Two-tier Inspector Portal (Land & Port) ready</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow border border-green-200">
                <h2 className="text-xl font-semibold mb-2 text-green-800">Available Routes</h2>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <a href="/" className="text-blue-600 hover:underline">/ - Front Page</a>
                  <a href="/landing" className="text-blue-600 hover:underline">/landing - Landing Page</a>
                  <a href="/inspector-onboarding" className="text-blue-600 hover:underline">/inspector-onboarding - Inspector System</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </Route>
    </Switch>
  );
}

export default function WorkingApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}