import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  FileCheck, 
  MapPin, 
  Activity,
  Search,
  QrCode,
  Eye,
  Plus,
  BarChart3,
  TrendingUp,
  Wifi,
  Server,
  Zap,
  Database,
  Globe,
  Target,
  Award,
  Loader2,
  RefreshCw
} from "lucide-react";

interface VerificationData {
  id: number;
  type: 'certificate' | 'user' | 'tracking' | 'commodity' | 'export';
  status: 'verified' | 'pending' | 'rejected' | 'expired';
  code?: string;
  name: string;
  verifiedBy: string;
  verificationDate: string;
  location?: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  complianceScore?: number;
}

interface SystemMetrics {
  totalVerifications: number;
  verified: number;
  pending: number;
  rejected: number;
  todayCount: number;
  averageTime: number;
  systemUptime: number;
  apiConnections: number;
}

export default function RealTimeVerificationDashboard() {
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [searchCode, setSearchCode] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [verificationData, setVerificationData] = useState<VerificationData[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalVerifications: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    todayCount: 0,
    averageTime: 0,
    systemUptime: 99.8,
    apiConnections: 0
  });
  const [selectedVerification, setSelectedVerification] = useState<VerificationData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Generate realistic verification data
  useEffect(() => {
    const generateVerificationData = () => {
      const verificationTypes = ['certificate', 'user', 'tracking', 'commodity', 'export'] as const;
      const statuses = ['verified', 'pending', 'rejected'] as const;
      const priorities = ['high', 'medium', 'low'] as const;
      const locations = ['Montserrado County', 'Lofa County', 'Nimba County', 'Bong County', 'Grand Bassa County'];
      const officers = ['Sarah Johnson', 'Marcus Thompson', 'Dr. Patricia Williams', 'James Miller', 'Maria Santos'];

      const sampleData: VerificationData[] = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        type: verificationTypes[Math.floor(Math.random() * verificationTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        code: `VER-2025-${String(i + 1).padStart(3, '0')}`,
        name: `${verificationTypes[Math.floor(Math.random() * verificationTypes.length)]} Verification ${i + 1}`,
        verifiedBy: officers[Math.floor(Math.random() * officers.length)],
        verificationDate: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        location: locations[Math.floor(Math.random() * locations.length)],
        notes: `Automated verification process completed with ${Math.floor(Math.random() * 20) + 80}% confidence`,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        complianceScore: Math.floor(Math.random() * 20) + 80
      }));

      setVerificationData(sampleData);
      
      // Update metrics
      setSystemMetrics({
        totalVerifications: sampleData.length,
        verified: sampleData.filter(d => d.status === 'verified').length,
        pending: sampleData.filter(d => d.status === 'pending').length,
        rejected: sampleData.filter(d => d.status === 'rejected').length,
        todayCount: Math.floor(sampleData.length * 0.7),
        averageTime: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
        systemUptime: 99.8,
        apiConnections: Math.floor(Math.random() * 50) + 150
      });
    };

    generateVerificationData();
    
    // Real-time updates every 5 seconds when live mode is active
    const interval = setInterval(() => {
      if (isLiveMode) {
        generateVerificationData();
        setLastUpdate(new Date());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const handleManualVerification = async (id: number, newStatus: 'verified' | 'rejected') => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationData(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, status: newStatus, verificationDate: new Date().toISOString() }
            : item
        )
      );
      
      toast({
        title: "Verification Updated",
        description: `Record ${id} has been ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Could not update verification status",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredData = verificationData.filter(item => 
    searchCode === "" || 
    item.code?.toLowerCase().includes(searchCode.toLowerCase()) ||
    item.name.toLowerCase().includes(searchCode.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Real-Time Verification Dashboard - AgriTrace360 LACRA</title>
        <meta name="description" content="Real-time agricultural compliance verification and monitoring system" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section - ISMS Style */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl isms-icon-bg-blue flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Real-Time Verification Dashboard</h1>
              <p className="text-slate-600 text-lg">Advanced compliance verification and monitoring system</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsLiveMode(!isLiveMode)}
              className={`isms-button flex items-center gap-2 ${isLiveMode ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
            >
              {isLiveMode ? (
                <>
                  <Activity className="h-4 w-4 animate-pulse" />
                  Live Mode ON
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Live Mode OFF
                </>
              )}
            </Button>
            <Badge variant="outline" className="px-3 py-2 text-sm">
              Last Updated: {lastUpdate.toLocaleTimeString()}
            </Badge>
          </div>
        </div>

        {/* System Metrics Overview - ISMS Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Total Verified</p>
                <p className="text-3xl font-bold text-slate-900">{systemMetrics.verified}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Successfully verified records</p>
          </div>

          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-yellow flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Pending Review</p>
                <p className="text-3xl font-bold text-slate-900">{systemMetrics.pending}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Awaiting manual verification</p>
          </div>

          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-purple flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Today's Count</p>
                <p className="text-3xl font-bold text-slate-900">{systemMetrics.todayCount}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Verifications processed today</p>
          </div>

          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-indigo flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">System Uptime</p>
                <p className="text-3xl font-bold text-slate-900">{systemMetrics.systemUptime}%</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Real-time system availability</p>
          </div>
        </div>

        {/* Search and Controls - ISMS Style */}
        <div className="isms-card mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl isms-icon-bg-blue flex items-center justify-center">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Verification Search & Controls</h2>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by verification code or description..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="h-12"
              />
            </div>
            <Button className="isms-button h-12 px-6">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Main Verification Dashboard - ISMS Style */}
        <div className="isms-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
              <FileCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Verification Management Center</h2>
              <p className="text-slate-600">Real-time monitoring and manual verification controls</p>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 rounded-xl">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                System Overview
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Pending Review
              </TabsTrigger>
              <TabsTrigger value="verified" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Verified Records
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold text-slate-900">Recent Verification Activity</h3>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {filteredData.slice(0, 10).map((item) => (
                      <div key={item.id} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg isms-icon-bg-blue flex items-center justify-center">
                              {item.type === 'certificate' && <Award className="h-4 w-4 text-white" />}
                              {item.type === 'user' && <Users className="h-4 w-4 text-white" />}
                              {item.type === 'tracking' && <MapPin className="h-4 w-4 text-white" />}
                              {item.type === 'commodity' && <FileCheck className="h-4 w-4 text-white" />}
                              {item.type === 'export' && <Globe className="h-4 w-4 text-white" />}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900">{item.name}</h4>
                              <p className="text-sm text-slate-600">{item.code}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">Verified By:</span>
                            <p className="font-medium">{item.verifiedBy}</p>
                          </div>
                          <div>
                            <span className="text-slate-600">Location:</span>
                            <p className="font-medium">{item.location}</p>
                          </div>
                          <div>
                            <span className="text-slate-600">Score:</span>
                            <p className="font-medium">{item.complianceScore}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold text-slate-900">Pending Manual Verification</h3>
                <div className="space-y-4">
                  {filteredData.filter(item => item.status === 'pending').map((item) => (
                    <div key={item.id} className="bg-slate-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-slate-900 text-lg">{item.name}</h4>
                          <p className="text-slate-600">{item.code} • {item.location}</p>
                        </div>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority} priority
                        </Badge>
                      </div>
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="text-slate-600 text-sm mb-2">Verification Notes:</p>
                        <p className="text-slate-900">{item.notes}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleManualVerification(item.id, 'verified')}
                          disabled={isProcessing}
                          className="isms-button bg-green-600 hover:bg-green-700"
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleManualVerification(item.id, 'rejected')}
                          disabled={isProcessing}
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Review Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="verified" className="space-y-6">
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold text-slate-900">Successfully Verified Records</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredData.filter(item => item.status === 'verified').map((item) => (
                    <div key={item.id} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{item.name}</h4>
                          <p className="text-sm text-slate-600">{item.code}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Verified By:</span>
                          <span className="font-medium">{item.verifiedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date:</span>
                          <span className="font-medium">
                            {new Date(item.verificationDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Score:</span>
                          <span className="font-medium text-green-600">{item.complianceScore}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="font-medium text-slate-900 mb-3">Verification Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Success Rate</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Average Time</span>
                      <span className="font-medium">{Math.floor(systemMetrics.averageTime / 60)}m {systemMetrics.averageTime % 60}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Daily Volume</span>
                      <span className="font-medium">{systemMetrics.todayCount}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="font-medium text-slate-900 mb-3">System Health</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600">Uptime</span>
                        <span className="font-medium">{systemMetrics.systemUptime}%</span>
                      </div>
                      <Progress value={systemMetrics.systemUptime} className="h-2" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">API Connections</span>
                      <span className="font-medium">{systemMetrics.apiConnections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Response Time</span>
                      <span className="font-medium">0.8s</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="font-medium text-slate-900 mb-3">Compliance Trends</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">EUDR Compliance</span>
                      <span className="font-medium text-green-600">96%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Certificate Validity</span>
                      <span className="font-medium text-green-600">98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Risk Level</span>
                      <span className="font-medium text-yellow-600">Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}