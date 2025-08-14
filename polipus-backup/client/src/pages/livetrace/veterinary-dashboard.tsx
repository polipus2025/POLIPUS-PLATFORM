import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  Calendar, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  MapPin,
  Clock,
  Activity,
  Stethoscope,
  Shield,
  ChevronRight,
  Plus
} from "lucide-react";

export default function VeterinaryDashboard() {
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
  const todayStats = {
    totalAnimals: 1247,
    healthyAnimals: 1156,
    underTreatment: 65,
    criticalCases: 26,
    vaccinationsToday: 34,
    scheduledVisits: 12
  };

  const recentAlerts = [
    { id: 1, type: "critical", message: "Cattle herd #347 - Suspected foot-and-mouth disease", time: "2 hours ago", location: "Bong County" },
    { id: 2, type: "warning", message: "Goat vaccination overdue - Farm LR-234", time: "4 hours ago", location: "Margibi County" },
    { id: 3, type: "info", message: "New livestock registration - Poultry farm", time: "6 hours ago", location: "Montserrado County" }
  ];

  const upcomingTasks = [
    { id: 1, task: "Cattle health inspection", farm: "Firestone Farm #12", time: "09:00 AM", priority: "high" },
    { id: 2, task: "Vaccination schedule review", farm: "Cooperativa Ganadera", time: "11:30 AM", priority: "medium" },
    { id: 3, task: "Disease outbreak follow-up", farm: "Bong Agricultural Center", time: "02:00 PM", priority: "critical" },
    { id: 4, task: "Health certificate issuance", farm: "Liberian Livestock Co.", time: "03:30 PM", priority: "low" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Veterinary Dashboard - LiveTrace Animal Health Management</title>
        <meta name="description" content="Comprehensive veterinary dashboard for livestock health monitoring and management" />
      </Helmet>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">LiveTrace</h1>
                <p className="text-sm text-slate-600">Veterinary Portal</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <a 
              href="/livetrace-veterinary-dashboard" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-800 font-medium"
            >
              <Activity className="h-4 w-4" />
              Dashboard
            </a>
            <a 
              href="/livetrace-health-monitoring" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Heart className="h-4 w-4" />
              Health Monitoring
            </a>
            <a 
              href="/livetrace-disease-tracking" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <AlertTriangle className="h-4 w-4" />
              Disease Tracking
            </a>
            <a 
              href="/livetrace-vaccination-records" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Shield className="h-4 w-4" />
              Vaccination Records
            </a>
            <a 
              href="/livetrace-treatment-plans" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Treatment Plans
            </a>
          </nav>

          <div className="p-4 border-t border-slate-200 mt-auto">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Health Record
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6">
          {/* Header with Time */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Veterinary Dashboard</h2>
                <p className="text-slate-600">Comprehensive livestock health management system</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{formatTime(currentTime)}</div>
                <div className="text-sm text-slate-600">{formatDate(currentTime)}</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Animals</p>
                      <p className="text-2xl font-bold">{todayStats.totalAnimals.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm">Healthy</p>
                      <p className="text-2xl font-bold">{todayStats.healthyAnimals.toLocaleString()}</p>
                    </div>
                    <Heart className="h-8 w-8 text-emerald-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Under Treatment</p>
                      <p className="text-2xl font-bold">{todayStats.underTreatment}</p>
                    </div>
                    <Stethoscope className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Critical Cases</p>
                      <p className="text-2xl font-bold">{todayStats.criticalCases}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Vaccinations Today</p>
                      <p className="text-2xl font-bold">{todayStats.vaccinationsToday}</p>
                    </div>
                    <Shield className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Scheduled Visits</p>
                      <p className="text-2xl font-bold">{todayStats.scheduledVisits}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Health Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Recent Health Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === 'critical' ? 'bg-red-500' : 
                        alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.time}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {alert.location}
                          </span>
                        </div>
                      </div>
                      <Badge variant={alert.type === 'critical' ? 'destructive' : alert.type === 'warning' ? 'default' : 'secondary'}>
                        {alert.type}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Alerts
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

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
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className="w-12 text-center">
                        <div className="text-sm font-medium text-slate-900">{task.time}</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{task.task}</p>
                        <p className="text-xs text-slate-500">{task.farm}</p>
                      </div>
                      <Badge variant={
                        task.priority === 'critical' ? 'destructive' : 
                        task.priority === 'high' ? 'default' : 
                        task.priority === 'medium' ? 'secondary' : 'outline'
                      }>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Full Schedule
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Heart className="h-6 w-6" />
                    Record Health Check
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Shield className="h-6 w-6" />
                    Schedule Vaccination
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    Create Treatment Plan
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Report Disease
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}