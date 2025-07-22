import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, addMonths } from "date-fns";
import { insertCertificationSchema, type InsertCertification, type Commodity } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CertificationForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: commodities = [] } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
    select: (data) => data.filter(c => c.status === 'compliant')
  });

  const form = useForm<InsertCertification>({
    resolver: zodResolver(insertCertificationSchema),
    defaultValues: {
      commodityId: 0,
      certificateNumber: "",
      certificateType: "export",
      issuedBy: "LACRA",
      status: "active",
      exportDestination: "",
      exporterName: "",
    },
  });

  const createCertificationMutation = useMutation({
    mutationFn: (data: InsertCertification) =>
      apiRequest("POST", "/api/certifications", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Certificate issued successfully",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to issue certificate",
        variant: "destructive",
      });
    },
  });

  const watchedCommodityId = form.watch("commodityId");
  const watchedType = form.watch("certificateType");
  const selectedCommodity = commodities.find(c => c.id === watchedCommodityId);

  const onSubmit = (data: InsertCertification) => {
    createCertificationMutation.mutate({
      ...data,
      issuedDate: new Date(),
      expiryDate: addMonths(new Date(), data.certificateType === 'export' ? 12 : 6)
    });
  };

  const generateCertificateNumber = () => {
    const type = watchedType.toUpperCase().substring(0, 3);
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${type}-${year}-${random}`;
  };

  const certificateTypes = [
    { value: "export", label: "Export Certificate", description: "For international trade" },
    { value: "quality", label: "Quality Certificate", description: "Quality assurance document" },
    { value: "organic", label: "Organic Certificate", description: "Organic certification" }
  ];

  const commonDestinations = [
    "United States",
    "Netherlands",
    "Germany",
    "Belgium",
    "France",
    "United Kingdom",
    "Italy",
    "Spain",
    "Ghana",
    "Nigeria",
    "Senegal"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="commodityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Compliant Commodity</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select commodity for certification" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {commodities.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No compliant commodities available
                      </div>
                    ) : (
                      commodities.map((commodity) => (
                        <SelectItem key={commodity.id} value={commodity.id.toString()}>
                          <div>
                            <div className="font-medium">{commodity.name}</div>
                            <div className="text-xs text-gray-500">
                              {commodity.batchNumber} - {commodity.qualityGrade}
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedCommodity && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-success mb-2">Selected Commodity</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Name:</span> {selectedCommodity.name}</div>
                <div><span className="font-medium">Type:</span> {selectedCommodity.type.replace('_', ' ').toUpperCase()}</div>
                <div><span className="font-medium">Batch:</span> {selectedCommodity.batchNumber}</div>
                <div><span className="font-medium">Grade:</span> {selectedCommodity.qualityGrade}</div>
                <div><span className="font-medium">County:</span> {selectedCommodity.county}</div>
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="certificateType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select certificate type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {certificateTypes.map((type) => (
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
            name="certificateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Number</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input placeholder="Enter certificate number..." {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => field.onChange(generateCertificateNumber())}
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
            name="issuedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issued By</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exporterName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exporter Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter exporter company name..." {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exportDestination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Export Destination</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search countries..."
                        onChange={(e) => {
                          // Simple search functionality
                          const value = e.target.value;
                          if (value && !commonDestinations.includes(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </div>
                    {commonDestinations.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
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
            name="issuedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
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
                          <span>Select issue date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : new Date()}
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

          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
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
                          <span>Select expiry date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : addMonths(new Date(), 12)}
                      onSelect={(date) => field.onChange(date)}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            className="bg-lacra-green hover:bg-green-700"
            disabled={createCertificationMutation.isPending || commodities.length === 0}
          >
            {createCertificationMutation.isPending ? "Issuing..." : "Issue Certificate"}
          </Button>
        </div>
        
        {commodities.length === 0 && (
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-warning text-sm">
              No compliant commodities available for certification. 
              Commodities must pass inspection and be marked as compliant before certificates can be issued.
            </p>
          </div>
        )}
      </form>
    </Form>
  );
}
