import { Switch, Route } from "wouter";

// Simple working components
function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto p-8">
        <h1 className="text-5xl font-bold mb-6">Polipus Platform</h1>
        <p className="text-xl mb-8">Environmental Intelligence Platform - All 8 Modules Active</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <a href="/field-agent-login" className="bg-green-600 hover:bg-green-700 px-6 py-4 rounded-lg font-semibold transition-colors">
            Field Agent Login
          </a>
          <a href="/regulatory-login" className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-lg font-semibold transition-colors">
            Regulatory Login
          </a>
          <a href="/farmer-login" className="bg-amber-600 hover:bg-amber-700 px-6 py-4 rounded-lg font-semibold transition-colors">
            Farmer Login
          </a>
          <a href="/exporter-login" className="bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-lg font-semibold transition-colors">
            Exporter Login
          </a>
        </div>
        
        <div className="text-sm opacity-75">
          Test credentials: agent001/password123, agent002/password123, field001/password123
        </div>
      </div>
    </div>
  );
}

function SimpleFieldAgentLogin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 text-white flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Field Agent Login</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input type="text" className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white placeholder-white/50" placeholder="agent001" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white placeholder-white/50" placeholder="password123" />
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold transition-colors">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/" className="text-white/75 hover:text-white text-sm">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}

export default function SimpleApp() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/field-agent-login" component={SimpleFieldAgentLogin} />
      <Route component={HomePage} />
    </Switch>
  );
}