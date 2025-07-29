import { Link } from 'wouter';

function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/api/placeholder/60/60" 
                alt="LACRA Logo" 
                className="h-12 w-12 rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold">LACRA</h1>
                <p className="text-sm text-slate-300">Liberia Agriculture Commodity Regulatory Authority</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300">Agricultural Compliance Platform</p>
              <p className="text-lg font-semibold">AgriTrace360™</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Agricultural Traceability & Compliance Platform
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-12">
            Comprehensive commodity tracking, regulatory compliance monitoring, and farm management 
            platform supporting all 15 Liberian counties and major cash crops with EUDR compliance integration.
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-1">Real-time</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">Analytics</p>
              <p className="text-slate-600 text-sm">Platform</p>
            </div>
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-1">GPS Farm</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">Mapping</p>
              <p className="text-slate-600 text-sm">System</p>
            </div>
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-1">EUDR</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">100%</p>
              <p className="text-slate-600 text-sm">Compliance</p>
            </div>
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-1">Government</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">Integration</p>
              <p className="text-slate-600 text-sm">Active</p>
            </div>
          </div>
        </div>

        {/* Access Portals */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Access Portals</h2>
          <p className="text-slate-600 mb-8">Role-based authentication for agricultural compliance management</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Regulatory Portal */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Regulatory Portal</h3>
              <ul className="text-sm text-slate-600 mb-4 space-y-1">
                <li>LACRA administrators</li>
                <li>Compliance monitoring</li>
                <li>System analytics</li>
                <li>Government integration</li>
                <li>User management</li>
              </ul>
              <Link href="/regulatory-login">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Access Portal
                </button>
              </Link>
            </div>

            {/* Farmer Portal */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Farmer Portal</h3>
              <ul className="text-sm text-slate-600 mb-4 space-y-1">
                <li>Agricultural producers</li>
                <li>Farm plot mapping</li>
                <li>Batch code tracking</li>
                <li>Crop planning</li>
                <li>Compliance docs</li>
              </ul>
              <Link href="/farmer-login">
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                  Access Portal
                </button>
              </Link>
            </div>

            {/* Field Agent Portal */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Field Agent Portal</h3>
              <ul className="text-sm text-slate-600 mb-4 space-y-1">
                <li>Extension officers</li>
                <li>Farmer onboarding</li>
                <li>GPS field mapping</li>
                <li>Mobile data collection</li>
                <li>Field reports</li>
              </ul>
              <Link href="/field-agent-login">
                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors">
                  Access Portal
                </button>
              </Link>
            </div>

            {/* Exporter Portal */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Exporter Portal</h3>
              <ul className="text-sm text-slate-600 mb-4 space-y-1">
                <li>Commodity exporters</li>
                <li>Export order management</li>
                <li>LACRA compliance</li>
                <li>Network partnerships</li>
                <li>Export analytics</li>
              </ul>
              <Link href="/exporter-login">
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                  Access Portal
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Platform Statistics</h3>
          <p className="text-slate-600 mb-8">Comprehensive agricultural compliance management coverage</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-1">Liberian</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">15</p>
              <p className="text-slate-600 text-sm">Counties</p>
            </div>
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-1">Cash Crop</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">20+</p>
              <p className="text-slate-600 text-sm">Types</p>
            </div>
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-1">EUDR</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">100%</p>
              <p className="text-slate-600 text-sm">Compliant</p>
            </div>
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-1">Government</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">3</p>
              <p className="text-slate-600 text-sm">Integrations</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-xl font-semibold text-slate-900 mb-4">Need Help Accessing the System?</h4>
          <p className="text-slate-600 mb-6">
            Contact your local LACRA office or system administrator for account setup and technical support.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h5 className="font-semibold text-slate-900 mb-2">LACRA Hotline</h5>
              <p className="text-slate-600">+231 77 LACRA-1</p>
            </div>
            <div className="text-center">
              <h5 className="font-semibold text-slate-900 mb-2">Email Support</h5>
              <p className="text-slate-600">support@lacra.gov.lr</p>
            </div>
            <div className="text-center">
              <h5 className="font-semibold text-slate-900 mb-2">Emergency</h5>
              <p className="text-slate-600">+231 88 AGRI-911</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;