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
import { Shield, Bird, AlertCircle, Eye, EyeOff, TreePine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  biologistId: z.string().min(1, "Wildlife Biologist ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  biologistCredentials: z.string().min(1, "Biologist credentials are required"),
  researchLevel: z.string().min(1, "Research level is required"),
  studyArea: z.string().min(1, "Study area is required"),
  specialization: z.string().min(1, "Wildlife specialization is required"),
  academicCredentials: z.string().min(1, "Academic credentials are required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function ForestGuardWildlifeBiologistLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      biologistId: "",
      password: "",
      biologistCredentials: "",
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
      const result = await apiRequest("/api/auth/forest-guard-wildlife-biologist-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "forest-guard-wildlife-biologist",
          portalType: "wildlife-biologist"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Wildlife Biologist Login Successful",
          description: "Welcome to Forest Guard Research Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "wildlife-biologist");
        localStorage.setItem("userType", "forest-guard-wildlife-biologist");
        localStorage.setItem("studyArea", data.studyArea);
        
        window.location.href = "/forest-guard-research-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your wildlife biologist credentials.";
      setError(errorMessage);
      toast({
        title: "Wildlife Biologist Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const biologistCredentials = [
    { value: "certified-wildlife-biologist", label: "Certified Wildlife Biologist (CWB)" },
    { value: "associate-wildlife-biologist", label: "Associate Wildlife Biologist (AWB)" },
    { value: "wildlife-research-scientist", label: "Wildlife Research Scientist" },
    { value: "conservation-biologist", label: "Conservation Biologist" },
    { value: "ecology-specialist", label: "Ecology Specialist" },
    { value: "mammalogy-specialist", label: "Mammalogy Specialist" },
    { value: "ornithology-specialist", label: "Ornithology Specialist" }
  ];

  const researchLevels = [
    { value: "principal-researcher", label: "Principal Research Scientist" },
    { value: "senior-biologist", label: "Senior Wildlife Biologist" },
    { value: "research-biologist", label: "Research Biologist" },
    { value: "field-biologist", label: "Field Biologist" },
    { value: "wildlife-technician", label: "Wildlife Research Technician" },
    { value: "research-assistant", label: "Research Assistant" }
  ];

  const studyAreas = [
    { value: "sapo-ecosystem-research", label: "Sapo National Park Ecosystem Research" },
    { value: "nimba-biodiversity-study", label: "Nimba Mountains Biodiversity Study" },
    { value: "gola-forest-wildlife", label: "Gola Forest Wildlife Population Study" },
    { value: "liberian-chimpanzee-research", label: "Liberian Chimpanzee Conservation Research" },
    { value: "forest-elephant-tracking", label: "Forest Elephant Migration Tracking" },
    { value: "primate-behavior-study", label: "Primate Behavior & Habitat Study" },
    { value: "endemic-species-research", label: "Endemic Species Conservation Research" },
    { value: "migratory-bird-research", label: "Migratory Bird Population Research" }
  ];

  const specializations = [
    { value: "primate-research", label: "Primate Research & Conservation" },
    { value: "large-mammal-ecology", label: "Large Mammal Ecology" },
    { value: "avian-ecology", label: "Avian Ecology & Migration" },
    { value: "endangered-species", label: "Endangered Species Recovery" },
    { value: "population-genetics", label: "Population Genetics & Diversity" },
    { value: "habitat-assessment", label: "Habitat Assessment & Restoration" },
    { value: "behavioral-ecology", label: "Behavioral Ecology" },
    { value: "conservation-genetics", label: "Conservation Genetics" }
  ];

  const academicCredentials = [
    { value: "phd-wildlife-biology", label: "Ph.D. in Wildlife Biology" },
    { value: "phd-ecology", label: "Ph.D. in Ecology" },
    { value: "phd-conservation-biology", label: "Ph.D. in Conservation Biology" },
    { value: "masters-wildlife-management", label: "M.S. in Wildlife Management" },
    { value: "masters-ecology", label: "M.S. in Ecology & Evolution" },
    { value: "bachelors-biology", label: "B.S. in Biology/Wildlife Science" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Forest Guard Wildlife Biologist Login - Wildlife Research & Conservation Science Access</title>
        <meta name="description" content="Secure access portal for wildlife biologists and conservation researchers" />
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
                <Bird className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Forest Guard Portal
            </h1>
            <p className="text-slate-600">
              Wildlife Biologist - Wildlife Research & Conservation Science
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Certified Wildlife Biologists Only
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
              <Label htmlFor="biologistId">Wildlife Biologist ID</Label>
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
              <Label htmlFor="biologistCredentials">Biologist Credentials</Label>
              <Select 
                value={form.watch("biologistCredentials")} 
                onValueChange={(value) => form.setValue("biologistCredentials", value)}
              >
                <SelectTrigger data-testid="select-biologist-credentials">
                  <SelectValue placeholder="Select your credentials" />
                </SelectTrigger>
                <SelectContent>
                  {biologistCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.biologistCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.biologistCredentials.message}</p>
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
              <Label htmlFor="studyArea">Study Area</Label>
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
              <Label htmlFor="specialization">Wildlife Specialization</Label>
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
                  Verifying Research Credentials...
                </div>
              ) : (
                "Access Wildlife Research Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Certified wildlife biologists only. All research activities are monitored for scientific integrity and conservation impact.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Wildlife Research Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}