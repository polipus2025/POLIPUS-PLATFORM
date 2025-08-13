import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import FrontPage from "@/pages/front-page";
import Landing from "@/pages/landing";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/landing" component={Landing} />
          <Route path="/portals" component={Landing} />
          <Route path="/front-page" component={FrontPage} />
          <Route>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">🌿 Polipus Platform</h1>
                <p className="text-xl opacity-80">Page not found - return to <a href="/" className="text-green-400 hover:text-green-300">home</a></p>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </QueryClientProvider>
  );
}

export default App;