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
import { Shield, Waves, AlertCircle, Eye, EyeOff, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  conservationistId: z.string().min(1, "Marine Conservationist ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  conservationCredentials: z.string().min(1, "Conservation credentials are required"),
  conservationLevel: z.string().min(1, "Conservation level is required"),
  marineEcosystem: z.string().min(1, "Marine ecosystem is required"),
  specialization: z.string().min(1, "Conservation specialization is required"),
  certificationLevel: z.string().min(1, "Certification level is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function BlueCarbonMarineConservationLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      conservationistId: "",
      password: "",
      conservationCredentials: "",
      conservationLevel: "",
      marineEcosystem: "",
      specialization: "",
      certificationLevel: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/blue-carbon-marine-conservation-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "blue-carbon-marine-conservation",
          portalType: "marine-conservation"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Marine Conservation Login Successful",
          description: "Welcome to Blue Carbon 360 Conservation Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "marine-conservationist");
        localStorage.setItem("userType", "blue-carbon-marine-conservation");
        localStorage.setItem("marineEcosystem", data.marineEcosystem);
        
        window.location.href = "/blue-carbon-conservation-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your marine conservation credentials.";
      setError(errorMessage);
      toast({
        title: "Marine Conservation Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const conservationCredentials = [
    { value: "certified-marine-conservationist", label: "Certified Marine Conservationist (CMC)" },
    { value: "blue-carbon-specialist", label: "Blue Carbon Ecosystem Specialist" },
    { value: "mangrove-restoration-expert", label: "Mangrove Restoration Expert" },
    { value: "marine-protected-area-manager", label: "Marine Protected Area Manager" },
    { value: "coastal-ecosystem-specialist", label: "Coastal Ecosystem Specialist" },
    { value: "seagrass-conservation-expert", label: "Seagrass Conservation Expert" },
    { value: "coral-reef-conservationist", label: "Coral Reef Conservationist" }
  ];

  const conservationLevels = [
    { value: "senior-marine-conservationist", label: "Senior Marine Conservationist" },
    { value: "principal-conservation-scientist", label: "Principal Conservation Scientist" },
    { value: "marine-conservation-manager", label: "Marine Conservation Manager" },
    { value: "field-conservation-coordinator", label: "Field Conservation Coordinator" },
    { value: "ecosystem-restoration-specialist", label: "Ecosystem Restoration Specialist" },
    { value: "conservation-project-officer", label: "Conservation Project Officer" }
  ];

  const marineEcosystems = [
    { value: "liberian-mangrove-systems", label: "Liberian Mangrove Systems" },
    { value: "west-african-coastal-wetlands", label: "West African Coastal Wetlands" },
    { value: "mesurado-wetlands-complex", label: "Mesurado Wetlands Complex" },
    { value: "sapo-coastal-mangroves", label: "Sapo Coastal Mangrove Forests" },
    { value: "liberian-seagrass-beds", label: "Liberian Seagrass Beds" },
    { value: "atlantic-coral-reefs", label: "West Atlantic Coral Reef Systems" },
    { value: "coastal-lagoon-ecosystems", label: "Coastal Lagoon Ecosystems" },
    { value: "estuarine-conservation-areas", label: "Estuarine Conservation Areas" }
  ];

  const specializations = [
    { value: "mangrove-ecosystem-restoration", label: "Mangrove Ecosystem Restoration" },
    { value: "blue-carbon-sequestration", label: "Blue Carbon Sequestration Projects" },
    { value: "coastal-habitat-protection", label: "Coastal Habitat Protection" },
    { value: "community-based-conservation", label: "Community-Based Marine Conservation" },
    { value: "marine-biodiversity-conservation", label: "Marine Biodiversity Conservation" },
    { value: "sustainable-coastal-management", label: "Sustainable Coastal Management" },
    { value: "climate-adaptation-planning", label: "Climate Adaptation Planning" },
    { value: "ecosystem-services-enhancement", label: "Ecosystem Services Enhancement" }
  ];

  const certificationLevels = [
    { value: "master-marine-conservationist", label: "Master Marine Conservationist" },
    { value: "certified-blue-carbon-specialist", label: "Certified Blue Carbon Specialist" },
    { value: "advanced-restoration-practitioner", label: "Advanced Ecosystem Restoration Practitioner" },
    { value: "marine-conservation-professional", label: "Marine Conservation Professional" },
    { value: "coastal-management-specialist", label: "Coastal Management Specialist" },
    { value: "conservation-project-manager", label: "Conservation Project Manager" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Blue Carbon 360 Marine Conservation Login - Ecosystem Restoration & Protection Access</title>
        <meta name="description" content="Secure access portal for marine conservationists and ecosystem restoration specialists" />
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
              <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Blue Carbon 360 Portal
            </h1>
            <p className="text-slate-600">
              Marine Conservation - Ecosystem Restoration & Protection
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Certified Marine Conservationists Only
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
              <Label htmlFor="conservationistId">Marine Conservationist ID</Label>
              <Input
                id="conservationistId"
                type="text"
                {...form.register("conservationistId")}
                className="w-full"
                placeholder="Enter your conservationist ID"
                data-testid="input-conservationist-id"
              />
              {form.formState.errors.conservationistId && (
                <p className="text-sm text-red-600">{form.formState.errors.conservationistId.message}</p>
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
              <Label htmlFor="conservationLevel">Conservation Level</Label>
              <Select 
                value={form.watch("conservationLevel")} 
                onValueChange={(value) => form.setValue("conservationLevel", value)}
              >
                <SelectTrigger data-testid="select-conservation-level">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {conservationLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.conservationLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.conservationLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="marineEcosystem">Marine Ecosystem</Label>
              <Select 
                value={form.watch("marineEcosystem")} 
                onValueChange={(value) => form.setValue("marineEcosystem", value)}
              >
                <SelectTrigger data-testid="select-marine-ecosystem">
                  <SelectValue placeholder="Select your ecosystem" />
                </SelectTrigger>
                <SelectContent>
                  {marineEcosystems.map((ecosystem) => (
                    <SelectItem key={ecosystem.value} value={ecosystem.value}>
                      {ecosystem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.marineEcosystem && (
                <p className="text-sm text-red-600">{form.formState.errors.marineEcosystem.message}</p>
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
                  Verifying Conservation Credentials...
                </div>
              ) : (
                "Access Marine Conservation Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Certified marine conservationists only. All ecosystem restoration and marine protection activities are monitored for conservation impact.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Marine Conservation Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}