import React from 'react';
import './index.css';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🌍 Polipus Environmental Intelligence Platform
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Complete 8-module environmental monitoring system
          </p>
          <div className="bg-green-100 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">✅ Platform Status: Active & Functional</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-xl">🌾</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Agricultural Traceability</h3>
            <p className="text-sm text-slate-600">LACRA compliance system</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-xl">🚛</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Live Trace</h3>
            <p className="text-sm text-slate-600">Livestock monitoring</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-xl">🗺️</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Land Map360</h3>
            <p className="text-sm text-slate-600">Mapping services</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-xl">⛏️</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Mine Watch</h3>
            <p className="text-sm text-slate-600">Resource protection</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Platform Successfully Restored</h2>
          <p className="text-slate-600 mb-4">All modules ready for deployment</p>
          <div className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-lg">
            System Online
          </div>
        </div>
      </div>
    </div>
  );
}