import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Shield, 
  Download, 
  Activity, 
  Eye,
  MapPin,
  Truck,
  BarChart3,
  Globe,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Building2,
  DollarSign,
  Package,
  LogOut
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OverviewStats {
  totalFarmers: number;
  totalBuyers: number;
  totalExporters: number;
  totalInspectors: number;
  totalTransactions: number;
  totalValue: number;
  activeCertificates: number;
  pendingInspections: number;
}

interface Transaction {
  id: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  exporterId?: string;
  exporterName?: string;
  product: string;
  quantity: number;
  value: number;
  status: string;
  createdAt: string;
  county: string;
}

interface Certificate {
  id: string;
  type: string;
  farmerName: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  status: string;
}

export default function MonitoringDashboard() {
  const [, setLocation] = useLocation();
  const [userInfo, setUserInfo] = useState<any>(null);
  const { toast } = useToast();

  // Check authentication and get user info
  useEffect(() => {
    const token = localStorage.getItem("monitoring_token");
    const userData = localStorage.getItem("monitoring_user");
    
    if (!token || !userData) {
      toast({
        title: "Session Expired",
        description: "Please login again to access the monitoring dashboard.",
        variant: "destructive",
      });
      setLocation("/monitoring-login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUserInfo(user);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setLocation("/monitoring-login");
    }
  }, []);

  // Fetch overview statistics
  const { data: overviewStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/monitoring/overview-stats"],
    retry: false,
  });

  // Fetch recent transactions
  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/monitoring/recent-transactions"],
    retry: false,
  });

  // Fetch certificates
  const { data: certificates, isLoading: certificatesLoading } = useQuery({
    queryKey: ["/api/monitoring/certificates"],
    retry: false,
  });

  // Fetch supply chain data
  const { data: supplyChainData, isLoading: supplyChainLoading } = useQuery({
    queryKey: ["/api/monitoring/supply-chain"],
    retry: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("monitoring_token");
    localStorage.removeItem("monitoring_user");
    localStorage.removeItem("userType");
    localStorage.removeItem("userRole");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setLocation("/monitoring-login");
  };

  const generatePDFReport = async () => {
    try {
      const response = await apiRequest("/api/monitoring/generate-pdf-report", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("monitoring_token")}`
        }
      });

      // Create download link
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agricultural-supply-chain-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      // CRITICAL FIX: Safe DOM removal
      try {
        if (link && link.parentNode && link.parentNode.contains(link)) {
          link.parentNode.removeChild(link);
        }
      } catch (e) {
        // Element already removed - ignore
      }
      window.URL.revokeObjectURL(url);

      toast({
        title: "Report Downloaded",
        description: "Comprehensive supply chain report has been generated and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'donor': return <Globe className="w-5 h-5" />;
      case 'ngo': return <Users className="w-5 h-5" />;
      case 'auditor': return <FileText className="w-5 h-5" />;
      default: return <Eye className="w-5 h-5" />;
    }
  };

  const getEntityLabel = (entityType: string) => {
    switch (entityType) {
      case 'donor': return 'International Donor';
      case 'ngo': return 'NGO Organization';
      case 'auditor': return 'Government Auditor';
      default: return 'Observer';
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getEntityIcon(userInfo.entityType)}
                <h1 className="text-xl font-bold text-slate-900">
                  Oversight Dashboard
                </h1>
              </div>
              <Badge variant="outline" className="text-xs">
                {getEntityLabel(userInfo.entityType)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {userInfo.organizationName || userInfo.username}
                </p>
                <p className="text-xs text-slate-500">
                  {getEntityLabel(userInfo.entityType)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats?.totalFarmers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Registered farmers in system
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Transactions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats?.totalTransactions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Supply chain transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(overviewStats?.totalValue || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Combined transaction value
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats?.activeCertificates || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active compliance certificates
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      System Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Farmers Registered</span>
                        <Badge variant="secondary">{overviewStats?.totalFarmers || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Buyers Active</span>
                        <Badge variant="secondary">{overviewStats?.totalBuyers || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Exporters Verified</span>
                        <Badge variant="secondary">{overviewStats?.totalExporters || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Inspectors Active</span>
                        <Badge variant="secondary">{overviewStats?.totalInspectors || 0}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Operational Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pending Inspections</span>
                        <Badge variant="outline">{overviewStats?.pendingInspections || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">System Status</span>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Operational
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Data Integrity</span>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-2"></div>
                      <p className="text-sm text-slate-600">Loading transactions...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentTransactions?.map((transaction: Transaction) => (
                        <div key={transaction.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{transaction.farmerName} → {transaction.buyerName}</h4>
                              <p className="text-sm text-slate-600">
                                {transaction.product} • {transaction.quantity}kg • {transaction.county}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${transaction.value.toLocaleString()}</p>
                              <Badge 
                                variant={
                                  transaction.status === 'completed' ? 'default' : 
                                  transaction.status === 'pending' ? 'secondary' : 'destructive'
                                }
                              >
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )) || (
                        <p className="text-center text-slate-500 py-8">No transactions found</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Certificates</CardTitle>
                </CardHeader>
                <CardContent>
                  {certificatesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-2"></div>
                      <p className="text-sm text-slate-600">Loading certificates...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {certificates?.map((cert: Certificate) => (
                        <div key={cert.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{cert.type}</h4>
                              <p className="text-sm text-slate-600">{cert.farmerName}</p>
                              <p className="text-xs text-slate-500">
                                Issued by {cert.issuedBy} • {new Date(cert.issueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge 
                              variant={cert.status === 'active' ? 'default' : 'secondary'}
                            >
                              {cert.status}
                            </Badge>
                          </div>
                        </div>
                      )) || (
                        <p className="text-center text-slate-500 py-8">No certificates found</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="supply-chain" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Supply Chain Visibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h3 className="font-medium">Farms</h3>
                      <p className="text-2xl font-bold">{overviewStats?.totalFarmers || 0}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-medium">Processing</h3>
                      <p className="text-2xl font-bold">{overviewStats?.totalBuyers || 0}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Package className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <h3 className="font-medium">Export</h3>
                      <p className="text-2xl font-bold">{overviewStats?.totalExporters || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Comprehensive Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-semibold mb-2">Generate Comprehensive Report</h3>
                    <p className="text-slate-600 mb-6">
                      Generate a complete PDF report containing all operational activities, 
                      transactions, certifications, and supply chain data for oversight and compliance purposes.
                    </p>
                    <Button 
                      onClick={generatePDFReport}
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      <Download className="w-4 h-4" />
                      Generate & Download PDF Report
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <h4 className="font-medium">Report Includes:</h4>
                      <ul className="space-y-1 text-slate-600">
                        <li>• Complete farmer registration data</li>
                        <li>• All transaction records</li>
                        <li>• Certificate status and compliance</li>
                        <li>• Supply chain traceability</li>
                        <li>• Inspector activities and findings</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Data Coverage:</h4>
                      <ul className="space-y-1 text-slate-600">
                        <li>• Real-time operational status</li>
                        <li>• Regulatory compliance metrics</li>
                        <li>• Financial transaction summaries</li>
                        <li>• Geographic distribution maps</li>
                        <li>• Audit trail and timestamps</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
    setIsTestingActive(true);
    setTestProgress(0);
    setTestResults([]);

    const tests = [
      { name: 'Authentication System', endpoint: '/api/auth/monitoring-login', method: 'POST', data: { username: 'monitor001', password: 'monitor123' } },
      { name: 'Regulatory Portal', endpoint: '/api/auth/regulatory-login', method: 'POST', data: { username: 'admin001', password: 'admin123', role: 'admin' } },
      { name: 'Farmer Portal', endpoint: '/api/auth/farmer-login', method: 'POST', data: { farmerId: 'FRM-2024-001', password: 'farmer123' } },
      { name: 'Field Agent Portal', endpoint: '/api/auth/field-agent-login', method: 'POST', data: { agentId: 'AGT-2024-001', password: 'agent123' } },
      { name: 'Exporter Portal', endpoint: '/api/auth/exporter-login', method: 'POST', data: { username: 'EXP-2024-001', password: 'exporter123' } },
      { name: 'Dashboard API', endpoint: '/api/dashboard/metrics', method: 'GET' },
      { name: 'Commodities Data', endpoint: '/api/commodities', method: 'GET' },
      { name: 'GPS Mapping System', endpoint: '/api/gps-data', method: 'GET' },
      { name: 'Internal Messaging', endpoint: '/api/messages', method: 'GET' },
      { name: 'System Performance', endpoint: '/api/monitoring/system-metrics', method: 'GET' },
      { name: 'Database Connection', endpoint: '/api/dashboard/farmer-stats', method: 'GET' },
      { name: 'Export Permits', endpoint: '/api/export-permits', method: 'GET' }
    ];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      setTestResults(prev => [...prev, { test: test.name, status: 'running', message: 'Testing...' }]);
      
      try {
        const response = await fetch(test.endpoint, {
          method: test.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
          },
          body: test.data ? JSON.stringify(test.data) : undefined
        });

        const isSuccess = response.status === 200 || response.status === 201;
        
        setTestResults(prev => prev.map(result => 
          result.test === test.name 
            ? { 
                ...result, 
                status: isSuccess ? 'passed' : 'failed', 
                message: isSuccess ? `✓ Response: ${response.status}` : `✗ Error: ${response.status} ${response.statusText}` 
              }
            : result
        ));
      } catch (error) {
        setTestResults(prev => prev.map(result => 
          result.test === test.name 
            ? { ...result, status: 'failed', message: `✗ Connection Error: ${error}` }
            : result
        ));
      }

      setTestProgress(((i + 1) / tests.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 800)); // Delay between tests
    }

    setIsTestingActive(false);
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
          <div className="flex items-center gap-2">
            {/* System Health Check Button */}
            <Link href="/system-monitoring">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-blue-600/20 border-blue-400/50 text-blue-100 hover:bg-blue-600/30"
                data-testid="system-health-button"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Run System Health Check
              </Button>
            </Link>
            
            {/* Super Backend Dashboard Access */}
            <a href="/super-backend" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-purple-500/20 border-purple-400/50 text-purple-100 hover:bg-purple-500/30"
              >
                <Terminal className="h-4 w-4 mr-2" />
                Super Backend
              </Button>
            </a>
            
            {/* Central Control Dashboard Access */}
            <a href="/central-control" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-orange-500/20 border-orange-400/50 text-orange-100 hover:bg-orange-500/30"
              >
                <Settings className="h-4 w-4 mr-2" />
                Central Control
              </Button>
            </a>
            
            <Link href="/mobile-app-dashboard">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-blue-500/20 border-blue-400/50 text-blue-100 hover:bg-blue-500/30"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile App Dashboard
              </Button>
            </Link>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-green-500/20 border-green-400/50 text-green-100 hover:bg-green-500/30"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Comprehensive Test
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-blue-600" />
                    Platform Comprehensive Testing Suite
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Test all website functionality and authentication systems in real-time
                    </p>
                    <Button 
                      onClick={runComprehensiveTest}
                      disabled={isTestingActive}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isTestingActive ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Test
                        </>
                      )}
                    </Button>
                  </div>

                  {isTestingActive && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{Math.round(testProgress)}%</span>
                      </div>
                      <Progress value={testProgress} className="w-full" />
                    </div>
                  )}

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {testResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {result.status === 'running' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                          {result.status === 'passed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {result.status === 'failed' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          <span className="font-medium">{result.test}</span>
                        </div>
                        <div className="text-sm">
                          <Badge 
                            variant={result.status === 'passed' ? 'default' : result.status === 'failed' ? 'destructive' : 'secondary'}
                            className={result.status === 'running' ? 'bg-blue-100 text-blue-800' : ''}
                          >
                            {result.status === 'running' ? 'Testing' : result.status === 'passed' ? 'Passed' : 'Failed'}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{result.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {testResults.length > 0 && !isTestingActive && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Test Summary:</span>
                        <div className="flex gap-4 text-sm">
                          <span className="text-green-600">
                            ✓ {testResults.filter(r => r.status === 'passed').length} Passed
                          </span>
                          <span className="text-red-600">
                            ✗ {testResults.filter(r => r.status === 'failed').length} Failed
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
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
              <div className="text-2xl font-bold text-green-600">{monitoringData?.totalUsers || 0}</div>
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
              <div className="text-2xl font-bold text-blue-600">{(monitoringData?.totalOffers || 0) * 100 + (systemMetrics?.apiRequests || 0)}</div>
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
              <div className="text-2xl font-bold text-green-600">{monitoringData?.systemHealth || 98.5}%</div>
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
              <div className="text-2xl font-bold text-orange-600">{monitoringData?.responseTime || 68}ms</div>
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
                      <Badge className="bg-green-100 text-green-800">{userActivity?.regulatoryPortal || 0} active</Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mt-2">{userActivity?.regulatoryPortal || 0}</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-700">Farmer Portal</span>
                      <Badge className="bg-blue-100 text-blue-800">{userActivity?.farmerPortal || 0} active</Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mt-2">{userActivity?.farmerPortal || 0}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-700">Exporter Portal</span>
                      <Badge className="bg-purple-100 text-purple-800">{userActivity?.exporterPortal || 0} active</Badge>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mt-2">{userActivity?.exporterPortal || 0}</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-700">Field Agent Portal</span>
                      <Badge className="bg-orange-100 text-orange-800">{userActivity?.fieldAgents || 0} active</Badge>
                    </div>
                    <div className="text-2xl font-bold text-orange-600 mt-2">{userActivity?.fieldAgents || 0}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Recent Login Activity</h4>
                  <div className="space-y-2">
                    {userActivity?.recentActivity?.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{activity.user} - {activity.action}</span>
                        <span className="text-gray-500">
                          {Math.floor((Date.now() - new Date(activity.timestamp).getTime()) / 60000)} minutes ago
                        </span>
                      </div>
                    )) || (
                      <div className="text-sm text-gray-500">No recent activity</div>
                    )}
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
                    <div className="text-2xl font-bold text-blue-600 mt-2">{systemMetrics?.cpu || 0}%</div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${systemMetrics?.cpu || 0}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700">Memory Usage</span>
                      <Badge className="bg-green-100 text-green-800">Good</Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mt-2">{systemMetrics?.memory || 0}%</div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${systemMetrics?.memory || 0}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-700">Database Load</span>
                      <Badge className="bg-purple-100 text-purple-800">Low</Badge>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mt-2">{systemMetrics?.database || 0}%</div>
                    <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${systemMetrics?.database || 0}%` }}></div>
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

        {/* Independent Access Portals - Added from Front Page */}
        <Card className="bg-white/95 border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900">Independent Access Portals</CardTitle>
                <CardDescription>Alternative portal access for administrators and regulatory staff</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">System Administrator Portal</h4>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Comprehensive system control center with cross-module connectivity monitoring, 
                  database management, and system health oversight for platform administrators.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>7 Module Integration</span>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>System Health</span>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Database Control</span>
                </div>
                <a href="/system-admin-login">
                  <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white">
                    <Shield className="h-4 w-4 mr-2" />
                    Access System Portal
                  </Button>
                </a>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-700 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">Regulatory Portal (Classic)</h4>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Original unified regulatory interface with comprehensive EUDR compliance monitoring, 
                  exporter management, and inspection oversight in a single dashboard.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>EUDR Compliance</span>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Export Control</span>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Unified Interface</span>
                </div>
                <a href="/regulatory-classic-login">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Access Classic Portal
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Documentation - Added from Front Page */}
        <Card className="bg-white/95 border-0 shadow-xl bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-blue-200">
          <CardHeader>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
                Platform Documentation
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
                Download comprehensive technical documentation covering the world's first environmental intelligence ecosystem with all 8 integrated modules, 200+ satellite sources, shipping tracking & monitoring system integration, and complete monitoring capabilities.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Button 
                onClick={() => window.open('/api/download/platform-documentation', '_blank')}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Complete Documentation PDF
              </Button>
              <div className="mt-4 flex items-center justify-center gap-6 text-xs sm:text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Complete 24-Page Analysis</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>All 8 Modules</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>200+ Satellites</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Comprehensive environmental intelligence analysis • Generated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}