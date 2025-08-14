import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Calendar, FileText, Smartphone, MapPin, Shield, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { getStatusColor } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Inspection, Commodity, InspectorDevice, InspectorLocationHistory, InspectorDeviceAlert, InspectorCheckIn } from "@shared/schema";

export default function Inspections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isNewInspectionOpen, setIsNewInspectionOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const { data: inspections = [], isLoading: inspectionsLoading } = useQuery<Inspection[]>({
    queryKey: ["/api/inspections"],
  });

  const { data: commodities = [], isLoading: commoditiesLoading } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  // Inspector Mobile Device Queries
  const { data: inspectorDevices = [], isLoading: devicesLoading } = useQuery<InspectorDevice[]>({
    queryKey: ["/api/inspector-devices"],
  });

  const { data: inspectorAlerts = [], isLoading: alertsLoading } = useQuery<InspectorDeviceAlert[]>({
    queryKey: ["/api/inspector-alerts/unread"],
  });

  const { data: todayCheckIns = [], isLoading: checkInsLoading } = useQuery<InspectorCheckIn[]>({
    queryKey: ["/api/inspector-checkins/today"],
  });

  const isLoading = inspectionsLoading || commoditiesLoading || devicesLoading || alertsLoading || checkInsLoading;

  if (isLoading) {
    return (
      <div className="p-3 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 mb-2" />
          <Skeleton className="h-3 sm:h-4 w-64 sm:w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 sm:h-6 w-32 sm:w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 sm:h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Combine inspection and commodity data
  const inspectionsWithCommodities = inspections.map(inspection => {
    const commodity = commodities.find(c => c.id === inspection.commodityId);
    return {
      ...inspection,
      commodity
    };
  });

  const filteredInspections = inspectionsWithCommodities.filter(inspection => {
    const matchesSearch = inspection.inspectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.commodity?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.commodity?.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inspection.complianceStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const colors = getStatusColor(status);
    const statusText = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return (
      <Badge className={`${colors} bg-opacity-10 text-xs font-medium rounded-full`}>
        {statusText}
      </Badge>
    );
  };

  const getPriorityBadge = (status: string) => {
    if (status === 'non_compliant') return 'High';
    if (status === 'review_required') return 'Medium';
    return 'Low';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Helmet>
          <title>Inspections - AgriTrace360™ LACRA</title>
          <meta name="description" content="Quality control inspection management system for agricultural commodity compliance" />
        </Helmet>

        {/* Modern ISMS Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl shadow-lg">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Quality Inspections
              </h1>
              <p className="text-slate-600 text-lg mt-1">
                Manage quality control inspections and compliance monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="inspections" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="inspections" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Quality Inspections
            </TabsTrigger>
            <TabsTrigger value="mobile-monitoring" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Inspector Mobile Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inspections">
            {/* Inspection Controls */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div></div>
            <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={() => setIsScheduleDialogOpen(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Inspection
            </Button>
            <Button 
              className="bg-lacra-green hover:bg-green-700"
              onClick={() => setIsNewInspectionOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          </div>
        </div>
      </div>

        {/* Summary Cards - ISMS Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="isms-card text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">{inspections.length}</div>
            <p className="text-slate-600 font-medium">Total Inspections</p>
          </div>
          <div className="isms-card text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {inspections.filter(i => i.complianceStatus === 'compliant').length}
            </div>
            <p className="text-slate-600 font-medium">Compliant</p>
          </div>
          <div className="isms-card text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {inspections.filter(i => i.complianceStatus === 'review_required').length}
            </div>
            <p className="text-slate-600 font-medium">Review Required</p>
          </div>
          <div className="isms-card text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-red flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">
              {inspections.filter(i => i.complianceStatus === 'non_compliant').length}
            </div>
            <p className="text-slate-600 font-medium">Non-Compliant</p>
          </div>
        </div>

        {/* Filters Section - ISMS Style */}
        <div className="isms-card mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl isms-icon-bg-slate flex items-center justify-center">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Search & Filter</h3>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Search Inspections</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by inspector, commodity, or batch number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              </div>
            </div>
            <div className="min-w-48">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Status Filter</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="review_required">Review Required</SelectItem>
                  <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Inspections Table - ISMS Style */}
        <div className="isms-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl isms-icon-bg-blue flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Quality Inspections</h3>
              <p className="text-slate-600 text-sm">
                Showing {filteredInspections.length} of {inspections.length} inspections
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Inspection Date</TableHead>
                  <TableHead>Quality Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInspections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {inspections.length === 0 
                        ? "No inspections recorded yet. Start by conducting your first quality inspection."
                        : "No inspections match your current filters."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInspections.map((inspection) => (
                    <TableRow key={inspection.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          {inspection.commodity?.name || 'Unknown Commodity'}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {inspection.commodity?.type?.replace('_', ' ') || 'Unknown Type'}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {inspection.commodity?.batchNumber || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{inspection.inspectorName}</div>
                        <div className="text-sm text-gray-500">{inspection.inspectorId}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(inspection.inspectionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {inspection.qualityGrade}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(inspection.complianceStatus)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            getPriorityBadge(inspection.complianceStatus) === 'High' ? 'border-error text-error' :
                            getPriorityBadge(inspection.complianceStatus) === 'Medium' ? 'border-warning text-warning' :
                            'border-success text-success'
                          }`}
                        >
                          {getPriorityBadge(inspection.complianceStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-lacra-blue hover:text-blue-700"
                            onClick={() => {
                              setSelectedInspection(inspection);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      {/* View Inspection Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedInspection ? `Inspection Report - ${selectedInspection.inspectionId}` : 'Inspection Report'}
            </DialogTitle>
            <DialogDescription>
              Detailed quality inspection report and compliance assessment
            </DialogDescription>
          </DialogHeader>
          {selectedInspection && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inspection Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Inspection ID</label>
                    <p className="font-mono text-sm">{selectedInspection.inspectionId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Commodity</label>
                    <p>{selectedInspection.commodity?.name || 'Unknown Commodity'}</p>
                    <p className="text-sm text-gray-500">{selectedInspection.commodity?.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Batch Number</label>
                    <p className="font-mono text-sm">{selectedInspection.commodity?.batchNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Inspection Date</label>
                    <p>{new Date(selectedInspection.inspectionDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p>{selectedInspection.location}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Inspector Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inspector Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Inspector Name</label>
                    <p>{selectedInspection.inspectorName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">License Number</label>
                    <p className="font-mono text-sm">{selectedInspection.inspectorLicense}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Quality Grade</label>
                    <Badge variant="outline" className="mt-1">
                      {selectedInspection.qualityGrade}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Compliance Status</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedInspection.complianceStatus)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quality Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quality Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Moisture Content</label>
                    <p>{selectedInspection.moistureContent}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Defect Rate</label>
                    <p>{selectedInspection.defectRate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">County</label>
                    <p>{selectedInspection.commodity?.county}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Quantity</label>
                    <p>{selectedInspection.commodity?.quantity} {selectedInspection.commodity?.unit}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Inspection Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inspection Notes & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Inspection Notes</label>
                    <div className="bg-gray-50 p-3 rounded border mt-1">
                      <p className="text-sm">{selectedInspection.notes}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Recommendations</label>
                    <div className="bg-blue-50 p-3 rounded border mt-1">
                      <p className="text-sm">{selectedInspection.recommendations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-1" />
              Export Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Inspection Dialog */}
      <Dialog open={isNewInspectionOpen} onOpenChange={setIsNewInspectionOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Inspection</DialogTitle>
            <DialogDescription>
              Schedule a new quality control inspection for a commodity batch
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Commodity</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select commodity..." />
                  </SelectTrigger>
                  <SelectContent>
                    {commodities.map((commodity) => (
                      <SelectItem key={commodity.id} value={commodity.id.toString()}>
                        {commodity.name} - {commodity.batchNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Inspector Name</label>
                <Input placeholder="Enter inspector name..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Inspector License</label>
                <Input placeholder="Enter inspector license number..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Inspection Date</label>
                <Input type="date" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                <Input placeholder="Enter inspection location..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Quality Grade</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality grade..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Grade A">Grade A</SelectItem>
                    <SelectItem value="Grade B">Grade B</SelectItem>
                    <SelectItem value="Grade 1">Grade 1</SelectItem>
                    <SelectItem value="Grade 2">Grade 2</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Compliance Status</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select compliance status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="requires_action">Requires Action</SelectItem>
                    <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Moisture Content (%)</label>
                <Input placeholder="Enter moisture content..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Defect Rate (%)</label>
                <Input placeholder="Enter defect rate..." />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Inspection Notes</label>
                <Textarea 
                  placeholder="Enter detailed inspection notes and observations..."
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Recommendations</label>
                <Textarea 
                  placeholder="Enter recommendations and follow-up actions..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewInspectionOpen(false)}>
                Cancel
              </Button>
              <Button>
                Create Inspection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Inspection Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Inspection</DialogTitle>
            <DialogDescription>
              Schedule a future quality control inspection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Commodity</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select commodity to inspect..." />
                </SelectTrigger>
                <SelectContent>
                  {commodities.map((commodity) => (
                    <SelectItem key={commodity.id} value={commodity.id.toString()}>
                      {commodity.name} - {commodity.batchNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Preferred Inspector</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select inspector..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="james_kollie">James Kollie (LIC-INS-2024-001)</SelectItem>
                  <SelectItem value="sarah_konneh">Sarah Konneh (LIC-INS-2024-002)</SelectItem>
                  <SelectItem value="moses_tuah">Moses Tuah (LIC-INS-2024-003)</SelectItem>
                  <SelectItem value="mary_johnson">Mary Johnson (LIC-INS-2024-004)</SelectItem>
                  <SelectItem value="david_clarke">David Clarke (LIC-INS-2024-005)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Scheduled Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Scheduled Time</label>
              <Input type="time" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Priority Level</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
              <Input placeholder="Enter inspection location..." />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Notes</label>
              <Textarea 
                placeholder="Additional notes or special requirements..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-1" />
              Schedule Inspection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
          </TabsContent>

          <TabsContent value="mobile-monitoring">
            {/* Inspector Mobile Monitoring Content */}
            <div className="space-y-8">
              
              {/* Header Section */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Inspector Mobile Monitoring System</h2>
                <p className="text-slate-600">Real-time tracking and monitoring of field inspector mobile devices</p>
              </div>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Active Devices</p>
                        <p className="text-3xl font-bold text-blue-900">
                          {inspectorDevices.filter(d => d.isActive).length}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Smartphone className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Today's Check-ins</p>
                        <p className="text-3xl font-bold text-green-900">{todayCheckIns.length}</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600">Unread Alerts</p>
                        <p className="text-3xl font-bold text-yellow-900">{inspectorAlerts.length}</p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Online Now</p>
                        <p className="text-3xl font-bold text-purple-900">
                          {inspectorDevices.filter(d => {
                            const lastSeen = d.lastSeen ? new Date(d.lastSeen) : new Date();
                            const now = new Date();
                            const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
                            return diffMinutes < 5; // Online if last seen within 5 minutes
                          }).length}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Shield className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time GPS Tracking Section */}
              <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    Real-time GPS Location Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inspectorDevices.map((device) => (
                      <div key={device.deviceId} className="bg-white p-4 rounded-lg border border-indigo-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-3 h-3 rounded-full ${device.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <h4 className="font-medium text-slate-900">{device.inspectorName}</h4>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            <span>{device.deviceModel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>GPS: {device.gpsEnabled ? 'Enabled' : 'Disabled'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Last seen: {device.lastSeen ? new Date(device.lastSeen).toLocaleTimeString() : 'Never'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Device Status Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Inspector Device Status & Battery Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Inspector</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Location</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead>Battery</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inspectorDevices.map((device) => {
                        const lastSeen = device.lastSeen ? new Date(device.lastSeen) : new Date();
                        const now = new Date();
                        const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
                        const isOnline = diffMinutes < 5;
                        
                        return (
                          <TableRow key={device.deviceId}>
                            <TableCell className="font-medium">
                              {device.inspectorName || device.inspectorId}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">{device.deviceModel}</p>
                                  <p className="text-xs text-gray-500">{device.deviceId}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                {isOnline ? "Online" : "Offline"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                  No location
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                  {lastSeen.toLocaleString()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-8 rounded-full ${
                                  (device.batteryLevel || 0) > 50 ? 'bg-green-500' :
                                  (device.batteryLevel || 0) > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                                <span className="text-xs text-gray-600">{device.batteryLevel || 0}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              {inspectorAlerts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      Recent Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {inspectorAlerts.slice(0, 5).map((alert) => (
                        <div key={alert.id} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-800">{alert.alertType}</p>
                            <p className="text-xs text-yellow-700 mt-1">{alert.message}</p>
                            <p className="text-xs text-yellow-600 mt-2">
                              Device: {alert.deviceId} • {alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleString() : 'Unknown time'}
                            </p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {alert.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Today's Check-ins */}
              {todayCheckIns.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Today's Check-ins
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {todayCheckIns.map((checkIn) => (
                        <div key={checkIn.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-800">
                              {checkIn.inspectorId}
                            </p>
                            <p className="text-xs text-green-700">
                              Check-in • {checkIn.timestamp ? new Date(checkIn.timestamp).toLocaleTimeString() : 'Unknown time'}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {checkIn.checkInType}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location History Section */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    Location History & Movement Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-purple-900 mb-2">GPS Tracking Active</h3>
                    <p className="text-purple-700">Inspector movement history and location tracking is being monitored in real-time</p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{inspectorDevices.filter(d => d.gpsEnabled).length}</div>
                        <div className="text-sm text-purple-700">GPS Enabled</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{inspectorDevices.filter(d => d.locationPermission).length}</div>
                        <div className="text-sm text-purple-700">Location Permitted</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{todayCheckIns.length}</div>
                        <div className="text-sm text-purple-700">Check-ins Today</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Quick Actions & Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button className="h-auto p-4 flex-col bg-blue-600 hover:bg-blue-700">
                      <Smartphone className="h-6 w-6 mb-2" />
                      <span className="text-sm">Refresh Devices</span>
                    </Button>
                    <Button className="h-auto p-4 flex-col bg-green-600 hover:bg-green-700">
                      <MapPin className="h-6 w-6 mb-2" />
                      <span className="text-sm">View GPS Map</span>
                    </Button>
                    <Button className="h-auto p-4 flex-col bg-yellow-600 hover:bg-yellow-700">
                      <AlertTriangle className="h-6 w-6 mb-2" />
                      <span className="text-sm">View All Alerts</span>
                    </Button>
                    <Button className="h-auto p-4 flex-col bg-purple-600 hover:bg-purple-700">
                      <CheckCircle className="h-6 w-6 mb-2" />
                      <span className="text-sm">Check-in Report</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
