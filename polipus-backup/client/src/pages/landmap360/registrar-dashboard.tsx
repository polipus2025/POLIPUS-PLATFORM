import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Shield, 
  Search, 
  Award,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  Building,
  Plus,
  Eye,
  Download,
  Stamp,
  Folder,
  Database
} from "lucide-react";
import LandMapSidebar from "../../components/landmap360/landmap-sidebar";
import LandMapHeader from "../../components/landmap360/landmap-header";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function RegistrarDashboard() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("month");

  // Get user info from localStorage
  const userName = localStorage.getItem("userName");
  const county = localStorage.getItem("county");

  // Mock data for registrar dashboard
  const dashboardStats = {
    totalRegistrations: 12634,
    pendingRegistrations: 158,
    completedToday: 23,
    averageProcessingTime: 5.2,
    titlesIssued: 8934,
    verificationsCompleted: 456,
    documentsProcessed: 1247,
    searchRequests: 89
  };

  const pendingRegistrations = [
    {
      id: "REG-001",
      parcelId: "LM-2025-001",
      applicant: "Moses Tuah",
      location: "Montserrado County - Paynesville",
      area: "2.45 hectares",
      submissionDate: "2025-01-05",
      status: "document_review",
      priority: "high",
      documents: ["Deed", "Survey Plan", "Tax Receipt", "ID Copy"],
      registrationType: "First Registration",
      fees: "LRD 2,500",
      daysInQueue: 3
    },
    {
      id: "REG-002",
      parcelId: "LM-2025-002",
      applicant: "Grace Johnson",
      location: "Bong County - Gbarnga",
      area: "1.87 hectares",
      submissionDate: "2025-01-04",
      status: "verification_pending",
      priority: "medium",
      documents: ["Transfer Deed", "Survey Plan", "Court Order"],
      registrationType: "Transfer of Title",
      fees: "LRD 1,800",
      daysInQueue: 4
    },
    {
      id: "REG-003",
      parcelId: "LM-2025-003",
      applicant: "Emmanuel Doe",
      location: "Margibi County - Kakata",
      area: "5.12 hectares",
      submissionDate: "2025-01-03",
      status: "ready_for_title",
      priority: "high",
      documents: ["Deed", "Survey Plan", "Tax Clearance", "Affidavit"],
      registrationType: "Subdivision",
      fees: "LRD 3,200",
      daysInQueue: 5
    }
  ];

  const recentTitles = [
    {
      id: "TITLE-345",
      parcelId: "LM-2024-987",
      owner: "Samuel Roberts",
      location: "Nimba County",
      area: "2.3 hectares",
      issueDate: "2025-01-05",
      titleType: "Fee Simple",
      registrationNumber: "MLS-2025-0345"
    },
    {
      id: "TITLE-344", 
      parcelId: "LM-2024-986",
      owner: "Mary Wilson",
      location: "Bong County",
      area: "1.5 hectares",
      issueDate: "2025-01-04",
      titleType: "Leasehold",
      registrationNumber: "MLS-2025-0344"
    }
  ];

  const verificationQueue = [
    {
      id: "VER-001",
      requestType: "Title Verification",
      requestor: "Bank of Liberia",
      parcelId: "LM-2024-567",
      owner: "David Kpehe",
      purpose: "Mortgage Application",
      submittedDate: "2025-01-06",
      status: "in_progress",
      priority: "urgent"
    },
    {
      id: "VER-002",
      requestType: "Ownership Verification", 
      requestor: "Ministry of Finance",
      parcelId: "LM-2023-234",
      owner: "Sarah Johnson",
      purpose: "Tax Assessment",
      submittedDate: "2025-01-05",
      status: "pending",
      priority: "normal"
    }
  ];

  const documentSearch = [
    {
      id: "SEARCH-001",
      requestor: "John Mensah",
      searchType: "Owner Name Search",
      searchTerm: "Wilson",
      results: 12,
      requestDate: "2025-01-06",
      status: "completed",
      fee: "LRD 100"
    },
    {
      id: "SEARCH-002",
      requestor: "Legal Aid Bureau",
      searchType: "Parcel History Search",
      searchTerm: "LM-2023-445",
      results: 8,
      requestDate: "2025-01-05", 
      status: "in_progress",
      fee: "LRD 150"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'document_review': return 'text-orange-600';
      case 'verification_pending': return 'text-blue-600';
      case 'ready_for_title': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'document_review': return 'bg-orange-100 text-orange-800';
      case 'verification_pending': return 'bg-blue-100 text-blue-800';
      case 'ready_for_title': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'normal': case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Registrar Dashboard - LandMap360 Land Management</title>
        <meta name="description" content="Land registrar dashboard for title registration, document verification, and property searches" />
      </Helmet>

      <LandMapHeader />

      <div className="flex">
        <LandMapSidebar />
        
        {/* Main Content */}
        <div className="flex-1 ml-64" style={{ paddingTop: '0px' }}>
          <div className="p-6">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Land Registrar Dashboard
                  </h1>
                  <p className="text-slate-600 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Title Registration & Document Verification
                    {county && ` • ${county}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter Applications" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="ready">Ready for Title</SelectItem>
                      <SelectItem value="urgent">Urgent Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Registration
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="registrations" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="registrations">Registrations</TabsTrigger>
                <TabsTrigger value="titles">Title Issuance</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
                <TabsTrigger value="search">Property Search</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="registrations" className="space-y-6">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-emerald-900">
                        Total Registrations
                      </CardTitle>
                      <FileText className="h-5 w-5 text-emerald-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-emerald-900">
                        {dashboardStats.totalRegistrations.toLocaleString()}
                      </div>
                      <p className="text-xs text-emerald-700 mt-1">
                        All time registrations
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-orange-900">
                        Pending Review
                      </CardTitle>
                      <Clock className="h-5 w-5 text-orange-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-900">
                        {dashboardStats.pendingRegistrations}
                      </div>
                      <p className="text-xs text-orange-700 mt-1">
                        Awaiting registrar action
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-900">
                        Completed Today
                      </CardTitle>
                      <CheckCircle className="h-5 w-5 text-blue-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-900">
                        {dashboardStats.completedToday}
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        Registrations completed
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-purple-900">
                        Avg. Processing Time
                      </CardTitle>
                      <Calendar className="h-5 w-5 text-purple-700" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-900">
                        {dashboardStats.averageProcessingTime} days
                      </div>
                      <p className="text-xs text-purple-700 mt-1">
                        Current average
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Pending Registrations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      Pending Land Registrations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingRegistrations.map((registration) => (
                        <div key={registration.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-slate-900">{registration.id}</h3>
                                <Badge className={getStatusBadge(registration.status)}>
                                  {registration.status.replace('_', ' ')}
                                </Badge>
                                <Badge className={getPriorityColor(registration.priority)}>
                                  {registration.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 flex items-center gap-1 mb-1">
                                <MapPin className="h-3 w-3" />
                                {registration.location}
                              </p>
                              <p className="text-sm text-slate-600">
                                Applicant: {registration.applicant} • Area: {registration.area}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-900">{registration.fees}</p>
                              <p className="text-xs text-slate-600">{registration.daysInQueue} days in queue</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600 mb-3">
                            <div>
                              <span className="text-slate-500">Type:</span>
                              <p>{registration.registrationType}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Parcel ID:</span>
                              <p>{registration.parcelId}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Submitted:</span>
                              <p>{registration.submissionDate}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Documents:</span>
                              <p>{registration.documents.length} attached</p>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-xs text-slate-500 mb-1">Required Documents:</p>
                            <div className="flex flex-wrap gap-1">
                              {registration.documents.map((doc, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                              <Eye className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                            <Button size="sm" variant="outline">
                              <Folder className="h-3 w-3 mr-1" />
                              Documents
                            </Button>
                            {registration.status === 'ready_for_title' && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Award className="h-3 w-3 mr-1" />
                                Issue Title
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="titles" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      Recent Title Issuance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTitles.map((title) => (
                        <div key={title.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-slate-900">{title.id}</h3>
                              <Badge className="bg-blue-100 text-blue-800">
                                {title.titleType}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Print
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
                            <div>
                              <span className="text-slate-500">Owner:</span>
                              <p>{title.owner}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Location:</span>
                              <p>{title.location}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Area:</span>
                              <p>{title.area}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Registration #:</span>
                              <p>{title.registrationNumber}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-600" />
                      Document Verification Queue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {verificationQueue.map((verification) => (
                        <div key={verification.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-slate-900">{verification.id}</h3>
                              <Badge className={getStatusBadge(verification.status)}>
                                {verification.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(verification.priority)}>
                                {verification.priority}
                              </Badge>
                            </div>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              <Shield className="h-3 w-3 mr-1" />
                              Verify
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
                            <div>
                              <span className="text-slate-500">Type:</span>
                              <p>{verification.requestType}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Requestor:</span>
                              <p>{verification.requestor}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Owner:</span>
                              <p>{verification.owner}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Purpose:</span>
                              <p>{verification.purpose}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="search" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Search className="h-5 w-5 text-green-600" />
                      Property Search Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {documentSearch.map((search) => (
                        <div key={search.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-slate-900">{search.id}</h3>
                              <Badge className={getStatusBadge(search.status)}>
                                {search.status}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{search.fee}</p>
                              <p className="text-xs text-slate-600">{search.results} results</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
                            <div>
                              <span className="text-slate-500">Requestor:</span>
                              <p>{search.requestor}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Search Type:</span>
                              <p>{search.searchType}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Search Term:</span>
                              <p>{search.searchTerm}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Request Date:</span>
                              <p>{search.requestDate}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Database className="h-5 w-5 text-indigo-600" />
                      Registration Analytics & Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      Comprehensive analytics on registration trends, processing times, and performance metrics
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-blue-200">
                        <CardContent className="p-4">
                          <p className="text-sm text-slate-600 mb-1">Titles Issued</p>
                          <p className="text-2xl font-bold text-blue-900">{dashboardStats.titlesIssued.toLocaleString()}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-purple-200">
                        <CardContent className="p-4">
                          <p className="text-sm text-slate-600 mb-1">Verifications</p>
                          <p className="text-2xl font-bold text-purple-900">{dashboardStats.verificationsCompleted}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-green-200">
                        <CardContent className="p-4">
                          <p className="text-sm text-slate-600 mb-1">Search Requests</p>
                          <p className="text-2xl font-bold text-green-900">{dashboardStats.searchRequests}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}