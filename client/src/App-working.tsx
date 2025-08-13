import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import FrontPage from "@/pages/front-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={FrontPage} />
      <Route>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1>Page Not Found</h1>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Router />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;