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
  const [donorForm, setDonorForm] = useState({ username: "", password: "" });
  const [ngoForm, setNgoForm] = useState({ username: "", password: "" });
  const [auditorForm, setAuditorForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState({ donor: false, ngo: false, auditor: false });
  const [errors, setErrors] = useState({ donor: "", ngo: "", auditor: "" });
  const [showPasswords, setShowPasswords] = useState({ donor: false, ngo: false, auditor: false });
  const { toast } = useToast();

  const handleInputChange = (entityType: string, field: string, value: string) => {
    if (entityType === 'donor') {
      setDonorForm(prev => ({ ...prev, [field]: value }));
    } else if (entityType === 'ngo') {
      setNgoForm(prev => ({ ...prev, [field]: value }));
    } else if (entityType === 'auditor') {
      setAuditorForm(prev => ({ ...prev, [field]: value }));
    }
    // Clear error for this entity type
    setErrors(prev => ({ ...prev, [entityType]: "" }));
  };

  const handleSubmit = async (entityType: string, formData: { username: string, password: string }) => {
    setIsLoading(prev => ({ ...prev, [entityType]: true }));
    setErrors(prev => ({ ...prev, [entityType]: "" }));

    try {
      const response = await fetch("/api/auth/monitoring-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          entityType: entityType,
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
          description: `Welcome to Oversight Dashboard, ${data.user.organizationName}`,
        });
        setLocation("/monitoring-dashboard");
      } else {
        setErrors(prev => ({ ...prev, [entityType]: data.message || "Invalid credentials" }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, [entityType]: "Connection error. Please try again." }));
    } finally {
      setIsLoading(prev => ({ ...prev, [entityType]: false }));
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
          {/* Three Login Boxes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* International Donors Login */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-blue-900">International Donors</h3>
                <p className="text-xs text-blue-700 mt-1">Global funding oversight</p>
              </div>
              
              {errors.donor && (
                <Alert className="border-red-200 bg-red-50 mb-3">
                  <AlertDescription className="text-red-700 text-xs">{errors.donor}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit('donor', donorForm); }} className="space-y-3">
                <div>
                  <Input
                    type="text"
                    placeholder="Organization username"
                    value={donorForm.username}
                    onChange={(e) => handleInputChange('donor', 'username', e.target.value)}
                    required
                    className="h-10 text-sm"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPasswords.donor ? "text" : "password"}
                    placeholder="Access code"
                    value={donorForm.password}
                    onChange={(e) => handleInputChange('donor', 'password', e.target.value)}
                    required
                    className="h-10 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, donor: !prev.donor }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  >
                    {showPasswords.donor ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium"
                  disabled={isLoading.donor}
                >
                  {isLoading.donor ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                      <span className="text-xs">Authenticating...</span>
                    </div>
                  ) : (
                    "Login as Donor"
                  )}
                </Button>
                <div className="text-center">
                  <p className="text-xs text-blue-600 font-mono">donor.test / DONOR2025</p>
                </div>
              </form>
            </div>

            {/* NGO Organizations Login */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-green-900">NGO Organizations</h3>
                <p className="text-xs text-green-700 mt-1">Civil society monitoring</p>
              </div>
              
              {errors.ngo && (
                <Alert className="border-red-200 bg-red-50 mb-3">
                  <AlertDescription className="text-red-700 text-xs">{errors.ngo}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit('ngo', ngoForm); }} className="space-y-3">
                <div>
                  <Input
                    type="text"
                    placeholder="Organization username"
                    value={ngoForm.username}
                    onChange={(e) => handleInputChange('ngo', 'username', e.target.value)}
                    required
                    className="h-10 text-sm"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPasswords.ngo ? "text" : "password"}
                    placeholder="Access code"
                    value={ngoForm.password}
                    onChange={(e) => handleInputChange('ngo', 'password', e.target.value)}
                    required
                    className="h-10 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, ngo: !prev.ngo }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  >
                    {showPasswords.ngo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-10 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium"
                  disabled={isLoading.ngo}
                >
                  {isLoading.ngo ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                      <span className="text-xs">Authenticating...</span>
                    </div>
                  ) : (
                    "Login as NGO"
                  )}
                </Button>
                <div className="text-center">
                  <p className="text-xs text-green-600 font-mono">ngo.test / NGO2025</p>
                </div>
              </form>
            </div>

            {/* Government Auditors Login */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-purple-900">Government Auditors</h3>
                <p className="text-xs text-purple-700 mt-1">Official compliance review</p>
              </div>
              
              {errors.auditor && (
                <Alert className="border-red-200 bg-red-50 mb-3">
                  <AlertDescription className="text-red-700 text-xs">{errors.auditor}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit('auditor', auditorForm); }} className="space-y-3">
                <div>
                  <Input
                    type="text"
                    placeholder="Organization username"
                    value={auditorForm.username}
                    onChange={(e) => handleInputChange('auditor', 'username', e.target.value)}
                    required
                    className="h-10 text-sm"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPasswords.auditor ? "text" : "password"}
                    placeholder="Access code"
                    value={auditorForm.password}
                    onChange={(e) => handleInputChange('auditor', 'password', e.target.value)}
                    required
                    className="h-10 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, auditor: !prev.auditor }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  >
                    {showPasswords.auditor ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-10 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-medium"
                  disabled={isLoading.auditor}
                >
                  {isLoading.auditor ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                      <span className="text-xs">Authenticating...</span>
                    </div>
                  ) : (
                    "Login as Auditor"
                  )}
                </Button>
                <div className="text-center">
                  <p className="text-xs text-purple-600 font-mono">audit.test / AUDIT2025</p>
                </div>
              </form>
            </div>
          </div>

          {/* Features Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3 mt-6">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Oversight Dashboard Features
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span>Supply Chain Visibility</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-3 w-3" />
                <span>PDF Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                <span>Audit Trail</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3" />
                <span>Real-time Monitoring</span>
              </div>
            </div>
          </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}