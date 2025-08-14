import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Map, 
  MapPin, 
  Ruler, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  Building,
  Eye,
  Calendar,
  Search,
  Globe,
  Layers,
  Navigation,
  Camera,
  Shield,
  BarChart3,
  Activity,
  TreePine,
  Home
} from "lucide-react";
import LandMapSidebar from "../../components/landmap360/landmap-sidebar";
import LandMapHeader from "../../components/landmap360/landmap-header";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function LandMap360MainDashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("month");

  // Get user info from localStorage
  const userType = localStorage.getItem("userType");
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");
  const county = localStorage.getItem("county");

  // Fetch land management data
  const { data: landStats = {} } = useQuery({
    queryKey: ['/api/landmap360/dashboard-stats', selectedTimeRange],
    queryFn: () => apiRequest(`/api/landmap360/dashboard-stats?timeRange=${selectedTimeRange}`),
  });

  // Fetch recent surveys
  const { data: recentSurveys = [] } = useQuery({
    queryKey: ['/api/landmap360/recent-surveys'],
    queryFn: () => apiRequest('/api/landmap360/recent-surveys'),
  });

  // Fetch land disputes
  const { data: disputes = [] } = useQuery({
    queryKey: ['/api/landmap360/disputes'],
    queryFn: () => apiRequest('/api/landmap360/disputes'),
  });

  // Mock data for demonstration
  const dashboardStats = {
    totalParcels: 15847,
    registeredParcels: 12634,
    pendingRegistrations: 458,
    activeSurveys: 23,
    completedSurveys: 312,
    disputes: 8,
    resolvedDisputes: 156,
    gpsAccuracy: 98.7,
    surveyorsActive: 15,
    totalArea: "2,847,392",
    registeredArea: "2,234,156",
    pendingArea: "158,432"
  };

  const recentActivities = [
    { 
      id: 1, 
      type: "survey", 
      message: "Land survey completed for Parcel LM-2025-001", 
      time: "2 hours ago", 
      location: "Montserrado County",
      status: "completed",
      surveyor: "John Mensah"
    },
    { 
      id: 2, 
      type: "registration", 
      message: "New land parcel registration submitted", 
      time: "4 hours ago", 
      location: "Bong County",
      status: "pending",
      applicant: "Mary Wilson"
    },
    { 
      id: 3, 
      type: "dispute", 
      message: "Land dispute reported - Boundary disagreement", 
      time: "6 hours ago", 
      location: "Nimba County",
      status: "investigating",
      inspector: "David Kpehe"
    },
    { 
      id: 4, 
      type: "verification", 
      message: "Title verification completed - Certificate issued", 
      time: "8 hours ago", 
      location: "Margibi County",
      status: "verified",
      registrar: "Sarah Johnson"
    }
  ];

  const upcomingTasks = [
    { id: 1, task: "Boundary survey - Parcel LM-045", location: "Bong County", time: "09:00 AM", priority: "high" },
    { id: 2, task: "Title registration review", location: "Montserrado County", time: "11:30 AM", priority: "medium" },
    { id: 3, task: "Dispute mediation meeting", location: "Nimba County", time: "02:00 PM", priority: "critical" },
    { id: 4, task: "GPS calibration check", location: "Field Office", time: "04:00 PM", priority: "low" }
  ];

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'survey': return <Ruler className="h-4 w-4" />;
      case 'registration': return <FileText className="h-4 w-4" />;
      case 'dispute': return <AlertTriangle className="h-4 w-4" />;
      case 'verification': return <Shield className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': case 'verified': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'investigating': return 'text-blue-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: { [key: string]: string } = {
      "surveyor": "Land Surveyor",
      "administrator": "Land Administrator", 
      "registrar": "Land Registrar",
      "inspector": "Land Inspector",
      "analyst": "GIS Analyst",
      "manager": "Land Manager"
    };
    return roleMap[role] || role;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>LandMap360 Dashboard - Land Management System</title>
        <meta name="description" content="Comprehensive land management dashboard for surveying, registration, and GIS mapping" />
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
                    Welcome to LandMap360
                  </h1>
                  <p className="text-slate-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Professional Land Management Dashboard - {getRoleDisplay(userRole || "")}
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
                  <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="parcels">Land Parcels</TabsTrigger>
                <TabsTrigger value="surveys">Surveys</TabsTrigger>
                <TabsTrigger value="disputes">Disputes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-emerald-900">
                        Total Land Parcels
                      </CardTitle>
                      <Map className="h-5 w-5 text-emerald-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-emerald-900">
                        {dashboardStats.totalParcels.toLocaleString()}
                      </div>
                      <p className="text-xs text-emerald-700 mt-1">
                        {dashboardStats.totalArea} hectares total
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-900">
                        Active Surveys
                      </CardTitle>
                      <Ruler className="h-5 w-5 text-blue-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-900">
                        {dashboardStats.activeSurveys}
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        {dashboardStats.completedSurveys} completed this month
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-orange-900">
                        Pending Registrations
                      </CardTitle>
                      <FileText className="h-5 w-5 text-orange-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-900">
                        {dashboardStats.pendingRegistrations}
                      </div>
                      <p className="text-xs text-orange-700 mt-1">
                        {dashboardStats.pendingArea} hectares pending
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-red-900">
                        Active Disputes
                      </CardTitle>
                      <AlertTriangle className="h-5 w-5 text-red-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-900">
                        {dashboardStats.disputes}
                      </div>
                      <p className="text-xs text-red-700 mt-1">
                        {dashboardStats.resolvedDisputes} resolved this year
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* System Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-600" />
                        System Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">GPS Accuracy</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${dashboardStats.gpsAccuracy}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{dashboardStats.gpsAccuracy}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Active Surveyors</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {dashboardStats.surveyorsActive} Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Data Sync Status</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Synced
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Satellite Coverage</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Optimal
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Recent Activities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-slate-200 last:border-b-0">
                            <div className={`p-2 rounded-lg bg-slate-100 ${getStatusColor(activity.status)}`}>
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {activity.location}
                                </span>
                                <span className="text-xs text-slate-500">{activity.time}</span>
                                {(activity as any).surveyor && (
                                  <span className="text-xs text-slate-500">
                                    by {(activity as any).surveyor}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Upcoming Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Upcoming Tasks & Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {upcomingTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{task.task}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-slate-600 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {task.location}
                              </span>
                              <span className="text-sm text-slate-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {task.time}
                              </span>
                            </div>
                          </div>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="parcels" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Map className="h-5 w-5 text-emerald-600" />
                      Land Parcel Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Comprehensive land parcel database and registration system
                    </p>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <MapPin className="h-4 w-4 mr-2" />
                      View All Parcels
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="surveys" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Ruler className="h-5 w-5 text-blue-600" />
                      Survey Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Active and completed land surveys with GPS coordinates
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Navigation className="h-4 w-4 mr-2" />
                      View Surveys
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="disputes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Dispute Resolution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Land dispute cases and resolution tracking
                    </p>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      View Disputes
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