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
import { Shield, Leaf, AlertCircle, Eye, EyeOff, TreePine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  environmentalistId: z.string().min(1, "Environmental Specialist ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  environmentalCredentials: z.string().min(1, "Environmental credentials are required"),
  specialization: z.string().min(1, "Environmental specialization is required"),
  certificationLevel: z.string().min(1, "Certification level is required"),
  monitoringArea: z.string().min(1, "Monitoring area is required"),
  complianceFramework: z.string().min(1, "Compliance framework is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function MineWatchEnvironmentalPortalLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      environmentalistId: "",
      password: "",
      environmentalCredentials: "",
      specialization: "",
      certificationLevel: "",
      monitoringArea: "",
      complianceFramework: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/mine-watch-environmental-portal-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "mine-watch-environmental-portal",
          portalType: "environmental-portal"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Environmental Portal Login Successful",
          description: "Welcome to Mine Watch Environmental Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "environmental-specialist");
        localStorage.setItem("userType", "mine-watch-environmental-portal");
        localStorage.setItem("monitoringArea", data.monitoringArea);
        
        window.location.href = "/mine-watch-environmental-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your environmental specialist credentials.";
      setError(errorMessage);
      toast({
        title: "Environmental Portal Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const environmentalCredentials = [
    { value: "certified-environmental-professional", label: "Certified Environmental Professional (CEP)" },
    { value: "environmental-impact-assessor", label: "Environmental Impact Assessor" },
    { value: "pollution-control-specialist", label: "Pollution Control Specialist" },
    { value: "water-quality-specialist", label: "Water Quality Specialist" },
    { value: "air-quality-monitor", label: "Air Quality Monitoring Specialist" },
    { value: "soil-contamination-expert", label: "Soil Contamination Expert" }
  ];

  const specializations = [
    { value: "mining-environmental-impact", label: "Mining Environmental Impact Assessment" },
    { value: "water-resource-protection", label: "Water Resource Protection" },
    { value: "air-quality-monitoring", label: "Air Quality Monitoring" },
    { value: "soil-erosion-control", label: "Soil Erosion & Contamination Control" },
    { value: "wildlife-habitat-protection", label: "Wildlife Habitat Protection" },
    { value: "restoration-rehabilitation", label: "Land Restoration & Rehabilitation" },
    { value: "waste-management", label: "Mining Waste Management" }
  ];

  const certificationLevels = [
    { value: "senior-environmental-specialist", label: "Senior Environmental Specialist" },
    { value: "environmental-compliance-manager", label: "Environmental Compliance Manager" },
    { value: "environmental-analyst", label: "Environmental Analyst" },
    { value: "field-environmental-monitor", label: "Field Environmental Monitor" },
    { value: "environmental-technician", label: "Environmental Technician" }
  ];

  const monitoringAreas = [
    { value: "nimba-iron-ore-region", label: "Nimba Iron Ore Mining Region" },
    { value: "bong-gold-mining-area", label: "Bong County Gold Mining Area" },
    { value: "grand-cape-mount-rutile", label: "Grand Cape Mount Rutile Mining" },
    { value: "grand-bassa-iron-ore", label: "Grand Bassa Iron Ore Region" },
    { value: "sinoe-titanium-area", label: "Sinoe County Titanium Mining" },
    { value: "lofa-diamond-region", label: "Lofa County Diamond Mining" },
    { value: "national-monitoring", label: "National Environmental Monitoring" }
  ];

  const complianceFrameworks = [
    { value: "liberian-epa-standards", label: "Liberian EPA Environmental Standards" },
    { value: "international-mining-standards", label: "International Mining Environmental Standards" },
    { value: "world-bank-guidelines", label: "World Bank Environmental Guidelines" },
    { value: "ifc-performance-standards", label: "IFC Environmental Performance Standards" },
    { value: "extractive-industries-standards", label: "Extractive Industries Transparency Standards" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Mine Watch Environmental Portal Login - Environmental Compliance & Monitoring Access</title>
        <meta name="description" content="Secure access portal for environmental specialists and compliance monitors" />
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
                <Leaf className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Mine Watch Portal
            </h1>
            <p className="text-slate-600">
              Environmental Portal - Mining Environmental Compliance & Monitoring
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Certified Environmental Specialists Only
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
              <Label htmlFor="environmentalistId">Environmental Specialist ID</Label>
              <Input
                id="environmentalistId"
                type="text"
                {...form.register("environmentalistId")}
                className="w-full"
                placeholder="Enter your specialist ID"
                data-testid="input-environmentalist-id"
              />
              {form.formState.errors.environmentalistId && (
                <p className="text-sm text-red-600">{form.formState.errors.environmentalistId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="environmentalCredentials">Environmental Credentials</Label>
              <Select 
                value={form.watch("environmentalCredentials")} 
                onValueChange={(value) => form.setValue("environmentalCredentials", value)}
              >
                <SelectTrigger data-testid="select-environmental-credentials">
                  <SelectValue placeholder="Select your credentials" />
                </SelectTrigger>
                <SelectContent>
                  {environmentalCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.environmentalCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.environmentalCredentials.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Environmental Specialization</Label>
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
              <Label htmlFor="monitoringArea">Monitoring Area</Label>
              <Select 
                value={form.watch("monitoringArea")} 
                onValueChange={(value) => form.setValue("monitoringArea", value)}
              >
                <SelectTrigger data-testid="select-monitoring-area">
                  <SelectValue placeholder="Select your monitoring area" />
                </SelectTrigger>
                <SelectContent>
                  {monitoringAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.monitoringArea && (
                <p className="text-sm text-red-600">{form.formState.errors.monitoringArea.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="complianceFramework">Compliance Framework</Label>
              <Select 
                value={form.watch("complianceFramework")} 
                onValueChange={(value) => form.setValue("complianceFramework", value)}
              >
                <SelectTrigger data-testid="select-compliance-framework">
                  <SelectValue placeholder="Select compliance framework" />
                </SelectTrigger>
                <SelectContent>
                  {complianceFrameworks.map((framework) => (
                    <SelectItem key={framework.value} value={framework.value}>
                      {framework.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.complianceFramework && (
                <p className="text-sm text-red-600">{form.formState.errors.complianceFramework.message}</p>
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
                  Verifying Environmental Credentials...
                </div>
              ) : (
                "Access Environmental Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Certified environmental specialists only. All environmental monitoring activities are tracked for regulatory compliance.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Environmental Compliance Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}