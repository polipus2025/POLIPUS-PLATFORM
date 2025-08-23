import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Users, 
  FileText, 
  BarChart3,
  TreePine,
  Shield,
  Globe,
  Zap
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AgriTraceWorkflow {
  id: number;
  workflowName: string;
  workflowType: string;
  status: string;
  priority: number;
  farmerId: string;
  currentStage: string;
  totalStages: number;
  completedStages: number;
  assignedInspector: string;
  complianceScore: number;
  workflowConfiguration: any;
  createdAt: string;
  updatedAt: string;
  estimatedCompletion?: string;
  actualCompletion?: string;
}

export default function AgriTraceDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedWorkflow, setSelectedWorkflow] = useState<AgriTraceWorkflow | null>(null);

  // Fetch AgriTrace workflows
  const { data: workflows = [], isLoading } = useQuery<AgriTraceWorkflow[]>({
    queryKey: ["/api/agritrace/workflows"],
    queryFn: () => apiRequest("GET", "/api/agritrace/workflows"),
  });

  // Initialize National Mapping Plan mutation
  const initializeMappingMutation = useMutation({
    mutationFn: (data: { lacraAdminId: string }) => 
      apiRequest("POST", "/api/agritrace/national-mapping", data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "National mapping plan initialized successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/agritrace/workflows"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to initialize national mapping plan",
        variant: "destructive",
      });
    },
  });

  // LACRA 14-Step Workflow Definition
  const workflowSteps = [
    { 
      step: 0, 
      name: "National Mapping Plan", 
      description: "LACRA prepares national plan to map all farms", 
      icon: <Globe className="w-4 h-4" />,
      color: "bg-blue-500"
    },
    { 
      step: 1, 
      name: "Inspector Registration", 
      description: "Field inspectors register in their respective counties", 
      icon: <Users className="w-4 h-4" />,
      color: "bg-green-500"
    },
    { 
      step: 2, 
      name: "Farmer Onboarding", 
      description: "Inspector onboards farmer and maps farm plots", 
      icon: <MapPin className="w-4 h-4" />,
      color: "bg-yellow-500"
    },
    { 
      step: 3, 
      name: "Farm Plot Registration", 
      description: "Register farm plots with GPS coordinates", 
      icon: <MapPin className="w-4 h-4" />,
      color: "bg-orange-500"
    },
    { 
      step: 4, 
      name: "Commodity Registration", 
      description: "Register specific commodities produced", 
      icon: <TreePine className="w-4 h-4" />,
      color: "bg-purple-500"
    },
    { 
      step: 5, 
      name: "EUDR Compliance Check", 
      description: "Verify compliance with EU Deforestation Regulation", 
      icon: <Shield className="w-4 h-4" />,
      color: "bg-red-500"
    },
    { 
      step: 6, 
      name: "Quality Assessment", 
      description: "Assess commodity quality and grade", 
      icon: <BarChart3 className="w-4 h-4" />,
      color: "bg-indigo-500"
    },
    { 
      step: 7, 
      name: "Certification Generation", 
      description: "Generate compliance certificates", 
      icon: <FileText className="w-4 h-4" />,
      color: "bg-cyan-500"
    },
    { 
      step: 8, 
      name: "Harvest Recording", 
      description: "Record harvest data and quantities", 
      icon: <TreePine className="w-4 h-4" />,
      color: "bg-lime-500"
    },
    { 
      step: 9, 
      name: "Transportation Tracking", 
      description: "Track commodity movement to collection points", 
      icon: <Zap className="w-4 h-4" />,
      color: "bg-pink-500"
    },
    { 
      step: 10, 
      name: "Export Preparation", 
      description: "Prepare commodities for export", 
      icon: <Globe className="w-4 h-4" />,
      color: "bg-teal-500"
    },
    { 
      step: 11, 
      name: "Final Inspection", 
      description: "Conduct final pre-export inspection", 
      icon: <CheckCircle className="w-4 h-4" />,
      color: "bg-emerald-500"
    },
    { 
      step: 12, 
      name: "Export Documentation", 
      description: "Generate final export documents", 
      icon: <FileText className="w-4 h-4" />,
      color: "bg-slate-500"
    },
    { 
      step: 13, 
      name: "EUDR Pack Generation", 
      description: "Generate complete EUDR compliance pack", 
      icon: <Shield className="w-4 h-4" />,
      color: "bg-violet-500"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active': case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInitializeMapping = () => {
    initializeMappingMutation.mutate({
      lacraAdminId: "LACRA-ADMIN-001"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            AgriTrace360™ Workflow System
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            LACRA EUDR Compliance Workflow Management - 14-Step Agricultural Traceability Process
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
              <Zap className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.filter(w => w.status === 'active').length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.filter(w => w.status === 'completed').length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.filter(w => w.status === 'pending').length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Compliance</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workflows.length > 0 
                  ? Math.round(workflows.reduce((sum, w) => sum + w.complianceScore, 0) / workflows.length)
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
            <TabsTrigger value="process">Workflow Process</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Initialize Mapping Button */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Initialize new workflows and manage existing processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleInitializeMapping}
                  disabled={initializeMappingMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {initializeMappingMutation.isPending ? "Initializing..." : "Initialize National Mapping Plan"}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Workflows */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Workflows</CardTitle>
                <CardDescription>Latest AgriTrace workflow activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.slice(0, 5).map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(workflow.status)}
                        <div>
                          <p className="font-medium">{workflow.workflowName}</p>
                          <p className="text-sm text-gray-500">Farmer: {workflow.farmerId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">{workflow.completedStages}/{workflow.totalStages} steps</p>
                          <Progress 
                            value={(workflow.completedStages / workflow.totalStages) * 100} 
                            className="w-20"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <div className="grid gap-6">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedWorkflow(workflow)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(workflow.status)}
                          {workflow.workflowName}
                        </CardTitle>
                        <CardDescription>
                          {workflow.workflowType} • Farmer: {workflow.farmerId}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-medium">Progress</p>
                          <p className="text-2xl font-bold">{workflow.completedStages}/{workflow.totalStages}</p>
                        </div>
                        <Progress 
                          value={(workflow.completedStages / workflow.totalStages) * 100} 
                          className="w-32"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Compliance Score</p>
                        <p className="text-2xl font-bold text-green-600">{workflow.complianceScore}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="process" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>LACRA EUDR Compliance - 14-Step Workflow Process</CardTitle>
                <CardDescription>
                  Complete agricultural traceability workflow as specified by LACRA requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowSteps.map((step, index) => (
                    <div key={step.step} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {step.icon}
                          <h3 className="font-semibold">{step.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                      {index < workflowSteps.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Workflow Details Modal/Sidebar could go here */}
        {selectedWorkflow && (
          <Card className="fixed bottom-4 right-4 w-96 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedWorkflow.workflowName}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedWorkflow(null)}>×</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Type:</strong> {selectedWorkflow.workflowType}</p>
                <p><strong>Status:</strong> {selectedWorkflow.status}</p>
                <p><strong>Current Stage:</strong> {selectedWorkflow.currentStage}</p>
                <p><strong>Progress:</strong> {selectedWorkflow.completedStages}/{selectedWorkflow.totalStages} steps</p>
                <p><strong>Compliance:</strong> {selectedWorkflow.complianceScore}%</p>
                {selectedWorkflow.assignedInspector && (
                  <p><strong>Inspector:</strong> {selectedWorkflow.assignedInspector}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}