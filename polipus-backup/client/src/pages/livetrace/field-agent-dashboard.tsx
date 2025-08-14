import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  CheckCircle,
  Activity,
  Plus,
  ChevronRight,
  Users,
  ClipboardList,
  AlertTriangle,
  Navigation,
  Camera,
  FileText,
  Clock,
  Route
} from "lucide-react";

export default function FieldAgentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Mock data - would come from API
  const agentStats = {
    todayVisits: 8,
    completedInspections: 6,
    pendingReports: 2,
    totalFarmsAssigned: 45,
    distanceTraveled: 127,
    samplesCollected: 12,
    emergencyAlerts: 1,
    complianceRate: 94.2
  };

  const todaySchedule = [
    { 
      id: 1, 
      time: "08:00 AM", 
      farm: "Bong Agricultural Center", 
      type: "Health Inspection", 
      status: "completed",
      location: "Bong County",
      priority: "routine"
    },
    { 
      id: 2, 
      time: "09:30 AM", 
      farm: "Firestone Dairy #12", 
      type: "Vaccination Verification", 
      status: "completed",
      location: "Margibi County",
      priority: "routine"
    },
    { 
      id: 3, 
      time: "11:00 AM", 
      farm: "Cooperativa Ganadera", 
      type: "Disease Investigation", 
      status: "in_progress",
      location: "Margibi County",
      priority: "urgent"
    },
    { 
      id: 4, 
      time: "01:30 PM", 
      farm: "Grand Bassa Poultry", 
      type: "Compliance Check", 
      status: "scheduled",
      location: "Grand Bassa County",
      priority: "routine"
    },
    { 
      id: 5, 
      time: "03:00 PM", 
      farm: "Montserrado Livestock", 
      type: "Sample Collection", 
      status: "scheduled",
      location: "Montserrado County",
      priority: "high"
    }
  ];

  const recentReports = [
    {
      id: "RPT-001",
      farm: "Bong Agricultural Center",
      type: "Health Inspection",
      status: "submitted",
      date: "2025-01-04",
      findings: "All animals healthy, vaccination records up to date",
      priority: "routine"
    },
    {
      id: "RPT-002", 
      farm: "Firestone Dairy #12",
      type: "Disease Alert",
      status: "pending_review",
      date: "2025-01-03",
      findings: "Possible mastitis case detected, samples collected for testing",
      priority: "urgent"
    },
    {
      id: "RPT-003",
      farm: "Cooperativa Ganadera", 
      type: "Vaccination Audit",
      status: "draft",
      date: "2025-01-03",
      findings: "Minor vaccination delays identified, corrective action recommended",
      priority: "medium"
    }
  ];

  const alerts = [
    {
      id: 1,
      type: "disease_outbreak",
      message: "Suspected FMD outbreak reported in Bong County",
      location: "Bong County - Sector 7",
      priority: "critical",
      time: "30 minutes ago"
    },
    {
      id: 2,
      type: "vaccination_overdue", 
      message: "Vaccination schedule overdue at 3 farms",
      location: "Multiple counties",
      priority: "medium",
      time: "2 hours ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'routine': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Field Agent Dashboard - LiveTrace Field Operations</title>
        <meta name="description" content="Comprehensive field agent dashboard for livestock inspection and monitoring" />
      </Helmet>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Navigation className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">LiveTrace</h1>
                <p className="text-sm text-slate-600">Field Agent Portal</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <a 
              href="/livetrace-field-agent-dashboard" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-medium"
            >
              <Activity className="h-4 w-4" />
              Dashboard
            </a>
            <a 
              href="/livetrace-field-inspections" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ClipboardList className="h-4 w-4" />
              Inspections
            </a>
            <a 
              href="/livetrace-field-route-planning" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Route className="h-4 w-4" />
              Route Planning
            </a>
            <a 
              href="/livetrace-field-reports" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Reports
            </a>
            <a 
              href="/livetrace-field-sample-tracking" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Camera className="h-4 w-4" />
              Sample Tracking
            </a>
          </nav>

          <div className="p-4 border-t border-slate-200 mt-auto">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6">
          {/* Header with Time */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Field Agent Dashboard</h2>
                <p className="text-slate-600">Monitor field operations and manage inspection schedules</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{formatTime(currentTime)}</div>
                <div className="text-sm text-slate-600">{formatDate(currentTime)}</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Today's Visits</p>
                      <p className="text-2xl font-bold">{agentStats.todayVisits}</p>
                    </div>
                    <MapPin className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Completed</p>
                      <p className="text-2xl font-bold">{agentStats.completedInspections}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Pending Reports</p>
                      <p className="text-2xl font-bold">{agentStats.pendingReports}</p>
                    </div>
                    <FileText className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Samples Collected</p>
                      <p className="text-2xl font-bold">{agentStats.samplesCollected}</p>
                    </div>
                    <Camera className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
              <div className="mb-6">
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <AlertTriangle className="h-5 w-5" />
                      Active Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {alerts.map((alert) => (
                        <div key={alert.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            alert.priority === 'critical' ? 'bg-red-500' : 
                            alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {alert.location}
                              </span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {alert.time}
                              </span>
                            </div>
                          </div>
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySchedule.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className="w-16 text-center">
                        <div className="text-sm font-medium text-slate-900">{item.time}</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{item.farm}</p>
                        <p className="text-xs text-slate-600">{item.type}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(item.priority)} variant="outline">
                          {item.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Full Schedule
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Recent Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{report.farm}</p>
                          <p className="text-xs text-slate-600">{report.type} - {report.id}</p>
                        </div>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-700 bg-slate-50 rounded p-2 mb-2">
                        {report.findings}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                        <Badge className={getPriorityColor(report.priority)} variant="outline">
                          {report.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Reports
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <ClipboardList className="h-6 w-6" />
                  Start Inspection
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Camera className="h-6 w-6" />
                  Collect Sample
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  Report Emergency
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Route className="h-6 w-6" />
                  Plan Route
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}