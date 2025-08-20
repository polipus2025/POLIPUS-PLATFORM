import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Key, User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function FarmerLoginPortal() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    credentialId: "",
    password: ""
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { credentialId: string; password: string }) => {
      return await apiRequest("/api/farmers/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: (response: any) => {
      // Store farmer login data
      localStorage.setItem("farmerId", response.farmer.farmerId);
      localStorage.setItem("farmerName", `${response.farmer.firstName} ${response.farmer.lastName}`);
      localStorage.setItem("farmerToken", response.token);
      localStorage.setItem("userType", "farmer");

      toast({
        title: "Login Successful!",
        description: `Welcome ${response.farmer.firstName} ${response.farmer.lastName}`,
      });

      // Redirect to farmer dashboard
      setLocation("/farmer-dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please check your login ID and password.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.credentialId || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both login ID and password",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate(loginData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Farmer Portal</CardTitle>
            <p className="text-gray-600 mt-2">
              Access your farm mapping data, harvest schedules, and marketplace
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Login ID Field */}
              <div className="space-y-2">
                <Label htmlFor="credentialId" className="text-sm font-medium text-gray-700">
                  Login ID
                </Label>
                <div className="relative">
                  <Key className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    id="credentialId"
                    type="text"
                    placeholder="Enter your FRM ID (e.g., FRM434923)"
                    value={loginData.credentialId}
                    onChange={(e) => setLoginData(prev => ({ ...prev, credentialId: e.target.value }))}
                    className="pl-10"
                    data-testid="input-credential-id"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    data-testid="toggle-password-visibility"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login to Farmer Portal
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Demo Account Available</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div className="flex justify-between">
                  <span>Login ID:</span>
                  <span className="font-mono font-bold">FRM434923</span>
                </div>
                <div className="flex justify-between">
                  <span>Password:</span>
                  <span className="font-mono font-bold">Test2025!</span>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Use these credentials to explore the farmer portal with sample data
              </p>
            </div>

            {/* Help Information */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p>• Your Login ID was provided when you were onboarded by a Land Inspector</p>
                <p>• Login ID format: FRM followed by 6 digits (e.g., FRM434923)</p>
                <p>• Contact your Land Inspector if you forgot your credentials</p>
                <p>• First-time users will be asked to change their password</p>
              </div>
            </div>

            {/* Features Preview */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Farmer Portal Features</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p>🗺️ View your land mapping data and GPS boundaries</p>
                <p>📅 Manage harvest schedules and crop planning</p>
                <p>🛒 Create marketplace listings for your crops</p>
                <p>💬 Connect with buyers and negotiate prices</p>
                <p>🔔 Receive alerts about harvest timing and market opportunities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>AgriTrace360 Farmer Portal • Powered by Polipus Platform</p>
        </div>
      </div>
    </div>
  );
}