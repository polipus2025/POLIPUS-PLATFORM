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
import { Shield, HardHat, AlertCircle, Eye, EyeOff, Mountain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  engineerId: z.string().min(1, "Engineer ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  professionalLevel: z.string().min(1, "Professional level is required"),
  miningLicense: z.string().min(1, "Mining license is required"),
  specialization: z.string().min(1, "Specialization is required"),
  safetyCredentials: z.string().min(1, "Safety credentials are required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function MineWatchMiningEngineerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      engineerId: "",
      password: "",
      professionalLevel: "",
      miningLicense: "",
      specialization: "",
      safetyCredentials: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/mine-watch-mining-engineer-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "mine-watch-mining-engineer",
          portalType: "mining-engineer"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Mining Engineer Login Successful",
          description: "Welcome to Mine Watch Engineering Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "mining-engineer");
        localStorage.setItem("userType", "mine-watch-mining-engineer");
        localStorage.setItem("specialization", data.specialization);
        
        window.location.href = "/mine-watch-engineer-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your engineering credentials.";
      setError(errorMessage);
      toast({
        title: "Engineering Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const professionalLevels = [
    { value: "senior-mining-engineer", label: "Senior Mining Engineer" },
    { value: "mining-engineer", label: "Mining Engineer" },
    { value: "junior-mining-engineer", label: "Junior Mining Engineer" },
    { value: "mining-technologist", label: "Mining Technologist" }
  ];

  const specializations = [
    { value: "surface-mining", label: "Surface Mining Operations" },
    { value: "underground-mining", label: "Underground Mining" },
    { value: "mineral-processing", label: "Mineral Processing" },
    { value: "mining-safety", label: "Mining Safety Engineering" },
    { value: "environmental-mining", label: "Environmental Mining" },
    { value: "geological-engineering", label: "Geological Engineering" }
  ];

  const safetyCredentials = [
    { value: "msha-certified", label: "MSHA Certified" },
    { value: "mining-safety-professional", label: "Mining Safety Professional" },
    { value: "hazmat-certified", label: "HAZMAT Certified" },
    { value: "emergency-response", label: "Emergency Response Certified" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Mine Watch Engineer Login - Mining Operations Access | Safety & Production</title>
        <meta name="description" content="Secure access portal for licensed mining engineers and operations specialists" />
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
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                <HardHat className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Mine Watch Portal
            </h1>
            <p className="text-slate-600">
              Mining Engineer Access - Operations & Safety Management
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Licensed Mining Engineers Only
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
              <Label htmlFor="engineerId">Mining Engineer ID</Label>
              <Input
                id="engineerId"
                type="text"
                {...form.register("engineerId")}
                className="w-full"
                placeholder="Enter your engineer ID"
                data-testid="input-engineer-id"
              />
              {form.formState.errors.engineerId && (
                <p className="text-sm text-red-600">{form.formState.errors.engineerId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="miningLicense">Mining License Number</Label>
              <Input
                id="miningLicense"
                type="text"
                {...form.register("miningLicense")}
                className="w-full"
                placeholder="Enter your mining license"
                data-testid="input-mining-license"
              />
              {form.formState.errors.miningLicense && (
                <p className="text-sm text-red-600">{form.formState.errors.miningLicense.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalLevel">Professional Level</Label>
              <Select 
                value={form.watch("professionalLevel")} 
                onValueChange={(value) => form.setValue("professionalLevel", value)}
              >
                <SelectTrigger data-testid="select-professional-level">
                  <SelectValue placeholder="Select your professional level" />
                </SelectTrigger>
                <SelectContent>
                  {professionalLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.professionalLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.professionalLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Mining Specialization</Label>
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
              <Label htmlFor="safetyCredentials">Safety Credentials</Label>
              <Select 
                value={form.watch("safetyCredentials")} 
                onValueChange={(value) => form.setValue("safetyCredentials", value)}
              >
                <SelectTrigger data-testid="select-safety-credentials">
                  <SelectValue placeholder="Select your safety credentials" />
                </SelectTrigger>
                <SelectContent>
                  {safetyCredentials.map((cred) => (
                    <SelectItem key={cred.value} value={cred.value}>
                      {cred.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.safetyCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.safetyCredentials.message}</p>
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
                  Verifying Engineering Credentials...
                </div>
              ) : (
                "Access Mining Engineer Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Licensed Mining Engineers only. All mining operations are monitored for safety compliance.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Professional Mining Engineer Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}