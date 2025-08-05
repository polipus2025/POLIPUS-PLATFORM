import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet";
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

export default function MineWatchRegulatoryLogin() {
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
      const result = await apiRequest("/api/auth/mine-watch-regulatory-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "mine-watch-regulatory"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to Mine Watch Regulatory Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userType", "mine-watch-regulatory");
        
        window.location.href = "/mine-watch-dashboard";
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

  const roles = [
    { value: "mining-director", label: "Mining Director", department: "Mining Regulation" },
    { value: "safety-inspector", label: "Safety Inspector", department: "Mining Safety" },
    { value: "environmental-officer", label: "Environmental Officer", department: "Environmental Protection" },
    { value: "compliance-monitor", label: "Compliance Monitor", department: "Regulatory Compliance" },
    { value: "system-admin", label: "System Administrator", department: "IT Administration" }
  ];

  const getDepartmentForRole = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue);
    return role?.department || "";
  };

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Mine Watch Regulatory Login - Mining Oversight Access | Ministry of Mines</title>
        <meta name="description" content="Secure access portal for Mine Watch mining regulatory personnel" />
      </Helmet>

      <div className="w-full max-w-md">
        <div className="isms-card">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-4 mb-4">
              <img 
                src={lacraLogo} 
                alt="LACRA Logo" 
                className="h-16 w-16 object-contain"
              />
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Mine Watch Portal
            </h1>
            <p className="text-slate-600">
              Regulatory Access - Mining Oversight System
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                {...form.register("username")}
                className="w-full"
                placeholder="Enter your username"
                data-testid="input-username"
              />
              {form.formState.errors.username && (
                <p className="text-sm text-red-600">{form.formState.errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  className="w-full pr-10"
                  placeholder="Enter your password"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Access Level</Label>
              <Select 
                value={form.watch("role")} 
                onValueChange={(value) => {
                  form.setValue("role", value);
                  form.setValue("department", getDepartmentForRole(value));
                }}
              >
                <SelectTrigger data-testid="select-role">
                  <SelectValue placeholder="Select your access level" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-sm text-red-600">{form.formState.errors.role.message}</p>
              )}
            </div>

            {selectedRole && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  type="text"
                  value={getDepartmentForRole(selectedRole)}
                  readOnly
                  className="w-full bg-slate-50"
                  data-testid="input-department"
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full isms-button"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Access Mine Watch Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Authorized personnel only. All access is monitored and logged.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Secure Government Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}