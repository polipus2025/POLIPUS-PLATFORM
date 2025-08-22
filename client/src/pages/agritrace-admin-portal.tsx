import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Database, 
  Shield, 
  Activity, 
  BarChart3, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Wheat,
  LogOut,
  Cpu,
  HardDrive,
  Monitor
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

interface AgriTraceDashboardData {
  systemInfo: {
    platform: string;
    module: string;
    scope: string;
    adminType: string;
    version: string;
    lastUpdated: string;
  };
  systemHealth: {
    status: string;
    uptime: number;
    memory: any;
    cpu: number[];
    moduleSpecific: string;
  };
  recentActivity: any[];
  activeFeatures: any[];
  activeControls: any[];
  performanceOverview: {
    avgResponseTime: number;
    errorRate: number;
    throughput: number;
  };
  restrictions: {
    platformAccess: boolean;
    otherModules: boolean;
    globalControls: boolean;
    crossModuleData: boolean;
  };
  capabilities: string[];
}

export default function AgriTraceAdminPortal() {
  const [dashboardData, setDashboardData] = useState<AgriTraceDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const userInfo = {
    username: localStorage.getItem("username") || "agritrace.admin",
    role: localStorage.getItem("userRole") || "system_administrator",
    scope: localStorage.getItem("adminScope") || "AgriTrace360™ Module Only"
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await apiRequest('/api/agritrace-admin/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setDashboardData(response);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch dashboard data";
      setError(errorMessage);
      toast({
        title: "Dashboard Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    localStorage.removeItem("adminScope");
    
    toast({
      title: "Logged Out",
      description: "Successfully logged out of AgriTrace Admin Portal",
    });
    
    window.location.href = "/";
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatMemory = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading AgriTrace Control Center...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>AgriTrace System Administrator - Control Center</title>
        <meta name="description" content="AgriTrace360™ agricultural traceability system administration" />
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img 
                  src={lacraLogo} 
                  alt="LACRA Official Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AgriTrace Control Center</h1>
                <p className="text-sm text-gray-600">Agricultural Traceability System Administration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userInfo.username}</p>
                <p className="text-xs text-gray-500">{userInfo.scope}</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* System Information Cards */}
        {dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">Healthy</div>
                  <p className="text-xs text-muted-foreground">AgriTrace Module Only</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatUptime(dashboardData.systemHealth.uptime)}</div>
                  <p className="text-xs text-muted-foreground">Continuous operation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                  <Cpu className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatMemory(dashboardData.systemHealth.memory.heapUsed)}</div>
                  <p className="text-xs text-muted-foreground">of {formatMemory(dashboardData.systemHealth.memory.heapTotal)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Admin Scope</CardTitle>
                  <Wheat className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Limited</div>
                  <p className="text-xs text-muted-foreground">AgriTrace Only</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="system">System Health</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="controls">Controls</TabsTrigger>
                <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-500" />
                        System Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Platform:</span>
                        <span className="text-sm">{dashboardData.systemInfo.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Module:</span>
                        <span className="text-sm">{dashboardData.systemInfo.module}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Admin Type:</span>
                        <Badge variant="secondary">{dashboardData.systemInfo.adminType}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Version:</span>
                        <span className="text-sm">{dashboardData.systemInfo.version}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-500" />
                        AgriTrace Capabilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {dashboardData.capabilities.map((capability, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm">{capability}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="system" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-blue-500" />
                      AgriTrace System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600 mb-2">
                          {dashboardData.systemHealth.status.toUpperCase()}
                        </div>
                        <p className="text-sm text-gray-600">Overall Status</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {dashboardData.systemHealth.cpu[0]?.toFixed(2) || "0.00"}
                        </div>
                        <p className="text-sm text-gray-600">CPU Load</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          {formatMemory(dashboardData.systemHealth.memory.heapUsed)}
                        </div>
                        <p className="text-sm text-gray-600">Memory Used</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-purple-500" />
                      AgriTrace Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.activeFeatures.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.activeFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{feature.flagName || `Feature ${index + 1}`}</h4>
                              <p className="text-sm text-gray-600">{feature.description || "AgriTrace feature control"}</p>
                            </div>
                            <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                              Active
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No active AgriTrace features to display</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="controls" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      AgriTrace System Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.activeControls.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.activeControls.map((control, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{control.controlType || `Control ${index + 1}`}</h4>
                              <p className="text-sm text-gray-600">AgriTrace system control</p>
                            </div>
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              Active
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No active AgriTrace controls</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="restrictions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Administrative Restrictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-6 border-amber-200 bg-amber-50">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        This administrator has limited scope - AgriTrace agricultural module only.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <span className="font-medium">Polipus Platform Access</span>
                        <Badge variant="destructive">Restricted</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <span className="font-medium">Other Module Access</span>
                        <Badge variant="destructive">Restricted</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <span className="font-medium">Global System Controls</span>
                        <Badge variant="destructive">Restricted</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <span className="font-medium">Cross-Module Data</span>
                        <Badge variant="destructive">Restricted</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <span className="font-medium">AgriTrace Administration</span>
                        <Badge variant="default" className="bg-emerald-600">Allowed</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}