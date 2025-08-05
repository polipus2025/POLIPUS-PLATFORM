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
import { Shield, Compass, AlertCircle, Eye, EyeOff, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  surveyorId: z.string().min(1, "Surveyor ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  certificationLevel: z.string().min(1, "Certification level is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  operationArea: z.string().min(1, "Operation area is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LandMap360SurveyorLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      surveyorId: "",
      password: "",
      certificationLevel: "",
      licenseNumber: "",
      operationArea: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/land-map360-surveyor-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "land-map360-surveyor",
          portalType: "surveyor"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Surveyor Login Successful",
          description: "Welcome to Land Map360 Surveyor Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "surveyor");
        localStorage.setItem("userType", "land-map360-surveyor");
        localStorage.setItem("certificationLevel", data.certificationLevel);
        
        window.location.href = "/land-map360-surveyor-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your surveyor credentials.";
      setError(errorMessage);
      toast({
        title: "Surveyor Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const certificationLevels = [
    { value: "licensed-surveyor", label: "Licensed Professional Surveyor" },
    { value: "senior-surveyor", label: "Senior Land Surveyor" },
    { value: "junior-surveyor", label: "Junior Surveyor" },
    { value: "survey-technician", label: "Survey Technician" }
  ];

  const operationAreas = [
    { value: "montserrado", label: "Montserrado County" },
    { value: "margibi", label: "Margibi County" },
    { value: "nimba", label: "Nimba County" },
    { value: "bong", label: "Bong County" },
    { value: "grand-cape-mount", label: "Grand Cape Mount County" },
    { value: "all-counties", label: "All Counties (National License)" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Land Map360 Surveyor Login - Professional Surveyor Access | GPS & Mapping</title>
        <meta name="description" content="Secure access portal for licensed land surveyors and mapping professionals" />
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
                <Compass className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Land Map360 Portal
            </h1>
            <p className="text-slate-600">
              Surveyor Access - GPS Surveying & Land Mapping
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Licensed Professional Surveyors Only
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
              <Label htmlFor="surveyorId">Surveyor ID</Label>
              <Input
                id="surveyorId"
                type="text"
                {...form.register("surveyorId")}
                className="w-full"
                placeholder="Enter your surveyor ID"
                data-testid="input-surveyor-id"
              />
              {form.formState.errors.surveyorId && (
                <p className="text-sm text-red-600">{form.formState.errors.surveyorId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">Professional License Number</Label>
              <Input
                id="licenseNumber"
                type="text"
                {...form.register("licenseNumber")}
                className="w-full"
                placeholder="Enter your license number"
                data-testid="input-license-number"
              />
              {form.formState.errors.licenseNumber && (
                <p className="text-sm text-red-600">{form.formState.errors.licenseNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificationLevel">Certification Level</Label>
              <Select 
                value={form.watch("certificationLevel")} 
                onValueChange={(value) => form.setValue("certificationLevel", value)}
              >
                <SelectTrigger data-testid="select-certification">
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
              <Label htmlFor="operationArea">Licensed Operation Area</Label>
              <Select 
                value={form.watch("operationArea")} 
                onValueChange={(value) => form.setValue("operationArea", value)}
              >
                <SelectTrigger data-testid="select-operation-area">
                  <SelectValue placeholder="Select your operation area" />
                </SelectTrigger>
                <SelectContent>
                  {operationAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.operationArea && (
                <p className="text-sm text-red-600">{form.formState.errors.operationArea.message}</p>
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
                  Verifying Surveyor Credentials...
                </div>
              ) : (
                "Access Surveyor Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Licensed Professional Surveyors only. All GPS activities are monitored and logged.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Professional Surveyor Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}