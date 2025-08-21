import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ship, 
  Container, 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Package, 
  Truck,
  Eye,
  Download,
  Search,
  Filter,
  Users,
  Building2,
  Globe
} from "lucide-react";

export default function PortInspectorDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Get inspector data from localStorage
  const inspectorData = JSON.parse(localStorage.getItem("inspectorData") || "{}");
  const portFacility = inspectorData.portFacility || "Port of Monrovia";

  // Dashboard statistics
  const dashboardStats = {
    pendingInspections: 8,
    completedInspections: 156,
    activeShipments: 12,
    documentsReviewed: 89,
    complianceRate: 94.2,
    avgInspectionTime: "2.4 hours",
    criticalIssues: 3,
    exportersActive: 24
  };

  // Pending export inspections
  const pendingInspections = [
    {
      id: "EXP-INS-001",
      exporterId: "EXP-001",
      exporterName: "Liberia Premium Exports Ltd",
      shipmentId: "SHP-2025-001", 
      commodity: "Coffee Beans",
      quantity: "15,000 kg",
      containers: ["MSKU-123456", "MSKU-789012"],
      scheduledDate: "2025-01-06 14:00",
      priority: "high",
      status: "pending",
      documents: ["Certificate of Origin", "EUDR Compliance", "Quality Certificate"],
      vesselName: "MV Atlantic Star",
      destination: "Hamburg, Germany"
    },
    {
      id: "EXP-INS-002", 
      exporterId: "EXP-002",
      exporterName: "Golden Harvest Co.",
      shipmentId: "SHP-2025-002",
      commodity: "Cocoa Beans",
      quantity: "25,000 kg", 
      containers: ["MSCU-456789"],
      scheduledDate: "2025-01-06 16:30",
      priority: "medium",
      status: "in_progress",
      documents: ["Export License", "Phytosanitary Certificate", "Bill of Lading"],
      vesselName: "MV Ocean Breeze",
      destination: "Rotterdam, Netherlands"
    }
  ];

  // Active shipments being processed
  const activeShipments = [
    {
      id: "SHP-2025-003",
      exporterId: "EXP-003",
      exporterName: "Tropical Commodities Inc",
      commodity: "Palm Oil",
      quantity: "50,000 L",
      containers: ["TEMU-654321", "TEMU-987654"],
      vesselName: "MV Cargo Express",
      inspectionStatus: "completed",
      loadingStatus: "in_progress",
      departureTime: "2025-01-07 08:00",
      destination: "Antwerp, Belgium"
    }
  ];

  // Regulatory compliance checks
  const complianceChecks = [
    {
      category: "EUDR Compliance",
      total: 45,
      compliant: 42,
      nonCompliant: 3,
      rate: 93.3
    },
    {
      category: "Export Licenses",
      total: 38,
      compliant: 37,
      nonCompliant: 1,
      rate: 97.4
    },
    {
      category: "Quality Certificates", 
      total: 52,
      compliant: 48,
      nonCompliant: 4,
      rate: 92.3
    }
  ];

  // Three-tier regulatory connections
  const regulatoryConnections = [
    {
      department: "Director General (DG)",
      status: "connected",
      lastSync: "2025-01-06 11:30",
      pendingReports: 2,
      criticalAlerts: 0
    },
    {
      department: "DDGOTS (Trade & Standards)",
      status: "connected", 
      lastSync: "2025-01-06 11:45",
      pendingReports: 1,
      criticalAlerts: 1
    },
    {
      department: "DDGAF (Agriculture & Forestry)",
      status: "connected",
      lastSync: "2025-01-06 11:20", 
      pendingReports: 0,
      criticalAlerts: 0
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Ship className="w-8 h-8 text-blue-600" />
                Port Inspector Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                {portFacility} • Export Inspection & Regulatory Oversight
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Inspector: {inspectorData.fullName || "Port Inspector"}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {inspectorData.certificationLevel || "Senior"} Level
              </Badge>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Inspections</p>
                  <p className="text-2xl font-bold text-orange-600">{dashboardStats.pendingInspections}</p>
                </div>
                <ClipboardCheck className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Shipments</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardStats.activeShipments}</p>
                </div>
                <Container className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardStats.complianceRate}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Exporters</p>
                  <p className="text-2xl font-bold text-purple-600">{dashboardStats.exportersActive}</p>
                </div>
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inspections">Export Inspections</TabsTrigger>
            <TabsTrigger value="shipments">Active Shipments</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory Sync</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Export Inspections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5" />
                    Recent Export Inspections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingInspections.slice(0, 3).map((inspection) => (
                      <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{inspection.exporterName}</p>
                          <p className="text-sm text-gray-600">{inspection.commodity} • {inspection.quantity}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getPriorityColor(inspection.priority)}>
                            {inspection.priority}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{inspection.scheduledDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Regulatory Department Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Three-Tier Regulatory Sync
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {regulatoryConnections.map((dept) => (
                      <div key={dept.department} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{dept.department}</p>
                          <p className="text-sm text-gray-600">Last sync: {dept.lastSync}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">Connected</Badge>
                          {dept.criticalAlerts > 0 && (
                            <p className="text-xs text-red-600 mt-1">{dept.criticalAlerts} alerts</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Export Inspections Tab */}
          <TabsContent value="inspections" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Export Inspection Queue</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Search inspections..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingInspections.map((inspection) => (
                    <div key={inspection.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getPriorityColor(inspection.priority)}>
                            {inspection.priority} priority
                          </Badge>
                          <Badge className={getStatusColor(inspection.status)}>
                            {inspection.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                          <Button size="sm">Start Inspection</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Exporter Details</h4>
                          <p className="text-sm text-gray-600">ID: {inspection.exporterId}</p>
                          <p className="font-medium">{inspection.exporterName}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Shipment Details</h4>
                          <p className="text-sm text-gray-600">Commodity: {inspection.commodity}</p>
                          <p className="text-sm text-gray-600">Quantity: {inspection.quantity}</p>
                          <p className="text-sm text-gray-600">Containers: {inspection.containers.join(", ")}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Shipping Details</h4>
                          <p className="text-sm text-gray-600">Vessel: {inspection.vesselName}</p>
                          <p className="text-sm text-gray-600">Destination: {inspection.destination}</p>
                          <p className="text-sm text-gray-600">Scheduled: {inspection.scheduledDate}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="font-medium mb-2">Required Documents</h4>
                        <div className="flex flex-wrap gap-2">
                          {inspection.documents.map((doc, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Shipments Tab */}
          <TabsContent value="shipments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Export Shipments</CardTitle>
                <CardDescription>
                  Currently processing shipments at {portFacility}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeShipments.map((shipment) => (
                    <div key={shipment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{shipment.exporterName}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(shipment.inspectionStatus)}>
                            Inspection {shipment.inspectionStatus}
                          </Badge>
                          <Badge className={getStatusColor(shipment.loadingStatus)}>
                            Loading {shipment.loadingStatus}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Commodity</p>
                          <p className="font-medium">{shipment.commodity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Quantity</p>
                          <p className="font-medium">{shipment.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Vessel</p>
                          <p className="font-medium">{shipment.vesselName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Departure</p>
                          <p className="font-medium">{shipment.departureTime}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Track Shipment
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Export Documents
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Compliance Overview</CardTitle>
                <CardDescription>
                  Regulatory compliance status for export shipments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceChecks.map((check, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{check.category}</h3>
                        <Badge className={check.rate >= 95 ? 'bg-green-100 text-green-800' : 
                                        check.rate >= 90 ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-red-100 text-red-800'}>
                          {check.rate}% Compliance
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Reviewed</p>
                          <p className="font-medium">{check.total}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Compliant</p>
                          <p className="font-medium text-green-600">{check.compliant}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Non-Compliant</p>
                          <p className="font-medium text-red-600">{check.nonCompliant}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${check.rate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regulatory Sync Tab */}
          <TabsContent value="regulatory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Three-Tier Regulatory Integration</CardTitle>
                <CardDescription>
                  Real-time sync with LACRA regulatory departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regulatoryConnections.map((dept) => (
                    <div key={dept.department} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{dept.department}</h3>
                        <Badge className="bg-green-100 text-green-800">
                          {dept.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Last Sync</p>
                          <p className="font-medium">{dept.lastSync}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Pending Reports</p>
                          <p className="font-medium">{dept.pendingReports}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Critical Alerts</p>
                          <p className={`font-medium ${dept.criticalAlerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {dept.criticalAlerts}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <Button size="sm" variant="outline">Sync Now</Button>
                        <Button size="sm" variant="outline">View Reports</Button>
                        <Button size="sm" variant="outline">Send Alert</Button>
                      </div>
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
}