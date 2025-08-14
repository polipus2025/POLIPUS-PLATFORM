import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MapPin, 
  Calendar, 
  TrendingUp,
  Activity,
  Plus,
  ChevronRight,
  Beef,
  Milk,
  DollarSign,
  Thermometer,
  Heart,
  AlertTriangle,
  BarChart3,
  Wheat
} from "lucide-react";

export default function RancherDashboard() {
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
  const ranchStats = {
    totalLivestock: 847,
    cattleCount: 425,
    goatCount: 287,
    sheepCount: 135,
    monthlyMilkProduction: 12450,
    averageWeight: 378,
    birthsThisMonth: 23,
    vaccinated: 98.5
  };

  const recentActivities = [
    { id: 1, type: "birth", message: "3 calves born at Pasture Section A", time: "2 hours ago", status: "success" },
    { id: 2, type: "health", message: "Cattle herd #7 scheduled for health checkup", time: "4 hours ago", status: "pending" },
    { id: 3, type: "feed", message: "Feed delivery completed - 500kg concentrate", time: "6 hours ago", status: "completed" },
    { id: 4, type: "milk", message: "Morning milk collection: 1,250 liters", time: "8 hours ago", status: "completed" }
  ];

  const upcomingTasks = [
    { id: 1, task: "Cattle vaccination program", section: "Pasture A & B", time: "08:00 AM", priority: "high" },
    { id: 2, task: "Feed supplement distribution", section: "All sections", time: "10:30 AM", priority: "medium" },
    { id: 3, task: "Breeding program review", section: "Breeding barn", time: "01:00 PM", priority: "medium" },
    { id: 4, task: "Pasture rotation planning", section: "Grazing areas", time: "03:30 PM", priority: "low" }
  ];

  const livestockSections = [
    { name: "Pasture Section A", cattle: 125, goats: 0, sheep: 0, health: "excellent", lastCheck: "Today" },
    { name: "Pasture Section B", cattle: 98, goats: 0, sheep: 0, health: "good", lastCheck: "Yesterday" },
    { name: "Goat Paddock 1", cattle: 0, goats: 142, sheep: 0, health: "excellent", lastCheck: "Today" },
    { name: "Goat Paddock 2", cattle: 0, goats: 145, sheep: 0, health: "good", lastCheck: "2 days ago" },
    { name: "Sheep Grazing Area", cattle: 0, goats: 0, sheep: 135, health: "good", lastCheck: "Today" },
    { name: "Breeding & Maternity", cattle: 47, goats: 15, sheep: 12, health: "monitored", lastCheck: "Today" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Rancher Dashboard - LiveTrace Livestock Management</title>
        <meta name="description" content="Comprehensive ranch management dashboard for livestock operations" />
      </Helmet>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
                <Beef className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">LiveTrace</h1>
                <p className="text-sm text-slate-600">Rancher Portal</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <a 
              href="/livetrace-rancher-dashboard" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-medium"
            >
              <Activity className="h-4 w-4" />
              Dashboard
            </a>
            <a 
              href="/livetrace-ranch-livestock" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Users className="h-4 w-4" />
              Livestock Management
            </a>
            <a 
              href="/livetrace-ranch-breeding" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Heart className="h-4 w-4" />
              Breeding Program
            </a>
            <a 
              href="/livetrace-ranch-feed" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Wheat className="h-4 w-4" />
              Feed Management
            </a>
            <a 
              href="/livetrace-ranch-production" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Milk className="h-4 w-4" />
              Production Records
            </a>
          </nav>

          <div className="p-4 border-t border-slate-200 mt-auto">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Livestock
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6">
          {/* Header with Time */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Ranch Management Dashboard</h2>
                <p className="text-slate-600">Monitor and manage your livestock operations</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{formatTime(currentTime)}</div>
                <div className="text-sm text-slate-600">{formatDate(currentTime)}</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm">Total Livestock</p>
                      <p className="text-2xl font-bold">{ranchStats.totalLivestock.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-amber-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Cattle</p>
                      <p className="text-2xl font-bold">{ranchStats.cattleCount}</p>
                    </div>
                    <Beef className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Monthly Milk (L)</p>
                      <p className="text-2xl font-bold">{ranchStats.monthlyMilkProduction.toLocaleString()}</p>
                    </div>
                    <Milk className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Vaccination Rate</p>
                      <p className="text-2xl font-bold">{ranchStats.vaccinated}%</p>
                    </div>
                    <Heart className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-amber-600" />
                  Recent Ranch Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 
                        activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                      <Badge variant={activity.status === 'success' ? 'default' : activity.status === 'pending' ? 'secondary' : 'outline'}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activities
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Today's Tasks
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
                        <p className="text-xs text-slate-500">{task.section}</p>
                      </div>
                      <Badge variant={
                        task.priority === 'high' ? 'destructive' : 
                        task.priority === 'medium' ? 'default' : 'outline'
                      }>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Schedule
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Livestock Sections Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Livestock Sections Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {livestockSections.map((section, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900">{section.name}</h4>
                        <p className="text-xs text-slate-500">Last checked: {section.lastCheck}</p>
                      </div>
                      <Badge className={
                        section.health === 'excellent' ? 'bg-green-100 text-green-800 border-green-200' :
                        section.health === 'good' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }>
                        {section.health}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {section.cattle > 0 && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-amber-600">{section.cattle}</div>
                          <div className="text-xs text-slate-500">Cattle</div>
                        </div>
                      )}
                      {section.goats > 0 && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">{section.goats}</div>
                          <div className="text-xs text-slate-500">Goats</div>
                        </div>
                      )}
                      {section.sheep > 0 && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{section.sheep}</div>
                          <div className="text-xs text-slate-500">Sheep</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  Record Birth
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Milk className="h-6 w-6" />
                  Log Production
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Wheat className="h-6 w-6" />
                  Feed Schedule
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Heart className="h-6 w-6" />
                  Health Check
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}