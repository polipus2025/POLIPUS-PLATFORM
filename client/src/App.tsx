import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import FrontPage from "@/pages/front-page";

function Router() {
  return (
    <Switch>
      {/* FORCE ORIGINAL POLIPUS APP - ALL PATHS LEAD TO FRONT PAGE */}
      <Route path="/" component={FrontPage} />
      <Route component={FrontPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Router />
      </div>
      <PWAInstallPrompt />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;