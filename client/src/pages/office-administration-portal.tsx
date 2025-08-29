import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  FolderOpen, 
  Archive, 
  ScanLine, 
  FileText, 
  Settings, 
  Users, 
  Calendar, 
  Workflow,
  Search,
  Upload,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Home,
  Database,
  Monitor
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

export default function OfficeAdministrationPortal() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [documents, setDocuments] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load user data from localStorage
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('userRole');
    const authToken = localStorage.getItem('authToken');

    if (!username || !authToken) {
      window.location.href = '/regulatory-login';
      return;
    }

    setUser({ username, role });
    
    // Load sample office data
    loadOfficeData();
  }, []);

  const loadOfficeData = () => {
    // Sample office activities
    setActivities([
      { id: 1, type: 'Document Scan', description: 'Scanned 15 compliance documents', time: '2 hours ago', status: 'completed' },
      { id: 2, type: 'Archive Update', description: 'Updated Q3 2025 archive records', time: '4 hours ago', status: 'completed' },
      { id: 3, type: 'Workflow Review', description: 'Reviewed administrative workflow protocols', time: '1 day ago', status: 'pending' },
      { id: 4, type: 'Document Upload', description: 'Uploaded new policy documents', time: '2 days ago', status: 'completed' },
      { id: 5, type: 'System Backup', description: 'Scheduled weekly system backup', time: '3 days ago', status: 'completed' }
    ]);

    // Sample documents
    setDocuments([
      { id: 1, name: 'Policy Manual 2025', type: 'Policy', status: 'active', lastModified: '2025-08-29', size: '2.3 MB' },
      { id: 2, name: 'Administrative Procedures', type: 'Procedure', status: 'active', lastModified: '2025-08-28', size: '1.8 MB' },
      { id: 3, name: 'Q3 Compliance Report', type: 'Report', status: 'archived', lastModified: '2025-08-25', size: '4.1 MB' },
      { id: 4, name: 'Staff Guidelines', type: 'Guideline', status: 'active', lastModified: '2025-08-24', size: '950 KB' },
      { id: 5, name: 'Budget Analysis 2025', type: 'Financial', status: 'confidential', lastModified: '2025-08-20', size: '3.2 MB' }
    ]);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out of the Office & Administration Portal.",
    });
    window.location.href = '/';
  };

  const stats = [
    { title: 'Active Documents', value: '1,247', icon: FileText, color: 'blue' },
    { title: 'Archived Records', value: '3,892', icon: Archive, color: 'green' },
    { title: 'Scanned Today', value: '156', icon: ScanLine, color: 'orange' },
    { title: 'Pending Reviews', value: '23', icon: Clock, color: 'red' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>Office & Administration Portal - LACRA</title>
        <meta name="description" content="Office & Administration Portal for comprehensive administrative management and documentation services" />
      </Helmet>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={lacraLogo} alt="LACRA Logo" className="h-10 w-10 object-cover rounded-lg" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Office & Administration</h1>
                <p className="text-sm text-gray-500">Administrative Management Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <FolderOpen className="h-3 w-3 mr-1" />
                {user?.username}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                <Home className="h-4 w-4 mr-2" />
                Platform Home
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Office Administration Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
            <TabsTrigger value="scanning">Scanning</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Document Management</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Archive System</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Scanning Services</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Workflow Engine</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.slice(0, 4).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-1 rounded-full ${activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                          {activity.status === 'completed' ? 
                            <CheckCircle className="h-3 w-3 text-green-600" /> : 
                            <AlertCircle className="h-3 w-3 text-yellow-600" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Management
                </CardTitle>
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <Input placeholder="Search documents..." />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="guideline">Guideline</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.name}</h4>
                          <p className="text-sm text-gray-500">{doc.type} • {doc.size} • Modified {doc.lastModified}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={`${
                            doc.status === 'active' ? 'bg-green-100 text-green-800' :
                            doc.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {doc.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Archive Tab */}
          <TabsContent value="archive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  Archive Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <Database className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Digital Archives</h3>
                    <p className="text-sm text-gray-600 mb-4">Access and manage digital document archives</p>
                    <Button className="w-full">Browse Archives</Button>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Archive Search</h3>
                    <p className="text-sm text-gray-600 mb-4">Search through archived documents and records</p>
                    <Button className="w-full" variant="outline">Search Archives</Button>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <Upload className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Archive Upload</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload documents to archive storage</p>
                    <Button className="w-full" variant="outline">Upload to Archive</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scanning Tab */}
          <TabsContent value="scanning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScanLine className="h-5 w-5" />
                  Document Scanning Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Scan New Documents</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="document-type">Document Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="invoice">Invoice</SelectItem>
                            <SelectItem value="report">Report</SelectItem>
                            <SelectItem value="policy">Policy Document</SelectItem>
                            <SelectItem value="compliance">Compliance Record</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="quality">Scan Quality</Label>
                        <Select defaultValue="high">
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard (200 DPI)</SelectItem>
                            <SelectItem value="high">High (300 DPI)</SelectItem>
                            <SelectItem value="archive">Archive Quality (600 DPI)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">
                        <ScanLine className="h-4 w-4 mr-2" />
                        Start Scanning
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Scanning Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-blue-800">Today's Scans</span>
                        <span className="text-lg font-bold text-blue-900">156</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-green-800">This Week</span>
                        <span className="text-lg font-bold text-green-900">1,247</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-purple-800">This Month</span>
                        <span className="text-lg font-bold text-purple-900">5,892</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Administrative Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <div className={`p-2 rounded-full ${activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        {activity.status === 'completed' ? 
                          <CheckCircle className="h-5 w-5 text-green-600" /> : 
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        }
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.type}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                      <Badge 
                        className={`${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Administrative Workflow Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Active Workflows</h3>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-900">Document Approval Process</h4>
                        <p className="text-sm text-gray-600">15 documents pending approval</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">60% complete</p>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-900">Archive Migration</h4>
                        <p className="text-sm text-gray-600">Q2 2025 documents migration</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">85% complete</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Workflow Tools</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Workflows
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Assignments
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Tasks
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Monitor className="h-4 w-4 mr-2" />
                        Monitor Progress
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}