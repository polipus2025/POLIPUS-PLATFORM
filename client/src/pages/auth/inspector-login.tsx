import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, MapPin, Ship, Warehouse, ArrowRight, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function InspectorLogin() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-slate-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">LACRA Inspector Portal</h1>
          <p className="text-slate-700 text-lg">Field Operations Access System</p>
          <p className="text-slate-600 text-sm mt-2">Liberia Agriculture Commodity Regulatory Authority</p>
        </div>

        {/* Inspector Access Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Land Inspector Portal */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group" 
                onClick={() => navigate('/land-inspector-login')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                Land Inspector
              </CardTitle>
              <CardDescription className="text-slate-600">
                Agricultural Land & GPS Mapping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-green-500 text-green-600 bg-green-50">
                Field Operations Access
              </Badge>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• GPS mapping and land verification</li>
                <li>• Farm plot inspections</li>
                <li>• Agricultural compliance monitoring</li>
                <li>• Field data collection</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/land-inspector-login'); }}
              >
                Access Land Inspector Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Port Inspector Portal */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group"
                onClick={() => navigate('/port-inspector-login')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Ship className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <Ship className="w-5 h-5" />
                Port Inspector
              </CardTitle>
              <CardDescription className="text-slate-600">
                Maritime & Export Operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-blue-500 text-blue-600 bg-blue-50">
                Port Operations Access
              </Badge>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Export cargo inspections</li>
                <li>• Port facility compliance</li>
                <li>• Maritime documentation</li>
                <li>• Shipping quality control</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/port-inspector-login'); }}
              >
                Access Port Inspector Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Warehouse Inspector Portal */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group"
                onClick={() => navigate('/warehouse-inspector-login')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Warehouse className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <Warehouse className="w-5 h-5" />
                Warehouse Inspector
              </CardTitle>
              <CardDescription className="text-slate-600">
                Storage & Quality Control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-purple-500 text-purple-600 bg-purple-50">
                Storage Operations Access
              </Badge>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Storage facility compliance</li>
                <li>• Inventory quality control</li>
                <li>• Temperature monitoring</li>
                <li>• Regulatory documentation</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/warehouse-inspector-login'); }}
              >
                Access Warehouse Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="bg-white shadow-lg border border-slate-200 rounded-lg p-6 text-center">
          <Shield className="w-8 h-8 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure Inspector Access Portal</h3>
          <p className="text-slate-600 text-sm mb-4">
            Each inspector portal provides specialized access controls and field operation tools. 
            All sessions are secured with JWT authentication and comprehensive audit logging.
          </p>
          <div className="flex justify-center space-x-6 text-xs text-slate-500">
            <span>✓ Field Device Authentication</span>
            <span>✓ GPS Location Verification</span>
            <span>✓ Real-time Data Sync</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>AgriTrace360™ Inspector Field Operations Portal System</p>
          <p className="text-xs mt-1">Authorized Inspector Personnel Only • All Access Attempts are Logged</p>
        </div>
      </div>
    </div>
  );
}