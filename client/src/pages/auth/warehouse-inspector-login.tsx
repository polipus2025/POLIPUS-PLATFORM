import React, { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Warehouse, 
  Shield, 
  ClipboardCheck, 
  Package, 
  Truck, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Eye,
  BarChart3
} from "lucide-react";

export default function WarehouseInspectorLogin() {
  const [, setLocation] = useLocation();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    warehouseFacility: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/warehouse-inspector/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store inspector data in localStorage
        localStorage.setItem("warehouseInspectorData", JSON.stringify({
          ...data,
          warehouseFacility: credentials.warehouseFacility,
          loginTime: new Date().toISOString()
        }));

        toast({ 
          title: "Login Successful", 
          description: `Welcome to ${credentials.warehouseFacility} Warehouse Portal` 
        });
        
        setLocation("/warehouse-inspector-dashboard");
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({ 
        title: "Login Failed", 
        description: "Invalid credentials. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const warehouseFacilities = [
    "Monrovia Central Warehouse",
    "Freeport Commodity Storage",
    "Buchanan Export Warehouse", 
    "Harper Storage Facility",
    "Greenville Warehouse Complex",
    "Roberts International Storage"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Warehouse className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Warehouse Inspector Portal
          </CardTitle>
          <CardDescription className="text-gray-600">
            LACRA Warehouse Regulatory & Compliance Division
          </CardDescription>
          <Badge className="bg-blue-100 text-blue-800 mx-auto mt-2">
            <Shield className="w-3 h-3 mr-1" />
            Authorized Personnel Only
          </Badge>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="warehouse-facility">Warehouse Facility</Label>
              <select
                id="warehouse-facility"
                className="w-full p-2 border rounded-md"
                value={credentials.warehouseFacility}
                onChange={(e) => setCredentials({...credentials, warehouseFacility: e.target.value})}
                required
              >
                <option value="">Select Facility</option>
                {warehouseFacilities.map((facility) => (
                  <option key={facility} value={facility}>{facility}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Inspector ID</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter Inspector ID"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
                data-testid="input-username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Security Code</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Security Code"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                data-testid="input-password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? "Authenticating..." : "Access Warehouse Portal"}
            </Button>
          </form>

          {/* Inspection Capabilities Overview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Warehouse Inspection Scope
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-gray-600">
                <Package className="w-3 h-3 mr-2" />
                Storage Compliance
              </div>
              <div className="flex items-center text-gray-600">
                <Truck className="w-3 h-3 mr-2" />
                Loading Operations
              </div>
              <div className="flex items-center text-gray-600">
                <FileText className="w-3 h-3 mr-2" />
                Documentation
              </div>
              <div className="flex items-center text-gray-600">
                <BarChart3 className="w-3 h-3 mr-2" />
                Quality Control
              </div>
              <div className="flex items-center text-gray-600">
                <AlertTriangle className="w-3 h-3 mr-2" />
                Safety Standards
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle className="w-3 h-3 mr-2" />
                EUDR Compliance
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">Demo Access:</p>
            <p className="text-xs text-blue-500">Inspector ID: WH-INS-001</p>
            <p className="text-xs text-blue-500">Security Code: warehouse123</p>
          </div>

          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation("/inspector-portal")}
              data-testid="button-back"
            >
              ← Back to Inspector Portal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}