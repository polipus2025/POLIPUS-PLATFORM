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
import { Search, Plus, Calendar, FileText } from "lucide-react";
import { getStatusColor } from "@/lib/types";
import type { Inspection, Commodity } from "@shared/schema";

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

  const isLoading = inspectionsLoading || commoditiesLoading;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
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
    <div className="p-6">
      <Helmet>
        <title>Inspections - AgriTrace360™ LACRA</title>
        <meta name="description" content="Quality control inspection management system for agricultural commodity compliance" />
      </Helmet>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-neutral mb-2">Quality Inspections</h2>
            <p className="text-gray-600">Manage quality control inspections and compliance monitoring</p>
          </div>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-neutral">{inspections.length}</div>
            <p className="text-sm text-gray-500">Total Inspections</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">
              {inspections.filter(i => i.complianceStatus === 'compliant').length}
            </div>
            <p className="text-sm text-gray-500">Compliant</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-warning">
              {inspections.filter(i => i.complianceStatus === 'review_required').length}
            </div>
            <p className="text-sm text-gray-500">Review Required</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-error">
              {inspections.filter(i => i.complianceStatus === 'non_compliant').length}
            </div>
            <p className="text-sm text-gray-500">Non-Compliant</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by inspector, commodity, or batch number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <div className="min-w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
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
        </CardContent>
      </Card>

      {/* Inspections Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral">
            Inspections ({filteredInspections.length} of {inspections.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

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
    </div>
  );
}
