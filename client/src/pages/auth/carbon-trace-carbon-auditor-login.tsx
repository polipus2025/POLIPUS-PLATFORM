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
import { Shield, ClipboardCheck, AlertCircle, Eye, EyeOff, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  auditorId: z.string().min(1, "Carbon Auditor ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  auditCredentials: z.string().min(1, "Audit credentials are required"),
  auditorLevel: z.string().min(1, "Auditor level is required"),
  auditSpecialty: z.string().min(1, "Audit specialty is required"),
  specialization: z.string().min(1, "Carbon specialization is required"),
  certificationBody: z.string().min(1, "Certification body is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function CarbonTraceCarbonAuditorLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      auditorId: "",
      password: "",
      auditCredentials: "",
      auditorLevel: "",
      auditSpecialty: "",
      specialization: "",
      certificationBody: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/carbon-trace-carbon-auditor-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "carbon-trace-carbon-auditor",
          portalType: "carbon-auditor"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Carbon Auditor Login Successful",
          description: "Welcome to Carbon Trace Audit Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "carbon-auditor");
        localStorage.setItem("userType", "carbon-trace-carbon-auditor");
        localStorage.setItem("auditSpecialty", data.auditSpecialty);
        
        window.location.href = "/carbon-trace-audit-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your carbon auditor credentials.";
      setError(errorMessage);
      toast({
        title: "Carbon Auditor Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const auditCredentials = [
    { value: "certified-carbon-auditor", label: "Certified Carbon Auditor (CCA)" },
    { value: "iso-14064-lead-auditor", label: "ISO 14064 Lead Auditor" },
    { value: "greenhouse-gas-auditor", label: "Greenhouse Gas Auditor" },
    { value: "carbon-verification-specialist", label: "Carbon Verification Specialist" },
    { value: "environmental-auditor", label: "Environmental Auditor (ISO 14001)" },
    { value: "carbon-footprint-auditor", label: "Carbon Footprint Auditor" },
    { value: "vcs-auditor", label: "Verified Carbon Standard (VCS) Auditor" }
  ];

  const auditorLevels = [
    { value: "lead-carbon-auditor", label: "Lead Carbon Auditor" },
    { value: "senior-carbon-auditor", label: "Senior Carbon Auditor" },
    { value: "carbon-audit-manager", label: "Carbon Audit Manager" },
    { value: "principal-carbon-auditor", label: "Principal Carbon Auditor" },
    { value: "carbon-verification-officer", label: "Carbon Verification Officer" },
    { value: "associate-carbon-auditor", label: "Associate Carbon Auditor" }
  ];

  const auditSpecialties = [
    { value: "liberian-agriculture-carbon-audit", label: "Liberian Agriculture Carbon Audit" },
    { value: "forestry-carbon-verification", label: "Forestry Carbon Verification" },
    { value: "industrial-emissions-audit", label: "Industrial Emissions Audit" },
    { value: "renewable-energy-carbon-audit", label: "Renewable Energy Carbon Audit" },
    { value: "blue-carbon-ecosystem-audit", label: "Blue Carbon Ecosystem Audit" },
    { value: "mining-carbon-footprint-audit", label: "Mining Carbon Footprint Audit" },
    { value: "transportation-emissions-audit", label: "Transportation Emissions Audit" },
    { value: "carbon-offset-project-verification", label: "Carbon Offset Project Verification" }
  ];

  const specializations = [
    { value: "greenhouse-gas-inventory", label: "Greenhouse Gas Inventory & Reporting" },
    { value: "carbon-footprint-assessment", label: "Carbon Footprint Assessment" },
    { value: "emission-factor-development", label: "Emission Factor Development" },
    { value: "carbon-offset-verification", label: "Carbon Offset Project Verification" },
    { value: "scope-123-emissions-audit", label: "Scope 1, 2 & 3 Emissions Audit" },
    { value: "carbon-accounting-standards", label: "Carbon Accounting Standards (GHG Protocol)" },
    { value: "carbon-market-compliance", label: "Carbon Market Compliance Audit" },
    { value: "carbon-neutral-certification", label: "Carbon Neutral Certification" }
  ];

  const certificationBodies = [
    { value: "iso-international-organization", label: "ISO (International Organization for Standardization)" },
    { value: "ghg-protocol-initiative", label: "GHG Protocol Initiative" },
    { value: "verra-vcs-program", label: "Verra (VCS Program)" },
    { value: "gold-standard-foundation", label: "Gold Standard Foundation" },
    { value: "climate-action-reserve", label: "Climate Action Reserve (CAR)" },
    { value: "american-carbon-registry", label: "American Carbon Registry (ACR)" },
    { value: "cdm-executive-board", label: "CDM Executive Board (UNFCCC)" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Carbon Trace Carbon Auditor Login - Carbon Verification & Audit Access</title>
        <meta name="description" content="Secure access portal for carbon auditors and verification specialists" />
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
              <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Carbon Trace Portal
            </h1>
            <p className="text-slate-600">
              Carbon Auditor - Carbon Verification & Audit
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Certified Carbon Auditors Only
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
              <Label htmlFor="auditorId">Carbon Auditor ID</Label>
              <Input
                id="auditorId"
                type="text"
                {...form.register("auditorId")}
                className="w-full"
                placeholder="Enter your auditor ID"
                data-testid="input-auditor-id"
              />
              {form.formState.errors.auditorId && (
                <p className="text-sm text-red-600">{form.formState.errors.auditorId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="auditCredentials">Audit Credentials</Label>
              <Select 
                value={form.watch("auditCredentials")} 
                onValueChange={(value) => form.setValue("auditCredentials", value)}
              >
                <SelectTrigger data-testid="select-audit-credentials">
                  <SelectValue placeholder="Select your credentials" />
                </SelectTrigger>
                <SelectContent>
                  {auditCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.auditCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.auditCredentials.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="auditorLevel">Auditor Level</Label>
              <Select 
                value={form.watch("auditorLevel")} 
                onValueChange={(value) => form.setValue("auditorLevel", value)}
              >
                <SelectTrigger data-testid="select-auditor-level">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {auditorLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.auditorLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.auditorLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="auditSpecialty">Audit Specialty</Label>
              <Select 
                value={form.watch("auditSpecialty")} 
                onValueChange={(value) => form.setValue("auditSpecialty", value)}
              >
                <SelectTrigger data-testid="select-audit-specialty">
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  {auditSpecialties.map((specialty) => (
                    <SelectItem key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.auditSpecialty && (
                <p className="text-sm text-red-600">{form.formState.errors.auditSpecialty.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Carbon Specialization</Label>
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
              <Label htmlFor="certificationBody">Certification Body</Label>
              <Select 
                value={form.watch("certificationBody")} 
                onValueChange={(value) => form.setValue("certificationBody", value)}
              >
                <SelectTrigger data-testid="select-certification-body">
                  <SelectValue placeholder="Select certification body" />
                </SelectTrigger>
                <SelectContent>
                  {certificationBodies.map((body) => (
                    <SelectItem key={body.value} value={body.value}>
                      {body.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.certificationBody && (
                <p className="text-sm text-red-600">{form.formState.errors.certificationBody.message}</p>
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
                  Verifying Audit Credentials...
                </div>
              ) : (
                "Access Carbon Audit Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Certified carbon auditors only. All carbon audits and verification activities are monitored for accuracy and compliance with international standards.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Carbon Audit Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}