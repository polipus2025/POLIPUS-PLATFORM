import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Settings, 
  Users, 
  FileText, 
  BarChart3,
  TreePine,
  Globe,
  AlertTriangle,
  CheckCircle,
  Activity
} from "lucide-react";

export default function AgriTraceAdminPortal() {
  const [isLoading, setIsLoading] = useState(false);

  const userInfo = {
    username: "agritrace.admin",
    scope: "AgriTrace360™ Administrator"
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AgriTrace360™ Admin Portal</h1>
                <p className="text-sm text-gray-600">Standalone System Administrator</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{userInfo.username}</p>
                <p className="text-xs text-gray-600">{userInfo.scope}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">Limited Administrative Scope</h3>
              <p className="text-sm text-yellow-700">
                This portal provides administrative access only to AgriTrace360™ agricultural traceability functions. 
                Access to other Polipus platform modules is restricted.
              </p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">Online</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">AgriTrace360™ v2.1.0</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">342</div>
              <p className="text-sm text-gray-600">Farmers & Inspectors</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Module Scope
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-800">Agricultural Only</Badge>
              <p className="text-sm text-gray-600 mt-1">Limited to AgriTrace</p>
            </CardContent>
          </Card>
        </div>

        {/* Administration Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                AgriTrace Controls
              </CardTitle>
              <CardDescription>Agricultural traceability system management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Farm Inspectors
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Review Compliance Reports
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Agricultural Analytics
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  System Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Access Restrictions
              </CardTitle>
              <CardDescription>Current administrative limitations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-medium text-red-800">Platform-Wide Controls</p>
                  <p className="text-sm text-red-600">Access denied to Polipus platform administration</p>
                </div>
                
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-medium text-red-800">Other Modules</p>
                  <p className="text-sm text-red-600">No access to Land Map360, Mine Watch, etc.</p>
                </div>
                
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-medium text-red-800">Cross-Module Data</p>
                  <p className="text-sm text-red-600">Limited to agricultural data only</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-medium text-green-800">AgriTrace360™ Full Access</p>
                  <p className="text-sm text-green-600">Complete control within agricultural scope</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            AgriTrace360™ Standalone Administrator Portal - Limited Scope Access
          </p>
          <p className="text-xs text-gray-500 mt-1">
            LACRA - Liberia Agriculture Commodity Regulatory Authority
          </p>
        </div>
      </div>
    </div>
  );
}