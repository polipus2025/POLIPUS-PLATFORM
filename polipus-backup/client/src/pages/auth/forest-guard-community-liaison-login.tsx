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
import { Shield, Users, AlertCircle, Eye, EyeOff, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  liaisonId: z.string().min(1, "Community Liaison ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  liaisonCredentials: z.string().min(1, "Liaison credentials are required"),
  engagementLevel: z.string().min(1, "Engagement level is required"),
  communityArea: z.string().min(1, "Community area is required"),
  specialization: z.string().min(1, "Community specialization is required"),
  culturalCompetency: z.string().min(1, "Cultural competency is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function ForestGuardCommunityLiaisonLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      liaisonId: "",
      password: "",
      liaisonCredentials: "",
      engagementLevel: "",
      communityArea: "",
      specialization: "",
      culturalCompetency: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/forest-guard-community-liaison-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "forest-guard-community-liaison",
          portalType: "community-liaison"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Community Liaison Login Successful",
          description: "Welcome to Forest Guard Community Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "community-liaison");
        localStorage.setItem("userType", "forest-guard-community-liaison");
        localStorage.setItem("communityArea", data.communityArea);
        
        window.location.href = "/forest-guard-community-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your community liaison credentials.";
      setError(errorMessage);
      toast({
        title: "Community Liaison Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const liaisonCredentials = [
    { value: "community-development-specialist", label: "Community Development Specialist" },
    { value: "indigenous-rights-advocate", label: "Indigenous Rights Advocate" },
    { value: "community-engagement-coordinator", label: "Community Engagement Coordinator" },
    { value: "cultural-preservation-specialist", label: "Cultural Preservation Specialist" },
    { value: "participatory-development-facilitator", label: "Participatory Development Facilitator" },
    { value: "conflict-resolution-mediator", label: "Conflict Resolution Mediator" }
  ];

  const engagementLevels = [
    { value: "senior-community-liaison", label: "Senior Community Liaison" },
    { value: "community-engagement-manager", label: "Community Engagement Manager" },
    { value: "field-community-coordinator", label: "Field Community Coordinator" },
    { value: "cultural-liaison-officer", label: "Cultural Liaison Officer" },
    { value: "community-outreach-specialist", label: "Community Outreach Specialist" },
    { value: "traditional-knowledge-coordinator", label: "Traditional Knowledge Coordinator" }
  ];

  const communityAreas = [
    { value: "sapo-surrounding-communities", label: "Sapo National Park Surrounding Communities" },
    { value: "nimba-indigenous-communities", label: "Nimba Mountains Indigenous Communities" },
    { value: "gola-forest-villages", label: "Gola Forest Border Villages" },
    { value: "kpelle-ethnic-communities", label: "Kpelle Ethnic Communities" },
    { value: "grebo-tribal-areas", label: "Grebo Tribal Forest Areas" },
    { value: "krahn-traditional-territories", label: "Krahn Traditional Territories" },
    { value: "kissi-forest-communities", label: "Kissi Forest Communities" },
    { value: "coastal-fishing-villages", label: "Coastal Fishing & Mangrove Communities" }
  ];

  const specializations = [
    { value: "indigenous-knowledge-systems", label: "Indigenous Knowledge Systems" },
    { value: "traditional-forest-management", label: "Traditional Forest Management Practices" },
    { value: "community-based-conservation", label: "Community-Based Conservation" },
    { value: "participatory-forest-monitoring", label: "Participatory Forest Monitoring" },
    { value: "sustainable-livelihood-development", label: "Sustainable Livelihood Development" },
    { value: "cultural-resource-protection", label: "Cultural Resource Protection" },
    { value: "eco-tourism-development", label: "Community Eco-Tourism Development" }
  ];

  const culturalCompetencies = [
    { value: "multi-ethnic-fluency", label: "Multi-Ethnic Language Fluency" },
    { value: "traditional-governance-understanding", label: "Traditional Governance Systems" },
    { value: "indigenous-rights-framework", label: "Indigenous Rights Legal Framework" },
    { value: "cultural-protocol-expertise", label: "Cultural Protocol & Ceremony Expertise" },
    { value: "conflict-mediation-skills", label: "Inter-Community Conflict Mediation" },
    { value: "participatory-research-methods", label: "Participatory Research Methods" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Forest Guard Community Liaison Login - Community Engagement & Cultural Preservation Access</title>
        <meta name="description" content="Secure access portal for community liaisons and cultural preservation specialists" />
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
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Forest Guard Portal
            </h1>
            <p className="text-slate-600">
              Community Liaison - Community Engagement & Cultural Preservation
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Certified Community Liaisons Only
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
              <Label htmlFor="liaisonId">Community Liaison ID</Label>
              <Input
                id="liaisonId"
                type="text"
                {...form.register("liaisonId")}
                className="w-full"
                placeholder="Enter your liaison ID"
                data-testid="input-liaison-id"
              />
              {form.formState.errors.liaisonId && (
                <p className="text-sm text-red-600">{form.formState.errors.liaisonId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="liaisonCredentials">Liaison Credentials</Label>
              <Select 
                value={form.watch("liaisonCredentials")} 
                onValueChange={(value) => form.setValue("liaisonCredentials", value)}
              >
                <SelectTrigger data-testid="select-liaison-credentials">
                  <SelectValue placeholder="Select your credentials" />
                </SelectTrigger>
                <SelectContent>
                  {liaisonCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.liaisonCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.liaisonCredentials.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="engagementLevel">Engagement Level</Label>
              <Select 
                value={form.watch("engagementLevel")} 
                onValueChange={(value) => form.setValue("engagementLevel", value)}
              >
                <SelectTrigger data-testid="select-engagement-level">
                  <SelectValue placeholder="Select your engagement level" />
                </SelectTrigger>
                <SelectContent>
                  {engagementLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.engagementLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.engagementLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="communityArea">Community Area</Label>
              <Select 
                value={form.watch("communityArea")} 
                onValueChange={(value) => form.setValue("communityArea", value)}
              >
                <SelectTrigger data-testid="select-community-area">
                  <SelectValue placeholder="Select your community area" />
                </SelectTrigger>
                <SelectContent>
                  {communityAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.communityArea && (
                <p className="text-sm text-red-600">{form.formState.errors.communityArea.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Community Specialization</Label>
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
              <Label htmlFor="culturalCompetency">Cultural Competency</Label>
              <Select 
                value={form.watch("culturalCompetency")} 
                onValueChange={(value) => form.setValue("culturalCompetency", value)}
              >
                <SelectTrigger data-testid="select-cultural-competency">
                  <SelectValue placeholder="Select your cultural competency" />
                </SelectTrigger>
                <SelectContent>
                  {culturalCompetencies.map((competency) => (
                    <SelectItem key={competency.value} value={competency.value}>
                      {competency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.culturalCompetency && (
                <p className="text-sm text-red-600">{form.formState.errors.culturalCompetency.message}</p>
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
                  Verifying Community Credentials...
                </div>
              ) : (
                "Access Community Liaison Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Certified community liaisons only. All community engagement activities are monitored for cultural sensitivity and indigenous rights compliance.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Community Engagement Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}