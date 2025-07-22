import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, Plus, Download, FileText, Calendar, BarChart3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReportSchema, type Report, type InsertReport } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { COUNTIES, COMMODITY_TYPES } from "@/lib/types";

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const form = useForm<InsertReport>({
    resolver: zodResolver(insertReportSchema),
    defaultValues: {
      title: "",
      type: "compliance",
      parameters: "",
      generatedBy: "James Kollie",
      status: "pending"
    },
  });

  const createReportMutation = useMutation({
    mutationFn: (data: InsertReport) =>
      apiRequest("POST", "/api/reports", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Success",
        description: "Report generation initiated successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create report",
        variant: "destructive",
      });
    },
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'text-warning bg-warning',
      completed: 'text-success bg-success',
      failed: 'text-error bg-error'
    };
    
    return (
      <Badge className={`${colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-400'} bg-opacity-10 text-xs font-medium rounded-full`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      compliance: 'border-lacra-blue text-lacra-blue',
      inspection: 'border-lacra-green text-lacra-green',
      export: 'border-lacra-orange text-lacra-orange',
      county: 'border-purple-500 text-purple-500'
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`${colors[type as keyof typeof colors] || 'border-gray-400 text-gray-600'} text-xs`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const onSubmit = (data: InsertReport) => {
    const reportData = {
      ...data,
      parameters: JSON.stringify({
        county: data.parameters?.includes('county') ? 'all' : undefined,
        dateRange: '30days',
        includeCharts: true
      })
    };
    createReportMutation.mutate(reportData);
  };

  const reportTypes = [
    { value: "compliance", label: "Compliance Report", description: "Overall compliance status across all commodities" },
    { value: "inspection", label: "Inspection Report", description: "Quality control inspection summaries" },
    { value: "export", label: "Export Report", description: "Export certification and trade statistics" },
    { value: "county", label: "County Report", description: "Regional compliance and production data" }
  ];

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

  return (
    <div className="p-6">
      <Helmet>
        <title>Reports - AgriTrace360™ LACRA</title>
        <meta name="description" content="Generate and manage regulatory compliance reports for agricultural commodities" />
      </Helmet>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-neutral mb-2">Regulatory Reports</h2>
            <p className="text-gray-600">Generate and manage compliance reports for regulatory submissions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lacra-green hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter report title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {reportTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div>
                                  <div className="font-medium">{type.label}</div>
                                  <div className="text-xs text-gray-500">{type.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parameters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Parameters (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any specific parameters or filters for this report..."
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-lacra-green hover:bg-green-700"
                      disabled={createReportMutation.isPending}
                    >
                      {createReportMutation.isPending ? "Generating..." : "Generate Report"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {reportTypes.map((type) => (
          <Card key={type.value} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-lacra-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-lacra-blue" />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-lacra-blue hover:text-blue-700"
                  onClick={() => {
                    form.setValue("type", type.value);
                    form.setValue("title", `${type.label} - ${new Date().toLocaleDateString()}`);
                    setIsDialogOpen(true);
                  }}
                >
                  Generate
                </Button>
              </div>
              <h3 className="font-semibold text-neutral mb-2">{type.label}</h3>
              <p className="text-sm text-gray-500">{type.description}</p>
            </CardContent>
          </Card>
        ))}
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
                  placeholder="Search by title or generated by..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="county">County</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral">
            Generated Reports ({filteredReports.length} of {reports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Generated By</TableHead>
                  <TableHead>Generated Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {reports.length === 0 
                        ? "No reports generated yet. Create your first regulatory report to get started."
                        : "No reports match your current filters."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{report.title}</div>
                        {report.parameters && (
                          <div className="text-sm text-gray-500">
                            Parameters: {report.parameters.length > 50 
                              ? report.parameters.substring(0, 50) + '...' 
                              : report.parameters
                            }
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getTypeBadge(report.type)}</TableCell>
                      <TableCell className="text-sm">{report.generatedBy}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(report.generatedAt!).toLocaleDateString()} at{' '}
                        {new Date(report.generatedAt!).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {report.status === 'completed' ? (
                            <>
                              <Button variant="ghost" size="sm" className="text-lacra-blue hover:text-blue-700">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                                View
                              </Button>
                            </>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-gray-400" disabled>
                              {report.status === 'pending' ? 'Processing...' : 'Failed'}
                            </Button>
                          )}
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
    </div>
  );
}
