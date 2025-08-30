import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, MapPin, Ship, Warehouse, ArrowRight, CheckCircle, ArrowLeft, User, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function InspectorLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [landCredentials, setLandCredentials] = useState({ username: "", password: "" });
  const [portCredentials, setPortCredentials] = useState({ username: "", password: "" });
  const [warehouseCredentials, setWarehouseCredentials] = useState({ username: "", password: "" });
  const [loadingStates, setLoadingStates] = useState({ land: false, port: false, warehouse: false });

  const handleLogin = async (type: 'land' | 'port' | 'warehouse', credentials: {username: string, password: string}) => {
    setLoadingStates(prev => ({ ...prev, [type]: true }));
    
    try {
      // Fix endpoint URL mapping for different inspector types
      const endpointMap = {
        'warehouse': '/api/auth/warehouse-inspector/login',
        'port': '/api/auth/port-inspector-login', 
        'land': '/api/auth/land-inspector-login'
      };
      
      const response = await fetch(endpointMap[type] || `/api/auth/${type}-inspector-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userType", `${type}_inspector`);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        
        toast({
          title: "Login Successful",
          description: `Welcome ${data.username}!`,
        });
        
        // Navigate to correct dashboard routes
        const dashboardRoute = type === 'land' ? '/unified-land-inspector-dashboard' : `/${type}-inspector-dashboard`;
        navigate(dashboardRoute);
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Connection failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Back to Platform Button */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Polipus Platform
          </Button>
        </Link>
      </div>
      
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
          {/* Land Inspector Login */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
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
              
              {/* Login Form */}
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="land-username" className="text-sm font-medium">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="land-username"
                      type="text"
                      placeholder="Enter username"
                      value={landCredentials.username}
                      onChange={(e) => setLandCredentials(prev => ({ ...prev, username: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="land-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="land-password"
                      type="password"
                      placeholder="Enter password"
                      value={landCredentials.password}
                      onChange={(e) => setLandCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  onClick={() => handleLogin('land', landCredentials)}
                  disabled={loadingStates.land || !landCredentials.username || !landCredentials.password}
                >
                  {loadingStates.land ? "Logging in..." : "Access Land Inspector Portal"}
                  {!loadingStates.land && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Port Inspector Login */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
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
              
              {/* Login Form */}
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="port-username" className="text-sm font-medium">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="port-username"
                      type="text"
                      placeholder="Enter username"
                      value={portCredentials.username}
                      onChange={(e) => setPortCredentials(prev => ({ ...prev, username: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="port-password"
                      type="password"
                      placeholder="Enter password"
                      value={portCredentials.password}
                      onChange={(e) => setPortCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  onClick={() => handleLogin('port', portCredentials)}
                  disabled={loadingStates.port || !portCredentials.username || !portCredentials.password}
                >
                  {loadingStates.port ? "Logging in..." : "Access Port Inspector Portal"}
                  {!loadingStates.port && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Warehouse Inspector Login */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
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
              
              {/* Login Form */}
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="warehouse-username" className="text-sm font-medium">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="warehouse-username"
                      type="text"
                      placeholder="Enter username"
                      value={warehouseCredentials.username}
                      onChange={(e) => setWarehouseCredentials(prev => ({ ...prev, username: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warehouse-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="warehouse-password"
                      type="password"
                      placeholder="Enter password"
                      value={warehouseCredentials.password}
                      onChange={(e) => setWarehouseCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  onClick={() => handleLogin('warehouse', warehouseCredentials)}
                  disabled={loadingStates.warehouse || !warehouseCredentials.username || !warehouseCredentials.password}
                >
                  {loadingStates.warehouse ? "Logging in..." : "Access Warehouse Portal"}
                  {!loadingStates.warehouse && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
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