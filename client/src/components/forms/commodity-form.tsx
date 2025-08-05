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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
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
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-blue-900">Source Location Mapping</h4>
                  <p className="text-sm text-blue-700">Click on map to set precise source location</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLocationMappingOpen(true)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Select on Map
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

      {/* Interactive Location Mapping Dialog */}
      <Dialog open={isLocationMappingOpen} onOpenChange={setIsLocationMappingOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Select Commodity Source Location
            </DialogTitle>
            <DialogDescription>
              Click on the map to select the precise location where this commodity was sourced or harvested.
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
