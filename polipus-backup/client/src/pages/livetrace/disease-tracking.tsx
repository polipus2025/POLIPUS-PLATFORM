import { Helmet } from "react-helmet";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Eye,
  Search,
  Plus,
  Download,
  Clock,
  Users,
  Shield,
  FileText,
  Calendar,
  ChevronRight
} from "lucide-react";
import LiveTraceSidebar from "../../components/livetrace/live-trace-sidebar";
import LiveTraceHeader from "../../components/livetrace/live-trace-header";

export default function DiseaseTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Mock disease tracking data
  const diseaseOutbreaks = [
    {
      id: "DT-001",
      diseaseName: "Foot and Mouth Disease",
      severity: "high",
      status: "active",
      affectedAnimals: 45,
      affectedFarms: 3,
      region: "Montserrado County",
      firstReported: "2025-01-04",
      lastUpdate: "2025-01-06 14:30",
      transmissionRisk: "very_high",
      quarantineStatus: "enforced",
      estimatedSpread: "12km radius",
      responsibleVet: "Dr. Sarah Johnson",
      description: "Outbreak detected in cattle population, immediate quarantine measures implemented"
    },
    {
      id: "DT-002",
      diseaseName: "African Swine Fever",
      severity: "medium",
      status: "contained",
      affectedAnimals: 12,
      affectedFarms: 1,
      region: "Bong County",
      firstReported: "2025-01-02",
      lastUpdate: "2025-01-06 10:15",
      transmissionRisk: "medium",
      quarantineStatus: "partial",
      estimatedSpread: "5km radius",
      responsibleVet: "Dr. Michael Roberts",
      description: "Small outbreak in swine population, containment measures effective"
    },
    {
      id: "DT-003",
      diseaseName: "Newcastle Disease",
      severity: "low",
      status: "monitoring",
      affectedAnimals: 8,
      affectedFarms: 1,
      region: "Nimba County",
      firstReported: "2025-01-05",
      lastUpdate: "2025-01-06 08:45",
      transmissionRisk: "low",
      quarantineStatus: "voluntary",
      estimatedSpread: "2km radius",
      responsibleVet: "Dr. Emma Davis",
      description: "Minor outbreak in poultry, preventive measures in place"
    }
  ];

  const diseaseMetrics = {
    activeOutbreaks: 3,
    totalAffectedAnimals: 65,
    quarantinedFarms: 5,
    recoveredAnimals: 234,
    mortalityRate: 2.3,
    avgContainmentTime: 8.5
  };

  const surveillanceAlerts = [
    {
      id: 1,
      type: "Early Warning",
      location: "Margibi County",
      description: "Unusual mortality pattern detected in local cattle",
      timestamp: "2025-01-06 16:20",
      priority: "medium",
      investigated: false
    },
    {
      id: 2,
      type: "Quarantine Breach",
      location: "Montserrado County",
      description: "Animal movement detected from quarantined area",
      timestamp: "2025-01-06 15:10",
      priority: "high",
      investigated: true
    },
    {
      id: 3,
      type: "Symptom Report",
      location: "Grand Bassa County",
      description: "Farmer reported respiratory symptoms in goat herd",
      timestamp: "2025-01-06 13:45",
      priority: "low",
      investigated: false
    }
  ];

  const preventionMeasures = [
    {
      id: 1,
      measure: "Vaccination Campaign",
      target: "Cattle in Montserrado County",
      status: "ongoing",
      completion: 78,
      startDate: "2025-01-01",
      endDate: "2025-01-15"
    },
    {
      id: 2,
      measure: "Biosecurity Training",
      target: "Farmers in affected regions",
      status: "scheduled",
      completion: 0,
      startDate: "2025-01-08",
      endDate: "2025-01-20"
    },
    {
      id: 3,
      measure: "Movement Restrictions",
      target: "Livestock in outbreak zones",
      status: "active",
      completion: 100,
      startDate: "2025-01-04",
      endDate: "2025-01-18"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'contained': return 'bg-yellow-100 text-yellow-800';
      case 'monitoring': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'very_high': return 'text-red-600';
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Helmet>
        <title>Disease Tracking - LiveTrace | LACRA</title>
        <meta name="description" content="Real-time disease surveillance and outbreak management system" />
      </Helmet>

      <LiveTraceHeader />
      
      <div className="flex">
        <LiveTraceSidebar />
        
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Disease Tracking</h1>
                <p className="text-gray-600 mt-1">Monitor and manage disease outbreaks in livestock populations</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Report Outbreak
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Disease Report
                </Button>
              </div>
            </div>

            {/* Disease Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Active Outbreaks</CardTitle>
                  <AlertTriangle className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{diseaseMetrics.activeOutbreaks}</div>
                  <p className="text-xs opacity-80 mt-1">Require immediate attention</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Affected Animals</CardTitle>
                  <Users className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{diseaseMetrics.totalAffectedAnimals}</div>
                  <p className="text-xs opacity-80 mt-1">Currently under care</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Quarantined Farms</CardTitle>
                  <Shield className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{diseaseMetrics.quarantinedFarms}</div>
                  <p className="text-xs opacity-80 mt-1">Movement restricted</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Recovery Rate</CardTitle>
                  <TrendingUp className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{(100 - diseaseMetrics.mortalityRate).toFixed(1)}%</div>
                  <p className="text-xs opacity-80 mt-1">{diseaseMetrics.recoveredAnimals} animals recovered</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="outbreaks" className="space-y-6">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
                <TabsTrigger value="outbreaks">Active Outbreaks</TabsTrigger>
                <TabsTrigger value="surveillance">Surveillance</TabsTrigger>
                <TabsTrigger value="prevention">Prevention</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="outbreaks" className="space-y-6">
                {/* Search and Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-gray-600" />
                      Search & Filter Outbreaks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search by disease name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Severity Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severity</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          <SelectItem value="montserrado">Montserrado</SelectItem>
                          <SelectItem value="bong">Bong</SelectItem>
                          <SelectItem value="nimba">Nimba</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline">
                        <MapPin className="h-4 w-4 mr-2" />
                        Map View
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Outbreaks */}
                <div className="space-y-4">
                  {diseaseOutbreaks.map((outbreak) => (
                    <Card key={outbreak.id} className="border-l-4 border-red-500">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <h3 className="text-xl font-semibold">{outbreak.diseaseName}</h3>
                              <Badge className={getSeverityColor(outbreak.severity)}>
                                {outbreak.severity.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(outbreak.status)}>
                                {outbreak.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Impact Assessment</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Affected Animals:</span>
                                    <span className="font-medium">{outbreak.affectedAnimals}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Affected Farms:</span>
                                    <span className="font-medium">{outbreak.affectedFarms}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Location:</span>
                                    <span className="font-medium">{outbreak.region}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Risk Assessment</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Transmission Risk:</span>
                                    <span className={`font-medium ${getRiskColor(outbreak.transmissionRisk)}`}>
                                      {outbreak.transmissionRisk.replace('_', ' ').toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Spread Radius:</span>
                                    <span className="font-medium">{outbreak.estimatedSpread}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Quarantine:</span>
                                    <span className="font-medium">{outbreak.quarantineStatus}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Response Team</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Lead Veterinarian:</span>
                                    <span className="font-medium">{outbreak.responsibleVet}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">First Reported:</span>
                                    <span className="font-medium">{outbreak.firstReported}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Last Update:</span>
                                    <span className="font-medium">{outbreak.lastUpdate}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">{outbreak.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-6">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4 mr-2" />
                              Update Report
                            </Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              <Shield className="h-4 w-4 mr-2" />
                              Manage Response
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="surveillance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      Surveillance Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {surveillanceAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={alert.priority === 'high' ? 'destructive' : 
                                           alert.priority === 'medium' ? 'default' : 'secondary'}>
                                {alert.type}
                              </Badge>
                              <Badge variant="outline">{alert.priority.toUpperCase()}</Badge>
                              {alert.investigated && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Investigated
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-medium">{alert.description}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{alert.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{alert.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              Investigate
                            </Button>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prevention" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Prevention Measures
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {preventionMeasures.map((measure) => (
                        <div key={measure.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{measure.measure}</h4>
                              <p className="text-sm text-gray-600">{measure.target}</p>
                            </div>
                            <Badge className={
                              measure.status === 'active' ? 'bg-green-100 text-green-800' :
                              measure.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {measure.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{measure.completion}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${measure.completion}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Start: {measure.startDate}</span>
                              <span>End: {measure.endDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Disease Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Outbreak Frequency</span>
                          <span className="font-semibold text-red-600">-15%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Avg Containment Time</span>
                          <span className="font-semibold text-green-600">{diseaseMetrics.avgContainmentTime} days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Mortality Rate</span>
                          <span className="font-semibold text-yellow-600">{diseaseMetrics.mortalityRate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Prevention Effectiveness</span>
                          <span className="font-semibold text-green-600">89.2%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-purple-600" />
                        Response Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Avg Response Time</span>
                          <span className="font-semibold">4.2 hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Teams Deployed</span>
                          <span className="font-semibold">12</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Areas Monitored</span>
                          <span className="font-semibold">45</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Success Rate</span>
                          <span className="font-semibold text-green-600">94.3%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}