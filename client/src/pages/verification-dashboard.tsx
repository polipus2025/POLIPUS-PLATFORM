import { useState, useEffect } from "react";
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
  Server
} from "lucide-react";

interface VerificationData {
  id: number;
  type: 'certificate' | 'user' | 'tracking';
  status: 'verified' | 'pending' | 'rejected' | 'expired';
  code?: string;
  name: string;
  verifiedBy: string;
  verificationDate: string;
  location?: string;
  notes?: string;
}

const RealTimeVerificationDashboard = () => {
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [searchCode, setSearchCode] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [verificationData, setVerificationData] = useState<VerificationData[]>([]);
  const [stats, setStats] = useState({
    totalVerifications: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    todayCount: 0
  });

  // Generate real-time sample data
  useEffect(() => {
    const generateSampleData = () => {
      const sampleData: VerificationData[] = [
        {
          id: 1,
          type: 'certificate',
          status: 'verified',
          code: 'CERT-2025-001',
          name: 'Organic Coffee Export Certificate',
          verifiedBy: 'Sarah Johnson',
          verificationDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          location: 'Lofa County',
          notes: 'Grade A coffee batch meets EU organic standards'
        },
        {
          id: 2,
          type: 'user',
          status: 'verified',
          name: 'Moses Konneh - Farmer Verification',
          verifiedBy: 'Marcus Thompson',
          verificationDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          location: 'Lofa County',
          notes: 'Identity and farming license verified'
        },
        {
          id: 3,
          type: 'tracking',
          status: 'pending',
          code: 'TRK-2025-003',
          name: 'Cocoa Shipment Tracking',
          verifiedBy: 'System Auto',
          verificationDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          location: 'En route to Monrovia Port',
          notes: 'GPS tracking active, temperature within range'
        },
        {
          id: 4,
          type: 'certificate',
          status: 'verified',
          code: 'CERT-2025-002',
          name: 'EUDR Compliance Certificate',
          verifiedBy: 'Dr. Patricia Williams',
          verificationDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          location: 'Nimba County',
          notes: 'Deforestation-free verification complete'
        },
        {
          id: 5,
          type: 'user',
          status: 'pending',
          name: 'James Kollie - Field Agent Verification',
          verifiedBy: 'Admin Review',
          verificationDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          location: 'Bong County',
          notes: 'Background check in progress'
        }
      ];

      setVerificationData(sampleData);
      
      // Update statistics
      setStats({
        totalVerifications: sampleData.length,
        verified: sampleData.filter(d => d.status === 'verified').length,
        pending: sampleData.filter(d => d.status === 'pending').length,
        rejected: sampleData.filter(d => d.status === 'rejected').length,
        todayCount: sampleData.length
      });
    };

    generateSampleData();

    // Real-time updates every 10 seconds
    const interval = setInterval(() => {
      if (isLiveMode) {
        setLastUpdate(new Date());
        // Simulate real-time data changes
        setVerificationData(prev => {
          const updated = [...prev];
          // Randomly update a pending item to verified
          const pendingItems = updated.filter(item => item.status === 'pending');
          if (pendingItems.length > 0 && Math.random() > 0.7) {
            const randomPending = pendingItems[Math.floor(Math.random() * pendingItems.length)];
            randomPending.status = 'verified';
            randomPending.verificationDate = new Date().toISOString();
          }
          return updated;
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'certificate': return <FileCheck className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'tracking': return <MapPin className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const filteredData = verificationData.filter(item => 
    !searchCode || 
    item.code?.toLowerCase().includes(searchCode.toLowerCase()) ||
    item.name.toLowerCase().includes(searchCode.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Real-Time Verification System</h1>
            <p className="text-gray-600">LACRA - Certificate, User & Tracking Verification Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isLiveMode ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {isLiveMode ? 'Live' : 'Offline'} • Updated {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            <Button
              variant={isLiveMode ? "default" : "outline"}
              onClick={() => setIsLiveMode(!isLiveMode)}
              className="flex items-center gap-2"
            >
              <Wifi className="h-4 w-4" />
              {isLiveMode ? 'Live Mode' : 'Start Live Mode'}
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalVerifications}</div>
                  <p className="text-sm text-gray-500">Total Verifications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
                  <p className="text-sm text-gray-500">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-purple-600">{stats.todayCount}</div>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Server className="h-8 w-8 text-gray-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-gray-600">99.9%</div>
                  <p className="text-sm text-gray-500">Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by verification code or name..."
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <QrCode className="h-4 w-4 mr-2" />
                    Verify Certificate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Verify Certificate</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Verification Code</Label>
                      <Input placeholder="Enter certificate verification code..." />
                    </div>
                    <Button className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Verify Now
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Verifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Verifications
                    {isLiveMode && <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {filteredData.slice(0, 8).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(item.type)}
                            <div>
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className="text-xs text-gray-500">
                                {item.code && `${item.code} • `}
                                {new Date(item.verificationDate).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1">{item.status}</span>
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <span className="text-sm font-medium text-green-600">&lt; 100ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="text-sm font-medium text-green-600">98.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Connections</span>
                      <span className="text-sm font-medium text-blue-600">247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Verifications/Hour</span>
                      <span className="text-sm font-medium text-purple-600">
                        {Math.floor(Math.random() * 50) + 30}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">System Status</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-600">Online</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.filter(item => item.type === 'certificate').map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{item.status}</span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Code:</span> {item.code}
                        </div>
                        <div>
                          <span className="font-medium">Verified By:</span> {item.verifiedBy}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {item.location}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(item.verificationDate).toLocaleDateString()}
                        </div>
                      </div>
                      {item.notes && (
                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.filter(item => item.type === 'user').map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-600" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{item.status}</span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Verified By:</span> {item.verifiedBy}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {item.location}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(item.verificationDate).toLocaleDateString()}
                        </div>
                      </div>
                      {item.notes && (
                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>Tracking Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.filter(item => item.type === 'tracking').map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-orange-600" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{item.status}</span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Code:</span> {item.code}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {item.verifiedBy}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {item.location}
                        </div>
                        <div>
                          <span className="font-medium">Updated:</span> {new Date(item.verificationDate).toLocaleString()}
                        </div>
                      </div>
                      {item.notes && (
                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RealTimeVerificationDashboard;