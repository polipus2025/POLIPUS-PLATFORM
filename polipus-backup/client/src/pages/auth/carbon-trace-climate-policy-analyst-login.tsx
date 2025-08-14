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
import { Shield, FileBarChart, AlertCircle, Eye, EyeOff, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  analystId: z.string().min(1, "Climate Policy Analyst ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  policyCredentials: z.string().min(1, "Policy credentials are required"),
  analystLevel: z.string().min(1, "Analyst level is required"),
  policyFocus: z.string().min(1, "Policy focus is required"),
  specialization: z.string().min(1, "Climate specialization is required"),
  institutionalAffiliation: z.string().min(1, "Institutional affiliation is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function CarbonTraceClimatePolicyAnalystLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      analystId: "",
      password: "",
      policyCredentials: "",
      analystLevel: "",
      policyFocus: "",
      specialization: "",
      institutionalAffiliation: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/carbon-trace-climate-policy-analyst-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "carbon-trace-climate-policy-analyst",
          portalType: "climate-policy-analyst"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Climate Policy Analyst Login Successful",
          description: "Welcome to Carbon Trace Policy Analysis Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "climate-policy-analyst");
        localStorage.setItem("userType", "carbon-trace-climate-policy-analyst");
        localStorage.setItem("policyFocus", data.policyFocus);
        
        window.location.href = "/carbon-trace-policy-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your climate policy analyst credentials.";
      setError(errorMessage);
      toast({
        title: "Climate Policy Analyst Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const policyCredentials = [
    { value: "certified-climate-policy-analyst", label: "Certified Climate Policy Analyst" },
    { value: "environmental-policy-specialist", label: "Environmental Policy Specialist" },
    { value: "climate-change-analyst", label: "Climate Change Analyst" },
    { value: "carbon-policy-researcher", label: "Carbon Policy Researcher" },
    { value: "climate-economics-analyst", label: "Climate Economics Analyst" },
    { value: "international-climate-policy", label: "International Climate Policy Expert" },
    { value: "climate-adaptation-policy", label: "Climate Adaptation Policy Specialist" }
  ];

  const analystLevels = [
    { value: "senior-climate-policy-analyst", label: "Senior Climate Policy Analyst" },
    { value: "principal-policy-researcher", label: "Principal Policy Researcher" },
    { value: "climate-policy-director", label: "Climate Policy Director" },
    { value: "policy-analysis-manager", label: "Policy Analysis Manager" },
    { value: "climate-policy-consultant", label: "Climate Policy Consultant" },
    { value: "research-policy-analyst", label: "Research Policy Analyst" }
  ];

  const policyFocuses = [
    { value: "liberian-climate-policy-framework", label: "Liberian Climate Policy Framework" },
    { value: "ndc-implementation-policy", label: "NDC Implementation Policy" },
    { value: "carbon-pricing-mechanisms", label: "Carbon Pricing Mechanisms" },
    { value: "redd-plus-policy-analysis", label: "REDD+ Policy Analysis" },
    { value: "climate-adaptation-policy", label: "Climate Adaptation Policy" },
    { value: "renewable-energy-policy", label: "Renewable Energy Policy" },
    { value: "climate-finance-policy", label: "Climate Finance Policy" },
    { value: "international-climate-agreements", label: "International Climate Agreements" }
  ];

  const specializations = [
    { value: "carbon-tax-policy-analysis", label: "Carbon Tax Policy Analysis" },
    { value: "emission-trading-systems", label: "Emission Trading Systems (ETS)" },
    { value: "climate-mitigation-policy", label: "Climate Mitigation Policy" },
    { value: "climate-adaptation-strategies", label: "Climate Adaptation Strategies" },
    { value: "green-growth-policy", label: "Green Growth Policy Analysis" },
    { value: "climate-justice-policy", label: "Climate Justice Policy" },
    { value: "sectoral-decarbonization-policy", label: "Sectoral Decarbonization Policy" },
    { value: "climate-risk-assessment", label: "Climate Risk Assessment & Policy" }
  ];

  const institutionalAffiliations = [
    { value: "liberian-government-epa", label: "Liberian Government - EPA" },
    { value: "ministry-environment-climate", label: "Ministry of Environment & Climate Change" },
    { value: "university-liberia-research", label: "University of Liberia - Research Institute" },
    { value: "international-development-organizations", label: "International Development Organizations" },
    { value: "world-bank-climate-unit", label: "World Bank Climate Change Unit" },
    { value: "undp-climate-programme", label: "UNDP Climate Change Programme" },
    { value: "ecowas-climate-policy", label: "ECOWAS Climate Policy Division" },
    { value: "climate-policy-think-tanks", label: "Climate Policy Think Tanks & NGOs" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Carbon Trace Climate Policy Analyst Login - Climate Policy Analysis & Research Access</title>
        <meta name="description" content="Secure access portal for climate policy analysts and research specialists" />
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
              <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Carbon Trace Portal
            </h1>
            <p className="text-slate-600">
              Climate Policy Analyst - Climate Policy Analysis & Research
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Certified Climate Policy Analysts Only
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
              <Label htmlFor="analystId">Climate Policy Analyst ID</Label>
              <Input
                id="analystId"
                type="text"
                {...form.register("analystId")}
                className="w-full"
                placeholder="Enter your analyst ID"
                data-testid="input-analyst-id"
              />
              {form.formState.errors.analystId && (
                <p className="text-sm text-red-600">{form.formState.errors.analystId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="policyCredentials">Policy Credentials</Label>
              <Select 
                value={form.watch("policyCredentials")} 
                onValueChange={(value) => form.setValue("policyCredentials", value)}
              >
                <SelectTrigger data-testid="select-policy-credentials">
                  <SelectValue placeholder="Select your credentials" />
                </SelectTrigger>
                <SelectContent>
                  {policyCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.policyCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.policyCredentials.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="analystLevel">Analyst Level</Label>
              <Select 
                value={form.watch("analystLevel")} 
                onValueChange={(value) => form.setValue("analystLevel", value)}
              >
                <SelectTrigger data-testid="select-analyst-level">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {analystLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.analystLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.analystLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="policyFocus">Policy Focus</Label>
              <Select 
                value={form.watch("policyFocus")} 
                onValueChange={(value) => form.setValue("policyFocus", value)}
              >
                <SelectTrigger data-testid="select-policy-focus">
                  <SelectValue placeholder="Select your focus area" />
                </SelectTrigger>
                <SelectContent>
                  {policyFocuses.map((focus) => (
                    <SelectItem key={focus.value} value={focus.value}>
                      {focus.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.policyFocus && (
                <p className="text-sm text-red-600">{form.formState.errors.policyFocus.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Climate Specialization</Label>
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
              <Label htmlFor="institutionalAffiliation">Institutional Affiliation</Label>
              <Select 
                value={form.watch("institutionalAffiliation")} 
                onValueChange={(value) => form.setValue("institutionalAffiliation", value)}
              >
                <SelectTrigger data-testid="select-institutional-affiliation">
                  <SelectValue placeholder="Select your institution" />
                </SelectTrigger>
                <SelectContent>
                  {institutionalAffiliations.map((affiliation) => (
                    <SelectItem key={affiliation.value} value={affiliation.value}>
                      {affiliation.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.institutionalAffiliation && (
                <p className="text-sm text-red-600">{form.formState.errors.institutionalAffiliation.message}</p>
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
                  Verifying Policy Analyst Credentials...
                </div>
              ) : (
                "Access Climate Policy Analysis Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Certified climate policy analysts only. All policy analysis and research activities are monitored for accuracy and institutional compliance.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Climate Policy Analysis Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}