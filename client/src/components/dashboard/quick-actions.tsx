import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, FileText, Tag, CalendarPlus } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Commodity } from "@shared/schema";

export default function QuickActions() {
  const [isNewInspectionOpen, setIsNewInspectionOpen] = useState(false);
  const [inspectionForm, setInspectionForm] = useState({
    commodityId: "",
    inspectorName: "",
    qualityGrade: "",
    complianceStatus: "pending",
    notes: "",
    deficiencies: "",
    recommendations: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch commodities for inspection selection
  const { data: commodities = [] } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  // Create inspection mutation
  const createInspectionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/inspections", {
        method: "POST",
        body: JSON.stringify({
          commodityId: parseInt(data.commodityId),
          inspectorId: "INSP001",
          inspectorName: data.inspectorName || "Dashboard User",
          qualityGrade: data.qualityGrade,
          complianceStatus: data.complianceStatus,
          notes: data.notes,
          deficiencies: data.deficiencies,
          recommendations: data.recommendations
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inspections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commodities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      setIsNewInspectionOpen(false);
      setInspectionForm({
        commodityId: "",
        inspectorName: "",
        qualityGrade: "",
        complianceStatus: "pending",
        notes: "",
        deficiencies: "",
        recommendations: ""
      });
      toast({
        title: "Success",
        description: "Inspection recorded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record inspection",
        variant: "destructive",
      });
    },
  });

  const handleSubmitInspection = () => {
    if (!inspectionForm.commodityId || !inspectionForm.qualityGrade) {
      toast({
        title: "Validation Error",
        description: "Please select a commodity and quality grade",
        variant: "destructive",
      });
      return;
    }
    createInspectionMutation.mutate(inspectionForm);
  };

  const actions = [
    {
      title: "New Inspection",
      subtitle: "Record quality control",
      icon: ClipboardCheck,
      action: "dialog",
      bgGradient: "from-blue-500 to-blue-600",
      iconColor: "text-white",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      title: "Generate Report",
      subtitle: "Export compliance data",
      icon: FileText,
      href: "/reports",
      bgGradient: "from-green-500 to-green-600",
      iconColor: "text-white",
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    {
      title: "Issue Tag",
      subtitle: "Create certificates",
      icon: Tag,
      href: "/data-entry?type=certification",
      bgGradient: "from-orange-500 to-orange-600",
      iconColor: "text-white",
      hoverColor: "hover:from-orange-600 hover:to-orange-700"
    },
    {
      title: "Schedule Inspection",
      subtitle: "Plan future reviews",
      icon: CalendarPlus,
      href: "/inspections",
      bgGradient: "from-purple-500 to-purple-600",
      iconColor: "text-white",
      hoverColor: "hover:from-purple-600 hover:to-purple-700"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => {
            if (action.action === "dialog" && action.title === "New Inspection") {
              return (
                <Dialog key={action.title} open={isNewInspectionOpen} onOpenChange={setIsNewInspectionOpen}>
                  <DialogTrigger asChild>
                    <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.bgGradient} ${action.hoverColor} transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg`}>
                      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                      <div className="relative p-6 flex flex-col items-center text-center">
                        <div className="mb-4 p-3 bg-white bg-opacity-20 rounded-full">
                          <action.icon className={`h-8 w-8 ${action.iconColor}`} />
                        </div>
                        <h3 className="text-white font-semibold text-sm mb-1">{action.title}</h3>
                        <p className="text-white text-xs opacity-90">{action.subtitle}</p>
                        <div className="absolute top-2 right-2 w-2 h-2 bg-white bg-opacity-30 rounded-full"></div>
                        <div className="absolute bottom-2 left-2 w-1 h-1 bg-white bg-opacity-40 rounded-full"></div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Inspection</DialogTitle>
                      <DialogDescription>
                        Record a new quality control inspection for a commodity batch
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Commodity</Label>
                          <Select value={inspectionForm.commodityId} onValueChange={(value) => setInspectionForm({...inspectionForm, commodityId: value})}>
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
                          <Label>Inspector Name</Label>
                          <Input 
                            placeholder="Enter inspector name..." 
                            value={inspectionForm.inspectorName}
                            onChange={(e) => setInspectionForm({...inspectionForm, inspectorName: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Quality Grade</Label>
                          <Select value={inspectionForm.qualityGrade} onValueChange={(value) => setInspectionForm({...inspectionForm, qualityGrade: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select quality grade..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Grade A">Grade A - Premium</SelectItem>
                              <SelectItem value="Grade B">Grade B - Standard</SelectItem>
                              <SelectItem value="Grade C">Grade C - Commercial</SelectItem>
                              <SelectItem value="Grade D">Grade D - Below Standard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Compliance Status</Label>
                          <Select value={inspectionForm.complianceStatus} onValueChange={(value) => setInspectionForm({...inspectionForm, complianceStatus: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="compliant">Compliant</SelectItem>
                              <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                              <SelectItem value="pending">Pending Review</SelectItem>
                              <SelectItem value="review_required">Review Required</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Inspection Notes</Label>
                        <Textarea 
                          placeholder="Enter detailed inspection notes..."
                          value={inspectionForm.notes}
                          onChange={(e) => setInspectionForm({...inspectionForm, notes: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Deficiencies (if any)</Label>
                          <Textarea 
                            placeholder="List any deficiencies found..."
                            value={inspectionForm.deficiencies}
                            onChange={(e) => setInspectionForm({...inspectionForm, deficiencies: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Recommendations</Label>
                          <Textarea 
                            placeholder="Enter recommendations for improvement..."
                            value={inspectionForm.recommendations}
                            onChange={(e) => setInspectionForm({...inspectionForm, recommendations: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsNewInspectionOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSubmitInspection}
                          disabled={createInspectionMutation.isPending}
                        >
                          {createInspectionMutation.isPending ? "Recording..." : "Record Inspection"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            }
            
            return (
              <Link key={action.title} href={action.href || "#"}>
                <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.bgGradient} ${action.hoverColor} transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg`}>
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <div className="relative p-6 flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-white bg-opacity-20 rounded-full">
                      <action.icon className={`h-8 w-8 ${action.iconColor}`} />
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1">{action.title}</h3>
                    <p className="text-white text-xs opacity-90">{action.subtitle}</p>
                    <div className="absolute top-2 right-2 w-2 h-2 bg-white bg-opacity-30 rounded-full"></div>
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-white bg-opacity-40 rounded-full"></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
