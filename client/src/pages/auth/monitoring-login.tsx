import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Activity, BarChart3, Users, Database, ArrowLeft, Globe, FileText, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function MonitoringLogin() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    entityType: "donor" // donor, ngo, auditor
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/monitoring-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          entityType: formData.entityType,
          requestedRole: "monitoring_observer"
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("monitoring_token", data.token);
        localStorage.setItem("monitoring_user", JSON.stringify(data.user));
        localStorage.setItem("userType", "monitoring");
        localStorage.setItem("userRole", "monitoring_observer");
        toast({
          title: "Login Successful",
          description: `Welcome to Monitoring Dashboard, ${data.user.organizationName}`,
        });
        // Redirect directly to monitoring dashboard
        setLocation("/monitoring-dashboard");
      } else {
        setError(data.message || "Invalid monitoring credentials");
      }
    } catch (error) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-white hover:bg-white/10 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Return to Platform
          </Button>
        </Link>
      </div>
      
      <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-sm sm:max-w-md">
          <Card className="bg-white shadow-2xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-600 p-4 rounded-full">
                  <Activity className="h-12 w-12 text-white" />
                </div>
              </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Oversight Portal
            </CardTitle>
            <CardDescription className="text-slate-600 text-sm leading-relaxed">
              International Donors • NGOs • Government Auditors
            </CardDescription>
            <p className="text-xs text-slate-500">
              Comprehensive Agricultural Supply Chain Oversight
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Entity Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">Entity Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: "donor", label: "International Donor", icon: Globe },
                    { value: "ngo", label: "NGO Organization", icon: Users },
                    { value: "auditor", label: "Government Auditor", icon: FileText }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, entityType: type.value })}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                        formData.entityType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <type.icon className={`w-4 h-4 ${
                        formData.entityType === type.value ? 'text-blue-600' : 'text-slate-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        formData.entityType === type.value ? 'text-blue-700' : 'text-slate-700'
                      }`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                  Organization Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your organization username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="h-11"
                  data-testid="input-username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Access Code
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your access code"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-11 pr-10"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    data-testid="toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Authenticating...
                  </div>
                ) : (
                  "Access Oversight Dashboard"
                )}
              </Button>
            </form>

            {/* Test Credentials */}
            <div className="border-t pt-4 space-y-3">
              <p className="text-xs text-slate-500 font-medium">Test Credentials:</p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Donor:</span>
                  <span className="font-mono text-slate-700">donor.test / DONOR2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">NGO:</span>
                  <span className="font-mono text-slate-700">ngo.test / NGO2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Auditor:</span>
                  <span className="font-mono text-slate-700">audit.test / AUDIT2025</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Oversight Dashboard Features
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  Complete supply chain visibility
                </li>
                <li className="flex items-center gap-2">
                  <Database className="h-3 w-3" />
                  Comprehensive PDF reports
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Full operational audit trail
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  Real-time transaction monitoring
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}