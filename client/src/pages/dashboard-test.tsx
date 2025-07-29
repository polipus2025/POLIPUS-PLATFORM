import { Helmet } from "react-helmet";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Package, CheckCircle, AlertTriangle, TrendingUp, Plus, FileCheck, Shield, Download } from "lucide-react";

export default function DashboardTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Helmet>
          <title>Dashboard Test - AgriTrace360™ LACRA</title>
          <meta name="description" content="Test dashboard for LACRA compliance system" />
        </Helmet>
        
        {/* Success Banner */}
        <div className="mb-8 p-6 bg-green-100 border-2 border-green-500 rounded-lg text-center">
          <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            🎉 DASHBOARD TEST FUNZIONANTE! 🎉
          </h1>
          <p className="text-green-700 text-lg">
            Se vedi questo messaggio, la dashboard si sta caricando correttamente!
          </p>
        </div>

        {/* Dashboard Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Activity className="h-10 w-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                LACRA Dashboard
              </h1>
              <p className="text-slate-600 text-lg mt-1">
                Agricultural Compliance Management System
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Commodities</p>
                  <p className="text-3xl font-bold text-blue-600">1,247</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                  <p className="text-3xl font-bold text-green-600">94.7%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-3xl font-bold text-red-600">8</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Export Volume</p>
                  <p className="text-3xl font-bold text-purple-600">2.4M</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Overview */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Compliance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">127</div>
                <div className="text-sm text-gray-600">Farms Compliant</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-4xl font-bold text-yellow-600 mb-2">23</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-4xl font-bold text-red-600 mb-2">5</div>
                <div className="text-sm text-gray-600">Non-Compliant</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-5 w-5 mr-2" />
                Add Commodity
              </Button>
              <Button className="h-16 bg-green-600 hover:bg-green-700 text-white">
                <FileCheck className="h-5 w-5 mr-2" />
                New Inspection
              </Button>
              <Button className="h-16 bg-purple-600 hover:bg-purple-700 text-white">
                <Shield className="h-5 w-5 mr-2" />
                Generate Certificate
              </Button>
              <Button className="h-16 bg-orange-600 hover:bg-orange-700 text-white">
                <Download className="h-5 w-5 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Final Test Message */}
        <div className="mt-8 p-6 bg-blue-100 border-2 border-blue-500 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">
            ✅ DASHBOARD COMPLETAMENTE CARICATA!
          </h2>
          <p className="text-blue-700">
            Se vedi tutte le sezioni sopra (metriche, compliance, quick actions), 
            allora la dashboard funziona perfettamente!
          </p>
        </div>
      </div>
    </div>
  );
}