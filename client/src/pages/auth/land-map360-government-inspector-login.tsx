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
import { Shield, ClipboardCheck, AlertCircle, Eye, EyeOff, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  inspectorId: z.string().min(1, "Inspector ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  inspectorRank: z.string().min(1, "Inspector rank is required"),
  badgeNumber: z.string().min(1, "Official badge number is required"),
  jurisdictionArea: z.string().min(1, "Jurisdiction area is required"),
  governmentAgency: z.string().min(1, "Government agency is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LandMap360GovernmentInspectorLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      inspectorId: "",
      password: "",
      inspectorRank: "",
      badgeNumber: "",
      jurisdictionArea: "",
      governmentAgency: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/land-map360-government-inspector-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "land-map360-government-inspector",
          portalType: "government-inspector"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Government Inspector Login Successful",
          description: "Welcome to Land Map360 Government Inspector Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "government-inspector");
        localStorage.setItem("userType", "land-map360-government-inspector");
        localStorage.setItem("jurisdictionArea", data.jurisdictionArea);
        
        window.location.href = "/land-map360-government-inspector-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your government inspector credentials.";
      setError(errorMessage);
      toast({
        title: "Government Inspector Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inspectorRanks = [
    { value: "chief-inspector", label: "Chief Government Inspector" },
    { value: "senior-inspector", label: "Senior Inspector" },
    { value: "land-inspector", label: "Land Use Inspector" },
    { value: "compliance-inspector", label: "Compliance Inspector" },
    { value: "field-inspector", label: "Field Inspector" }
  ];

  const jurisdictionAreas = [
    { value: "montserrado", label: "Montserrado County" },
    { value: "margibi", label: "Margibi County" },
    { value: "nimba", label: "Nimba County" },
    { value: "bong", label: "Bong County" },
    { value: "grand-cape-mount", label: "Grand Cape Mount County" },
    { value: "grand-bassa", label: "Grand Bassa County" },
    { value: "grand-gedeh", label: "Grand Gedeh County" },
    { value: "lofa", label: "Lofa County" },
    { value: "bomi", label: "Bomi County" },
    { value: "sinoe", label: "Sinoe County" },
    { value: "national-jurisdiction", label: "National Jurisdiction" }
  ];

  const governmentAgencies = [
    { value: "land-commission", label: "Liberia Land Commission" },
    { value: "lacra", label: "LACRA - Agriculture Regulatory Authority" },
    { value: "planning-affairs", label: "Ministry of Planning & Affairs" },
    { value: "internal-affairs", label: "Ministry of Internal Affairs" },
    { value: "environmental-protection", label: "Environmental Protection Agency" },
    { value: "urban-planning", label: "Urban Planning Authority" },
    { value: "county-government", label: "County Government Office" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Land Map360 Government Inspector Login - Official Land Use Inspection Access</title>
        <meta name="description" content="Secure access portal for government inspectors and land use compliance officers" />
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
              <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Land Map360 Portal
            </h1>
            <p className="text-slate-600">
              Government Inspector Access - Land Use Compliance & Inspection
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Authorized Government Officials Only
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
              <Label htmlFor="inspectorId">Government Inspector ID</Label>
              <Input
                id="inspectorId"
                type="text"
                {...form.register("inspectorId")}
                className="w-full"
                placeholder="Enter your inspector ID"
                data-testid="input-inspector-id"
              />
              {form.formState.errors.inspectorId && (
                <p className="text-sm text-red-600">{form.formState.errors.inspectorId.message}</p>
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
              <Label htmlFor="inspectorRank">Inspector Rank</Label>
              <Select 
                value={form.watch("inspectorRank")} 
                onValueChange={(value) => form.setValue("inspectorRank", value)}
              >
                <SelectTrigger data-testid="select-inspector-rank">
                  <SelectValue placeholder="Select your inspector rank" />
                </SelectTrigger>
                <SelectContent>
                  {inspectorRanks.map((rank) => (
                    <SelectItem key={rank.value} value={rank.value}>
                      {rank.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.inspectorRank && (
                <p className="text-sm text-red-600">{form.formState.errors.inspectorRank.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="governmentAgency">Government Agency</Label>
              <Select 
                value={form.watch("governmentAgency")} 
                onValueChange={(value) => form.setValue("governmentAgency", value)}
              >
                <SelectTrigger data-testid="select-government-agency">
                  <SelectValue placeholder="Select your agency" />
                </SelectTrigger>
                <SelectContent>
                  {governmentAgencies.map((agency) => (
                    <SelectItem key={agency.value} value={agency.value}>
                      {agency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.governmentAgency && (
                <p className="text-sm text-red-600">{form.formState.errors.governmentAgency.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jurisdictionArea">Jurisdiction Area</Label>
              <Select 
                value={form.watch("jurisdictionArea")} 
                onValueChange={(value) => form.setValue("jurisdictionArea", value)}
              >
                <SelectTrigger data-testid="select-jurisdiction-area">
                  <SelectValue placeholder="Select your jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  {jurisdictionAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.jurisdictionArea && (
                <p className="text-sm text-red-600">{form.formState.errors.jurisdictionArea.message}</p>
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
                  Verifying Government Credentials...
                </div>
              ) : (
                "Access Government Inspector Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Authorized government officials only. All inspection activities are logged for compliance tracking.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Government Inspector Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}