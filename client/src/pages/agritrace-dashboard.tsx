import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function AgriTraceDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AgriTrace360™ Dashboard</h1>
              <p className="text-gray-600">Agricultural Traceability & Compliance Management</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              System Active
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              <Globe className="w-3 h-3 mr-1" />
              EUDR Compliant
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Farms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">1,247</div>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Inspections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">89</div>
              <p className="text-xs text-blue-600 mt-1">Completed this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Compliance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">96.3%</div>
              <p className="text-xs text-green-600 mt-1">Excellent rating</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Batch Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">342</div>
              <p className="text-xs text-blue-600 mt-1">Generated today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workflow Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                AgriTrace Workflows
              </CardTitle>
              <CardDescription>Current agricultural traceability processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Farm Registration</p>
                      <p className="text-sm text-gray-600">234 farms registered</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Land Mapping</p>
                      <p className="text-sm text-gray-600">156 plots mapped</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Quality Inspections</p>
                      <p className="text-sm text-gray-600">23 pending reviews</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                System Management
              </CardTitle>
              <CardDescription>AgriTrace360™ administrative controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Inspectors
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Farm Locations
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Reports
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  System Settings
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            AgriTrace360™ - LACRA Agricultural Traceability System
          </p>
        </div>
      </div>
    </div>
  );
}