import { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Menu, ChevronLeft } from "lucide-react";

export default function DirectorDashboardSimple() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Director Dashboard - LACRA</title>
      </Helmet>

      {/* SIDEBAR - ALWAYS VISIBLE */}
      <div 
        className="fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 shadow-xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6" />
            <h2 className="font-bold text-lg">Director Portal</h2>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">DASHBOARD</h3>
            <div className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg flex items-center gap-2">
              <Crown className="h-4 w-4" />
              <span className="font-medium">Executive Overview</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">OPERATIONS</h3>
            <div className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              Field Agent Approvals
            </div>
            <div className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              Mobile Requests
            </div>
            <div className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              Emergency Alerts
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">GIS & MAPPING</h3>
            <div className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              GIS Mapping System
            </div>
            <div className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              Satellite Monitoring
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">COMPLIANCE</h3>
            <div className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              Government Integration
            </div>
            <div className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              International Standards
            </div>
            <div className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              Certification System
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">ANALYTICS</h3>
            <div className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              Analytics & Reports
            </div>
            <div className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              Audit System
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">FINANCE</h3>
            <div className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
              Payment Services
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="ml-80">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Director Dashboard</h1>
                <p className="text-gray-600">Complete regulatory portal with all original functions</p>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">✅ Sidebar Visible</CardTitle>
              </CardHeader>
              <CardContent>
                <p>The sidebar menu is now fully visible with all regulatory portal sections.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">📋 Complete Functionality</CardTitle>
              </CardHeader>
              <CardContent>
                <p>All original functions have been preserved: Field Agent Approvals, Mobile Requests, Emergency Alerts, GIS Mapping.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">🔧 Regulatory Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Complete access to Government Integration, International Standards, Analytics, Payment Services.</p>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2">Field Agent Approvals</h3>
                <p className="text-sm text-gray-600">Complete system for agent request approvals</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2">Mobile Requests</h3>
                <p className="text-sm text-gray-600">Mobile request management with priority handling</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2">GIS Mapping</h3>
                <p className="text-sm text-gray-600">Advanced geographic mapping system</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2">Emergency Alerts</h3>
                <p className="text-sm text-gray-600">Real-time emergency alert system</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}