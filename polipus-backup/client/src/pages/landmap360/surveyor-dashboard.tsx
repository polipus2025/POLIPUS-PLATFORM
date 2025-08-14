import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Navigation, 
  MapPin, 
  Ruler, 
  Camera, 
  CheckCircle, 
  Clock,
  Activity,
  Satellite,
  Target,
  Map,
  FileText,
  Plus,
  Eye,
  Download,
  AlertTriangle,
  Settings
} from "lucide-react";
import LandMapSidebar from "../../components/landmap360/landmap-sidebar";
import LandMapHeader from "../../components/landmap360/landmap-header";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function SurveyorDashboard() {
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Get user info from localStorage
  const userName = localStorage.getItem("userName");
  const county = localStorage.getItem("county");

  // Fetch surveyor data
  const { data: surveyorStats = {} } = useQuery({
    queryKey: ['/api/landmap360/surveyor-stats', selectedProject],
    queryFn: () => apiRequest(`/api/landmap360/surveyor-stats?project=${selectedProject}`),
  });

  // Mock data for surveyor dashboard
  const dashboardStats = {
    activeSurveys: 8,
    completedSurveys: 47,
    totalArea: 2847.5,
    gpsAccuracy: 98.7,
    pendingSurveys: 5,
    scheduledSurveys: 12,
    equipmentStatus: "optimal",
    batteryLevel: 87
  };

  const activeSurveys = [
    {
      id: "SV-001",
      parcelId: "LM-2025-001",
      location: "Montserrado County - Paynesville",
      area: 2.45,
      status: "in_progress",
      progress: 65,
      startTime: "08:30 AM",
      estimatedCompletion: "02:30 PM",
      coordinates: "6.3133°N, 10.7969°W",
      surveyType: "Boundary Survey",
      priority: "high",
      equipment: "GPS RTK, Total Station",
      weather: "Clear, 28°C"
    },
    {
      id: "SV-002",
      parcelId: "LM-2025-002",
      location: "Bong County - Gbarnga",
      area: 5.12,
      status: "scheduled",
      progress: 0,
      startTime: "07:00 AM",
      estimatedCompletion: "04:00 PM",
      coordinates: "6.9987°N, 9.4722°W",
      surveyType: "Topographic Survey",
      priority: "medium",
      equipment: "GPS RTK, Drone",
      weather: "Partly cloudy, 26°C"
    },
    {
      id: "SV-003",
      parcelId: "LM-2025-003",
      location: "Margibi County - Kakata",
      area: 1.87,
      status: "planning",
      progress: 0,
      startTime: "09:00 AM",
      estimatedCompletion: "12:30 PM",
      coordinates: "6.5146°N, 10.3451°W",
      surveyType: "Title Survey",
      priority: "low",
      equipment: "GPS RTK",
      weather: "Clear, 29°C"
    }
  ];

  const completedSurveys = [
    {
      id: "SV-045",
      parcelId: "LM-2025-045",
      location: "Nimba County - Sanniquellie",
      area: 3.24,
      completedDate: "2025-01-05",
      accuracy: 99.2,
      surveyType: "Boundary Survey",
      client: "Ministry of Lands"
    },
    {
      id: "SV-044",
      parcelId: "LM-2025-044",
      location: "Bong County - Totota",
      area: 1.95,
      completedDate: "2025-01-04",
      accuracy: 98.8,
      surveyType: "Subdivision Survey",
      client: "Private Developer"
    }
  ];

  const equipmentStatus = [
    { name: "GPS RTK Unit", status: "operational", battery: 87, accuracy: "High" },
    { name: "Total Station", status: "operational", battery: 92, accuracy: "Very High" },
    { name: "Drone Survey", status: "maintenance", battery: 45, accuracy: "High" },
    { name: "Handheld GPS", status: "operational", battery: 68, accuracy: "Medium" }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'in_progress': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'scheduled': return 'text-orange-600';
      case 'planning': return 'text-purple-600';
      case 'operational': return 'text-green-600';
      case 'maintenance': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-orange-100 text-orange-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Surveyor Dashboard - LandMap360 Land Management</title>
        <meta name="description" content="Professional surveyor dashboard for land surveying operations and GPS data collection" />
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
                    Surveyor Dashboard
                  </h1>
                  <p className="text-slate-600 flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Welcome back, {userName || "Land Surveyor"}
                    {county && ` • ${county}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Survey
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="active" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="active">Active Surveys</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-6">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-900">
                        Active Surveys
                      </CardTitle>
                      <Activity className="h-5 w-5 text-blue-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-900">
                        {dashboardStats.activeSurveys}
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        {dashboardStats.totalArea} hectares total
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-green-900">
                        Completed Today
                      </CardTitle>
                      <CheckCircle className="h-5 w-5 text-green-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-900">
                        3
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        {dashboardStats.completedSurveys} total completed
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-orange-900">
                        GPS Accuracy
                      </CardTitle>
                      <Satellite className="h-5 w-5 text-orange-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-900">
                        {dashboardStats.gpsAccuracy}%
                      </div>
                      <p className="text-xs text-orange-700 mt-1">
                        Real-time accuracy
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-purple-900">
                        Scheduled Surveys
                      </CardTitle>
                      <Clock className="h-5 w-5 text-purple-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-900">
                        {dashboardStats.scheduledSurveys}
                      </div>
                      <p className="text-xs text-purple-700 mt-1">
                        Next 7 days
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Active Surveys List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Active Survey Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeSurveys.map((survey) => (
                        <div key={survey.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-slate-900">{survey.id}</h3>
                                <Badge className={getStatusBadge(survey.status)}>
                                  {survey.status.replace('_', ' ')}
                                </Badge>
                                <Badge className={getPriorityColor(survey.priority)}>
                                  {survey.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 flex items-center gap-1 mb-1">
                                <MapPin className="h-3 w-3" />
                                {survey.location}
                              </p>
                              <p className="text-sm text-slate-600 flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {survey.coordinates}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-900">{survey.area} hectares</p>
                              <p className="text-xs text-slate-600">{survey.surveyType}</p>
                            </div>
                          </div>
                          
                          {survey.status === 'in_progress' && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-slate-600">Progress</span>
                                <span className="font-medium">{survey.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${survey.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                              <span className="text-slate-500">Start Time:</span>
                              <p className="font-medium">{survey.startTime}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Est. Completion:</span>
                              <p className="font-medium">{survey.estimatedCompletion}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Equipment:</span>
                              <p className="font-medium">{survey.equipment}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Weather:</span>
                              <p className="font-medium">{survey.weather}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <Map className="h-3 w-3 mr-1" />
                              View Map
                            </Button>
                            {survey.status === 'in_progress' && (
                              <Button size="sm" variant="outline">
                                <Camera className="h-3 w-3 mr-1" />
                                Add Photos
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scheduled" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      Scheduled Survey Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Upcoming surveys scheduled for the next 7 days
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Clock className="h-4 w-4 mr-2" />
                      View Schedule
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Completed Surveys
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {completedSurveys.map((survey) => (
                        <div key={survey.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-slate-900">{survey.id}</h3>
                                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                              </div>
                              <p className="text-sm text-slate-600 flex items-center gap-1 mb-1">
                                <MapPin className="h-3 w-3" />
                                {survey.location}
                              </p>
                              <p className="text-xs text-slate-500">
                                {survey.surveyType} • {survey.area} hectares • Accuracy: {survey.accuracy}%
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-600">{survey.completedDate}</p>
                              <p className="text-xs text-slate-500">{survey.client}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3 mr-1" />
                              View Report
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Download Data
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="equipment" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Settings className="h-5 w-5 text-emerald-600" />
                      Equipment Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {equipmentStatus.map((equipment, index) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-slate-900">{equipment.name}</h3>
                            <Badge className={getStatusBadge(equipment.status)}>
                              {equipment.status}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Battery Level:</span>
                              <span className="font-medium">{equipment.battery}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${equipment.battery > 70 ? 'bg-green-500' : equipment.battery > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${equipment.battery}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Accuracy:</span>
                              <span className="font-medium">{equipment.accuracy}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-indigo-600" />
                      Survey Analytics & Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Detailed analytics and performance metrics for survey operations
                    </p>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <Activity className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
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