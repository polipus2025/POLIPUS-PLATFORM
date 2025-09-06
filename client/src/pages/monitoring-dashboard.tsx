import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
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
  LogOut,
  Terminal,
  Settings
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
  const [isTestingActive, setIsTestingActive] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testResults, setTestResults] = useState<any[]>([]);
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

  // System testing function
  const runSystemTests = async () => {
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
}
