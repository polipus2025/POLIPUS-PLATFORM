import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "wouter";
import {
  Ship,
  Package,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  LogOut,
  Download,
  Upload,
  BarChart3,
  MapPin,
  Calendar,
  User,
  Globe,
  DollarSign,
  Truck,
  Building,
  Phone,
  Mail
} from "lucide-react";

interface ExporterSession {
  exporter: {
    id: number;
    exporterId: string;
    companyName: string;
    contactPerson: string;
    complianceStatus: string;
  };
  mustChangePassword: boolean;
}

export default function ExporterPortal() {
  const [, navigate] = useNavigate();
  const { toast } = useToast();
  
  // Get current session
  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery<ExporterSession>({
    queryKey: ['/api/auth/exporter/session'],
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/auth/exporter/logout');
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/login?portal=exporter');
    },
  });

  // Redirect to login if not authenticated
  if (sessionError || (!sessionLoading && !session)) {
    navigate('/login?portal=exporter');
    return null;
  }

  // Redirect if password change is required
  if (session?.mustChangePassword) {
    navigate('/login?portal=exporter');
    return null;
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Ship className="h-6 w-6 animate-pulse text-blue-600" />
          <span>Loading your portal...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const { exporter } = session;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Ship className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Exporter Portal</h1>
                  <p className="text-sm text-slate-600">LACRA Export Management System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">{exporter.contactPerson}</p>
                <p className="text-xs text-slate-600">{exporter.companyName}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Welcome back, {exporter.contactPerson}
          </h2>
          <p className="text-slate-600 mt-2">
            Manage your export operations and compliance status from your dashboard
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8 border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Account Status</h3>
                <p className="text-slate-600">Your exporter account is active and approved</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <Badge className="bg-green-100 text-green-800">
                  {exporter.complianceStatus.charAt(0).toUpperCase() + exporter.complianceStatus.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Active Orders</p>
                  <p className="text-3xl font-bold text-slate-800" data-testid="metric-active-orders">12</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Pending Permits</p>
                  <p className="text-3xl font-bold text-slate-800" data-testid="metric-pending-permits">3</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-slate-800" data-testid="metric-monthly-revenue">$24.5K</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Compliance Score</p>
                  <p className="text-3xl font-bold text-slate-800" data-testid="metric-compliance-score">98%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" data-testid="tab-dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">Export Orders</TabsTrigger>
            <TabsTrigger value="permits" data-testid="tab-permits">Permits</TabsTrigger>
            <TabsTrigger value="compliance" data-testid="tab-compliance">Compliance</TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Recent Export Orders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "EO-2025-001", commodity: "Coffee Beans", status: "In Transit", date: "2025-01-15" },
                      { id: "EO-2025-002", commodity: "Cocoa", status: "Processing", date: "2025-01-12" },
                      { id: "EO-2025-003", commodity: "Palm Oil", status: "Delivered", date: "2025-01-08" }
                    ].map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-800">{order.id}</p>
                          <p className="text-sm text-slate-600">{order.commodity}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {order.status}
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">{order.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Compliance Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { item: "EUDR Documentation", status: "Complete", icon: CheckCircle, color: "text-green-600" },
                      { item: "Export Licenses", status: "Valid", icon: CheckCircle, color: "text-green-600" },
                      { item: "Quality Certificates", status: "Pending", icon: Clock, color: "text-yellow-600" },
                      { item: "Traceability Records", status: "Complete", icon: CheckCircle, color: "text-green-600" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                          <span className="font-medium text-slate-800">{item.item}</span>
                        </div>
                        <Badge 
                          className={
                            item.status === 'Complete' || item.status === 'Valid' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Export Order Management</CardTitle>
                  <Button data-testid="button-new-order">
                    <Package className="h-4 w-4 mr-2" />
                    New Order
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Export order management features will be available soon.</p>
                  <p className="text-sm text-slate-500 mt-2">Contact LACRA support for immediate order assistance.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permits" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Export Permits & Licenses</CardTitle>
                  <Button data-testid="button-new-permit">
                    <FileText className="h-4 w-4 mr-2" />
                    Apply for Permit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Permit management system is being finalized.</p>
                  <p className="text-sm text-slate-500 mt-2">Submit permit applications through LACRA regulatory staff.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>EUDR & Compliance Monitoring</CardTitle>
                <CardDescription>
                  Monitor your compliance status and documentation requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-800">EUDR Compliant</p>
                    <p className="text-sm text-slate-600">All requirements met</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-800">98% Score</p>
                    <p className="text-sm text-slate-600">Compliance rating</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-800">3 Pending</p>
                    <p className="text-sm text-slate-600">Document reviews</p>
                  </div>
                </div>
                
                <div className="text-center py-4">
                  <p className="text-slate-600">Detailed compliance reporting tools coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>
                  View and manage your exporter profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-800">Company Name</p>
                        <p className="text-slate-600">{exporter.companyName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-800">Contact Person</p>
                        <p className="text-slate-600">{exporter.contactPerson}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-800">Exporter ID</p>
                        <p className="text-slate-600 font-mono">{exporter.exporterId}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-800">Status</p>
                        <Badge className="bg-green-100 text-green-800">
                          {exporter.complianceStatus.charAt(0).toUpperCase() + exporter.complianceStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline" className="w-full" data-testid="button-edit-profile">
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile (Coming Soon)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}