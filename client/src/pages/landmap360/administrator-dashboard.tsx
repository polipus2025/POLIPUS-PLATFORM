import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building, 
  Users, 
  FileText, 
  Settings, 
  Shield,
  BarChart3,
  Map,
  UserCheck,
  ClipboardCheck,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import LandMapSidebar from "../../components/landmap360/landmap-sidebar";
import LandMapHeader from "../../components/landmap360/landmap-header";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function AdministratorDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("month");

  // Get user info from localStorage
  const userName = localStorage.getItem("userName");
  const county = localStorage.getItem("county");

  // Mock data for administrator dashboard
  const dashboardStats = {
    totalUsers: 247,
    activeUsers: 189,
    pendingRegistrations: 23,
    systemHealth: 98.5,
    totalParcels: 15847,
    approvedRegistrations: 12634,
    pendingApprovals: 158,
    rejectedApplications: 45,
    databaseSize: 2.4,
    backupStatus: "healthy",
    serverUptime: 99.8,
    securityAlerts: 2
  };

  const userManagement = [
    {
      id: 1,
      name: "John Mensah",
      role: "Land Surveyor",
      department: "Survey Department",
      status: "active",
      lastLogin: "2 hours ago",
      permissions: ["Survey", "GPS", "Reports"],
      email: "john.mensah@landmap360.gov.lr",
      county: "Montserrado"
    },
    {
      id: 2,
      name: "Mary Wilson",
      role: "Land Registrar",
      department: "Registration Office",
      status: "active",
      lastLogin: "1 hour ago",
      permissions: ["Registration", "Verification", "Certificates"],
      email: "mary.wilson@landmap360.gov.lr",
      county: "Bong"
    },
    {
      id: 3,
      name: "David Kpehe",
      role: "Land Inspector",
      department: "Inspection Division",
      status: "inactive",
      lastLogin: "2 days ago",
      permissions: ["Inspection", "Compliance"],
      email: "david.kpehe@landmap360.gov.lr",
      county: "Nimba"
    }
  ];

  const pendingApplications = [
    {
      id: "APP-001",
      type: "Land Registration",
      applicant: "Samuel Roberts",
      location: "Margibi County",
      dateSubmitted: "2025-01-05",
      priority: "high",
      status: "pending_review",
      documents: 8,
      area: "2.5 hectares"
    },
    {
      id: "APP-002", 
      type: "Title Transfer",
      applicant: "Grace Johnson",
      location: "Bong County",
      dateSubmitted: "2025-01-04",
      priority: "medium",
      status: "pending_approval",
      documents: 12,
      area: "1.8 hectares"
    },
    {
      id: "APP-003",
      type: "Survey Request",
      applicant: "Emmanuel Doe",
      location: "Montserrado County", 
      dateSubmitted: "2025-01-03",
      priority: "low",
      status: "pending_assignment",
      documents: 5,
      area: "0.7 hectares"
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "security",
      message: "Multiple failed login attempts from IP 192.168.1.45",
      time: "1 hour ago",
      severity: "medium",
      resolved: false
    },
    {
      id: 2,
      type: "system",
      message: "Scheduled backup completed successfully",
      time: "3 hours ago",
      severity: "info",
      resolved: true
    },
    {
      id: 3,
      type: "performance",
      message: "GPS service response time increased by 15%",
      time: "5 hours ago",
      severity: "low",
      resolved: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-red-600';
      case 'pending_review': return 'text-orange-600';
      case 'pending_approval': return 'text-blue-600';
      case 'pending_assignment': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending_review': return 'bg-orange-100 text-orange-800';
      case 'pending_approval': return 'bg-blue-100 text-blue-800';
      case 'pending_assignment': return 'bg-purple-100 text-purple-800';
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

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      case 'info': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Administrator Dashboard - LandMap360 Land Management</title>
        <meta name="description" content="Administrative dashboard for land management system oversight and user management" />
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
                    Administrator Dashboard
                  </h1>
                  <p className="text-slate-600 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    System Administration & User Management
                    {county && ` • ${county}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="survey">Survey Department</SelectItem>
                      <SelectItem value="registration">Registration Office</SelectItem>
                      <SelectItem value="inspection">Inspection Division</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="system">System Health</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-900">
                        Total Users
                      </CardTitle>
                      <Users className="h-5 w-5 text-blue-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-900">
                        {dashboardStats.totalUsers}
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        {dashboardStats.activeUsers} active users
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-green-900">
                        System Health
                      </CardTitle>
                      <Shield className="h-5 w-5 text-green-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-900">
                        {dashboardStats.systemHealth}%
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        All systems operational
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-orange-900">
                        Pending Approvals
                      </CardTitle>
                      <ClipboardCheck className="h-5 w-5 text-orange-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-900">
                        {dashboardStats.pendingApprovals}
                      </div>
                      <p className="text-xs text-orange-700 mt-1">
                        Requires administrator review
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-red-900">
                        Security Alerts
                      </CardTitle>
                      <AlertTriangle className="h-5 w-5 text-red-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-900">
                        {dashboardStats.securityAlerts}
                      </div>
                      <p className="text-xs text-red-700 mt-1">
                        Requires attention
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* System Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Database className="h-5 w-5 text-purple-600" />
                        System Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Server Uptime</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${dashboardStats.serverUptime}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{dashboardStats.serverUptime}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Database Size</span>
                        <span className="text-sm font-medium">{dashboardStats.databaseSize} GB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Backup Status</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Healthy
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Active Sessions</span>
                        <span className="text-sm font-medium">{dashboardStats.activeUsers}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Recent System Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {systemAlerts.map((alert) => (
                          <div key={alert.id} className="flex items-start gap-3 pb-3 border-b border-slate-200 last:border-b-0">
                            <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(alert.severity)} bg-current`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                              <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                            </div>
                            {!alert.resolved && (
                              <Button size="sm" variant="outline">
                                Resolve
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userManagement.map((user) => (
                        <div key={user.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-slate-900">{user.name}</h3>
                                <p className="text-sm text-slate-600">{user.role} • {user.department}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusBadge(user.status)}>
                                {user.status}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
                            <div>
                              <span className="text-slate-500">Email:</span>
                              <p>{user.email}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">County:</span>
                              <p>{user.county}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Last Login:</span>
                              <p>{user.lastLogin}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Permissions:</span>
                              <p>{user.permissions.join(", ")}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      Pending Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingApplications.map((app) => (
                        <div key={app.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-slate-900">{app.id}</h3>
                              <Badge className={getStatusBadge(app.status)}>
                                {app.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(app.priority)}>
                                {app.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                              <Button size="sm" variant="outline">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
                            <div>
                              <span className="text-slate-500">Type:</span>
                              <p>{app.type}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Applicant:</span>
                              <p>{app.applicant}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Location:</span>
                              <p>{app.location}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Area:</span>
                              <p>{app.area}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span>Submitted: {app.dateSubmitted}</span>
                            <span>Documents: {app.documents}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="system" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      System Health Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Comprehensive system monitoring and performance analytics
                    </p>
                    <Button className="bg-gray-600 hover:bg-gray-700">
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                      Administrative Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Generate comprehensive reports on system usage, user activity, and performance
                    </p>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Reports
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