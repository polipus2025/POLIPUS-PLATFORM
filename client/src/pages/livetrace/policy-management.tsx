import { Helmet } from "react-helmet";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter
} from "lucide-react";
import LiveTraceSidebar from "../../components/livetrace/live-trace-sidebar";
import LiveTraceHeader from "../../components/livetrace/live-trace-header";

export default function PolicyManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const policies = [
    {
      id: "LT-POL-001",
      title: "Livestock Health Monitoring Standards",
      category: "Health & Safety",
      status: "active",
      priority: "high",
      lastUpdated: "2025-01-05",
      updatedBy: "Dr. Sarah Johnson",
      description: "Comprehensive guidelines for regular health monitoring of livestock including vaccination schedules, health checks, and disease prevention protocols.",
      version: "2.1"
    },
    {
      id: "LT-POL-002", 
      title: "Transport Safety Regulations",
      category: "Transportation",
      status: "active",
      priority: "high",
      lastUpdated: "2025-01-03",
      updatedBy: "Michael Chen",
      description: "Safety protocols for livestock transportation including vehicle requirements, driver certification, and animal welfare standards during transit.",
      version: "1.8"
    },
    {
      id: "LT-POL-003",
      title: "Farm Registration Requirements",
      category: "Registration",
      status: "active", 
      priority: "medium",
      lastUpdated: "2024-12-28",
      updatedBy: "Emma Rodriguez",
      description: "Standard operating procedures for farm registration including documentation requirements, inspection processes, and compliance verification.",
      version: "3.0"
    },
    {
      id: "LT-POL-004",
      title: "Emergency Response Protocols",
      category: "Emergency",
      status: "review",
      priority: "critical",
      lastUpdated: "2024-12-20",
      updatedBy: "Dr. James Wilson",
      description: "Emergency response procedures for disease outbreaks, natural disasters, and other critical incidents affecting livestock operations.",
      version: "1.5"
    },
    {
      id: "LT-POL-005",
      title: "Data Privacy and Security Guidelines",
      category: "Security",
      status: "draft",
      priority: "high",
      lastUpdated: "2024-12-15",
      updatedBy: "Lisa Park",
      description: "Data protection policies ensuring farmer privacy and secure handling of sensitive livestock and farm operation information.",
      version: "1.0"
    },
    {
      id: "LT-POL-006",
      title: "Inter-agency Cooperation Framework",
      category: "Coordination",
      status: "active",
      priority: "medium",
      lastUpdated: "2024-12-10",
      updatedBy: "Robert Kim",
      description: "Guidelines for cooperation between LiveTrace and other government agencies, NGOs, and international organizations.",
      version: "2.3"
    }
  ];

  const categories = ["all", "Health & Safety", "Transportation", "Registration", "Emergency", "Security", "Coordination"];

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         policy.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || policy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "review":
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case "medium":
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Helmet>
        <title>Policy Management - LiveTrace Livestock Monitoring System</title>
        <meta name="description" content="Manage policies and regulations for LiveTrace livestock monitoring platform" />
      </Helmet>

      <LiveTraceHeader />
      
      <div className="flex">
        <LiveTraceSidebar />
        
        <main className="flex-1 ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-center lg:text-left">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 justify-center lg:justify-start">
                  <Settings className="h-8 w-8 text-blue-600" />
                  Policy Management
                </h1>
                <p className="text-gray-600 mt-1">Manage system policies, regulations, and operational guidelines</p>
              </div>
              
              <div className="flex items-center justify-center lg:justify-end gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Policy
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search policies by title, ID, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policy Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Active Policies</CardTitle>
                  <CheckCircle className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{policies.filter(p => p.status === 'active').length}</div>
                  <p className="text-xs opacity-80 mt-1">Currently enforced</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Under Review</CardTitle>
                  <Clock className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{policies.filter(p => p.status === 'review').length}</div>
                  <p className="text-xs opacity-80 mt-1">Pending approval</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Draft Policies</CardTitle>
                  <FileText className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{policies.filter(p => p.status === 'draft').length}</div>
                  <p className="text-xs opacity-80 mt-1">In development</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Critical Priority</CardTitle>
                  <AlertTriangle className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{policies.filter(p => p.priority === 'critical').length}</div>
                  <p className="text-xs opacity-80 mt-1">Requires attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Policies List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Policy Registry ({filteredPolicies.length} policies)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPolicies.map((policy) => (
                    <div key={policy.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{policy.title}</h3>
                            {getStatusBadge(policy.status)}
                            {getPriorityBadge(policy.priority)}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">{policy.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              ID: {policy.id}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Updated: {policy.lastUpdated}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              By: {policy.updatedBy}
                            </span>
                            <span>Version: {policy.version}</span>
                            <span>Category: {policy.category}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Plus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Create New Policy</h3>
                  <p className="text-gray-600 text-sm">Draft a new policy document with templates and guidelines</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Policy Templates</h3>
                  <p className="text-gray-600 text-sm">Access standardized templates for common policy types</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Policy Settings</h3>
                  <p className="text-gray-600 text-sm">Configure approval workflows and notification settings</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}