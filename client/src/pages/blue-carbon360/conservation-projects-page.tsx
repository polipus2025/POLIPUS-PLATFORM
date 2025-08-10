import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  TreePine,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Target,
  Award,
  Plus,
  Eye,
  BarChart3,
  Leaf,
  Waves,
  Clock,
  CheckCircle,
  AlertCircle,
  Play
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConservationProjectsPage() {
  // Fetch conservation projects data
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/conservation-projects"],
  });

  // Mock projects data for demonstration
  const conservationProjects = [
    {
      id: 1,
      name: "Monrovia Mangrove Restoration",
      type: "Mangrove Restoration",
      location: "Montserrado County",
      status: "active",
      progress: 75,
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      budget: 125000,
      spent: 93750,
      carbonCredits: 2340,
      areaSize: 450,
      teamSize: 12,
      beneficiaries: 8500,
      description: "Large-scale mangrove restoration project protecting coastal communities from erosion and storm surge while creating carbon sequestration opportunities."
    },
    {
      id: 2,
      name: "Grand Bassa Seagrass Conservation",
      type: "Seagrass Protection",
      location: "Grand Bassa County",
      status: "active",
      progress: 60,
      startDate: "2024-02-01",
      endDate: "2025-01-31",
      budget: 89000,
      spent: 53400,
      carbonCredits: 1890,
      areaSize: 320,
      teamSize: 8,
      beneficiaries: 6200,
      description: "Comprehensive seagrass bed protection and restoration initiative supporting marine biodiversity and local fishing communities."
    },
    {
      id: 3,
      name: "Sinoe Salt Marsh Rehabilitation",
      type: "Salt Marsh Restoration",
      location: "Sinoe County",
      status: "planning",
      progress: 25,
      startDate: "2024-04-01",
      endDate: "2025-03-31",
      budget: 67000,
      spent: 16750,
      carbonCredits: 1450,
      areaSize: 280,
      teamSize: 6,
      beneficiaries: 4800,
      description: "Salt marsh rehabilitation project focusing on ecosystem restoration and community-based conservation practices."
    },
    {
      id: 4,
      name: "River Cess Blue Carbon Initiative",
      type: "Mixed Ecosystem",
      location: "River Cess County",
      status: "completed",
      progress: 100,
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      budget: 156000,
      spent: 152000,
      carbonCredits: 3200,
      areaSize: 680,
      teamSize: 15,
      beneficiaries: 12000,
      description: "Comprehensive blue carbon ecosystem restoration covering mangroves, seagrass beds, and salt marshes with community engagement."
    }
  ];

  const projectStats = [
    {
      title: 'Active Projects',
      value: conservationProjects.filter(p => p.status === 'active').length,
      icon: Play,
      color: 'bg-green-500',
      change: '+2 new'
    },
    {
      title: 'Total Area Protected',
      value: conservationProjects.reduce((sum, p) => sum + p.areaSize, 0),
      unit: 'hectares',
      icon: MapPin,
      color: 'bg-cyan-500',
      change: '+15%'
    },
    {
      title: 'Carbon Credits Generated',
      value: conservationProjects.reduce((sum, p) => sum + p.carbonCredits, 0),
      unit: 'tonnes CO2',
      icon: Leaf,
      color: 'bg-emerald-500',
      change: '+22%'
    },
    {
      title: 'Communities Benefiting',
      value: conservationProjects.reduce((sum, p) => sum + p.beneficiaries, 0),
      unit: 'people',
      icon: Users,
      color: 'bg-blue-500',
      change: '+18%'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Play;
      case 'planning': return Clock;
      case 'completed': return CheckCircle;
      case 'paused': return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Conservation Projects - Blue Carbon 360</title>
        <meta name="description" content="Marine conservation projects and blue carbon initiatives" />
      </Helmet>

      <BlueCarbon360Header />
      <div className="flex">
        <BlueCarbon360Sidebar />
        
        <main className="flex-1 lg:ml-64">
          <ScrollArea className="h-screen">
            <div className="p-6 pb-20">
              
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <TreePine className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">Conservation Projects</h1>
                      <p className="text-slate-600">Blue carbon ecosystem restoration and protection initiatives</p>
                    </div>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  {conservationProjects.filter(p => p.status === 'active').length} Active Projects
                </Badge>
              </div>

              {/* Project Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {projectStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                            <p className="text-3xl font-bold text-slate-900">
                              {stat.value.toLocaleString()}
                            </p>
                            {stat.unit && <p className="text-sm text-slate-500">{stat.unit}</p>}
                            <p className="text-sm text-green-600 font-medium mt-1">{stat.change}</p>
                          </div>
                          <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {conservationProjects.map((project) => {
                  const StatusIcon = getStatusIcon(project.status);
                  return (
                    <Card key={project.id} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{project.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TreePine className="h-4 w-4" />
                                <span>{project.type}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(project.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 mb-4 text-sm">{project.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-slate-600 mb-2">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Project Metrics */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-900">{project.areaSize}</p>
                            <p className="text-xs text-slate-600">Hectares</p>
                          </div>
                          <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-900">{project.carbonCredits.toLocaleString()}</p>
                            <p className="text-xs text-slate-600">Carbon Credits</p>
                          </div>
                          <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-900">{project.teamSize}</p>
                            <p className="text-xs text-slate-600">Team Size</p>
                          </div>
                          <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-900">{project.beneficiaries.toLocaleString()}</p>
                            <p className="text-xs text-slate-600">Beneficiaries</p>
                          </div>
                        </div>

                        {/* Budget Information */}
                        <div className="flex justify-between items-center text-sm text-slate-600 mb-4">
                          <span>Budget: ${project.budget.toLocaleString()}</span>
                          <span>Spent: ${project.spent.toLocaleString()}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Reports
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span>Project Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="h-16 bg-green-600 hover:bg-green-700 text-white">
                      <Plus className="h-5 w-5 mr-2" />
                      Create New Project
                    </Button>
                    <Button variant="outline" className="h-16">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Generate Reports
                    </Button>
                    <Button variant="outline" className="h-16">
                      <Award className="h-5 w-5 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}