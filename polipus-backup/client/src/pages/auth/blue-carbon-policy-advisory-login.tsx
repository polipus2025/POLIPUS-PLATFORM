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
import { Shield, FileText, AlertCircle, Eye, EyeOff, Scale } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  advisorId: z.string().min(1, "Policy Advisor ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  policyCredentials: z.string().min(1, "Policy credentials are required"),
  advisoryLevel: z.string().min(1, "Advisory level is required"),
  policyDomain: z.string().min(1, "Policy domain is required"),
  specialization: z.string().min(1, "Policy specialization is required"),
  governmentLevel: z.string().min(1, "Government level is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function BlueCarbonPolicyAdvisoryLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      advisorId: "",
      password: "",
      policyCredentials: "",
      advisoryLevel: "",
      policyDomain: "",
      specialization: "",
      governmentLevel: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/blue-carbon-policy-advisory-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "blue-carbon-policy-advisory",
          portalType: "policy-advisory"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Policy Advisory Login Successful",
          description: "Welcome to Blue Carbon 360 Policy Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "policy-advisor");
        localStorage.setItem("userType", "blue-carbon-policy-advisory");
        localStorage.setItem("policyDomain", data.policyDomain);
        
        window.location.href = "/blue-carbon-policy-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your policy advisory credentials.";
      setError(errorMessage);
      toast({
        title: "Policy Advisory Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const policyCredentials = [
    { value: "certified-environmental-policy-analyst", label: "Certified Environmental Policy Analyst" },
    { value: "marine-policy-specialist", label: "Marine Policy Specialist" },
    { value: "climate-policy-advisor", label: "Climate Policy Advisor" },
    { value: "sustainable-development-consultant", label: "Sustainable Development Policy Consultant" },
    { value: "natural-resource-policy-expert", label: "Natural Resource Policy Expert" },
    { value: "international-environmental-law", label: "International Environmental Law Specialist" },
    { value: "government-policy-analyst", label: "Government Policy Analyst" }
  ];

  const advisoryLevels = [
    { value: "senior-policy-advisor", label: "Senior Policy Advisor" },
    { value: "principal-policy-analyst", label: "Principal Policy Analyst" },
    { value: "chief-environmental-advisor", label: "Chief Environmental Policy Advisor" },
    { value: "policy-research-director", label: "Policy Research Director" },
    { value: "strategic-policy-consultant", label: "Strategic Policy Consultant" },
    { value: "policy-development-specialist", label: "Policy Development Specialist" }
  ];

  const policyDomains = [
    { value: "liberian-marine-environmental-policy", label: "Liberian Marine Environmental Policy" },
    { value: "blue-carbon-policy-framework", label: "Blue Carbon Policy Framework" },
    { value: "coastal-zone-management-policy", label: "Coastal Zone Management Policy" },
    { value: "climate-change-adaptation-policy", label: "Climate Change Adaptation Policy" },
    { value: "sustainable-fisheries-policy", label: "Sustainable Fisheries Policy" },
    { value: "environmental-compliance-policy", label: "Environmental Compliance Policy" },
    { value: "international-conservation-agreements", label: "International Conservation Agreements" },
    { value: "community-based-resource-management", label: "Community-Based Resource Management Policy" }
  ];

  const specializations = [
    { value: "blue-carbon-legislation", label: "Blue Carbon Legislation Development" },
    { value: "environmental-impact-assessment", label: "Environmental Impact Assessment Policy" },
    { value: "marine-protected-area-policy", label: "Marine Protected Area Policy" },
    { value: "carbon-market-regulation", label: "Carbon Market Regulation" },
    { value: "international-treaty-compliance", label: "International Treaty Compliance" },
    { value: "sustainable-development-goals", label: "Sustainable Development Goals Implementation" },
    { value: "environmental-justice-policy", label: "Environmental Justice Policy" },
    { value: "climate-finance-policy", label: "Climate Finance Policy Frameworks" }
  ];

  const governmentLevels = [
    { value: "national-government-liberia", label: "National Government of Liberia" },
    { value: "ministry-environment", label: "Ministry of Environment & Climate Change" },
    { value: "liberian-maritime-authority", label: "Liberian Maritime Authority" },
    { value: "environmental-protection-agency", label: "Environmental Protection Agency (EPA)" },
    { value: "county-government-liaison", label: "County Government Policy Liaison" },
    { value: "international-organizations", label: "International Organizations (UN, World Bank)" },
    { value: "regional-ecowas-coordination", label: "Regional ECOWAS Policy Coordination" },
    { value: "ngo-policy-advocacy", label: "NGO Policy Advocacy Organizations" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Blue Carbon 360 Policy Advisory Login - Environmental Policy & Governance Access</title>
        <meta name="description" content="Secure access portal for policy advisors and environmental governance specialists" />
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
                <Scale className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Blue Carbon 360 Portal
            </h1>
            <p className="text-slate-600">
              Policy Advisory - Environmental Policy & Governance
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Certified Policy Advisors Only
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
              <Label htmlFor="advisorId">Policy Advisor ID</Label>
              <Input
                id="advisorId"
                type="text"
                {...form.register("advisorId")}
                className="w-full"
                placeholder="Enter your advisor ID"
                data-testid="input-advisor-id"
              />
              {form.formState.errors.advisorId && (
                <p className="text-sm text-red-600">{form.formState.errors.advisorId.message}</p>
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
              <Label htmlFor="advisoryLevel">Advisory Level</Label>
              <Select 
                value={form.watch("advisoryLevel")} 
                onValueChange={(value) => form.setValue("advisoryLevel", value)}
              >
                <SelectTrigger data-testid="select-advisory-level">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {advisoryLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.advisoryLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.advisoryLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="policyDomain">Policy Domain</Label>
              <Select 
                value={form.watch("policyDomain")} 
                onValueChange={(value) => form.setValue("policyDomain", value)}
              >
                <SelectTrigger data-testid="select-policy-domain">
                  <SelectValue placeholder="Select your domain" />
                </SelectTrigger>
                <SelectContent>
                  {policyDomains.map((domain) => (
                    <SelectItem key={domain.value} value={domain.value}>
                      {domain.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.policyDomain && (
                <p className="text-sm text-red-600">{form.formState.errors.policyDomain.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Policy Specialization</Label>
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
              <Label htmlFor="governmentLevel">Government Level</Label>
              <Select 
                value={form.watch("governmentLevel")} 
                onValueChange={(value) => form.setValue("governmentLevel", value)}
              >
                <SelectTrigger data-testid="select-government-level">
                  <SelectValue placeholder="Select your government level" />
                </SelectTrigger>
                <SelectContent>
                  {governmentLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.governmentLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.governmentLevel.message}</p>
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
                  Verifying Policy Credentials...
                </div>
              ) : (
                "Access Policy Advisory Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Certified policy advisors only. All environmental policy development and governance activities are monitored for regulatory compliance.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Environmental Policy Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}