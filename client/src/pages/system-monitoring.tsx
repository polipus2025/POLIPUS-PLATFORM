import { useState, memo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Shield,
  Database,
  Server,
  Wifi,
  Clock,
  TrendingUp,
  Settings,
  Wrench
} from "lucide-react";

interface SystemCheck {
  component: string;
  status: 'healthy' | 'warning' | 'error' | 'checking';
  responseTime?: number;
  message: string;
  advice?: string;
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'error';
  score: number;
  checks: SystemCheck[];
  lastUpdated: string;
}

const SystemMonitoring = memo(() => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const runSystemDiagnostics = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);

    try {
      // Initialize with checking status
      const initialChecks: SystemCheck[] = [
        { component: 'Database Connection', status: 'checking', message: 'Testing connection...' },
        { component: 'Farmer Portal', status: 'checking', message: 'Checking accessibility...' },
        { component: 'Buyer Portal', status: 'checking', message: 'Checking accessibility...' },
        { component: 'Exporter Portal', status: 'checking', message: 'Checking accessibility...' },
        { component: 'Regulatory Portal', status: 'checking', message: 'Checking accessibility...' },
        { component: 'Inspector Portal', status: 'checking', message: 'Checking accessibility...' },
        { component: 'DG Authority Portal', status: 'checking', message: 'Checking accessibility...' },
        { component: 'API Endpoints', status: 'checking', message: 'Testing API responses...' },
        { component: 'Performance Metrics', status: 'checking', message: 'Measuring response times...' },
        { component: 'LSP Diagnostics', status: 'checking', message: 'Scanning for errors...' }
      ];

      setSystemHealth({
        overall: 'warning',
        score: 0,
        checks: initialChecks,
        lastUpdated: new Date().toLocaleString()
      });

      // Run the actual diagnostics
      const response = await fetch('/api/system-health-check');
      
      if (!response.ok) {
        throw new Error('Failed to run system diagnostics');
      }

      const healthData = await response.json();
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      setTimeout(() => {
        setSystemHealth(healthData);
        setProgress(100);
        setIsRunning(false);
        
        toast({
          title: "System Diagnostics Complete",
          description: `Overall system health: ${healthData.overall.toUpperCase()} (Score: ${healthData.score}/100)`,
          variant: healthData.overall === 'error' ? 'destructive' : 'default'
        });
      }, 2000);

    } catch (error) {
      console.error('System diagnostics failed:', error);
      setIsRunning(false);
      setProgress(0);
      toast({
        title: "Diagnostics Failed",
        description: "Unable to complete system health check. Please check server connection.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const getStatusIcon = (status: SystemCheck['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'checking': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBadge = (status: SystemCheck['status']) => {
    const variants = {
      healthy: 'default',
      warning: 'secondary',
      error: 'destructive',
      checking: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status === 'checking' ? 'Running...' : status}
      </Badge>
    );
  };

  const getComponentIcon = (component: string) => {
    if (component.includes('Database')) return <Database className="h-4 w-4" />;
    if (component.includes('Portal')) return <Shield className="h-4 w-4" />;
    if (component.includes('API')) return <Server className="h-4 w-4" />;
    if (component.includes('Performance')) return <TrendingUp className="h-4 w-4" />;
    if (component.includes('LSP')) return <Settings className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">System Monitoring Dashboard</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Comprehensive health monitoring for the entire Polipus Environmental Intelligence Platform. 
            Run diagnostics to check all systems and get expert repair advice.
          </p>
          
          {/* Back to Monitoring Dashboard Button */}
          <div className="flex justify-center mt-4">
            <a href="/monitoring-dashboard">
              <Button 
                variant="outline"
                className="bg-slate-600 hover:bg-slate-700 text-white border-slate-500"
                data-testid="back-to-monitoring-button"
              >
                <Activity className="h-4 w-4 mr-2" />
                Back to Monitoring Dashboard
              </Button>
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-600" />
              System Health Check
            </CardTitle>
            <CardDescription>
              Run comprehensive diagnostics across all platform components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={runSystemDiagnostics}
                disabled={isRunning}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="run-diagnostics-button"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running Diagnostics...
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Run Full System Check
                  </>
                )}
              </Button>
              
              {systemHealth && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    Last check: {systemHealth.lastUpdated}
                  </span>
                </div>
              )}
            </div>

            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Progress</span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overall Status */}
        {systemHealth && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  Overall System Status
                  {getStatusIcon(systemHealth.overall as any)}
                </span>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {systemHealth.score}/100
                  </div>
                  <div className="text-sm text-slate-500">Health Score</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium">
                    {systemHealth.checks.filter(c => c.status === 'healthy').length} Healthy
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="font-medium">
                    {systemHealth.checks.filter(c => c.status === 'warning').length} Warnings
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="font-medium">
                    {systemHealth.checks.filter(c => c.status === 'error').length} Errors
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Results */}
        {systemHealth && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Component Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHealth.checks.map((check, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getComponentIcon(check.component)}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{check.component}</h4>
                            {getStatusBadge(check.status)}
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{check.message}</p>
                          {check.responseTime && (
                            <p className="text-xs text-slate-500 mt-1">
                              Response time: {check.responseTime}ms
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Repair Advice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Repair Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHealth.checks
                    .filter(check => check.advice && (check.status === 'error' || check.status === 'warning'))
                    .map((check, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>{check.component}</AlertTitle>
                        <AlertDescription>{check.advice}</AlertDescription>
                      </Alert>
                    ))}
                  
                  {systemHealth.checks.every(check => !check.advice || check.status === 'healthy') && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>All Systems Healthy</AlertTitle>
                      <AlertDescription>
                        No issues detected. Your platform is running optimally!
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>System Monitoring Help</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">What gets checked:</h4>
                <ul className="space-y-1 text-slate-600">
                  <li>• Database connectivity and performance</li>
                  <li>• All portal accessibility and response times</li>
                  <li>• API endpoint health and functionality</li>
                  <li>• System performance metrics</li>
                  <li>• Code quality and error scanning</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Status meanings:</h4>
                <ul className="space-y-1 text-slate-600">
                  <li>• <span className="text-green-600 font-medium">Healthy</span>: Component working perfectly</li>
                  <li>• <span className="text-yellow-600 font-medium">Warning</span>: Minor issues detected</li>
                  <li>• <span className="text-red-600 font-medium">Error</span>: Critical problems found</li>
                  <li>• <span className="text-blue-600 font-medium">Checking</span>: Test in progress</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

SystemMonitoring.displayName = 'SystemMonitoring';
export default SystemMonitoring;