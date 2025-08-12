import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

function FrontPageMinimal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            🌍 POLIPUS Environmental Intelligence Platform
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Comprehensive environmental monitoring across 8 specialized modules for agricultural traceability, 
            marine conservation, forest protection, and sustainable resource management.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Module Cards */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🌾</span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Agricultural Traceability</h3>
            <p className="text-sm text-slate-600">LACRA compliance system</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🚛</span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Live Trace</h3>
            <p className="text-sm text-slate-600">Livestock monitoring</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🗺️</span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Land Map360</h3>
            <p className="text-sm text-slate-600">Land mapping services</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🌊</span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Blue Carbon 360</h3>
            <p className="text-sm text-slate-600">Ocean conservation</p>
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            Access Login Portals
          </button>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={FrontPageMinimal} />
      <Route path="/front-page" component={FrontPageMinimal} />
      <Route>404 - Page Not Found</Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Router />
      </div>
    </QueryClientProvider>
  );
}

export default App;