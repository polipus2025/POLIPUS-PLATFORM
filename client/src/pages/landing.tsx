import { Button } from "@/components/ui/button";
import { Shield, Leaf, Users, ArrowRight, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AgriTrace360™</h1>
                <p className="text-sm text-gray-600">LACRA - Agricultural Compliance Platform</p>
              </div>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="/">← Back to Polipus Platform</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center mx-auto mb-6">
            <Globe className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Agricultural Traceability Platform
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Comprehensive commodity tracking and regulatory compliance for Liberian agriculture
          </p>
        </div>

        {/* Access Portals */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Access Portals</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Regulatory Portal */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Regulatory Portal</h4>
              <p className="text-gray-600 text-sm mb-4">LACRA administrators</p>
              <Button asChild className="w-full">
                <a href="/regulatory-login">
                  Access Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* Farmer Portal */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Farmer Portal</h4>
              <p className="text-gray-600 text-sm mb-4">Agricultural producers</p>
              <Button asChild className="w-full">
                <a href="/farmer-login">
                  Access Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* Inspector Portal */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-orange-600 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Inspector Portal</h4>
              <p className="text-gray-600 text-sm mb-4">Extension officers</p>
              <Button asChild className="w-full">
                <a href="/inspector-login">
                  Access Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* Exporter Portal */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Exporter Portal</h4>
              <p className="text-gray-600 text-sm mb-4">Commodity exporters</p>
              <Button asChild className="w-full">
                <a href="/exporter-login">
                  Access Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h4 className="text-xl font-semibold text-slate-900 mb-4">
            Need Help Accessing the System?
          </h4>
          <p className="text-slate-600 mb-6">
            Contact your local LACRA office or system administrator for account setup and technical support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900">LACRA Hotline</p>
              <p className="text-slate-600">+231 77 LACRA-1</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900">Email Support</p>
              <p className="text-slate-600">support@lacra.gov.lr</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900">Emergency</p>
              <p className="text-slate-600">+231 88 AGRI-911</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-slate-600 mb-2 font-medium">
              © 2025 Liberia Agriculture Commodity Regulatory Authority (LACRA)
            </p>
            <p className="text-sm text-slate-500">
              AgriTrace360™ - Securing Liberia's Agricultural Future
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}