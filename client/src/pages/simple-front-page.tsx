import React from 'react';
import { Link } from 'wouter';

export default function SimpleFrontPage() {
  console.log('✅ SimpleFrontPage component rendering...');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            🌟 POLIPUS PLATFORM
          </h1>
          <p className="text-2xl text-slate-300 mb-4">Environmental Intelligence System</p>
          <p className="text-lg text-slate-400">Comprehensive 8-Module Monitoring Platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-xl mx-auto mb-6 flex items-center justify-center text-2xl">
              ✓
            </div>
            <div className="text-4xl font-bold text-white mb-2">1/8</div>
            <div className="text-slate-400">Active Modules</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-xl mx-auto mb-6 flex items-center justify-center text-2xl">
              EU
            </div>
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-slate-400">EUDR Compliance</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-xl mx-auto mb-6 flex items-center justify-center text-2xl">
              ⚙️
            </div>
            <div className="text-4xl font-bold text-white mb-2">7</div>
            <div className="text-slate-400">In Development</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-xl mx-auto mb-6 flex items-center justify-center text-2xl">
              🌍
            </div>
            <div className="text-4xl font-bold text-white mb-2">Global</div>
            <div className="text-slate-400">Coverage</div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Agricultural Traceability */}
          <Link href="/portals">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center hover:border-green-500/40 hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-green-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl">
                🌾
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Agricultural Traceability</h3>
              <p className="text-slate-400 text-sm mb-4">Complete LACRA system for agricultural commodity tracking and EU deforestation regulation compliance</p>
              <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase">
                ✓ Active
              </span>
            </div>
          </Link>

          {/* Live Trace */}
          <Link href="/live-trace">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center hover:border-orange-500/40 hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl">
                🚛
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Trace</h3>
              <p className="text-slate-400 text-sm mb-4">Real-time livestock movement monitoring and transportation control system</p>
              <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold uppercase">
                Coming Soon
              </span>
            </div>
          </Link>

          {/* Land Map360 */}
          <Link href="/landmap360-portal">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center hover:border-purple-500/40 hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl">
                📍
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Land Map360</h3>
              <p className="text-slate-400 text-sm mb-4">Advanced land mapping services and territory dispute prevention system</p>
              <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold uppercase">
                Coming Soon
              </span>
            </div>
          </Link>

          {/* Mine Watch */}
          <Link href="/mine-watch">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center hover:border-orange-500/40 hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl">
                ⛏️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Mine Watch</h3>
              <p className="text-slate-400 text-sm mb-4">Mineral resource protection and community safeguarding monitoring</p>
              <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold uppercase">
                Coming Soon
              </span>
            </div>
          </Link>

          {/* Forest Guard */}
          <Link href="/forest-guard">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center hover:border-teal-500/40 hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl">
                🌲
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Forest Guard</h3>
              <p className="text-slate-400 text-sm mb-4">Forest conservation and carbon credit management system</p>
              <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold uppercase">
                Coming Soon
              </span>
            </div>
          </Link>

          {/* Aqua Trace */}
          <Link href="/aqua-trace">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center hover:border-indigo-500/40 hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl">
                🌊
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Aqua Trace</h3>
              <p className="text-slate-400 text-sm mb-4">Ocean and marine ecosystem monitoring with satellite integration</p>
              <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold uppercase">
                Coming Soon
              </span>
            </div>
          </Link>

          {/* Blue Carbon 360 */}
          <Link href="/blue-carbon360">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center hover:border-cyan-500/40 hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-cyan-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl">
                💙
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Blue Carbon 360</h3>
              <p className="text-slate-400 text-sm mb-4">Conservation economics and blue carbon marketplace platform</p>
              <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold uppercase">
                Coming Soon
              </span>
            </div>
          </Link>

          {/* Carbon Trace */}
          <Link href="/carbon-trace">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center hover:border-emerald-500/40 hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl">
                🌿
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Carbon Trace</h3>
              <p className="text-slate-400 text-sm mb-4">Environmental carbon monitoring and sustainability tracking</p>
              <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold uppercase">
                Coming Soon
              </span>
            </div>
          </Link>
        </div>

        {/* Bottom Status */}
        <div className="text-center py-12 border-t border-slate-700">
          <div className="text-green-400 text-2xl font-bold mb-2">
            🚀 POLIPUS PLATFORM - FULLY OPERATIONAL
          </div>
          <div className="text-slate-400">
            Environmental Intelligence • Global Monitoring • Sustainable Development
          </div>
        </div>
      </div>
    </div>
  );
}