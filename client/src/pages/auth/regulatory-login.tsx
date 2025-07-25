import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Building2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role selection is required"),
  department: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function RegulatoryLogin() {
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
      const result = await apiRequest("/api/auth/regulatory-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "regulatory"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to AgriTrace360™ Regulatory Portal",
        });
        
        // Store session data
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userType", "regulatory");
        
        // Redirect to dashboard
        window.location.href = "/dashboard";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Helmet>
        <title>Regulatory Portal Login - AgriTrace360™ LACRA</title>
        <meta name="description" content="Secure login portal for LACRA regulatory staff and administrators" />
      </Helmet>

      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img 
                  src={lacraLogo} 
                  alt="LACRA Official Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              LACRA Regulatory Portal
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Liberia Agriculture Commodity Regulatory Authority
            </p>
            <p className="text-sm text-gray-500">
              AgriTrace360™ | Authorized Personnel Only
            </p>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Role Selection */}
              <div>
                <Label htmlFor="role">Access Level *</Label>
                <Select 
                  value={form.watch("role")} 
                  onValueChange={(value) => form.setValue("role", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regulatory_admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        System Administrator
                      </div>
                    </SelectItem>
                    <SelectItem value="regulatory_staff">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Regulatory Officer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.role && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.role.message}</p>
                )}
              </div>

              {/* Department for Regulatory Staff */}
              {selectedRole === "regulatory_staff" && (
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={form.watch("department") || ""} 
                    onValueChange={(value) => form.setValue("department", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliance">Compliance & Monitoring</SelectItem>
                      <SelectItem value="certification">Certification & Quality</SelectItem>
                      <SelectItem value="inspection">Inspection Services</SelectItem>
                      <SelectItem value="analytics">Analytics & Reporting</SelectItem>
                      <SelectItem value="government_relations">Government Relations</SelectItem>
                      <SelectItem value="eudr_compliance">EUDR Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Username */}
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  type="text"
                  {...form.register("username")}
                  className="mt-1"
                  placeholder="Enter your username"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    className="pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  "Access Regulatory Portal"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Liberia Agriculture Commodity Regulatory Authority
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Secure access portal for authorized personnel
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Access Information */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Need different access?</p>
          <div className="flex justify-center gap-4">
            <a
              href="/farmer-login"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Farmer Portal
            </a>
            <a
              href="/field-agent-login"
              className="text-sm text-green-600 hover:text-green-800 underline"
            >
              Field Agent Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}