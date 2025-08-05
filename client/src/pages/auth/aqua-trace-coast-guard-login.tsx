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
import { Shield, Anchor, AlertCircle, Eye, EyeOff, Ship } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  guardId: z.string().min(1, "Coast Guard ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  guardCredentials: z.string().min(1, "Coast Guard credentials are required"),
  officerRank: z.string().min(1, "Officer rank is required"),
  patrolSector: z.string().min(1, "Patrol sector is required"),
  specialization: z.string().min(1, "Coast Guard specialization is required"),
  securityClearance: z.string().min(1, "Security clearance is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AquaTraceCoastGuardLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      guardId: "",
      password: "",
      guardCredentials: "",
      officerRank: "",
      patrolSector: "",
      specialization: "",
      securityClearance: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/aqua-trace-coast-guard-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "aqua-trace-coast-guard",
          portalType: "coast-guard"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Coast Guard Login Successful",
          description: "Welcome to Aqua Trace Security Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "coast-guard-officer");
        localStorage.setItem("userType", "aqua-trace-coast-guard");
        localStorage.setItem("patrolSector", data.patrolSector);
        
        window.location.href = "/aqua-trace-security-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your Coast Guard credentials.";
      setError(errorMessage);
      toast({
        title: "Coast Guard Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const guardCredentials = [
    { value: "liberian-coast-guard-officer", label: "Liberian Coast Guard Officer" },
    { value: "maritime-law-enforcement", label: "Maritime Law Enforcement Officer" },
    { value: "marine-security-specialist", label: "Marine Security Specialist" },
    { value: "port-security-officer", label: "Port Security Officer" },
    { value: "fisheries-enforcement", label: "Fisheries Enforcement Officer" },
    { value: "search-rescue-specialist", label: "Search & Rescue Specialist" },
    { value: "maritime-safety-inspector", label: "Maritime Safety Inspector" }
  ];

  const officerRanks = [
    { value: "coast-guard-commandant", label: "Coast Guard Commandant" },
    { value: "deputy-commandant", label: "Deputy Commandant" },
    { value: "sector-commander", label: "Sector Commander" },
    { value: "patrol-captain", label: "Patrol Captain" },
    { value: "lieutenant-commander", label: "Lieutenant Commander" },
    { value: "lieutenant", label: "Lieutenant" },
    { value: "petty-officer", label: "Petty Officer" },
    { value: "seaman", label: "Seaman" }
  ];

  const patrolSectors = [
    { value: "monrovia-port-sector", label: "Monrovia Port Security Sector" },
    { value: "buchanan-port-sector", label: "Buchanan Port Security Sector" },
    { value: "cape-palmas-sector", label: "Cape Palmas Coastal Sector" },
    { value: "grand-bassa-coastal", label: "Grand Bassa Coastal Patrol" },
    { value: "sinoe-maritime-zone", label: "Sinoe Maritime Patrol Zone" },
    { value: "western-territorial-waters", label: "Western Territorial Waters" },
    { value: "exclusive-economic-zone", label: "Exclusive Economic Zone (EEZ)" },
    { value: "international-waters-patrol", label: "International Waters Coordination" }
  ];

  const specializations = [
    { value: "anti-piracy-operations", label: "Anti-Piracy Operations" },
    { value: "illegal-fishing-enforcement", label: "Illegal Fishing Enforcement" },
    { value: "drug-trafficking-interdiction", label: "Drug Trafficking Interdiction" },
    { value: "maritime-border-security", label: "Maritime Border Security" },
    { value: "search-rescue-operations", label: "Search & Rescue Operations" },
    { value: "environmental-protection", label: "Marine Environmental Protection" },
    { value: "vessel-inspection-boarding", label: "Vessel Inspection & Boarding" },
    { value: "maritime-intelligence", label: "Maritime Intelligence Operations" }
  ];

  const securityClearances = [
    { value: "top-secret-maritime", label: "Top Secret - Maritime Operations" },
    { value: "secret-law-enforcement", label: "Secret - Law Enforcement" },
    { value: "confidential-security", label: "Confidential - Security Operations" },
    { value: "restricted-patrol", label: "Restricted - Patrol Operations" },
    { value: "public-trust-position", label: "Public Trust Position" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Aqua Trace Coast Guard Login - Maritime Security & Law Enforcement Access</title>
        <meta name="description" content="Secure access portal for Coast Guard officers and maritime security personnel" />
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
              <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center">
                <Anchor className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Aqua Trace Portal
            </h1>
            <p className="text-slate-600">
              Coast Guard - Maritime Security & Law Enforcement
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Authorized Coast Guard Personnel Only
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
              <Label htmlFor="guardId">Coast Guard ID</Label>
              <Input
                id="guardId"
                type="text"
                {...form.register("guardId")}
                className="w-full"
                placeholder="Enter your Coast Guard ID"
                data-testid="input-guard-id"
              />
              {form.formState.errors.guardId && (
                <p className="text-sm text-red-600">{form.formState.errors.guardId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardCredentials">Coast Guard Credentials</Label>
              <Select 
                value={form.watch("guardCredentials")} 
                onValueChange={(value) => form.setValue("guardCredentials", value)}
              >
                <SelectTrigger data-testid="select-guard-credentials">
                  <SelectValue placeholder="Select your credentials" />
                </SelectTrigger>
                <SelectContent>
                  {guardCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.guardCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.guardCredentials.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="officerRank">Officer Rank</Label>
              <Select 
                value={form.watch("officerRank")} 
                onValueChange={(value) => form.setValue("officerRank", value)}
              >
                <SelectTrigger data-testid="select-officer-rank">
                  <SelectValue placeholder="Select your rank" />
                </SelectTrigger>
                <SelectContent>
                  {officerRanks.map((rank) => (
                    <SelectItem key={rank.value} value={rank.value}>
                      {rank.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.officerRank && (
                <p className="text-sm text-red-600">{form.formState.errors.officerRank.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="patrolSector">Patrol Sector</Label>
              <Select 
                value={form.watch("patrolSector")} 
                onValueChange={(value) => form.setValue("patrolSector", value)}
              >
                <SelectTrigger data-testid="select-patrol-sector">
                  <SelectValue placeholder="Select your patrol sector" />
                </SelectTrigger>
                <SelectContent>
                  {patrolSectors.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.patrolSector && (
                <p className="text-sm text-red-600">{form.formState.errors.patrolSector.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Coast Guard Specialization</Label>
              <Select 
                value={form.watch("specialization")} 
                onValueChange={(value) => form.setValue("specialization", value)}
              >
                <SelectTrigger data-testid="select-specialization">
                  <SelectValue placeholder="Select your specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec.value} value={spec.value}>
                      {spec.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.specialization && (
                <p className="text-sm text-red-600">{form.formState.errors.specialization.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityClearance">Security Clearance</Label>
              <Select 
                value={form.watch("securityClearance")} 
                onValueChange={(value) => form.setValue("securityClearance", value)}
              >
                <SelectTrigger data-testid="select-security-clearance">
                  <SelectValue placeholder="Select your clearance level" />
                </SelectTrigger>
                <SelectContent>
                  {securityClearances.map((clearance) => (
                    <SelectItem key={clearance.value} value={clearance.value}>
                      {clearance.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.securityClearance && (
                <p className="text-sm text-red-600">{form.formState.errors.securityClearance.message}</p>
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
                  Verifying Security Credentials...
                </div>
              ) : (
                "Access Coast Guard Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Authorized Coast Guard personnel only. All maritime security operations are classified and monitored.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Maritime Security Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}