import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Users, 
  TreePine, 
  BarChart3, 
  FileText, 
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Leaf,
  Shield,
  Globe,
  Target,
  Navigation
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProfileDropdown from "@/components/ProfileDropdown";

export default function UnifiedLandInspectorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const inspectorName = JSON.parse(localStorage.getItem("inspectorData") || '{}')?.firstName || "Land Inspector";

  // Get dashboard statistics
  const { data: stats } = useQuery({
    queryKey: ["/api/land-inspector/dashboard-stats"],
    retry: false
  });

  const dashboardStats = {
    totalFarmers: (stats as any)?.totalFarmers || 0,
    activeFarms: (stats as any)?.activeFarms || 0,
    landPlotsMapped: (stats as any)?.landPlotsMapped || 0,
    eudrCompliant: (stats as any)?.eudrCompliant || 0,
    pendingInspections: (stats as any)?.pendingInspections || 0,
    completedInspections: (stats as any)?.completedInspections || 0
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Land Inspector Dashboard</h1>
            <p className="text-gray-600">Welcome back, {inspectorName}</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <ProfileDropdown
              userName={inspectorName}
              userEmail="inspector@land.co"
              userType="land-inspector"
              userId={inspectorName}
              onLogout={() => {
                localStorage.removeItem("inspectorData");
                window.location.href = "/inspector-login";
              }}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Farmers</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalFarmers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Farms</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeFarms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Land Plots</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.landPlotsMapped}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">EUDR Compliant</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.eudrCompliant}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingInspections}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-teal-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.completedInspections}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="farmers" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Farmer Management
          </TabsTrigger>
          <TabsTrigger value="landmapping" className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Land Mapping
          </TabsTrigger>
          <TabsTrigger value="eudr" className="flex items-center">
            <TreePine className="w-4 h-4 mr-2" />
            EUDR Compliance
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm">New farmer registration approved</span>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm">Land plot mapped (2.5 hectares)</span>
                    </div>
                    <span className="text-xs text-gray-500">4 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="text-sm">EUDR compliance check completed</span>
                    </div>
                    <span className="text-xs text-gray-500">6 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/onboard-farmer">
                    <Button className="w-full h-20 flex-col bg-green-600 hover:bg-green-700">
                      <Plus className="w-6 h-6 mb-2" />
                      Onboard Farmer
                    </Button>
                  </Link>
                  <Link href="/create-land-plot">
                    <Button className="w-full h-20 flex-col bg-blue-600 hover:bg-blue-700">
                      <MapPin className="w-6 h-6 mb-2" />
                      Map Land Plot
                    </Button>
                  </Link>
                  <Link href="/eudr-assessment">
                    <Button className="w-full h-20 flex-col bg-yellow-600 hover:bg-yellow-700">
                      <Shield className="w-6 h-6 mb-2" />
                      EUDR Check
                    </Button>
                  </Link>
                  <Link href="/generate-reports">
                    <Button className="w-full h-20 flex-col bg-purple-600 hover:bg-purple-700">
                      <FileText className="w-6 h-6 mb-2" />
                      Generate Report
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Farmer Management Tab */}
        <TabsContent value="farmers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Farmer Management</CardTitle>
                <Link href="/onboard-farmer">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Onboard New Farmer
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Farmer Management System</h3>
                <p className="text-gray-600 mb-4">Onboard new farmers, manage existing farmer profiles, and track farm activities</p>
                <div className="space-y-3">
                  <Link href="/onboard-farmer">
                    <Button size="lg" className="w-full">
                      <Plus className="w-5 h-5 mr-2" />
                      Start Farmer Onboarding
                    </Button>
                  </Link>
                  <Link href="/farmers-list">
                    <Button variant="outline" size="lg" className="w-full">
                      <Search className="w-5 h-5 mr-2" />
                      View All Farmers
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Land Mapping Tab */}
        <TabsContent value="landmapping" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Land Mapping System</CardTitle>
                <Link href="/create-land-plot">
                  <Button>
                    <MapPin className="w-4 h-4 mr-2" />
                    Create Land Plot
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Land Mapping</h3>
                <p className="text-gray-600 mb-4">Create multiple land plots for farmers using GPS mapping with satellite imagery</p>
                <div className="space-y-3">
                  <Link href="/create-land-plot">
                    <Button size="lg" className="w-full">
                      <Plus className="w-5 h-5 mr-2" />
                      Start Land Mapping
                    </Button>
                  </Link>
                  <Link href="/land-plots-list">
                    <Button variant="outline" size="lg" className="w-full">
                      <Globe className="w-5 h-5 mr-2" />
                      View All Land Plots
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EUDR Compliance Tab */}
        <TabsContent value="eudr" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>EUDR Compliance Management</CardTitle>
                <Button>
                  <Shield className="w-4 h-4 mr-2" />
                  Run Compliance Check
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <TreePine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EUDR Compliance System</h3>
                <p className="text-gray-600 mb-4">Monitor deforestation, assess compliance status, and generate EUDR reports</p>
                <div className="space-y-3">
                  <Link href="/eudr-assessment">
                    <Button size="lg" className="w-full">
                      <Shield className="w-5 h-5 mr-2" />
                      Perform EUDR Assessment
                    </Button>
                  </Link>
                  <Link href="/generate-reports">
                    <Button variant="outline" size="lg" className="w-full">
                      <Download className="w-5 h-5 mr-2" />
                      Download Compliance Reports
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Reports</h3>
                <p className="text-gray-600 mb-4">Create detailed reports on farm activities, compliance status, and land mapping progress</p>
                <div className="space-y-3">
                  <Link href="/generate-reports">
                    <Button size="lg" className="w-full">
                      <FileText className="w-5 h-5 mr-2" />
                      Generate Farm Report
                    </Button>
                  </Link>
                  <Link href="/generate-reports">
                    <Button variant="outline" size="lg" className="w-full">
                      <Download className="w-5 h-5 mr-2" />
                      Export Compliance Data
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}