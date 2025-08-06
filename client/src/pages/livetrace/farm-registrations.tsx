import { Helmet } from "react-helmet";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  Search,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Eye,
  FileText,
  Filter,
  Download
} from "lucide-react";
import LiveTraceSidebar from "../../components/livetrace/live-trace-sidebar";
import LiveTraceHeader from "../../components/livetrace/live-trace-header";

export default function FarmRegistrations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const farms = [
    {
      id: "LT-FARM-001",
      farmName: "Sunrise Cattle Ranch",
      ownerName: "John Doe",
      location: "Montserrado County, Paynesville",
      phone: "+231-777-123-456",
      email: "john.doe@email.com",
      registrationDate: "2024-12-15",
      status: "active",
      livestockCount: 245,
      landSize: "50 hectares",
      farmType: "Cattle Ranch",
      lastInspection: "2025-01-02",
      certifications: ["Organic", "Health Compliant"]
    },
    {
      id: "LT-FARM-002", 
      farmName: "Green Valley Poultry Farm",
      ownerName: "Mary Johnson",
      location: "Bong County, Gbarnga",
      phone: "+231-777-234-567",
      email: "mary.johnson@email.com",
      registrationDate: "2024-11-28",
      status: "active",
      livestockCount: 1200,
      landSize: "25 hectares",
      farmType: "Poultry",
      lastInspection: "2024-12-28",
      certifications: ["Health Compliant"]
    },
    {
      id: "LT-FARM-003",
      farmName: "Mountain View Goat Farm",
      ownerName: "Samuel Williams",
      location: "Nimba County, Sanniquellie",
      phone: "+231-777-345-678",
      email: "samuel.williams@email.com", 
      registrationDate: "2024-10-10",
      status: "pending",
      livestockCount: 89,
      landSize: "15 hectares",
      farmType: "Goat Farm",
      lastInspection: "Pending",
      certifications: []
    },
    {
      id: "LT-FARM-004",
      farmName: "Coastal Pig Farm",
      ownerName: "Rebecca Davis",
      location: "Grand Bassa County, Buchanan",
      phone: "+231-777-456-789",
      email: "rebecca.davis@email.com",
      registrationDate: "2024-12-01",
      status: "active",
      livestockCount: 156,
      landSize: "30 hectares",
      farmType: "Pig Farm", 
      lastInspection: "2024-12-20",
      certifications: ["Health Compliant", "Environmental"]
    },
    {
      id: "LT-FARM-005",
      farmName: "River Valley Mixed Farm",
      ownerName: "David Brown",
      location: "Lofa County, Voinjama",
      phone: "+231-777-567-890",
      email: "david.brown@email.com",
      registrationDate: "2024-09-15",
      status: "suspended",
      livestockCount: 78,
      landSize: "40 hectares",
      farmType: "Mixed Livestock",
      lastInspection: "2024-11-15",
      certifications: ["Previously Compliant"]
    },
    {
      id: "LT-FARM-006",
      farmName: "Highland Sheep Ranch",
      ownerName: "Sarah Wilson",
      location: "Grand Gedeh County, Zwedru",
      phone: "+231-777-678-901",
      email: "sarah.wilson@email.com",
      registrationDate: "2024-11-05",
      status: "active",
      livestockCount: 234,
      landSize: "60 hectares",
      farmType: "Sheep Ranch",
      lastInspection: "2024-12-18",
      certifications: ["Organic", "Health Compliant", "Quality Assured"]
    }
  ];

  const statusOptions = ["all", "active", "pending", "suspended"];

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         farm.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         farm.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         farm.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || farm.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Helmet>
        <title>Farm Registrations - LiveTrace Livestock Monitoring System</title>
        <meta name="description" content="Manage livestock farm registrations and compliance for LiveTrace platform" />
      </Helmet>

      <LiveTraceHeader />
      
      <div className="flex">
        <LiveTraceSidebar />
        
        <main className="flex-1 ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-center lg:text-left">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 justify-center lg:justify-start">
                  <Users className="h-8 w-8 text-green-600" />
                  Farm Registrations
                </h1>
                <p className="text-gray-600 mt-1">Manage livestock farm registrations and compliance status</p>
              </div>
              
              <div className="flex items-center justify-center lg:justify-end gap-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export List
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Register New Farm
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search farms by name, owner, location, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select 
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Active Farms</CardTitle>
                  <CheckCircle className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{farms.filter(f => f.status === 'active').length}</div>
                  <p className="text-xs opacity-80 mt-1">Fully registered</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Pending</CardTitle>
                  <Clock className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{farms.filter(f => f.status === 'pending').length}</div>
                  <p className="text-xs opacity-80 mt-1">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Total Livestock</CardTitle>
                  <Users className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{farms.reduce((sum, farm) => sum + farm.livestockCount, 0).toLocaleString()}</div>
                  <p className="text-xs opacity-80 mt-1">Across all farms</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Suspended</CardTitle>
                  <AlertTriangle className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{farms.filter(f => f.status === 'suspended').length}</div>
                  <p className="text-xs opacity-80 mt-1">Requires attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Farms List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Registered Farms ({filteredFarms.length} farms)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFarms.map((farm) => (
                    <div key={farm.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{farm.farmName}</h3>
                            {getStatusBadge(farm.status)}
                            <Badge variant="outline" className="text-xs">
                              {farm.farmType}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              Owner: {farm.ownerName}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              {farm.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              {farm.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {farm.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              Registered: {farm.registrationDate}
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-gray-400" />
                              Last Inspection: {farm.lastInspection}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                            <span>ID: {farm.id}</span>
                            <span>Livestock: {farm.livestockCount.toLocaleString()} animals</span>
                            <span>Land Size: {farm.landSize}</span>
                          </div>

                          {farm.certifications.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {farm.certifications.map((cert, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                            Inspect
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Plus className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Register New Farm</h3>
                  <p className="text-gray-600 text-sm">Add a new livestock farm to the registry with complete details</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Bulk Import</h3>
                  <p className="text-gray-600 text-sm">Import multiple farm registrations from CSV or Excel files</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Inspection Schedule</h3>
                  <p className="text-gray-600 text-sm">Schedule farm inspections and compliance checks</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}