import { Helmet } from "react-helmet";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Package, Users, Shield, TreePine, FileCheck, AlertTriangle } from "lucide-react";

export default function SimpleDashboard() {
  // Authentication check - simplified
  const authToken = localStorage.getItem("authToken");
  
  if (!authToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Authentication Required</h2>
          <p className="text-slate-600 mb-4">Please log in to access the dashboard.</p>
          <a href="/regulatory-login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Helmet>
        <title>AgriTrace360™ LACRA Dashboard | Agricultural Compliance Management</title>
        <meta name="description" content="Comprehensive agricultural commodity compliance dashboard for LACRA - Liberia Agriculture Commodity Regulatory Authority." />
      </Helmet>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">AgriTrace360™</h1>
                  <p className="text-sm text-slate-600">LACRA Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                System Online
              </Badge>
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome to AgriTrace360™</h2>
          <p className="text-slate-600">Liberia Agriculture Commodity Regulatory Authority Dashboard</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="isms-card h-60 p-10">
            <div className="flex items-center justify-between mb-4">
              <div className="isms-icon-bg-blue">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-slate-900 mb-2">2,847</h3>
              <p className="text-slate-600 font-medium">Total Commodities</p>
              <p className="text-sm text-slate-500 mt-1">Registered & Tracked</p>
            </div>
          </div>

          <div className="isms-card h-60 p-10">
            <div className="flex items-center justify-between mb-4">
              <div className="isms-icon-bg-green">
                <FileCheck className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-slate-900 mb-2">94.2%</h3>
              <p className="text-slate-600 font-medium">Compliance Rate</p>
              <p className="text-sm text-slate-500 mt-1">EUDR Standards</p>
            </div>
          </div>

          <div className="isms-card h-60 p-10">
            <div className="flex items-center justify-between mb-4">
              <div className="isms-icon-bg-yellow">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-slate-900 mb-2">1,284</h3>
              <p className="text-slate-600 font-medium">Active Farmers</p>
              <p className="text-sm text-slate-500 mt-1">Registered Users</p>
            </div>
          </div>

          <div className="isms-card h-60 p-10">
            <div className="flex items-center justify-between mb-4">
              <div className="isms-icon-bg-red">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-slate-900 mb-2">23</h3>
              <p className="text-slate-600 font-medium">Active Alerts</p>
              <p className="text-sm text-slate-500 mt-1">Requires Attention</p>
            </div>
          </div>
        </div>

        {/* EUDR Compliance Section */}
        <div className="mb-8">
          <Card className="isms-card">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="isms-icon-bg-green">
                  <TreePine className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="isms-gradient-text">EUDR Compliance Dashboard</CardTitle>
                  <p className="text-slate-600">EU Deforestation Regulation monitoring and compliance tracking</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-green-600">98.7%</h3>
                  <p className="text-sm text-slate-600">Forest Coverage</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-blue-600">127</h3>
                  <p className="text-sm text-slate-600">Satellite Monitors</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-orange-600">3</h3>
                  <p className="text-sm text-slate-600">Deforestation Alerts</p>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Generate EUDR Report
                </Button>
                <Button variant="outline">
                  View Satellite Data
                </Button>
                <Button variant="outline">
                  Export Certificates
                </Button>
                <Button variant="outline">
                  Schedule Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Message */}
        <div className="text-center py-8">
          <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-lg">
            <FileCheck className="h-5 w-5 mr-2" />
            Dashboard successfully loaded with ISMS styling!
          </div>
        </div>
      </main>
    </div>
  );
}