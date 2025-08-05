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
  officerId: z.string().min(1, "Conservation Officer ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  conservationCredentials: z.string().min(1, "Conservation credentials are required"),
  officerLevel: z.string().min(1, "Officer level is required"),
  protectedArea: z.string().min(1, "Protected area assignment is required"),
  specialization: z.string().min(1, "Conservation specialization is required"),
  certificationLevel: z.string().min(1, "Certification level is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function ForestGuardConservationOfficerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      officerId: "",
      password: "",
      conservationCredentials: "",
      officerLevel: "",
      protectedArea: "",
      specialization: "",
      certificationLevel: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/forest-guard-conservation-officer-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "forest-guard-conservation-officer",
          portalType: "conservation-officer"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Conservation Officer Login Successful",
          description: "Welcome to Forest Guard Conservation Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "conservation-officer");
        localStorage.setItem("userType", "forest-guard-conservation-officer");
        localStorage.setItem("protectedArea", data.protectedArea);
        
        window.location.href = "/forest-guard-conservation-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your conservation officer credentials.";
      setError(errorMessage);
      toast({
        title: "Conservation Officer Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const conservationCredentials = [
    { value: "certified-wildlife-biologist", label: "Certified Wildlife Biologist (CWB)" },
    { value: "forest-conservation-specialist", label: "Forest Conservation Specialist" },
    { value: "protected-area-manager", label: "Protected Area Management Certified" },
    { value: "wildlife-law-enforcement", label: "Wildlife Law Enforcement Officer" },
    { value: "ecosystem-restoration-specialist", label: "Ecosystem Restoration Specialist" },
    { value: "biodiversity-conservation-expert", label: "Biodiversity Conservation Expert" }
  ];

  const officerLevels = [
    { value: "senior-conservation-officer", label: "Senior Conservation Officer" },
    { value: "conservation-officer", label: "Conservation Officer" },
    { value: "assistant-conservation-officer", label: "Assistant Conservation Officer" },
    { value: "field-conservation-specialist", label: "Field Conservation Specialist" },
    { value: "wildlife-protection-officer", label: "Wildlife Protection Officer" },
    { value: "conservation-technician", label: "Conservation Technician" }
  ];

  const protectedAreas = [
    { value: "sapo-national-park", label: "Sapo National Park (Sinoe County)" },
    { value: "nimba-nature-reserve", label: "East Nimba Nature Reserve" },
    { value: "gola-forest-reserve", label: "Gola Forest National Reserve" },
    { value: "grebo-national-forest", label: "Grebo National Forest" },
    { value: "kpelle-national-forest", label: "Kpelle National Forest" },
    { value: "krahn-bassa-forest", label: "Krahn-Bassa National Forest" },
    { value: "marshall-wetlands", label: "Marshall Wetlands Reserve" },
    { value: "community-forests", label: "Community Forest Management Areas" }
  ];

  const specializations = [
    { value: "endangered-species-protection", label: "Endangered Species Protection" },
    { value: "anti-poaching-operations", label: "Anti-Poaching Operations" },
    { value: "habitat-restoration", label: "Habitat Restoration & Management" },
    { value: "wildlife-population-monitoring", label: "Wildlife Population Monitoring" },
    { value: "forest-fire-prevention", label: "Forest Fire Prevention & Control" },
    { value: "community-conservation", label: "Community-Based Conservation" },
    { value: "invasive-species-control", label: "Invasive Species Control" }
  ];

  const certificationLevels = [
    { value: "master-conservationist", label: "Master Conservationist" },
    { value: "senior-conservation-specialist", label: "Senior Conservation Specialist" },
    { value: "conservation-professional", label: "Conservation Professional" },
    { value: "field-conservation-officer", label: "Field Conservation Officer" },
    { value: "conservation-associate", label: "Conservation Associate" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Forest Guard Conservation Officer Login - Wildlife & Forest Conservation Management Access</title>
        <meta name="description" content="Secure access portal for conservation officers and wildlife protection specialists" />
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
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                <TreePine className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Forest Guard Portal
            </h1>
            <p className="text-slate-600">
              Conservation Officer - Wildlife & Forest Conservation Management
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Certified Conservation Officers Only
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
              <Label htmlFor="officerId">Conservation Officer ID</Label>
              <Input
                id="officerId"
                type="text"
                {...form.register("officerId")}
                className="w-full"
                placeholder="Enter your officer ID"
                data-testid="input-officer-id"
              />
              {form.formState.errors.officerId && (
                <p className="text-sm text-red-600">{form.formState.errors.officerId.message}</p>
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
                  {conservationCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.conservationCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.conservationCredentials.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="officerLevel">Officer Level</Label>
              <Select 
                value={form.watch("officerLevel")} 
                onValueChange={(value) => form.setValue("officerLevel", value)}
              >
                <SelectTrigger data-testid="select-officer-level">
                  <SelectValue placeholder="Select your officer level" />
                </SelectTrigger>
                <SelectContent>
                  {officerLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.officerLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.officerLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="protectedArea">Protected Area Assignment</Label>
              <Select 
                value={form.watch("protectedArea")} 
                onValueChange={(value) => form.setValue("protectedArea", value)}
              >
                <SelectTrigger data-testid="select-protected-area">
                  <SelectValue placeholder="Select your protected area" />
                </SelectTrigger>
                <SelectContent>
                  {protectedAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.protectedArea && (
                <p className="text-sm text-red-600">{form.formState.errors.protectedArea.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Conservation Specialization</Label>
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
              <Label htmlFor="certificationLevel">Certification Level</Label>
              <Select 
                value={form.watch("certificationLevel")} 
                onValueChange={(value) => form.setValue("certificationLevel", value)}
              >
                <SelectTrigger data-testid="select-certification-level">
                  <SelectValue placeholder="Select your certification level" />
                </SelectTrigger>
                <SelectContent>
                  {certificationLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.certificationLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.certificationLevel.message}</p>
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
                  Verifying Conservation Credentials...
                </div>
              ) : (
                "Access Conservation Officer Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Certified conservation officers only. All conservation activities are monitored for wildlife protection and forest management compliance.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Conservation Management Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}