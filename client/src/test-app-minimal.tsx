import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Switch, Route } from "wouter";
import FrontPage from "@/pages/immediate-fix";

function MinimalApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={FrontPage} />
        <Route path="/home" component={FrontPage} />
        <Route>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>404 - Page Not Found</h1>
            <p>The requested page could not be found.</p>
          </div>
        </Route>
      </Switch>
    </QueryClientProvider>
  );
}

export default MinimalApp;