import { Helmet } from "react-helmet";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, 
  Activity, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Search,
  Filter,
  Plus,
  Download,
  Calendar,
  MapPin,
  Stethoscope,
  TrendingUp,
  Clock
} from "lucide-react";
import LiveTraceSidebar from "../../components/livetrace/live-trace-sidebar";
import LiveTraceHeader from "../../components/livetrace/live-trace-header";

export default function HealthMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedFarm, setSelectedFarm] = useState("all");

  // Mock health monitoring data
  const healthRecords = [
    {
      id: "HM-001",
      animalId: "LT-CATTLE-12345",
      animalType: "Cattle",
      farmId: "LT-001",
      farmName: "Sunrise Cattle Ranch",
      location: "Montserrado County",
      healthStatus: "healthy",
      temperature: "38.5°C",
      heartRate: "65 BPM",
      lastCheckup: "2025-01-06 09:30",
      nextCheckup: "2025-01-13 09:30",
      veterinarian: "Dr. Sarah Johnson",
      notes: "Regular checkup - animal in excellent condition"
    },
    {
      id: "HM-002",
      animalId: "LT-GOAT-67890",
      animalType: "Goat",
      farmId: "LT-045",
      farmName: "Green Valley Livestock",
      location: "Bong County",
      healthStatus: "monitoring",
      temperature: "39.2°C",
      heartRate: "78 BPM",
      lastCheckup: "2025-01-06 14:15",
      nextCheckup: "2025-01-08 14:15",
      veterinarian: "Dr. Michael Roberts",
      notes: "Slightly elevated temperature - monitoring for 48 hours"
    },
    {
      id: "HM-003",
      animalId: "LT-SHEEP-11223",
      animalType: "Sheep",
      farmId: "LT-089",
      farmName: "Heritage Farm Co-op",
      location: "Nimba County",
      healthStatus: "treatment",
      temperature: "40.1°C",
      heartRate: "85 BPM",
      lastCheckup: "2025-01-06 11:00",
      nextCheckup: "2025-01-07 11:00",
      veterinarian: "Dr. Emma Davis",
      notes: "Respiratory infection - on antibiotics, responding well"
    }
  ];

  const healthAlerts = [
    {
      id: 1,
      severity: "high",
      type: "Temperature Alert",
      animalId: "LT-CATTLE-98765",
      farmName: "Mountain View Ranch",
      message: "Elevated temperature detected (40.5°C)",
      timestamp: "2025-01-06 15:45",
      status: "active"
    },
    {
      id: 2,
      severity: "medium",
      type: "Behavior Alert",
      animalId: "LT-GOAT-55444",
      farmName: "Valley Creek Farm",
      message: "Unusual feeding pattern observed",
      timestamp: "2025-01-06 13:20",
      status: "investigating"
    },
    {
      id: 3,
      severity: "low",
      type: "Checkup Reminder",
      animalId: "LT-SHEEP-33221",
      farmName: "Riverside Livestock",
      message: "Routine checkup due in 2 days",
      timestamp: "2025-01-06 10:00",
      status: "scheduled"
    }
  ];

  const healthMetrics = {
    totalAnimalsMonitored: 15420,
    healthyAnimals: 14890,
    underMonitoring: 342,
    underTreatment: 188,
    healthRate: 96.6,
    avgTemperature: "38.7°C",
    avgHeartRate: "68 BPM"
  };

  const filteredRecords = healthRecords.filter(record => {
    const matchesSearch = record.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.farmName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || record.healthStatus === selectedStatus;
    const matchesFarm = selectedFarm === "all" || record.farmId === selectedFarm;
    
    return matchesSearch && matchesStatus && matchesFarm;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'treatment': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Helmet>
        <title>Health Monitoring - LiveTrace | LACRA</title>
        <meta name="description" content="Real-time livestock health monitoring and management system" />
      </Helmet>

      <LiveTraceHeader />
      
      <div className="flex">
        <LiveTraceSidebar />
        
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Health Monitoring</h1>
                <p className="text-gray-600 mt-1">Monitor and track livestock health status in real-time</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Health Record
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Health Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Animals Monitored</CardTitle>
                  <Heart className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{healthMetrics.totalAnimalsMonitored.toLocaleString()}</div>
                  <p className="text-xs opacity-80 mt-1">Total in system</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Health Rate</CardTitle>
                  <CheckCircle className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{healthMetrics.healthRate}%</div>
                  <p className="text-xs opacity-80 mt-1">{healthMetrics.healthyAnimals.toLocaleString()} healthy animals</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Under Monitoring</CardTitle>
                  <Activity className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{healthMetrics.underMonitoring}</div>
                  <p className="text-xs opacity-80 mt-1">Requires attention</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Under Treatment</CardTitle>
                  <Stethoscope className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{healthMetrics.underTreatment}</div>
                  <p className="text-xs opacity-80 mt-1">Active treatments</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="monitoring" className="space-y-6">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                <TabsTrigger value="monitoring">Health Records</TabsTrigger>
                <TabsTrigger value="alerts">Health Alerts</TabsTrigger>
                <TabsTrigger value="analytics">Health Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="monitoring" className="space-y-6">
                {/* Search and Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-gray-600" />
                      Search & Filter Health Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search by Animal ID or Farm..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Health Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="healthy">Healthy</SelectItem>
                          <SelectItem value="monitoring">Under Monitoring</SelectItem>
                          <SelectItem value="treatment">Under Treatment</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedFarm} onValueChange={setSelectedFarm}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Farm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Farms</SelectItem>
                          <SelectItem value="LT-001">Sunrise Cattle Ranch</SelectItem>
                          <SelectItem value="LT-045">Green Valley Livestock</SelectItem>
                          <SelectItem value="LT-089">Heritage Farm Co-op</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        More Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Health Records Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Health Monitoring Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredRecords.map((record) => (
                        <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <h3 className="font-semibold text-lg">{record.animalId}</h3>
                                <Badge variant="outline">{record.animalType}</Badge>
                                <Badge className={getStatusColor(record.healthStatus)}>
                                  {record.healthStatus}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Farm:</p>
                                  <p className="font-medium">{record.farmName}</p>
                                  <p className="text-gray-500">{record.location}</p>
                                </div>
                                
                                <div>
                                  <p className="text-gray-600">Vital Signs:</p>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                      <Thermometer className="h-4 w-4 text-red-500" />
                                      <span>{record.temperature}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Heart className="h-4 w-4 text-red-500" />
                                      <span>{record.heartRate}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-gray-600">Veterinarian:</p>
                                  <p className="font-medium">{record.veterinarian}</p>
                                  <p className="text-gray-500">Last: {record.lastCheckup}</p>
                                </div>
                              </div>
                              
                              <div className="mt-3 p-3 bg-gray-50 rounded">
                                <p className="text-sm text-gray-700">{record.notes}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Calendar className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Active Health Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {healthAlerts.map((alert) => (
                        <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="bg-white">
                                  {alert.severity.toUpperCase()}
                                </Badge>
                                <Badge variant="secondary">
                                  {alert.type}
                                </Badge>
                              </div>
                              
                              <h3 className="font-semibold">{alert.animalId}</h3>
                              <p className="text-sm mt-1">{alert.farmName}</p>
                              <p className="font-medium mt-2">{alert.message}</p>
                              <p className="text-xs opacity-75 mt-2">{alert.timestamp}</p>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              <Button size="sm" variant="outline" className="bg-white">
                                View Details
                              </Button>
                              <Button size="sm" variant="outline" className="bg-white">
                                Take Action
                              </Button>
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
                        Health Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Overall Health Improvement</span>
                          <span className="font-semibold text-green-600">+2.3%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Treatment Success Rate</span>
                          <span className="font-semibold text-green-600">94.7%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Average Recovery Time</span>
                          <span className="font-semibold text-blue-600">5.2 days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Prevention Effectiveness</span>
                          <span className="font-semibold text-green-600">87.3%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-purple-600" />
                        Health Schedule Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Checkups Today</span>
                          <span className="font-semibold">23</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Checkups This Week</span>
                          <span className="font-semibold">156</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Overdue Checkups</span>
                          <span className="font-semibold text-red-600">7</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Scheduled Treatments</span>
                          <span className="font-semibold">34</span>
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