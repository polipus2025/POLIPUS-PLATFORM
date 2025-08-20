import { createRoot } from "react-dom/client";
import "./index.css";

// Minimal React app to test mounting
function MinimalApp() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🚀 Polipus Platform - WORKING!</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">AgriTrace360™ Quick Access</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/dashboard" className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
              <h3 className="font-medium text-green-800">Main Dashboard</h3>
              <p className="text-sm text-green-600">Click to access AgriTrace360™</p>
            </a>
            <a href="/farmer-registration" className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
              <h3 className="font-medium text-blue-800">Farmer Registration</h3>
              <p className="text-sm text-blue-600">Register new farmers</p>
            </a>
            <a href="/exporter-login" className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
              <h3 className="font-medium text-purple-800">Exporter Portal</h3>
              <p className="text-sm text-purple-600">Access exporter features</p>
            </a>
            <a href="/compliance-monitoring" className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
              <h3 className="font-medium text-orange-800">Compliance</h3>
              <p className="text-sm text-orange-600">LACRA regulatory oversight</p>
            </a>
          </div>
        </div>
        <p className="text-sm text-green-600 font-medium">✅ React is now mounting properly! Click any link above to access that module.</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<MinimalApp />);
