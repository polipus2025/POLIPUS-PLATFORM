import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Camera,
  FileText,
  MapPin,
  Eye,
  Plus,
  Flag,
  Building,
  Map,
  Activity,
  Users,
  Globe,
  Ruler,
  BarChart3,
  Navigation,
  Settings,
  TreePine,
  Layers
} from "lucide-react";
import LandMapSidebar from "../../components/landmap360/landmap-sidebar";
import LandMapHeader from "../../components/landmap360/landmap-header";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function InspectorDashboard() {
  const [location] = useLocation();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  // Get the current module based on URL path
  const getCurrentModule = () => {
    if (location.includes('/parcels')) return 'parcels';
    if (location.includes('/gis-mapping')) return 'gis-mapping';
    if (location.includes('/surveys')) return 'surveys';
    if (location.includes('/inspections')) return 'inspections';
    if (location.includes('/compliance')) return 'compliance';
    if (location.includes('/violations')) return 'violations';
    if (location.includes('/disputes')) return 'disputes';
    if (location.includes('/documents')) return 'documents';
    if (location.includes('/imagery')) return 'imagery';
    if (location.includes('/field-surveys')) return 'field-surveys';
    if (location.includes('/gps-data')) return 'gps-data';
    if (location.includes('/measurement')) return 'measurement';
    return 'dashboard';
  };

  // Get user info from localStorage
  const userName = localStorage.getItem("userName");
  const county = localStorage.getItem("county");
  
  const currentModule = getCurrentModule();
  
  // Function to get module title and description
  const getModuleInfo = () => {
    switch (currentModule) {
      case 'parcels':
        return { title: 'Land Parcels Management', description: 'Manage and register land parcels' };
      case 'gis-mapping':
        return { title: 'GIS Mapping & Analysis', description: 'Interactive GIS mapping and spatial analysis' };
      case 'surveys':
        return { title: 'Survey Records', description: 'Survey records and measurement data' };
      case 'inspections':
        return { title: 'Property Inspections', description: 'Property inspection operations' };
      case 'compliance':
        return { title: 'Compliance Monitoring', description: 'Compliance monitoring and regulatory adherence' };
      case 'violations':
        return { title: 'Violation Management', description: 'Track and manage land use violations' };
      case 'disputes':
        return { title: 'Dispute Management', description: 'Land ownership dispute resolution' };
      case 'documents':
        return { title: 'Land Documentation', description: 'Document management and verification' };
      case 'imagery':
        return { title: 'Aerial Imagery & Satellite Data', description: 'Satellite imagery analysis' };
      case 'field-surveys':
        return { title: 'Field Survey Operations', description: 'Field survey operations and data collection' };
      case 'gps-data':
        return { title: 'GPS Data Management', description: 'GPS coordinates and location data' };
      case 'measurement':
        return { title: 'Measurement Tools & Analysis', description: 'Precision measurement tools' };
      default:
        return { title: 'Land Inspector Dashboard', description: 'Land management and inspection operations' };
    }
  };

  // Mock data for inspector dashboard
  const dashboardStats = {
    activeInspections: 12,
    completedInspections: 89,
    complianceRate: 87.5,
    violationsFound: 23,
    pendingFollowups: 8,
    averageInspectionTime: 3.2,
    criticalViolations: 3,
    resolvedViolations: 156
  };

  const activeInspections = [
    {
      id: "INSP-001",
      parcelId: "LM-2025-001",
      location: "Montserrado County - Paynesville",
      owner: "Moses Tuah",
      inspectionType: "Compliance Check",
      scheduledDate: "2025-01-06",
      status: "in_progress",
      priority: "high",
      violations: 2,
      area: "2.45 hectares",
      inspector: "David Kpehe"
    },
    {
      id: "INSP-002",
      parcelId: "LM-2025-002", 
      location: "Bong County - Gbarnga",
      owner: "Grace Johnson",
      inspectionType: "Pre-Registration",
      scheduledDate: "2025-01-07",
      status: "scheduled",
      priority: "medium",
      violations: 0,
      area: "1.87 hectares",
      inspector: "Sarah Wilson"
    }
  ];

  const violationReports = [
    {
      id: "VIO-001",
      parcelId: "LM-2025-003",
      location: "Margibi County - Kakata",
      owner: "Emmanuel Doe",
      violationType: "Boundary Encroachment",
      severity: "critical",
      dateReported: "2025-01-05",
      status: "under_investigation",
      inspector: "John Mensah",
      description: "Property boundary extends beyond registered limits by 0.3 hectares"
    },
    {
      id: "VIO-002",
      parcelId: "LM-2024-987",
      location: "Nimba County - Sanniquellie",
      owner: "Samuel Roberts",
      violationType: "Unauthorized Construction",
      severity: "high",
      dateReported: "2025-01-04",
      status: "pending_review",
      inspector: "Mary Johnson",
      description: "Commercial building constructed without proper land use permit"
    }
  ];

  const complianceChecks = [
    {
      id: "COMP-001",
      category: "Land Use Compliance",
      totalParcels: 45,
      compliant: 39,
      nonCompliant: 6,
      complianceRate: 86.7,
      lastUpdated: "2025-01-06"
    },
    {
      id: "COMP-002",
      category: "Building Permits",
      totalParcels: 78,
      compliant: 68,
      nonCompliant: 10,
      complianceRate: 87.2,
      lastUpdated: "2025-01-05"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'in_progress': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'scheduled': return 'text-orange-600';
      case 'under_investigation': return 'text-purple-600';
      case 'pending_review': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-orange-100 text-orange-800';
      case 'under_investigation': return 'bg-purple-100 text-purple-800';
      case 'pending_review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-blue-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const moduleInfo = getModuleInfo();

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>{moduleInfo.title} - LandMap360</title>
        <meta name="description" content={`${moduleInfo.description} for land management operations`} />
      </Helmet>

      <LandMapHeader />

      <div className="flex">
        <LandMapSidebar />
        
        {/* Main Content */}
        <div className="flex-1 ml-64" style={{ paddingTop: '0px' }}>
          <div className="p-6">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {moduleInfo.title}
                  </h1>
                  <p className="text-slate-600 flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    {moduleInfo.description}
                    {county && ` • ${county}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="montserrado">Montserrado</SelectItem>
                      <SelectItem value="bong">Bong</SelectItem>
                      <SelectItem value="nimba">Nimba</SelectItem>
                      <SelectItem value="margibi">Margibi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => window.location.href = '/landmap360/inspections'}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Inspection
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="farmer-onboarding" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="farmer-onboarding">Farmer On-Boarding</TabsTrigger>
                <TabsTrigger value="inspections">Active Inspections</TabsTrigger>
                <TabsTrigger value="violations">Violations</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              {/* Farmer On-Boarding Tab */}
              <TabsContent value="farmer-onboarding" className="space-y-6">
                {/* Farmer Registration Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-purple-900">
                        New Farmers This Month
                      </CardTitle>
                      <Plus className="h-5 w-5 text-purple-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-900">24</div>
                      <p className="text-xs text-purple-700 mt-1">+15% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-emerald-900">
                        GPS Mapped Farms
                      </CardTitle>
                      <MapPin className="h-5 w-5 text-emerald-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-emerald-900">156</div>
                      <p className="text-xs text-emerald-700 mt-1">Ready for inspection</p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-900">
                        Pending Verification
                      </CardTitle>
                      <Clock className="h-5 w-5 text-blue-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-900">12</div>
                      <p className="text-xs text-blue-700 mt-1">Awaiting field visit</p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-green-900">
                        Completed This Week
                      </CardTitle>
                      <CheckCircle className="h-5 w-5 text-green-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-900">8</div>
                      <p className="text-xs text-green-700 mt-1">Fully registered</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions for Farmer On-Boarding */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-purple-200 hover:border-purple-400">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Register New Farmer</h3>
                      <p className="text-sm text-slate-600 mb-4">Access full farmer registration system with GPS integration</p>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => window.location.href = '/farmers'}
                      >
                        Open Farmer Registration
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-emerald-200 hover:border-emerald-400">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Map className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">GPS Land Mapping</h3>
                      <p className="text-sm text-slate-600 mb-4">Advanced GPS mapping with satellite imagery and boundary detection</p>
                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => window.location.href = '/landmap360/land-mapping-manager'}
                      >
                        Start GPS Mapping
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-400">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Farm Inspections</h3>
                      <p className="text-sm text-slate-600 mb-4">Manage livestock and agricultural inspections</p>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.location.href = '/livetrace/farm-registrations'}
                      >
                        View Farm Registry
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Pending Farmer Registrations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      Pending Farmer Registrations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          id: "REG-001",
                          name: "John Kpehe",
                          location: "Montserrado County - Paynesville",
                          phone: "+231777123456",
                          farmSize: "2.3 hectares",
                          crops: "Cocoa, Coffee",
                          status: "pending_gps",
                          registrationDate: "2025-01-15"
                        },
                        {
                          id: "REG-002", 
                          name: "Mary Johnson",
                          location: "Bong County - Gbarnga",
                          phone: "+231888654321",
                          farmSize: "1.8 hectares",
                          crops: "Palm Oil, Cassava",
                          status: "pending_verification",
                          registrationDate: "2025-01-14"
                        },
                        {
                          id: "REG-003",
                          name: "Samuel Tuah",
                          location: "Nimba County - Sanniquellie",
                          phone: "+231666789123",
                          farmSize: "3.1 hectares", 
                          crops: "Rubber, Cocoa",
                          status: "gps_mapped",
                          registrationDate: "2025-01-13"
                        }
                      ].map((farmer) => (
                        <div key={farmer.id} className="p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-slate-900">{farmer.name}</h3>
                                <Badge className={farmer.status === 'pending_gps' ? 'bg-orange-100 text-orange-800' : 
                                               farmer.status === 'pending_verification' ? 'bg-blue-100 text-blue-800' :
                                               'bg-green-100 text-green-800'}>
                                  {farmer.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 flex items-center gap-1 mb-1">
                                <MapPin className="h-3 w-3" />
                                {farmer.location}
                              </p>
                              <p className="text-sm text-slate-600 mb-2">
                                Farm Size: {farmer.farmSize} • Crops: {farmer.crops}
                              </p>
                              <p className="text-xs text-slate-500">
                                Phone: {farmer.phone} • Registered: {farmer.registrationDate}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              {farmer.status === 'pending_gps' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                  onClick={() => window.location.href = '/landmap360/land-mapping-manager'}
                                >
                                  <Map className="h-3 w-3 mr-1" />
                                  GPS Map
                                </Button>
                              )}
                              {farmer.status === 'pending_verification' && (
                                <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Verify
                                </Button>
                              )}
                              {farmer.status === 'gps_mapped' && (
                                <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Complete
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <FileText className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inspections" className="space-y-6">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-900">
                        Active Inspections
                      </CardTitle>
                      <Activity className="h-5 w-5 text-blue-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-900">
                        {dashboardStats.activeInspections}
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        In progress today
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-green-900">
                        Compliance Rate
                      </CardTitle>
                      <CheckCircle className="h-5 w-5 text-green-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-900">
                        {dashboardStats.complianceRate}%
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        Overall compliance
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-red-900">
                        Critical Violations
                      </CardTitle>
                      <AlertTriangle className="h-5 w-5 text-red-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-900">
                        {dashboardStats.criticalViolations}
                      </div>
                      <p className="text-xs text-red-700 mt-1">
                        Requires immediate action
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-orange-900">
                        Pending Follow-ups
                      </CardTitle>
                      <Clock className="h-5 w-5 text-orange-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-900">
                        {dashboardStats.pendingFollowups}
                      </div>
                      <p className="text-xs text-orange-700 mt-1">
                        Scheduled this week
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Active Inspections List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Search className="h-5 w-5 text-blue-600" />
                      Active Inspection Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeInspections.map((inspection) => (
                        <div key={inspection.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-slate-900">{inspection.id}</h3>
                                <Badge className={getStatusBadge(inspection.status)}>
                                  {inspection.status.replace('_', ' ')}
                                </Badge>
                                <Badge className={getPriorityColor(inspection.priority)}>
                                  {inspection.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 flex items-center gap-1 mb-1">
                                <MapPin className="h-3 w-3" />
                                {inspection.location}
                              </p>
                              <p className="text-sm text-slate-600">
                                Owner: {inspection.owner} • Type: {inspection.inspectionType}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-900">{inspection.area}</p>
                              <p className="text-xs text-slate-600">
                                {inspection.violations > 0 ? `${inspection.violations} violations` : 'No violations'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600 mb-3">
                            <div>
                              <span className="text-slate-500">Parcel ID:</span>
                              <p>{inspection.parcelId}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Scheduled:</span>
                              <p>{inspection.scheduledDate}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Inspector:</span>
                              <p>{inspection.inspector}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Status:</span>
                              <p className={getStatusColor(inspection.status)}>
                                {inspection.status.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <Camera className="h-3 w-3 mr-1" />
                              Add Photos
                            </Button>
                            {inspection.status === 'in_progress' && (
                              <Button size="sm" variant="outline">
                                <FileText className="h-3 w-3 mr-1" />
                                Complete Report
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="violations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Violation Reports & Investigation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {violationReports.map((violation) => (
                        <div key={violation.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-slate-900">{violation.id}</h3>
                                <Badge className={getStatusBadge(violation.status)}>
                                  {violation.status.replace('_', ' ')}
                                </Badge>
                                <Badge className={getPriorityColor(violation.severity)}>
                                  {violation.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 flex items-center gap-1 mb-1">
                                <MapPin className="h-3 w-3" />
                                {violation.location}
                              </p>
                              <p className="text-sm text-slate-600 mb-2">
                                Owner: {violation.owner} • Type: {violation.violationType}
                              </p>
                              <p className="text-xs text-slate-500">
                                {violation.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-900">{violation.dateReported}</p>
                              <p className="text-xs text-slate-600">Inspector: {violation.inspector}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              <Flag className="h-3 w-3 mr-1" />
                              Investigate
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View Evidence
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3 mr-1" />
                              Generate Report
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Compliance Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {complianceChecks.map((check) => (
                        <div key={check.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-slate-900">{check.category}</h3>
                            <Badge className={`${check.complianceRate >= 90 ? 'bg-green-100 text-green-800' : check.complianceRate >= 80 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                              {check.complianceRate}% Compliant
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Total Parcels:</span>
                              <p className="font-medium">{check.totalParcels}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Compliant:</span>
                              <p className="font-medium text-green-600">{check.compliant}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Non-Compliant:</span>
                              <p className="font-medium text-red-600">{check.nonCompliant}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Last Updated:</span>
                              <p className="font-medium">{check.lastUpdated}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      Inspection Reports & Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Generate comprehensive inspection reports and compliance analytics
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-blue-200">
                        <CardContent className="p-4">
                          <p className="text-sm text-slate-600 mb-1">Completed Inspections</p>
                          <p className="text-2xl font-bold text-blue-900">{dashboardStats.completedInspections}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-red-200">
                        <CardContent className="p-4">
                          <p className="text-sm text-slate-600 mb-1">Violations Found</p>
                          <p className="text-2xl font-bold text-red-900">{dashboardStats.violationsFound}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-green-200">
                        <CardContent className="p-4">
                          <p className="text-sm text-slate-600 mb-1">Avg. Inspection Time</p>
                          <p className="text-2xl font-bold text-green-900">{dashboardStats.averageInspectionTime}h</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}