import { Helmet } from "react-helmet";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Syringe, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Search,
  Plus,
  Download,
  FileText,
  Shield,
  TrendingUp,
  Users,
  Eye,
  Edit
} from "lucide-react";
import LiveTraceSidebar from "../../components/livetrace/live-trace-sidebar";
import LiveTraceHeader from "../../components/livetrace/live-trace-header";

export default function VaccinationRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVaccine, setSelectedVaccine] = useState("all");

  // Mock vaccination records data
  const vaccinationRecords = [
    {
      id: "VAC-001",
      animalId: "LT-CATTLE-12345",
      animalType: "Cattle",
      farmId: "LT-001",
      farmName: "Sunrise Cattle Ranch",
      location: "Montserrado County",
      vaccineName: "FMD Vaccine",
      vaccineType: "Foot and Mouth Disease",
      administeredDate: "2025-01-03",
      nextDueDate: "2025-07-03",
      veterinarian: "Dr. Sarah Johnson",
      batchNumber: "FMD-2025-001",
      status: "completed",
      sideEffects: "None reported",
      efficacyRate: "98%"
    },
    {
      id: "VAC-002",
      animalId: "LT-GOAT-67890",
      animalType: "Goat",
      farmId: "LT-045",
      farmName: "Green Valley Livestock",
      location: "Bong County",
      vaccineName: "PPR Vaccine",
      vaccineType: "Peste des Petits Ruminants",
      administeredDate: "2024-12-15",
      nextDueDate: "2025-12-15",
      veterinarian: "Dr. Michael Roberts",
      batchNumber: "PPR-2024-045",
      status: "completed",
      sideEffects: "Mild swelling at injection site",
      efficacyRate: "95%"
    },
    {
      id: "VAC-003",
      animalId: "LT-SHEEP-11223",
      animalType: "Sheep",
      farmId: "LT-089",
      farmName: "Heritage Farm Co-op",
      location: "Nimba County",
      vaccineName: "Anthrax Vaccine",
      vaccineType: "Anthrax Prevention",
      administeredDate: "",
      nextDueDate: "2025-01-08",
      veterinarian: "Dr. Emma Davis",
      batchNumber: "ANT-2025-012",
      status: "overdue",
      sideEffects: "",
      efficacyRate: "99%"
    }
  ];

  const vaccinationSchedule = [
    {
      id: 1,
      farmName: "Sunrise Cattle Ranch",
      animalCount: 45,
      vaccineType: "FMD Booster",
      scheduledDate: "2025-01-08",
      veterinarian: "Dr. Sarah Johnson",
      status: "scheduled",
      priority: "high"
    },
    {
      id: 2,
      farmName: "Mountain View Ranch",
      animalCount: 32,
      vaccineType: "Anthrax Prevention",
      scheduledDate: "2025-01-09",
      veterinarian: "Dr. Michael Roberts",
      status: "confirmed",
      priority: "medium"
    },
    {
      id: 3,
      farmName: "Valley Creek Farm",
      animalCount: 28,
      vaccineType: "PPR Vaccine",
      scheduledDate: "2025-01-10",
      veterinarian: "Dr. Emma Davis",
      status: "pending",
      priority: "low"
    }
  ];

  const vaccinationMetrics = {
    totalVaccinations: 1247,
    completedThisMonth: 156,
    scheduledVaccinations: 89,
    overdueVaccinations: 12,
    vaccinationCoverage: 94.2,
    efficacyRate: 97.1
  };

  const vaccineInventory = [
    {
      id: 1,
      name: "FMD Vaccine",
      type: "Foot and Mouth Disease",
      currentStock: 250,
      minimumStock: 50,
      expiryDate: "2025-12-15",
      supplier: "VetPharm Ltd",
      status: "adequate"
    },
    {
      id: 2,
      name: "PPR Vaccine",
      type: "Peste des Petits Ruminants",
      currentStock: 30,
      minimumStock: 40,
      expiryDate: "2025-08-20",
      supplier: "BioVet Solutions",
      status: "low"
    },
    {
      id: 3,
      name: "Anthrax Vaccine",
      type: "Anthrax Prevention",
      currentStock: 180,
      minimumStock: 75,
      expiryDate: "2025-06-10",
      supplier: "AgriVet Corp",
      status: "adequate"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'adequate': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Helmet>
        <title>Vaccination Records - LiveTrace | LACRA</title>
        <meta name="description" content="Comprehensive livestock vaccination tracking and management system" />
      </Helmet>

      <LiveTraceHeader />
      
      <div className="flex">
        <LiveTraceSidebar />
        
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Vaccination Records</h1>
                <p className="text-gray-600 mt-1">Track and manage livestock vaccination schedules and records</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vaccination
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Records
                </Button>
              </div>
            </div>

            {/* Vaccination Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Total Vaccinations</CardTitle>
                  <Syringe className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{vaccinationMetrics.totalVaccinations.toLocaleString()}</div>
                  <p className="text-xs opacity-80 mt-1">All time records</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Coverage Rate</CardTitle>
                  <Shield className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{vaccinationMetrics.vaccinationCoverage}%</div>
                  <p className="text-xs opacity-80 mt-1">Population coverage</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">This Month</CardTitle>
                  <Calendar className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{vaccinationMetrics.completedThisMonth}</div>
                  <p className="text-xs opacity-80 mt-1">Completed vaccinations</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Overdue</CardTitle>
                  <AlertTriangle className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{vaccinationMetrics.overdueVaccinations}</div>
                  <p className="text-xs opacity-80 mt-1">Require immediate attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="records" className="space-y-6">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
                <TabsTrigger value="records">Vaccination Records</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="inventory">Vaccine Inventory</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="records" className="space-y-6">
                {/* Search and Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-gray-600" />
                      Search & Filter Records
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
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedVaccine} onValueChange={setSelectedVaccine}>
                        <SelectTrigger>
                          <SelectValue placeholder="Vaccine Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Vaccines</SelectItem>
                          <SelectItem value="fmd">FMD Vaccine</SelectItem>
                          <SelectItem value="ppr">PPR Vaccine</SelectItem>
                          <SelectItem value="anthrax">Anthrax Vaccine</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Date Range
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Vaccination Records */}
                <div className="space-y-4">
                  {vaccinationRecords.map((record) => (
                    <Card key={record.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <h3 className="text-lg font-semibold">{record.animalId}</h3>
                              <Badge variant="outline">{record.animalType}</Badge>
                              <Badge className={getStatusColor(record.status)}>
                                {record.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Farm Information</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Farm:</span>
                                    <span className="font-medium">{record.farmName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Location:</span>
                                    <span className="font-medium">{record.location}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Veterinarian:</span>
                                    <span className="font-medium">{record.veterinarian}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Vaccination Details</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Vaccine:</span>
                                    <span className="font-medium">{record.vaccineName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Type:</span>
                                    <span className="font-medium">{record.vaccineType}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Batch:</span>
                                    <span className="font-medium">{record.batchNumber}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Schedule & Efficacy</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Administered:</span>
                                    <span className="font-medium">{record.administeredDate || "Pending"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Next Due:</span>
                                    <span className="font-medium">{record.nextDueDate}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Efficacy:</span>
                                    <span className="font-medium text-green-600">{record.efficacyRate}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {record.sideEffects && (
                              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h5 className="font-medium text-yellow-900 mb-1">Side Effects</h5>
                                <p className="text-sm text-yellow-800">{record.sideEffects}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-6">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Upcoming Vaccination Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {vaccinationSchedule.map((schedule) => (
                        <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getPriorityColor(schedule.priority)}>
                                {schedule.priority.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(schedule.status)}>
                                {schedule.status}
                              </Badge>
                            </div>
                            
                            <h4 className="font-semibold">{schedule.farmName}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {schedule.vaccineType} for {schedule.animalCount} animals
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{schedule.scheduledDate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{schedule.veterinarian}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              Reschedule
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Confirm
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Vaccine Inventory Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {vaccineInventory.map((vaccine) => (
                        <div key={vaccine.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{vaccine.name}</h4>
                              <p className="text-sm text-gray-600">{vaccine.type}</p>
                            </div>
                            <Badge className={getStockColor(vaccine.status)}>
                              {vaccine.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Current Stock:</span>
                              <span className="font-medium ml-2">{vaccine.currentStock} doses</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Minimum Stock:</span>
                              <span className="font-medium ml-2">{vaccine.minimumStock} doses</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Expiry Date:</span>
                              <span className="font-medium ml-2">{vaccine.expiryDate}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-sm text-gray-600">Supplier: {vaccine.supplier}</span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Reorder</Button>
                              <Button size="sm" variant="outline">Update Stock</Button>
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
                        Vaccination Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Coverage Improvement</span>
                          <span className="font-semibold text-green-600">+5.2%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Efficacy Rate</span>
                          <span className="font-semibold text-green-600">{vaccinationMetrics.efficacyRate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Compliance Rate</span>
                          <span className="font-semibold text-blue-600">92.8%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Cost per Vaccination</span>
                          <span className="font-semibold">$12.50</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-purple-600" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Avg Time per Vaccination</span>
                          <span className="font-semibold">8.5 minutes</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Success Rate</span>
                          <span className="font-semibold text-green-600">99.1%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Adverse Events</span>
                          <span className="font-semibold text-yellow-600">0.8%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Farmer Satisfaction</span>
                          <span className="font-semibold text-green-600">96.3%</span>
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