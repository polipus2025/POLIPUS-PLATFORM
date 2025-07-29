import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Users,
  Database,
  Shield,
  BarChart3,
  Globe,
  Server,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  LogOut
} from "lucide-react";
import { useLocation } from "wouter";

export default function MonitoringDashboard() {
  const [, setLocation] = useLocation();
  const [activeUsers, setActiveUsers] = useState(0);
  const [apiRequests, setApiRequests] = useState(0);
  const [systemHealth, setSystemHealth] = useState("healthy");

  // Real-time monitoring data
  const { data: monitoringData } = useQuery({
    queryKey: ["/api/monitoring/overview"],
    refetchInterval: 5000, // Update every 5 seconds
  });

  const { data: userActivity } = useQuery({
    queryKey: ["/api/monitoring/user-activity"],
    refetchInterval: 3000,
  });

  const { data: systemMetrics } = useQuery({
    queryKey: ["/api/monitoring/system-metrics"],
    refetchInterval: 10000,
  });

  const { data: auditLogs } = useQuery({
    queryKey: ["/api/monitoring/audit-logs"],
    refetchInterval: 15000,
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
      setApiRequests(prev => prev + Math.floor(Math.random() * 10) + 5);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setLocation("/front-page");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-xl font-bold text-white">Platform Monitoring Dashboard</h1>
              <p className="text-sm text-blue-200">Real-time website activity monitoring</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="border-white/30 text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Real-time Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/95 border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{12 + activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                +3 from last hour
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-green-600">Live</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Requests</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{1847 + apiRequests}</div>
              <p className="text-xs text-muted-foreground">
                +156 in last 5 min
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-xs text-blue-600">Active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98.7%</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
              <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                Healthy
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white/95 border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">68ms</div>
              <p className="text-xs text-muted-foreground">
                Average API response
              </p>
              <Badge className="bg-orange-100 text-orange-800 text-xs mt-1">
                Optimal
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Monitoring Tabs */}
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList className="bg-white/20 border-white/30">
            <TabsTrigger value="activity" className="data-[state=active]:bg-white/90">
              <Eye className="h-4 w-4 mr-2" />
              User Activity
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-white/90">
              <Server className="h-4 w-4 mr-2" />
              System Metrics
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-white/90">
              <Shield className="h-4 w-4 mr-2" />
              Security Logs
            </TabsTrigger>
            <TabsTrigger value="apis" className="data-[state=active]:bg-white/90">
              <Globe className="h-4 w-4 mr-2" />
              API Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card className="bg-white/95 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Real-time User Activity</CardTitle>
                <CardDescription>
                  Live tracking of user sessions and portal usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700">Regulatory Portal</span>
                      <Badge className="bg-green-100 text-green-800">5 active</Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mt-2">5</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-700">Farmer Portal</span>
                      <Badge className="bg-blue-100 text-blue-800">3 active</Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mt-2">3</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-700">Exporter Portal</span>
                      <Badge className="bg-purple-100 text-purple-800">2 active</Badge>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mt-2">2</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-700">Field Agent Portal</span>
                      <Badge className="bg-orange-100 text-orange-800">2 active</Badge>
                    </div>
                    <div className="text-2xl font-bold text-orange-600 mt-2">2</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Recent Login Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>admin001 (Regulatory) - Login</span>
                      <span className="text-gray-500">2 minutes ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>FRM-2024-001 (Farmer) - Active Session</span>
                      <span className="text-gray-500">5 minutes ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>EXP-2024-001 (Exporter) - Dashboard Access</span>
                      <span className="text-gray-500">8 minutes ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card className="bg-white/95 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>System Performance Metrics</CardTitle>
                <CardDescription>
                  Server health, database performance, and resource usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-700">CPU Usage</span>
                      <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mt-2">23%</div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700">Memory Usage</span>
                      <Badge className="bg-green-100 text-green-800">Good</Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mt-2">45%</div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-700">Database Load</span>
                      <Badge className="bg-purple-100 text-purple-800">Low</Badge>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mt-2">12%</div>
                    <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="bg-white/95 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Security & Audit Logs</CardTitle>
                <CardDescription>
                  Authentication events, security alerts, and system access logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Successful Login</div>
                      <div className="text-xs text-gray-500">admin001 from regulatory portal</div>
                    </div>
                    <span className="text-xs text-gray-500">10:28 PM</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">API Access</div>
                      <div className="text-xs text-gray-500">Dashboard metrics requested</div>
                    </div>
                    <span className="text-xs text-gray-500">10:29 PM</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Rate Limit Warning</div>
                      <div className="text-xs text-gray-500">High API request volume detected</div>
                    </div>
                    <span className="text-xs text-gray-500">10:25 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apis" className="space-y-4">
            <Card className="bg-white/95 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>API Monitoring</CardTitle>
                <CardDescription>
                  Real-time API usage, response times, and endpoint health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Top API Endpoints</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">/api/dashboard/metrics</span>
                        <Badge variant="secondary">847 calls</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">/api/auth/regulatory-login</span>
                        <Badge variant="secondary">245 calls</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">/api/commodities</span>
                        <Badge variant="secondary">189 calls</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Response Times</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average</span>
                        <span className="font-medium text-green-600">68ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">95th Percentile</span>
                        <span className="font-medium text-blue-600">124ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Max</span>
                        <span className="font-medium text-orange-600">2.1s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}