import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Simple test component
function TestPage() {
  return (
    <div className="min-h-screen bg-blue-500 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Polipus Platform</h1>
        <p className="text-xl">App is working! React has mounted successfully.</p>
        <div className="mt-8">
          <a href="/field-agent-login" className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold">
            Test Field Agent Login
          </a>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={TestPage} />
      <Route path="/test" component={TestPage} />
      <Route component={TestPage} />
    </Switch>
  );
}

function App() {
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

export default App;