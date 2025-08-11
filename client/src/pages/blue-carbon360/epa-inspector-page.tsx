import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield,
  FileCheck,
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Send,
  Phone,
  Mail,
  Building2,
  Clipboard,
  Target,
  Award,
  TrendingUp,
  Users,
  Globe,
  Waves,
  TreePine,
  Leaf,
  Fish,
  Factory,
  Truck,
  Anchor,
  Briefcase,
  GraduationCap,
  Zap,
  BookOpen,
  Settings,
  Bell,
  Star,
  Flag
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EPAInspectorPage() {
  // Fetch EPA inspection data
  const { data: inspectionData = [], isLoading: inspectionLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/epa-inspections"],
  });

  // EPA inspection overview metrics
  const inspectionMetrics = [
    {
      title: 'Active Inspections',
      value: 8,
      unit: 'ongoing',
      icon: Shield,
      color: 'bg-blue-500',
      change: '+3',
      period: 'This month'
    },
    {
      title: 'Completed Inspections',
      value: 47,
      unit: 'total',
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+12',
      period: 'This quarter'
    },
    {
      title: 'Pending Requests',
      value: 5,
      unit: 'awaiting',
      icon: Clock,
      color: 'bg-orange-500',
      change: '+2',
      period: 'In queue'
    },
    {
      title: 'Compliance Rate',
      value: 94.2,
      unit: '%',
      icon: Award,
      color: 'bg-purple-500',
      change: '+3.1%',
      period: 'Overall score'
    }
  ];

  // EPA inspection types available
  const inspectionTypes = [
    {
      type: 'Marine Environmental Compliance',
      icon: Waves,
      color: 'bg-blue-500',
      description: 'Marine ecosystem protection and coastal regulation compliance',
      duration: '2-3 days',
      priority: 'High',
      frequency: 'Quarterly'
    },
    {
      type: 'Carbon Emissions Assessment',
      icon: Leaf,
      color: 'bg-green-500',
      description: 'Carbon footprint evaluation and emission control verification',
      duration: '1-2 days',
      priority: 'High',
      frequency: 'Bi-annual'
    },
    {
      type: 'Mangrove Conservation Audit',
      icon: TreePine,
      color: 'bg-emerald-500',
      description: 'Mangrove restoration and protection program assessment',
      duration: '3-4 days',
      priority: 'Medium',
      frequency: 'Annual'
    },
    {
      type: 'Water Quality Monitoring',
      icon: Fish,
      color: 'bg-cyan-500',
      description: 'Coastal water quality standards and pollution control inspection',
      duration: '1 day',
      priority: 'High',
      frequency: 'Monthly'
    },
    {
      type: 'Waste Management Review',
      icon: Factory,
      color: 'bg-slate-500',
      description: 'Waste disposal and treatment facility compliance check',
      duration: '2 days',
      priority: 'Medium',
      frequency: 'Quarterly'
    },
    {
      type: 'Blue Carbon Project Verification',
      icon: Award,
      color: 'bg-indigo-500',
      description: 'Blue carbon initiative compliance and effectiveness review',
      duration: '3-5 days',
      priority: 'High',
      frequency: 'Project-based'
    }
  ];

  // Recent EPA inspection requests
  const recentInspections = [
    {
      id: 'EPA-2024-001',
      type: 'Marine Environmental Compliance',
      requestDate: '2024-12-08',
      scheduledDate: '2024-12-15',
      location: 'Montserrado Coastal Zone',
      inspector: 'Dr. James Environ',
      status: 'Scheduled',
      priority: 'High',
      requestedBy: 'Marina Conserve',
      organization: 'Blue Carbon 360',
      description: 'Quarterly marine compliance inspection for coastal protection projects'
    },
    {
      id: 'EPA-2024-002',
      type: 'Carbon Emissions Assessment',
      requestDate: '2024-12-05',
      scheduledDate: '2024-12-12',
      location: 'Buchanan Industrial Area',
      inspector: 'Sarah Carbon',
      status: 'In Progress',
      priority: 'High',
      requestedBy: 'Tech Operations',
      organization: 'Marine Tech Solutions',
      description: 'Carbon footprint assessment for new marine monitoring equipment'
    },
    {
      id: 'EPA-2024-003',
      type: 'Mangrove Conservation Audit',
      requestDate: '2024-12-01',
      scheduledDate: '2024-12-20',
      location: 'Grand Bassa Mangrove Reserve',
      inspector: 'Prof. Forest Guard',
      status: 'Pending',
      priority: 'Medium',
      requestedBy: 'Community Coordinator',
      organization: 'Coastal Communities Alliance',
      description: 'Annual audit of mangrove restoration progress and community compliance'
    },
    {
      id: 'EPA-2024-004',
      type: 'Water Quality Monitoring',
      requestDate: '2024-11-28',
      scheduledDate: '2024-12-10',
      location: 'Greenville Harbor',
      inspector: 'Alex Waters',
      status: 'Completed',
      priority: 'High',
      requestedBy: 'Harbor Master',
      organization: 'Greenville Port Authority',
      description: 'Monthly water quality inspection for harbor operations'
    },
    {
      id: 'EPA-2024-005',
      type: 'Blue Carbon Project Verification',
      requestDate: '2024-11-25',
      scheduledDate: '2024-12-18',
      location: 'Sinoe County Seagrass Areas',
      inspector: 'Dr. Blue Carbon',
      status: 'Scheduled',
      priority: 'High',
      requestedBy: 'Project Manager',
      organization: 'Conservation International',
      description: 'Verification of blue carbon sequestration project effectiveness'
    }
  ];

  // EPA inspector contact information
  const epaInspectors = [
    {
      name: 'Dr. James Environ',
      title: 'Senior Environmental Inspector',
      specialization: 'Marine Environmental Compliance',
      phone: '+231-555-0201',
      email: 'j.environ@epa.gov.lr',
      availability: 'Available',
      experience: '12 years',
      certifications: ['EPA Certified', 'Marine Biology PhD', 'ISO 14001 Auditor']
    },
    {
      name: 'Sarah Carbon',
      title: 'Carbon Assessment Specialist',
      specialization: 'Carbon Emissions & Climate',
      phone: '+231-555-0202',
      email: 's.carbon@epa.gov.lr',
      availability: 'Busy until Dec 15',
      experience: '8 years',
      certifications: ['Carbon Auditor', 'IPCC Certified', 'GHG Protocol Expert']
    },
    {
      name: 'Prof. Forest Guard',
      title: 'Conservation Compliance Officer',
      specialization: 'Forest & Mangrove Protection',
      phone: '+231-555-0203',
      email: 'p.guard@epa.gov.lr',
      availability: 'Available',
      experience: '15 years',
      certifications: ['Forest Conservation PhD', 'CITES Expert', 'IUCN Certified']
    },
    {
      name: 'Alex Waters',
      title: 'Water Quality Inspector',
      specialization: 'Aquatic Environment Monitoring',
      phone: '+231-555-0204',
      email: 'a.waters@epa.gov.lr',
      availability: 'Available',
      experience: '10 years',
      certifications: ['Water Quality Expert', 'Marine Chemistry MSc', 'EPA Licensed']
    },
    {
      name: 'Dr. Blue Carbon',
      title: 'Blue Carbon Project Verifier',
      specialization: 'Blue Carbon & Ocean Conservation',
      phone: '+231-555-0205',
      email: 'd.bluecarbon@epa.gov.lr',
      availability: 'Available Dec 18+',
      experience: '9 years',
      certifications: ['VERRA VCS Expert', 'Blue Carbon PhD', 'Carbon Credit Verifier']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability.toLowerCase().includes('available')) return 'text-green-600';
    if (availability.toLowerCase().includes('busy')) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>EPA Inspector Request - Blue Carbon 360</title>
        <meta name="description" content="Environmental Protection Agency inspection request and management system" />
      </Helmet>

      <BlueCarbon360Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <BlueCarbon360Sidebar />
        
        <main className="flex-1 lg:ml-64 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 pb-20">
              
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-green-600 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">EPA Inspector Request</h1>
                      <p className="text-slate-600">Environmental Protection Agency inspection management</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Search Inspections
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Request Inspection
                    </Button>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                  8 Active Inspections • 47 Completed • 5 Pending Requests • 94.2% Compliance Rate
                </Badge>
              </div>

              {/* Inspection Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {inspectionMetrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            {metric.change}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                          <p className="text-3xl font-bold text-slate-900">
                            {metric.value} {metric.unit}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">{metric.period}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Inspection Request Form */}
                  <Card className="bg-white shadow-sm border-0">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Plus className="h-5 w-5 text-blue-600" />
                        Request EPA Inspection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-2 block">Inspection Type:</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select inspection type" />
                            </SelectTrigger>
                            <SelectContent>
                              {inspectionTypes.map((type, index) => (
                                <SelectItem key={index} value={type.type}>
                                  {type.type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-2 block">Priority Level:</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High Priority</SelectItem>
                              <SelectItem value="medium">Medium Priority</SelectItem>
                              <SelectItem value="low">Low Priority</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-2 block">Inspection Location:</label>
                          <Input placeholder="Enter location address or coordinates" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-2 block">Preferred Date:</label>
                          <Input type="date" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Organization/Company:</label>
                        <Input placeholder="Your organization name" />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Contact Information:</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input placeholder="Your full name" />
                          <Input placeholder="Phone number" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Inspection Details:</label>
                        <Textarea 
                          placeholder="Describe the specific areas, processes, or compliance issues that need EPA inspection..."
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-600">
                          * EPA will respond within 24-48 hours to confirm inspection schedule
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">
                            <FileCheck className="h-4 w-4 mr-2" />
                            Save Draft
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Send className="h-4 w-4 mr-2" />
                            Submit Request
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Inspection Requests */}
                  <Card className="bg-white shadow-sm border-0">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Clipboard className="h-5 w-5 text-blue-600" />
                        Recent Inspection Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentInspections.map((inspection, index) => (
                          <div key={index} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-1">{inspection.type}</h3>
                                <p className="text-sm text-slate-600">{inspection.description}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={getStatusColor(inspection.status)}>
                                  {inspection.status}
                                </Badge>
                                <Badge className={getPriorityColor(inspection.priority)}>
                                  {inspection.priority}
                                </Badge>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-slate-500">Request ID:</p>
                                <p className="font-medium">{inspection.id}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Inspector:</p>
                                <p className="font-medium">{inspection.inspector}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Scheduled Date:</p>
                                <p className="font-medium">{new Date(inspection.scheduledDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Location:</p>
                                <p className="font-medium">{inspection.location}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Requested By:</p>
                                <p className="font-medium">{inspection.requestedBy}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Organization:</p>
                                <p className="font-medium">{inspection.organization}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3 mr-1" />
                                Report
                              </Button>
                              {inspection.status === 'Pending' && (
                                <Button variant="outline" size="sm">
                                  <Settings className="h-3 w-3 mr-1" />
                                  Modify
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  
                  {/* Inspection Types */}
                  <Card className="bg-white shadow-sm border-0">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Available Inspections
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {inspectionTypes.map((type, index) => {
                        const IconComponent = type.icon;
                        return (
                          <div key={index} className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer">
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-lg ${type.color} flex items-center justify-center`}>
                                <IconComponent className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-slate-900 mb-1">{type.type}</h4>
                                <p className="text-xs text-slate-600 mb-2">{type.description}</p>
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>Duration: {type.duration}</span>
                                  <Badge className={`${getPriorityColor(type.priority)} text-xs`}>
                                    {type.priority}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* EPA Inspectors */}
                  <Card className="bg-white shadow-sm border-0">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        EPA Inspectors
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {epaInspectors.slice(0, 3).map((inspector, index) => (
                        <div key={index} className="p-3 border border-slate-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-slate-900">{inspector.name}</h4>
                              <p className="text-xs text-slate-600 mb-1">{inspector.title}</p>
                              <p className="text-xs text-slate-500 mb-2">{inspector.specialization}</p>
                              <div className="flex justify-between items-center">
                                <span className={`text-xs font-medium ${getAvailabilityColor(inspector.availability)}`}>
                                  {inspector.availability}
                                </span>
                                <div className="flex gap-1">
                                  <Button variant="outline" size="sm" className="h-6 px-2">
                                    <Phone className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-6 px-2">
                                    <Mail className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        View All Inspectors
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Emergency Contact */}
                  <Card className="bg-red-50 border-red-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                        <AlertCircle className="h-5 w-5" />
                        Emergency EPA Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-red-800 space-y-2">
                        <p className="font-medium">For urgent environmental issues:</p>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>+231-555-EPA-911</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>emergency@epa.gov.lr</span>
                        </div>
                        <p className="text-xs text-red-700">
                          Available 24/7 for environmental emergencies
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}