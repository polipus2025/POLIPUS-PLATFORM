import { Link } from "wouter";

export default function InspectorLogin() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Inspector Portal Selection</h1>
          <p className="text-slate-600">Choose your inspector portal to continue</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Warehouse Inspector */}
          <Link href="/warehouse-inspector-login">
            <div className="border border-slate-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Warehouse Inspector</h3>
              <p className="text-sm text-slate-600 mb-4">Quality control and storage facility inspection</p>
              <div className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium">
                Access Portal
              </div>
            </div>
          </Link>

          {/* Port Inspector */}
          <Link href="/port-inspector-login">
            <div className="border border-slate-200 rounded-lg p-6 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Port Inspector</h3>
              <p className="text-sm text-slate-600 mb-4">Export compliance and shipping verification</p>
              <div className="bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium">
                Access Portal
              </div>
            </div>
          </Link>

          {/* Land Inspector */}
          <Link href="/land-inspector-login">
            <div className="border border-slate-200 rounded-lg p-6 hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Land Inspector</h3>
              <p className="text-sm text-slate-600 mb-4">GPS mapping and agricultural land verification</p>
              <div className="bg-orange-600 text-white py-2 px-4 rounded-md text-sm font-medium">
                Access Portal
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/portals">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
              ← Back to Agricultural Traceability & Compliance Platform
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}