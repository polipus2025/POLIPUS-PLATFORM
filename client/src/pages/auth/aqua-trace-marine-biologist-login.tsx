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
import { Shield, Fish, AlertCircle, Eye, EyeOff, Waves } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  biologistId: z.string().min(1, "Marine Biologist ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  marineCredentials: z.string().min(1, "Marine credentials are required"),
  researchLevel: z.string().min(1, "Research level is required"),
  studyArea: z.string().min(1, "Marine study area is required"),
  specialization: z.string().min(1, "Marine specialization is required"),
  academicCredentials: z.string().min(1, "Academic credentials are required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AquaTraceMarineBiologistLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      biologistId: "",
      password: "",
      marineCredentials: "",
      researchLevel: "",
      studyArea: "",
      specialization: "",
      academicCredentials: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/aqua-trace-marine-biologist-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "aqua-trace-marine-biologist",
          portalType: "marine-biologist"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Marine Biologist Login Successful",
          description: "Welcome to Aqua Trace Research Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "marine-biologist");
        localStorage.setItem("userType", "aqua-trace-marine-biologist");
        localStorage.setItem("studyArea", data.studyArea);
        
        window.location.href = "/aqua-trace-research-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your marine biologist credentials.";
      setError(errorMessage);
      toast({
        title: "Marine Biologist Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const marineCredentials = [
    { value: "certified-marine-biologist", label: "Certified Marine Biologist (CMB)" },
    { value: "fisheries-biologist", label: "Fisheries Biologist" },
    { value: "marine-ecology-specialist", label: "Marine Ecology Specialist" },
    { value: "oceanography-researcher", label: "Oceanography Researcher" },
    { value: "marine-conservation-biologist", label: "Marine Conservation Biologist" },
    { value: "aquaculture-specialist", label: "Aquaculture Specialist" },
    { value: "coral-reef-specialist", label: "Coral Reef Specialist" }
  ];

  const researchLevels = [
    { value: "principal-marine-scientist", label: "Principal Marine Research Scientist" },
    { value: "senior-marine-biologist", label: "Senior Marine Biologist" },
    { value: "research-marine-biologist", label: "Research Marine Biologist" },
    { value: "field-marine-biologist", label: "Field Marine Biologist" },
    { value: "marine-research-technician", label: "Marine Research Technician" },
    { value: "marine-research-assistant", label: "Marine Research Assistant" }
  ];

  const studyAreas = [
    { value: "liberian-continental-shelf", label: "Liberian Continental Shelf Research" },
    { value: "monrovia-coastal-waters", label: "Monrovia Coastal Waters Study" },
    { value: "atlantic-fisheries-research", label: "West Atlantic Fisheries Research" },
    { value: "mesurado-river-estuary", label: "Mesurado River Estuary Ecosystem" },
    { value: "west-african-mangroves", label: "West African Mangrove Systems" },
    { value: "liberian-sea-turtle-research", label: "Liberian Sea Turtle Conservation" },
    { value: "coastal-fish-population", label: "Coastal Fish Population Studies" },
    { value: "marine-protected-areas", label: "Marine Protected Areas Research" }
  ];

  const specializations = [
    { value: "fisheries-stock-assessment", label: "Fisheries Stock Assessment" },
    { value: "marine-biodiversity", label: "Marine Biodiversity Conservation" },
    { value: "coral-reef-ecology", label: "Coral Reef Ecology & Health" },
    { value: "sea-turtle-conservation", label: "Sea Turtle Conservation Biology" },
    { value: "mangrove-ecosystem-research", label: "Mangrove Ecosystem Research" },
    { value: "marine-pollution-studies", label: "Marine Pollution & Toxicology" },
    { value: "coastal-zone-management", label: "Coastal Zone Management" },
    { value: "marine-climate-change", label: "Marine Climate Change Research" }
  ];

  const academicCredentials = [
    { value: "phd-marine-biology", label: "Ph.D. in Marine Biology" },
    { value: "phd-oceanography", label: "Ph.D. in Oceanography" },
    { value: "phd-fisheries-science", label: "Ph.D. in Fisheries Science" },
    { value: "masters-marine-science", label: "M.S. in Marine Science" },
    { value: "masters-aquatic-biology", label: "M.S. in Aquatic Biology" },
    { value: "bachelors-marine-biology", label: "B.S. in Marine Biology" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Aqua Trace Marine Biologist Login - Marine Research & Conservation Science Access</title>
        <meta name="description" content="Secure access portal for marine biologists and ocean research scientists" />
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
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Fish className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Aqua Trace Portal
            </h1>
            <p className="text-slate-600">
              Marine Biologist - Marine Research & Conservation Science
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Certified Marine Biologists Only
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
              <Label htmlFor="biologistId">Marine Biologist ID</Label>
              <Input
                id="biologistId"
                type="text"
                {...form.register("biologistId")}
                className="w-full"
                placeholder="Enter your biologist ID"
                data-testid="input-biologist-id"
              />
              {form.formState.errors.biologistId && (
                <p className="text-sm text-red-600">{form.formState.errors.biologistId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="marineCredentials">Marine Credentials</Label>
              <Select 
                value={form.watch("marineCredentials")} 
                onValueChange={(value) => form.setValue("marineCredentials", value)}
              >
                <SelectTrigger data-testid="select-marine-credentials">
                  <SelectValue placeholder="Select your credentials" />
                </SelectTrigger>
                <SelectContent>
                  {marineCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.marineCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.marineCredentials.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="researchLevel">Research Level</Label>
              <Select 
                value={form.watch("researchLevel")} 
                onValueChange={(value) => form.setValue("researchLevel", value)}
              >
                <SelectTrigger data-testid="select-research-level">
                  <SelectValue placeholder="Select your research level" />
                </SelectTrigger>
                <SelectContent>
                  {researchLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.researchLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.researchLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studyArea">Marine Study Area</Label>
              <Select 
                value={form.watch("studyArea")} 
                onValueChange={(value) => form.setValue("studyArea", value)}
              >
                <SelectTrigger data-testid="select-study-area">
                  <SelectValue placeholder="Select your study area" />
                </SelectTrigger>
                <SelectContent>
                  {studyAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.studyArea && (
                <p className="text-sm text-red-600">{form.formState.errors.studyArea.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Marine Specialization</Label>
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
              <Label htmlFor="academicCredentials">Academic Credentials</Label>
              <Select 
                value={form.watch("academicCredentials")} 
                onValueChange={(value) => form.setValue("academicCredentials", value)}
              >
                <SelectTrigger data-testid="select-academic-credentials">
                  <SelectValue placeholder="Select your academic credentials" />
                </SelectTrigger>
                <SelectContent>
                  {academicCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.academicCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.academicCredentials.message}</p>
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
                  Verifying Marine Research Credentials...
                </div>
              ) : (
                "Access Marine Research Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Certified marine biologists only. All marine research activities are monitored for scientific integrity and conservation compliance.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Marine Research Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}