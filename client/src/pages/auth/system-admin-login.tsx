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
import { Settings, Database, Shield, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  accessCode: z.string().min(1, "System access code is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function SystemAdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      accessCode: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      // For demonstration purposes, using simple validation
      // In production, this would authenticate against a secure system
      if (data.username === "sysadmin" && data.password === "Admin2025!" && data.accessCode === "POLIPUS-SYS") {
        toast({
          title: "Login Successful",
          description: "Welcome to System Administrator Portal",
        });
        
        localStorage.setItem("authToken", "sys-admin-token");
        localStorage.setItem("userRole", "system_administrator");
        localStorage.setItem("userType", "system_admin");
        localStorage.setItem("username", data.username);
        
        window.location.href = "/system-admin-portal";
      } else {
        throw new Error("Invalid credentials or access code");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Helmet>
        <title>System Administrator Login - Polipus Platform</title>
        <meta name="description" content="Secure login portal for system administrators" />
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
              <div className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full">
                <Settings className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              System Administrator
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Polipus Platform Control Center
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Database className="h-4 w-4 text-slate-500" />
              <Shield className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-gray-500">Secure Access Required</span>
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
                <Label htmlFor="username">Administrator Username *</Label>
                <Input
                  id="username"
                  type="text"
                  {...form.register("username")}
                  className="mt-1"
                  placeholder="Enter administrator username"
                  data-testid="input-username"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.username.message}</p>
                )}
              </div>

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

              <div>
                <Label htmlFor="accessCode">System Access Code *</Label>
                <Input
                  id="accessCode"
                  type="text"
                  {...form.register("accessCode")}
                  className="mt-1"
                  placeholder="Enter system access code"
                  data-testid="input-access-code"
                />
                {form.formState.errors.accessCode && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.accessCode.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? "Authenticating..." : "Access System Portal"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Demo Credentials (for testing):
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Username: <span className="font-mono">sysadmin</span></p>
                  <p>Password: <span className="font-mono">Admin2025!</span></p>
                  <p>Access Code: <span className="font-mono">POLIPUS-SYS</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}