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
import { Shield, Recycle, AlertCircle, Eye, EyeOff, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  managerId: z.string().min(1, "Sustainability Manager ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  sustainabilityCredentials: z.string().min(1, "Sustainability credentials are required"),
  managementLevel: z.string().min(1, "Management level is required"),
  sustainabilitySector: z.string().min(1, "Sustainability sector is required"),
  specialization: z.string().min(1, "Sustainability specialization is required"),
  certificationLevel: z.string().min(1, "Certification level is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function CarbonTraceSustainabilityManagerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      managerId: "",
      password: "",
      sustainabilityCredentials: "",
      managementLevel: "",
      sustainabilitySector: "",
      specialization: "",
      certificationLevel: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/carbon-trace-sustainability-manager-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "carbon-trace-sustainability-manager",
          portalType: "sustainability-manager"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Sustainability Manager Login Successful",
          description: "Welcome to Carbon Trace Sustainability Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "sustainability-manager");
        localStorage.setItem("userType", "carbon-trace-sustainability-manager");
        localStorage.setItem("sustainabilitySector", data.sustainabilitySector);
        
        window.location.href = "/carbon-trace-sustainability-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your sustainability manager credentials.";
      setError(errorMessage);
      toast({
        title: "Sustainability Manager Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sustainabilityCredentials = [
    { value: "certified-sustainability-manager", label: "Certified Sustainability Manager (CSM)" },
    { value: "sustainability-reporting-specialist", label: "Sustainability Reporting Specialist" },
    { value: "corporate-sustainability-officer", label: "Corporate Sustainability Officer" },
    { value: "environmental-management-systems", label: "Environmental Management Systems (EMS) Expert" },
    { value: "sustainable-development-manager", label: "Sustainable Development Manager" },
    { value: "carbon-footprint-specialist", label: "Carbon Footprint Specialist" },
    { value: "circular-economy-expert", label: "Circular Economy Expert" }
  ];

  const managementLevels = [
    { value: "chief-sustainability-officer", label: "Chief Sustainability Officer (CSO)" },
    { value: "director-sustainability", label: "Director of Sustainability" },
    { value: "senior-sustainability-manager", label: "Senior Sustainability Manager" },
    { value: "sustainability-program-manager", label: "Sustainability Program Manager" },
    { value: "environmental-compliance-manager", label: "Environmental Compliance Manager" },
    { value: "sustainability-coordinator", label: "Sustainability Coordinator" }
  ];

  const sustainabilitySectors = [
    { value: "liberian-agriculture-sustainability", label: "Liberian Agriculture Sustainability" },
    { value: "mining-environmental-sustainability", label: "Mining Environmental Sustainability" },
    { value: "forestry-sustainable-management", label: "Forestry Sustainable Management" },
    { value: "marine-coastal-sustainability", label: "Marine & Coastal Sustainability" },
    { value: "urban-sustainability-planning", label: "Urban Sustainability Planning" },
    { value: "renewable-energy-development", label: "Renewable Energy Development" },
    { value: "waste-management-sustainability", label: "Waste Management & Sustainability" },
    { value: "community-based-sustainability", label: "Community-Based Sustainability Programs" }
  ];

  const specializations = [
    { value: "carbon-management-strategy", label: "Carbon Management Strategy" },
    { value: "sustainability-reporting-frameworks", label: "Sustainability Reporting Frameworks (GRI, SASB)" },
    { value: "environmental-social-governance", label: "Environmental, Social & Governance (ESG)" },
    { value: "lifecycle-assessment", label: "Lifecycle Assessment (LCA)" },
    { value: "sustainable-supply-chain", label: "Sustainable Supply Chain Management" },
    { value: "stakeholder-engagement", label: "Stakeholder Engagement & Community Relations" },
    { value: "climate-adaptation-planning", label: "Climate Adaptation Planning" },
    { value: "sustainability-performance-metrics", label: "Sustainability Performance Metrics" }
  ];

  const certificationLevels = [
    { value: "iso-14001-lead-auditor", label: "ISO 14001 Lead Environmental Auditor" },
    { value: "gri-certified-sustainability-professional", label: "GRI Certified Sustainability Professional" },
    { value: "sustainability-accounting-standards", label: "Sustainability Accounting Standards Board (SASB)" },
    { value: "carbon-disclosure-project", label: "Carbon Disclosure Project (CDP) Specialist" },
    { value: "leed-accredited-professional", label: "LEED Accredited Professional" },
    { value: "sustainability-management-certification", label: "Sustainability Management Certification" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Carbon Trace Sustainability Manager Login - Corporate Sustainability & ESG Access</title>
        <meta name="description" content="Secure access portal for sustainability managers and ESG specialists" />
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
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Carbon Trace Portal
            </h1>
            <p className="text-slate-600">
              Sustainability Manager - Corporate Sustainability & ESG
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Certified Sustainability Managers Only
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
              <Label htmlFor="managerId">Sustainability Manager ID</Label>
              <Input
                id="managerId"
                type="text"
                {...form.register("managerId")}
                className="w-full"
                placeholder="Enter your manager ID"
                data-testid="input-manager-id"
              />
              {form.formState.errors.managerId && (
                <p className="text-sm text-red-600">{form.formState.errors.managerId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sustainabilityCredentials">Sustainability Credentials</Label>
              <Select 
                value={form.watch("sustainabilityCredentials")} 
                onValueChange={(value) => form.setValue("sustainabilityCredentials", value)}
              >
                <SelectTrigger data-testid="select-sustainability-credentials">
                  <SelectValue placeholder="Select your credentials" />
                </SelectTrigger>
                <SelectContent>
                  {sustainabilityCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.sustainabilityCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.sustainabilityCredentials.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="managementLevel">Management Level</Label>
              <Select 
                value={form.watch("managementLevel")} 
                onValueChange={(value) => form.setValue("managementLevel", value)}
              >
                <SelectTrigger data-testid="select-management-level">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {managementLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.managementLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.managementLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sustainabilitySector">Sustainability Sector</Label>
              <Select 
                value={form.watch("sustainabilitySector")} 
                onValueChange={(value) => form.setValue("sustainabilitySector", value)}
              >
                <SelectTrigger data-testid="select-sustainability-sector">
                  <SelectValue placeholder="Select your sector" />
                </SelectTrigger>
                <SelectContent>
                  {sustainabilitySectors.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.sustainabilitySector && (
                <p className="text-sm text-red-600">{form.formState.errors.sustainabilitySector.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Sustainability Specialization</Label>
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
                  <SelectValue placeholder="Select your certification" />
                </SelectTrigger>
                <SelectContent>
                  {certificationLevels.map((cert) => (
                    <SelectItem key={cert.value} value={cert.value}>
                      {cert.label}
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
                  Verifying Sustainability Credentials...
                </div>
              ) : (
                "Access Sustainability Management Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Certified sustainability managers only. All ESG reporting and sustainability initiatives are monitored for compliance and impact.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Sustainability Management Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}