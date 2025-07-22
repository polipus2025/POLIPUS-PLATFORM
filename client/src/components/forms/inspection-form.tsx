import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { insertInspectionSchema, type InsertInspection, type Commodity } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { COMPLIANCE_STATUSES, QUALITY_GRADES } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function InspectionForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: commodities = [] } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  const form = useForm<InsertInspection>({
    resolver: zodResolver(insertInspectionSchema),
    defaultValues: {
      commodityId: 0,
      inspectorId: "INSP001",
      inspectorName: "James Kollie",
      qualityGrade: "",
      complianceStatus: "pending",
      notes: "",
      deficiencies: "",
      recommendations: "",
    },
  });

  const createInspectionMutation = useMutation({
    mutationFn: (data: InsertInspection) =>
      apiRequest("POST", "/api/inspections", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inspections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commodities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Inspection recorded successfully",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record inspection",
        variant: "destructive",
      });
    },
  });

  const watchedCommodityId = form.watch("commodityId");
  const selectedCommodity = commodities.find(c => c.id === watchedCommodityId);

  const onSubmit = (data: InsertInspection) => {
    createInspectionMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="commodityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Commodity</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select commodity to inspect" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {commodities.map((commodity) => (
                      <SelectItem key={commodity.id} value={commodity.id.toString()}>
                        <div>
                          <div className="font-medium">{commodity.name}</div>
                          <div className="text-xs text-gray-500">
                            {commodity.batchNumber} - {commodity.county}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedCommodity && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-neutral mb-2">Commodity Details</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Type:</span> {selectedCommodity.type.replace('_', ' ').toUpperCase()}</div>
                <div><span className="font-medium">Quantity:</span> {selectedCommodity.quantity} {selectedCommodity.unit}</div>
                <div><span className="font-medium">Current Grade:</span> {selectedCommodity.qualityGrade}</div>
                <div><span className="font-medium">Status:</span> {selectedCommodity.status}</div>
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="inspectorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspector Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter inspector name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inspectorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspector ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter inspector ID..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inspectionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspection Date</FormLabel>
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
                          <span>Select inspection date</span>
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
                    {selectedCommodity && QUALITY_GRADES[selectedCommodity.type as keyof typeof QUALITY_GRADES]?.map((grade) => (
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
            name="complianceStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compliance Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select compliance status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COMPLIANCE_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
            name="nextInspectionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Inspection Date (Optional)</FormLabel>
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
                          <span>Select next inspection date</span>
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

        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspection Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter detailed inspection notes..."
                    className="h-24"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deficiencies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deficiencies (if any)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="List any deficiencies found during inspection..."
                    className="h-20"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recommendations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recommendations</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide recommendations for improvement..."
                    className="h-20"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
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
            disabled={createInspectionMutation.isPending}
          >
            {createInspectionMutation.isPending ? "Recording..." : "Record Inspection"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
