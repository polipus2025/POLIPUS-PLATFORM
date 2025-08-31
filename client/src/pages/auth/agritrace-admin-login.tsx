import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Leaf, Shield, AlertTriangle, Lock, Database, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";
import { useToast } from "@/hooks/use-toast";

export default function AgriTraceAdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/agritrace-admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          adminCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store authentication data with proper scope limitations
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userType', 'agritrace_admin');
      localStorage.setItem('userRole', 'system_administrator');
      localStorage.setItem('adminScope', 'AgriTrace360™ Module Only');
      localStorage.setItem('username', data.username);
      localStorage.setItem('loginTime', Date.now().toString());

      toast({
        title: "Login Successful",
        description: "Welcome to AgriTrace360™ Administration Portal",
      });

      // Redirect to AgriTrace Admin Portal
      navigate('/agritrace-admin-portal');

    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or insufficient permissions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100 flex items-center justify-center p-4">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Link href="/regulatory-login">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Regulatory Portal
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <img 
              src={lacraLogo} 
              alt="LACRA Logo" 
              className="w-16 h-16 object-contain rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AgriTrace Administrator</h1>
          <p className="text-slate-700">Limited Agricultural Module Control</p>
        </div>

        {/* Restriction Warning Card */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800 text-sm">Access Restrictions</h3>
                <ul className="text-xs text-orange-700 mt-1 space-y-1">
                  <li>• Limited to AgriTrace360™ module only</li>
                  <li>• No access to broader Polipus platform</li>
                  <li>• Agricultural traceability controls only</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="bg-white shadow-xl border-slate-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
              <Database className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl text-slate-900">Administrative Access</CardTitle>
            <CardDescription className="text-slate-600">
              Enter your AgriTrace administrator credentials
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="agritrace.admin"
                  required
                  data-testid="input-username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    data-testid="input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminCode">Administrative Code</Label>
                <Input
                  id="adminCode"
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="AGRITRACE2025"
                  required
                  data-testid="input-admin-code"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" 
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Access AgriTrace Admin
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Access Scope Information */}
        <Card className="mt-6 bg-slate-50 border-slate-200">
          <CardContent className="p-4 text-center">
            <Badge className="bg-green-100 text-green-800 border-green-200 mb-2">
              <Leaf className="w-3 h-3 mr-1" />
              AgriTrace360™ Module
            </Badge>
            <p className="text-xs text-slate-600">
              This administrative interface is strictly limited to agricultural traceability operations. 
              No access to other platform modules or system-wide controls.
            </p>
          </CardContent>
        </Card>

        {/* Security Footer */}
        <div className="text-center mt-6 text-slate-400 text-xs">
          <p>Restricted Administrative Access • All Logins Audited</p>
          <p className="mt-1">AgriTrace360™ Module Administration Only</p>
        </div>
      </div>
    </div>
  );
}