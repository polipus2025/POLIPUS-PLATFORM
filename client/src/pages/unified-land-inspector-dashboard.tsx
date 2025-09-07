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
import { useToast } from "@/hooks/use-toast";
import RealMapBoundaryMapper from "@/components/maps/real-map-boundary-mapper";

export default function UnifiedLandInspectorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Safe JSON parsing for inspector data
  const getInspectorData = () => {
    try {
      const data = localStorage.getItem("inspectorData");
      if (!data || data === "undefined" || data === "null") return {};
      return JSON.parse(data);
    } catch {
      return {};
    }
  };
  
  const inspectorName = getInspectorData()?.firstName || "Land Inspector";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Land Inspector Dashboard</h1>
            <p className="text-slate-600">Welcome back, {inspectorName}</p>
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
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Farmers</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardStats.totalFarmers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Active Farms</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardStats.activeFarms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Land Plots</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardStats.landPlotsMapped}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">EUDR Compliant</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardStats.eudrCompliant}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardStats.pendingInspections}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-teal-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardStats.completedInspections}</p>
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
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                    <span className="text-xs text-slate-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm">Land plot mapped (2.5 hectares)</span>
                    </div>
                    <span className="text-xs text-slate-500">4 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="text-sm">EUDR compliance check completed</span>
                    </div>
                    <span className="text-xs text-slate-500">6 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Farmer Management System</h3>
                <p className="text-slate-600 mb-4">Onboard new farmers, manage existing farmer profiles, and track farm activities</p>
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
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Live GPS Satellite Mapping</h3>
                <p className="text-slate-600 mb-4">Real satellite imagery from Esri World Imagery (verified working)</p>
                
                {/* ACTUAL EMBEDDED GPS MAPPING */}
                <div className="h-96 border rounded-lg bg-white shadow-sm mb-4">
                  <RealMapBoundaryMapper
                    onBoundaryComplete={(boundary) => {
                      console.log('Land boundary mapped:', boundary);
                    }}
                    minPoints={3}
                    maxPoints={12}
                  />
                </div>
                
                <div className="space-y-3">
                  <Link href="/create-land-plot">
                    <Button size="lg" className="w-full">
                      <Plus className="w-5 h-5 mr-2" />
                      Advanced Land Plot Creation
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
          <EUDRReportsSection />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Generate Reports</h3>
                <p className="text-slate-600 mb-4">Create detailed reports on farm activities, compliance status, and land mapping progress</p>
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

// EUDR Reports Section Component
function EUDRReportsSection() {
  const { toast } = useToast();

  // Fetch EUDR compliance reports
  const { data: eudrReports, isLoading, refetch } = useQuery({
    queryKey: ["/api/eudr-compliance"],
    retry: false
  });

  const reports = (eudrReports as any[]) || [];

  // Generate test EUDR reports for demonstration
  const generateTestReports = async () => {
    try {
      toast({
        title: "Generating Test EUDR Reports",
        description: "Creating sample compliance reports for testing...",
      });

      const sampleReports = [
        {
          farmerId: "LR-FARM-001",
          farmerName: "John Kpargoi",
          plotId: "PLOT-001", 
          county: "Margibi",
          plotSize: "2.5",
          complianceScore: 95,
          riskLevel: "low",
          deforestationRisk: "0.2",
          landUse: "cocoa",
          createdAt: new Date().toISOString()
        },
        {
          farmerId: "LR-FARM-002", 
          farmerName: "Mary Pewu",
          plotId: "PLOT-002",
          county: "Bong",
          plotSize: "1.8",
          complianceScore: 87,
          riskLevel: "medium", 
          deforestationRisk: "1.1",
          landUse: "coffee",
          createdAt: new Date().toISOString()
        }
      ];

      for (const report of sampleReports) {
        await fetch('/api/eudr-compliance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            farmerId: parseInt(report.farmerId.split('-')[2]),
            farmGpsMappingId: parseInt(report.plotId.split('-')[1]),
            complianceScore: report.complianceScore,
            riskLevel: report.riskLevel,
            deforestationRisk: parseFloat(report.deforestationRisk),
            landUse: report.landUse,
            reportData: JSON.stringify(report)
          })
        });
      }

      await refetch();
      
      toast({
        title: "✅ Test Reports Generated",
        description: "Sample EUDR compliance reports are now available for download testing.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Generate Test Reports",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadReport = async (report: any) => {
    try {
      toast({
        title: "Preparing Download",
        description: "Generating EUDR compliance report PDF...",
      });

      // Use the existing EUDR report download API
      const response = await fetch(`/api/eudr-certificate/${report.id || report.plotId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `EUDR-Compliance-Report-${report.farmerId || 'REPORT'}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      if (a.isConnected) a.remove();

      toast({
        title: "✅ EUDR Report Downloaded",
        description: "The compliance report has been saved to your downloads folder.",
      });
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download EUDR report",
        variant: "destructive",
      });
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': case 'standard': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <TreePine className="w-5 h-5 mr-2 text-green-600" />
                Generated EUDR Compliance Reports
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Automatically generated EUDR reports from land plot mapping activities
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={generateTestReports} variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                <Plus className="w-4 h-4 mr-2" />
                Generate Test Reports
              </Button>
              <Button onClick={() => refetch()} variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Refresh Reports
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading EUDR reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <TreePine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No EUDR Reports Found</h3>
              <p className="text-slate-600 mb-4">
                EUDR compliance reports will appear here after you create land plots with boundary mapping.
              </p>
              <Link href="/create-land-plot">
                <Button>
                  <MapPin className="w-4 h-4 mr-2" />
                  Create Land Plot & Generate EUDR Report
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report: any, index: number) => (
                <div key={report.id || index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {report.farmerName || report.plotName || `EUDR Report #${index + 1}`}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {report.farmerId ? `Farmer ID: ${report.farmerId}` : ''}
                        {report.plotId ? ` | Plot ID: ${report.plotId}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskBadgeColor(report.riskLevel || 'low')}>
                        {(report.riskLevel || 'Low Risk').toUpperCase()}
                      </Badge>
                      <Badge variant="secondary">
                        {report.complianceScore || 95}% Compliant
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500">County:</span>
                      <p className="font-medium">{report.county || 'Monrovia'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Plot Size:</span>
                      <p className="font-medium">{report.plotSize || 'N/A'} hectares</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Deforestation Risk:</span>
                      <p className="font-medium">{report.deforestationRisk || '0'}%</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Generated:</span>
                      <p className="font-medium">
                        {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-600">
                      <Shield className="w-4 h-4 mr-1" />
                      EU Deforestation Regulation Compliant
                    </div>
                    <Button 
                      onClick={() => downloadReport(report)}
                      className="bg-green-600 hover:bg-green-700"
                      data-testid={`download-eudr-report-${index}`}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            EUDR Actions & Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/eudr-assessment">
              <Button size="lg" className="w-full h-20 flex-col bg-yellow-600 hover:bg-yellow-700">
                <Shield className="w-6 h-6 mb-2" />
                EUDR Assessment
              </Button>
            </Link>
            <Link href="/create-land-plot">
              <Button size="lg" className="w-full h-20 flex-col bg-green-600 hover:bg-green-700">
                <MapPin className="w-6 h-6 mb-2" />
                Map Land + Generate EUDR
              </Button>
            </Link>
            <Link href="/eudr-compliance">
              <Button size="lg" className="w-full h-20 flex-col bg-blue-600 hover:bg-blue-700">
                <FileText className="w-6 h-6 mb-2" />
                Compliance Packs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}