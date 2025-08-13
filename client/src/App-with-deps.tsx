import React from 'react';
import { Route, Switch } from 'wouter';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import FrontPage from "@/pages/front-page";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Switch>
          <Route path="/" component={FrontPage} />
          <Route>
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                <p className="text-gray-600 mb-4">Return to the home page to access the platform.</p>
                <a href="/" className="text-blue-600 hover:text-blue-800 underline">
                  Go to Home
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}