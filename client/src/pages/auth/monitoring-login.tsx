import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity, BarChart3, Users, Database, ArrowLeft, Globe, FileText, Eye, EyeOff, ArrowRight } from "lucide-react";
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
      
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-slate-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Oversight Portal Access</h1>
          <p className="text-slate-700 text-lg">International Monitoring & Compliance System</p>
          <p className="text-slate-600 text-sm mt-2">Complete Agricultural Supply Chain Transparency</p>
        </div>

        {/* Four Access Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
          {/* International Donors Card */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" />
                International Donors
              </CardTitle>
              <CardDescription className="text-slate-600">
                Global Funding Oversight
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-blue-500 text-blue-600 bg-blue-50">
                Global Access Level
              </Badge>
              {errors.donor && (
                <Alert className="border-red-200 bg-red-50">
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
                    className="h-11"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPasswords.donor ? "text" : "password"}
                    placeholder="Access code"
                    value={donorForm.password}
                    onChange={(e) => handleInputChange('donor', 'password', e.target.value)}
                    required
                    className="h-11 pr-10"
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
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group"
                  disabled={isLoading.donor}
                >
                  {isLoading.donor ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Authenticating...
                    </div>
                  ) : (
                    <>
                      Access Donor Portal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">Test Credentials:</p>
                <p className="text-xs text-blue-600 font-mono">donor.test / DONOR2025</p>
              </div>
            </CardContent>
          </Card>

          {/* NGO Organizations Card */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                NGO Organizations
              </CardTitle>
              <CardDescription className="text-slate-600">
                Civil Society Monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-emerald-500 text-emerald-600 bg-emerald-50">
                NGO Access Level
              </Badge>
              {errors.ngo && (
                <Alert className="border-red-200 bg-red-50">
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
                    className="h-11"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPasswords.ngo ? "text" : "password"}
                    placeholder="Access code"
                    value={ngoForm.password}
                    onChange={(e) => handleInputChange('ngo', 'password', e.target.value)}
                    required
                    className="h-11 pr-10"
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
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white group"
                  disabled={isLoading.ngo}
                >
                  {isLoading.ngo ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Authenticating...
                    </div>
                  ) : (
                    <>
                      Access NGO Portal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">Test Credentials:</p>
                <p className="text-xs text-emerald-600 font-mono">ngo.test / NGO2025</p>
              </div>
            </CardContent>
          </Card>

          {/* Government Auditors Card */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Government Auditors
              </CardTitle>
              <CardDescription className="text-slate-600">
                Official Compliance Review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-amber-500 text-amber-600 bg-amber-50">
                Audit Access Level
              </Badge>
              {errors.auditor && (
                <Alert className="border-red-200 bg-red-50">
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
                    className="h-11"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPasswords.auditor ? "text" : "password"}
                    placeholder="Access code"
                    value={auditorForm.password}
                    onChange={(e) => handleInputChange('auditor', 'password', e.target.value)}
                    required
                    className="h-11 pr-10"
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
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white group"
                  disabled={isLoading.auditor}
                >
                  {isLoading.auditor ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Authenticating...
                    </div>
                  ) : (
                    <>
                      Access Auditor Portal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">Test Credentials:</p>
                <p className="text-xs text-amber-600 font-mono">audit.test / AUDIT2025</p>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Portal Card - FOURTH BOX */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <Activity className="w-5 h-5" />
                Accessibility Portal
              </CardTitle>
              <CardDescription className="text-slate-600">
                Universal Access & Inclusion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-purple-500 text-purple-600 bg-purple-50">
                Universal Access Level
              </Badge>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Screen reader compatible interface</li>
                <li>• High contrast display options</li>
                <li>• Keyboard navigation support</li>
                <li>• Multi-language accessibility</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white group"
                onClick={() => setLocation("/monitoring-dashboard")}
              >
                Access Inclusive Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">Barrier-Free Access</p>
                <p className="text-xs text-purple-600 font-mono">No Credentials Required</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="bg-white shadow-lg border border-slate-200 rounded-lg p-6 text-center">
          <Shield className="w-8 h-8 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Complete Transparency Portal</h3>
          <p className="text-slate-600 text-sm mb-4">
            Comprehensive agricultural supply chain oversight for international stakeholders with complete 
            operational transparency and compliance monitoring capabilities.
          </p>
          <div className="flex justify-center space-x-6 text-xs text-slate-500">
            <span>✓ Multi-Entity Authentication</span>
            <span>✓ Global Transparency Standards</span>
            <span>✓ Universal Accessibility</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>Polipus Platform International Oversight Portal System</p>
          <p className="text-xs mt-1">Authorized International Stakeholders • All Access Attempts are Logged</p>
        </div>
      </div>
    </div>
  );
}