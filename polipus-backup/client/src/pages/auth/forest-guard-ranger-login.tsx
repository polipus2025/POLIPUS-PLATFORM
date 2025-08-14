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
import { Shield, TreePine, AlertCircle, Eye, EyeOff, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  rangerId: z.string().min(1, "Ranger ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rank: z.string().min(1, "Ranger rank is required"),
  badgeNumber: z.string().min(1, "Badge number is required"),
  patrolArea: z.string().min(1, "Patrol area is required"),
  conservationCredentials: z.string().min(1, "Conservation credentials are required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function ForestGuardRangerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rangerId: "",
      password: "",
      rank: "",
      badgeNumber: "",
      patrolArea: "",
      conservationCredentials: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/forest-guard-ranger-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "forest-guard-ranger",
          portalType: "forest-ranger"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Forest Ranger Login Successful",
          description: "Welcome to Forest Guard Ranger Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "forest-ranger");
        localStorage.setItem("userType", "forest-guard-ranger");
        localStorage.setItem("patrolArea", data.patrolArea);
        
        window.location.href = "/forest-guard-ranger-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your ranger credentials.";
      setError(errorMessage);
      toast({
        title: "Ranger Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rangerRanks = [
    { value: "chief-ranger", label: "Chief Forest Ranger" },
    { value: "senior-ranger", label: "Senior Forest Ranger" },
    { value: "forest-ranger", label: "Forest Ranger" },
    { value: "junior-ranger", label: "Junior Ranger" },
    { value: "patrol-officer", label: "Patrol Officer" }
  ];

  const patrolAreas = [
    { value: "sapo-national-park", label: "Sapo National Park" },
    { value: "nimba-mountains", label: "Nimba Mountains Reserve" },
    { value: "grebo-national-forest", label: "Grebo National Forest" },
    { value: "krahn-bassa-forest", label: "Krahn-Bassa National Forest" },
    { value: "gola-forest", label: "Gola Forest Reserve" },
    { value: "coastal-forests", label: "Coastal Forest Areas" },
    { value: "county-forests", label: "County Forest Reserves" }
  ];

  const conservationCredentials = [
    { value: "wildlife-conservation", label: "Wildlife Conservation Certified" },
    { value: "forest-management", label: "Forest Management Specialist" },
    { value: "biodiversity-protection", label: "Biodiversity Protection" },
    { value: "anti-poaching", label: "Anti-Poaching Operations" },
    { value: "environmental-enforcement", label: "Environmental Law Enforcement" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Forest Guard Ranger Login - Conservation Officer Access | Wildlife Protection</title>
        <meta name="description" content="Secure access portal for forest rangers and conservation officers" />
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
              <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center">
                <TreePine className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Forest Guard Portal
            </h1>
            <p className="text-slate-600">
              Forest Ranger Access - Wildlife & Conservation Protection
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Authorized Conservation Officers Only
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="rangerId">Forest Ranger ID</Label>
              <Input
                id="rangerId"
                type="text"
                {...form.register("rangerId")}
                className="w-full"
                placeholder="Enter your ranger ID"
                data-testid="input-ranger-id"
              />
              {form.formState.errors.rangerId && (
                <p className="text-sm text-red-600">{form.formState.errors.rangerId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="badgeNumber">Official Badge Number</Label>
              <Input
                id="badgeNumber"
                type="text"
                {...form.register("badgeNumber")}
                className="w-full"
                placeholder="Enter your badge number"
                data-testid="input-badge-number"
              />
              {form.formState.errors.badgeNumber && (
                <p className="text-sm text-red-600">{form.formState.errors.badgeNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rank">Ranger Rank</Label>
              <Select 
                value={form.watch("rank")} 
                onValueChange={(value) => form.setValue("rank", value)}
              >
                <SelectTrigger data-testid="select-rank">
                  <SelectValue placeholder="Select your ranger rank" />
                </SelectTrigger>
                <SelectContent>
                  {rangerRanks.map((rank) => (
                    <SelectItem key={rank.value} value={rank.value}>
                      {rank.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.rank && (
                <p className="text-sm text-red-600">{form.formState.errors.rank.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="patrolArea">Assigned Patrol Area</Label>
              <Select 
                value={form.watch("patrolArea")} 
                onValueChange={(value) => form.setValue("patrolArea", value)}
              >
                <SelectTrigger data-testid="select-patrol-area">
                  <SelectValue placeholder="Select your patrol area" />
                </SelectTrigger>
                <SelectContent>
                  {patrolAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.patrolArea && (
                <p className="text-sm text-red-600">{form.formState.errors.patrolArea.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="conservationCredentials">Conservation Credentials</Label>
              <Select 
                value={form.watch("conservationCredentials")} 
                onValueChange={(value) => form.setValue("conservationCredentials", value)}
              >
                <SelectTrigger data-testid="select-conservation-credentials">
                  <SelectValue placeholder="Select your credentials" />
                </SelectTrigger>
                <SelectContent>
                  {conservationCredentials.map((cred) => (
                    <SelectItem key={cred.value} value={cred.value}>
                      {cred.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.conservationCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.conservationCredentials.message}</p>
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

            <Button 
              type="submit" 
              className="w-full isms-button"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying Ranger Credentials...
                </div>
              ) : (
                "Access Forest Ranger Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Authorized Forest Rangers only. All patrol activities are monitored for conservation compliance.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Forest Conservation Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}