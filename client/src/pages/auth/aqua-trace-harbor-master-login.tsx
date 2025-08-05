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
import { Shield, Ship, AlertCircle, Eye, EyeOff, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  harborMasterId: z.string().min(1, "Harbor Master ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  maritimeCredentials: z.string().min(1, "Maritime credentials are required"),
  authorityLevel: z.string().min(1, "Authority level is required"),
  portJurisdiction: z.string().min(1, "Port jurisdiction is required"),
  specialization: z.string().min(1, "Harbor specialization is required"),
  maritimeLicense: z.string().min(1, "Maritime license is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AquaTraceHarborMasterLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      harborMasterId: "",
      password: "",
      maritimeCredentials: "",
      authorityLevel: "",
      portJurisdiction: "",
      specialization: "",
      maritimeLicense: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/aqua-trace-harbor-master-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "aqua-trace-harbor-master",
          portalType: "harbor-master"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Harbor Master Login Successful",
          description: "Welcome to Aqua Trace Port Management Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "harbor-master");
        localStorage.setItem("userType", "aqua-trace-harbor-master");
        localStorage.setItem("portJurisdiction", data.portJurisdiction);
        
        window.location.href = "/aqua-trace-port-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your Harbor Master credentials.";
      setError(errorMessage);
      toast({
        title: "Harbor Master Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const maritimeCredentials = [
    { value: "certified-harbor-master", label: "Certified Harbor Master" },
    { value: "port-authority-officer", label: "Port Authority Officer" },
    { value: "maritime-pilot", label: "Maritime Pilot" },
    { value: "vessel-traffic-controller", label: "Vessel Traffic Service Controller" },
    { value: "port-operations-manager", label: "Port Operations Manager" },
    { value: "marine-surveyor", label: "Marine Surveyor" },
    { value: "maritime-safety-inspector", label: "Maritime Safety Inspector" }
  ];

  const authorityLevels = [
    { value: "chief-harbor-master", label: "Chief Harbor Master" },
    { value: "deputy-harbor-master", label: "Deputy Harbor Master" },
    { value: "senior-port-officer", label: "Senior Port Officer" },
    { value: "port-operations-supervisor", label: "Port Operations Supervisor" },
    { value: "harbor-patrol-officer", label: "Harbor Patrol Officer" },
    { value: "assistant-harbor-master", label: "Assistant Harbor Master" }
  ];

  const portJurisdictions = [
    { value: "monrovia-freeport", label: "Monrovia Freeport Authority" },
    { value: "buchanan-port", label: "Port of Buchanan" },
    { value: "greenville-port", label: "Port of Greenville (Sinoe)" },
    { value: "harper-port", label: "Port of Harper (Cape Palmas)" },
    { value: "robertsport-harbor", label: "Robertsport Harbor" },
    { value: "grand-bassa-fishing-port", label: "Grand Bassa Fishing Port" },
    { value: "river-cess-port", label: "River Cess Port Authority" },
    { value: "national-port-authority", label: "National Port Authority" }
  ];

  const specializations = [
    { value: "vessel-traffic-management", label: "Vessel Traffic Management" },
    { value: "cargo-operations-oversight", label: "Cargo Operations Oversight" },
    { value: "maritime-safety-enforcement", label: "Maritime Safety Enforcement" },
    { value: "port-security-coordination", label: "Port Security Coordination" },
    { value: "environmental-compliance", label: "Environmental Compliance" },
    { value: "customs-immigration-liaison", label: "Customs & Immigration Liaison" },
    { value: "emergency-response-coordination", label: "Emergency Response Coordination" },
    { value: "navigational-aids-management", label: "Navigational Aids Management" }
  ];

  const maritimeLicenses = [
    { value: "master-mariner-unlimited", label: "Master Mariner - Unlimited Tonnage" },
    { value: "harbor-master-class-1", label: "Harbor Master License - Class 1" },
    { value: "pilot-license-liberian-waters", label: "Pilot License - Liberian Waters" },
    { value: "vessel-traffic-operator", label: "Vessel Traffic Service Operator" },
    { value: "port-state-control-inspector", label: "Port State Control Inspector" },
    { value: "marine-surveyor-classification", label: "Marine Surveyor - Classification Society" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Aqua Trace Harbor Master Login - Port Management & Maritime Operations Access</title>
        <meta name="description" content="Secure access portal for Harbor Masters and port authority officials" />
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
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Ship className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Aqua Trace Portal
            </h1>
            <p className="text-slate-600">
              Harbor Master - Port Management & Maritime Operations
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Licensed Harbor Masters Only
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
              <Label htmlFor="harborMasterId">Harbor Master ID</Label>
              <Input
                id="harborMasterId"
                type="text"
                {...form.register("harborMasterId")}
                className="w-full"
                placeholder="Enter your Harbor Master ID"
                data-testid="input-harbor-master-id"
              />
              {form.formState.errors.harborMasterId && (
                <p className="text-sm text-red-600">{form.formState.errors.harborMasterId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritimeCredentials">Maritime Credentials</Label>
              <Select 
                value={form.watch("maritimeCredentials")} 
                onValueChange={(value) => form.setValue("maritimeCredentials", value)}
              >
                <SelectTrigger data-testid="select-maritime-credentials">
                  <SelectValue placeholder="Select your credentials" />
                </SelectTrigger>
                <SelectContent>
                  {maritimeCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.maritimeCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.maritimeCredentials.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorityLevel">Authority Level</Label>
              <Select 
                value={form.watch("authorityLevel")} 
                onValueChange={(value) => form.setValue("authorityLevel", value)}
              >
                <SelectTrigger data-testid="select-authority-level">
                  <SelectValue placeholder="Select your authority level" />
                </SelectTrigger>
                <SelectContent>
                  {authorityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.authorityLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.authorityLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="portJurisdiction">Port Jurisdiction</Label>
              <Select 
                value={form.watch("portJurisdiction")} 
                onValueChange={(value) => form.setValue("portJurisdiction", value)}
              >
                <SelectTrigger data-testid="select-port-jurisdiction">
                  <SelectValue placeholder="Select your port jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  {portJurisdictions.map((port) => (
                    <SelectItem key={port.value} value={port.value}>
                      {port.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.portJurisdiction && (
                <p className="text-sm text-red-600">{form.formState.errors.portJurisdiction.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Harbor Specialization</Label>
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
              <Label htmlFor="maritimeLicense">Maritime License</Label>
              <Select 
                value={form.watch("maritimeLicense")} 
                onValueChange={(value) => form.setValue("maritimeLicense", value)}
              >
                <SelectTrigger data-testid="select-maritime-license">
                  <SelectValue placeholder="Select your maritime license" />
                </SelectTrigger>
                <SelectContent>
                  {maritimeLicenses.map((license) => (
                    <SelectItem key={license.value} value={license.value}>
                      {license.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.maritimeLicense && (
                <p className="text-sm text-red-600">{form.formState.errors.maritimeLicense.message}</p>
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
                  Verifying Maritime Credentials...
                </div>
              ) : (
                "Access Harbor Master Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Licensed Harbor Masters only. All port operations and vessel movements are monitored and regulated.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Port Management Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}