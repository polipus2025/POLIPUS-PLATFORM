import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Building2, AlertCircle, Eye, EyeOff, ArrowLeft, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role selection is required"),
  department: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function RegulatoryClassicLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "",
      department: "",
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      // Call backend authentication API
      const response = await apiRequest("/api/auth/regulatory-login", {
        method: "POST",
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          role: data.role,
          department: data.department,
          userType: "regulatory"
        })
      });

      if (response.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to LACRA Regulatory Portal (Classic)",
        });
        
        // Store the real JWT token from backend
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("userRole", response.user.role);
        localStorage.setItem("userType", response.user.userType);
        localStorage.setItem("username", response.user.username);
        localStorage.setItem("selectedRole", data.role);
        localStorage.setItem("userId", response.user.id);
        
        window.location.href = "/regulatory-portal-classic";
      } else {
        throw new Error(response.message || "Authentication failed");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Helmet>
        <title>Regulatory Portal (Classic) Login - LACRA</title>
        <meta name="description" content="Classic regulatory portal access for LACRA officers" />
      </Helmet>

      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <Link href="/" className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Platform
              </Button>
            </Link>
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img 
                  src={lacraLogo} 
                  alt="LACRA Official Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              LACRA Regulatory Portal
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Classic Unified Access
            </p>
            <p className="text-sm text-gray-500">
              Liberia Agriculture Commodity Regulatory Authority
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <FileCheck className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500">Original Interface</span>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  type="text"
                  {...form.register("username")}
                  className="mt-1"
                  placeholder="Enter your username"
                  data-testid="input-username"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.username.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role">Role *</Label>
                <Select 
                  value={form.watch("role")} 
                  onValueChange={(value) => form.setValue("role", value)}
                >
                  <SelectTrigger className="mt-1" data-testid="select-role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="director">Director</SelectItem>
                    <SelectItem value="inspector">Chief Inspector</SelectItem>
                    <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                    <SelectItem value="field_coordinator">Field Coordinator</SelectItem>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="analyst">Data Analyst</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.role && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.role.message}</p>
                )}
              </div>

              {selectedRole && (
                <div>
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Select 
                    value={form.watch("department")} 
                    onValueChange={(value) => form.setValue("department", value)}
                  >
                    <SelectTrigger className="mt-1" data-testid="select-department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="export_control">Export Control</SelectItem>
                      <SelectItem value="field_operations">Field Operations</SelectItem>
                      <SelectItem value="compliance_monitoring">Compliance Monitoring</SelectItem>
                      <SelectItem value="data_analytics">Data Analytics</SelectItem>
                      <SelectItem value="administration">Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    className="pr-10"
                    placeholder="Enter your password"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? "Logging in..." : "Access Regulatory Portal"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Demo Credentials (for testing):
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Username: <span className="font-mono">regulator</span></p>
                  <p>Password: <span className="font-mono">Reg2025!</span></p>
                  <p>Role: <span className="italic">Any role from dropdown</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}