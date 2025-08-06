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
import { Leaf, Building2, AlertCircle, Eye, EyeOff, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role selection is required"),
  farmSize: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LiveTraceFarmerLogin() {
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
      farmSize: "",
    },
  });

  const selectedRole = form.watch("role");

  // Auto-fill test credentials function
  const fillTestCredentials = (role: string) => {
    const credentials = {
      rancher: { username: "rancher001", password: "password123", role: "rancher", farmSize: "Large (100+ animals)" },
      farmer: { username: "farmer001", password: "password123", role: "farmer", farmSize: "Medium (50-100 animals)" },
      smallholder: { username: "smallholder001", password: "password123", role: "smallholder", farmSize: "Small (10-50 animals)" },
      cooperative: { username: "coop001", password: "password123", role: "cooperative", farmSize: "Cooperative (200+ animals)" }
    };
    
    const cred = credentials[role as keyof typeof credentials];
    if (cred) {
      form.setValue("username", cred.username);
      form.setValue("password", cred.password);
      form.setValue("role", cred.role);
      form.setValue("farmSize", cred.farmSize);
    }
  };

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/live-trace-farmer-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "live-trace-farmer"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to LiveTrace Farmer Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userType", "live-trace-farmer");
        
        window.location.href = "/livetrace/dashboard";
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
    { value: "small-farmer", label: "Small-Scale Farmer", farmSize: "Under 5 hectares" },
    { value: "medium-farmer", label: "Medium-Scale Farmer", farmSize: "5-20 hectares" },
    { value: "large-farmer", label: "Large-Scale Farmer", farmSize: "Over 20 hectares" },
    { value: "cooperative-lead", label: "Cooperative Leader", farmSize: "Multiple farms" }
  ];

  const getFarmSizeForRole = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue);
    return role?.farmSize || "";
  };

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>LiveTrace Farmer Login - Livestock Management Portal | Ministry of Agriculture</title>
        <meta name="description" content="Farmer access portal for LiveTrace livestock management and tracking system" />
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
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              LiveTrace Portal
            </h1>
            <p className="text-slate-600">
              Farmer Access - Livestock Management System
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
              <Label htmlFor="role">Farm Category</Label>
              <Select 
                value={form.watch("role")} 
                onValueChange={(value) => {
                  form.setValue("role", value);
                  form.setValue("farmSize", getFarmSizeForRole(value));
                }}
              >
                <SelectTrigger data-testid="select-role">
                  <SelectValue placeholder="Select your farm category" />
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
                <Label htmlFor="farmSize">Farm Size</Label>
                <Input
                  id="farmSize"
                  type="text"
                  value={getFarmSizeForRole(selectedRole)}
                  readOnly
                  className="w-full bg-slate-50"
                  data-testid="input-farm-size"
                />
              </div>
            )}

            {/* Test Credentials Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">Quick Test Access:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestCredentials('rancher')}
                  className="text-xs"
                >
                  Rancher Test
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestCredentials('farmer')}
                  className="text-xs"
                >
                  Farmer Test
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestCredentials('smallholder')}
                  className="text-xs"
                >
                  Small Farm Test
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestCredentials('cooperative')}
                  className="text-xs"
                >
                  Coop Test
                </Button>
              </div>
            </div>

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
                "Access LiveTrace Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Registered farmers only. Manage your livestock monitoring data.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Leaf className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Sustainable Agriculture Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}