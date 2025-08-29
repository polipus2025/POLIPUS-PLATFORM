import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Activity, BarChart3, Users, Database, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function MonitoringLogin() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
          requestedRole: "monitoring_admin"
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userType", "monitoring");
        localStorage.setItem("userRole", "monitoring_admin");
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("username", data.user.username);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="bg-white shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <Link href="/" className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Platform
              </Button>
            </Link>
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-4 rounded-full">
                <Activity className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Platform Monitoring Portal
            </CardTitle>
            <CardDescription className="text-gray-600">
              Access comprehensive website activity monitoring and analytics
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Monitoring Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter monitoring credentials"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Access Monitoring Dashboard"}
              </Button>
            </form>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Monitoring Dashboard Features
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  Real-time user activity tracking
                </li>
                <li className="flex items-center gap-2">
                  <Database className="h-3 w-3" />
                  System performance metrics
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Security and audit logs
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  API usage and health monitoring
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}