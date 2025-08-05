import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { CalendarIcon, MapPin, TreePine, Satellite, Shield, Download } from "lucide-react";
import { format } from "date-fns";
import EUDRComplianceReportComponent from "@/components/reports/eudr-compliance-report";
import DeforestationReportComponent from "@/components/reports/deforestation-report";
import { generateEUDRCompliancePDF, generateDeforestationPDF } from "@/lib/enhanced-pdf-generator";
import { createComplianceReports, ComplianceReportData } from "@/components/reports/report-storage";
import { insertCommoditySchema, type InsertCommodity } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { COUNTIES, COMMODITY_TYPES, QUALITY_GRADES } from "@/lib/types";
import { cn } from "@/lib/utils";
import InteractiveBoundaryMapper from "@/components/maps/interactive-boundary-mapper";

interface CommodityFormProps {
  onSuccess?: () => void;
}

export default function CommodityForm({ onSuccess }: CommodityFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isLocationMappingOpen, setIsLocationMappingOpen] = useState(false);
  const [sourceLocation, setSourceLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [complianceReports, setComplianceReports] = useState<any>(null);
  const [isGeneratingReports, setIsGeneratingReports] = useState(false);

  const form = useForm<InsertCommodity>({
    resolver: zodResolver(insertCommoditySchema),
    defaultValues: {
      name: "",
      type: "cocoa",
      batchNumber: "",
      county: "",
      qualityGrade: "",
      quantity: "0",
      unit: "kg",
      status: "pending",
      farmerId: "",
      farmerName: "",
    },
  });

  const createCommodityMutation = useMutation({
    mutationFn: (data: InsertCommodity) =>
      apiRequest("/api/commodities", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commodities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Commodity registered successfully",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register commodity",
        variant: "destructive",
      });
    },
  });

  const watchedType = form.watch("type");

  // Generate compliance reports for commodity location
  const generateCommodityComplianceReports = async () => {
    if (!sourceLocation) {
      toast({
        title: "No Location Data",
        description: "Please map the source location first to generate compliance reports",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingReports(true);
    
    try {
      const farmerId = localStorage.getItem("farmerId") || form.watch("farmerId") || `FRM-${Date.now()}`;
      const farmerName = form.watch("farmerName") || localStorage.getItem("farmerFirstName") || "Farm Owner";
      const coordinates = `${sourceLocation.latitude.toFixed(6)}, ${sourceLocation.longitude.toFixed(6)}`;
      const commodityName = form.watch("name") || "Agricultural Commodity";

      const reportData: ComplianceReportData = {
        farmerId,
        farmerName,
        coordinates,
        boundaryData: {
          name: `${commodityName} Source Location`,
          area: 1.0, // Default area for single point location
          perimeter: 0, // Not applicable for point location
          points: 1,
          accuracy: 'good' // Default accuracy
        }
      };

      const reports = await createComplianceReports(reportData);
      setComplianceReports(reports);

      toast({
        title: "✅ LACRA Commodity Compliance Reports Generated",
        description: "EUDR and deforestation analysis reports created for source location",
      });
    } catch (error) {
      console.error('Error generating commodity compliance reports:', error);
      toast({
        title: "Error Generating Reports",
        description: "Failed to create compliance reports. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingReports(false);
    }
  };

  const onSubmit = (data: InsertCommodity) => {
    createCommodityMutation.mutate(data);
  };

  const generateBatchNumber = () => {
    const type = watchedType.toUpperCase().substring(0, 3);
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${type}-${year}-${random}`;
  };

  return (
    <div className="bg-slate-50 p-6 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commodity Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter commodity name..." {...field} />
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
                <FormLabel>Commodity Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select commodity type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COMMODITY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
            name="batchNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Number</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input placeholder="Enter batch number..." {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => field.onChange(generateBatchNumber())}
                  >
                    Generate
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="county"
            render={({ field }) => (
              <FormItem>
                <FormLabel>County</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COUNTIES.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter quantity..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="tons">Tons</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qualityGrade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quality Grade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {QUALITY_GRADES[watchedType as keyof typeof QUALITY_GRADES]?.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
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
            name="farmerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Farmer Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter farmer name..." {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="farmerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Farmer ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter farmer ID..." {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="harvestDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harvest Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date)}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Source Location Interactive Mapping */}
          <div className="md:col-span-2">
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-blue-900 text-sm sm:text-base">Source Location Mapping</h4>
                  <p className="text-xs sm:text-sm text-blue-700">
                    <span className="hidden sm:inline">Click on map to set precise source location</span>
                    <span className="sm:hidden">Tap map to set location</span>
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLocationMappingOpen(true)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100 w-full sm:w-auto text-xs sm:text-sm"
                >
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="hidden sm:inline">Select on Map</span>
                  <span className="sm:hidden">Select Location</span>
                </Button>
              </div>
              
              {sourceLocation && (
                <div className="bg-white p-3 rounded border border-blue-200">
                  <div className="text-sm font-medium text-gray-900 mb-1">Selected Location:</div>
                  <div className="text-sm text-gray-600 font-mono">
                    Lat: {sourceLocation.latitude.toFixed(6)}, Lng: {sourceLocation.longitude.toFixed(6)}
                  </div>
                </div>
              )}
              
              {!sourceLocation && (
                <div className="text-center py-3">
                  <MapPin className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                  <p className="text-sm text-blue-600">No location selected</p>
                </div>
              )}
            </div>
          </div>
        </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => form.reset()}
              className="px-6"
            >
              Reset Form
            </Button>
            <Button 
              type="submit" 
              disabled={createCommodityMutation.isPending}
              className="isms-button px-8"
            >
              {createCommodityMutation.isPending ? "Registering..." : "Register Commodity"}
            </Button>
          </div>
        </form>
      </Form>

      {/* LACRA Compliance Reports Section */}
      {sourceLocation && (
        <div className="mt-6 bg-emerald-50 p-3 sm:p-4 rounded-lg border border-emerald-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">LACRA Compliance Reports</h3>
                <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">Generate official EUDR and deforestation analysis for source location</p>
                <p className="text-xs text-slate-600 sm:hidden">Generate compliance analysis</p>
              </div>
            </div>
            <Button 
              onClick={generateCommodityComplianceReports}
              disabled={isGeneratingReports}
              className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
              size="sm"
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="text-xs sm:text-sm">
                {isGeneratingReports ? 'Generating...' : 'Generate Reports'}
              </span>
            </Button>
          </div>

          {complianceReports ? (
            <div className="space-y-4">
              <div className="p-3 bg-white rounded border border-emerald-200">
                <p className="text-sm text-emerald-800 mb-3">
                  📋 Official LACRA compliance reports generated for commodity source location with colorful letterhead.
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  {/* EUDR Compliance Report */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 w-full"
                      >
                        <TreePine className="h-3 w-3 mr-1 sm:mr-2" />
                        <span className="text-xs">
                          <span className="hidden sm:inline">View EUDR</span>
                          <span className="sm:hidden">EUDR</span>
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <TreePine className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                          <span className="hidden sm:inline">EUDR Compliance Assessment</span>
                          <span className="sm:hidden">EUDR Report</span>
                        </DialogTitle>
                      </DialogHeader>
                      <EUDRComplianceReportComponent 
                        report={complianceReports.eudrCompliance}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Deforestation Analysis Report */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 w-full"
                      >
                        <Satellite className="h-3 w-3 mr-1 sm:mr-2" />
                        <span className="text-xs">
                          <span className="hidden sm:inline">View Deforestation</span>
                          <span className="sm:hidden">Defor.</span>
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <Satellite className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                          <span className="hidden sm:inline">Deforestation Analysis</span>
                          <span className="sm:hidden">Deforestation Report</span>
                        </DialogTitle>
                      </DialogHeader>
                      <DeforestationReportComponent 
                        report={complianceReports.deforestationReport}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* PDF Downloads */}
                  <Button 
                    onClick={() => generateEUDRCompliancePDF(complianceReports.eudrCompliance)}
                    variant="outline" 
                    size="sm" 
                    className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100 w-full"
                  >
                    <Download className="h-3 w-3 mr-1 sm:mr-2" />
                    <span className="text-xs">
                      <span className="hidden sm:inline">EUDR PDF</span>
                      <span className="sm:hidden">EUDR</span>
                    </span>
                  </Button>

                  <Button 
                    onClick={() => generateDeforestationPDF(complianceReports.deforestationReport)}
                    variant="outline" 
                    size="sm" 
                    className="bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100 w-full"
                  >
                    <Download className="h-3 w-3 mr-1 sm:mr-2" />
                    <span className="text-xs">
                      <span className="hidden sm:inline">Deforestation PDF</span>
                      <span className="sm:hidden">Defor.</span>
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-white rounded border border-emerald-200 text-center">
              <p className="text-sm text-slate-600">No compliance reports generated yet</p>
              <p className="text-xs text-slate-500">Generate reports to view LACRA compliance documentation</p>
            </div>
          )}
        </div>
      )}

      {/* Interactive Location Mapping Dialog */}
      <Dialog open={isLocationMappingOpen} onOpenChange={setIsLocationMappingOpen}>
        <DialogContent className="w-[95vw] max-w-5xl h-[90vh] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-3">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="hidden sm:inline">Select Commodity Source Location</span>
              <span className="sm:hidden">Source Location</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Click on the map to select the precise location where this commodity was sourced or harvested.</span>
              <span className="sm:hidden">Tap map to select location</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            <InteractiveBoundaryMapper
              onBoundaryComplete={(boundary) => {
                if (boundary.points.length > 0) {
                  const location = {
                    latitude: boundary.points[0].latitude,
                    longitude: boundary.points[0].longitude
                  };
                  
                  setSourceLocation(location);
                  
                  toast({
                    title: "Location Selected",
                    description: `Source location set to ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
                  });
                  
                  setIsLocationMappingOpen(false);
                }
              }}
              minPoints={1}
              maxPoints={1}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
