import React from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';

// Import pages
import FrontPage from '@/pages/front-page';
import PortalSelection from '@/pages/portal-selection';

// Import auth pages  
import FieldAgentLogin from '@/pages/auth/field-agent-login';
import FarmerLogin from '@/pages/auth/farmer-login';
import ExporterLogin from '@/pages/auth/exporter-login';

// Create a default query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

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
            <Route path="/exporter-login" component={ExporterLogin} />
            
            {/* Fallback route */}
            <Route>
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                  <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
                  <a href="/" className="text-blue-600 hover:text-blue-800 underline">
                    Return to Home
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