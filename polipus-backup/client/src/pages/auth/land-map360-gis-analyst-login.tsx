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
import { Shield, Layers, AlertCircle, Eye, EyeOff, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  analystId: z.string().min(1, "GIS Analyst ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gisCredentials: z.string().min(1, "GIS credentials are required"),
  certificationLevel: z.string().min(1, "Certification level is required"),
  specialization: z.string().min(1, "Specialization is required"),
  softwareProficiency: z.string().min(1, "Software proficiency is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LandMap360GISAnalystLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      analystId: "",
      password: "",
      gisCredentials: "",
      certificationLevel: "",
      specialization: "",
      softwareProficiency: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/land-map360-gis-analyst-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "land-map360-gis-analyst",
          portalType: "gis-analyst"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "GIS Analyst Login Successful",
          description: "Welcome to Land Map360 GIS Analyst Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "gis-analyst");
        localStorage.setItem("userType", "land-map360-gis-analyst");
        localStorage.setItem("specialization", data.specialization);
        
        window.location.href = "/land-map360-gis-analyst-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your GIS analyst credentials.";
      setError(errorMessage);
      toast({
        title: "GIS Analyst Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const gisCredentials = [
    { value: "gisp", label: "GIS Professional (GISP)" },
    { value: "esri-certified", label: "ESRI Certified Professional" },
    { value: "google-earth-engine", label: "Google Earth Engine Certified" },
    { value: "remote-sensing", label: "Remote Sensing Specialist" },
    { value: "cartography", label: "Professional Cartographer" }
  ];

  const certificationLevels = [
    { value: "senior-gis-analyst", label: "Senior GIS Analyst" },
    { value: "gis-analyst", label: "GIS Analyst" },
    { value: "junior-gis-analyst", label: "Junior GIS Analyst" },
    { value: "gis-technician", label: "GIS Technician" },
    { value: "mapping-specialist", label: "Mapping Specialist" }
  ];

  const specializations = [
    { value: "spatial-analysis", label: "Spatial Analysis" },
    { value: "cartographic-design", label: "Cartographic Design" },
    { value: "remote-sensing", label: "Remote Sensing & Imagery" },
    { value: "land-use-planning", label: "Land Use Planning" },
    { value: "environmental-gis", label: "Environmental GIS" },
    { value: "urban-planning", label: "Urban Planning GIS" },
    { value: "agricultural-mapping", label: "Agricultural Mapping" }
  ];

  const softwareProficiencies = [
    { value: "arcgis-suite", label: "ArcGIS Suite (Desktop/Pro/Online)" },
    { value: "qgis", label: "QGIS & Open Source GIS" },
    { value: "google-earth-engine", label: "Google Earth Engine" },
    { value: "erdas-imagine", label: "ERDAS IMAGINE" },
    { value: "envi", label: "ENVI Remote Sensing" },
    { value: "mapinfo", label: "MapInfo Professional" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Land Map360 GIS Analyst Login - Spatial Analysis & Mapping Professional Access</title>
        <meta name="description" content="Secure access portal for GIS analysts and mapping specialists" />
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
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Layers className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Land Map360 Portal
            </h1>
            <p className="text-slate-600">
              GIS Analyst Access - Spatial Analysis & Map Creation
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Certified GIS Professionals Only
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
              <Label htmlFor="analystId">GIS Analyst ID</Label>
              <Input
                id="analystId"
                type="text"
                {...form.register("analystId")}
                className="w-full"
                placeholder="Enter your GIS analyst ID"
                data-testid="input-analyst-id"
              />
              {form.formState.errors.analystId && (
                <p className="text-sm text-red-600">{form.formState.errors.analystId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gisCredentials">GIS Professional Credentials</Label>
              <Select 
                value={form.watch("gisCredentials")} 
                onValueChange={(value) => form.setValue("gisCredentials", value)}
              >
                <SelectTrigger data-testid="select-gis-credentials">
                  <SelectValue placeholder="Select your GIS credentials" />
                </SelectTrigger>
                <SelectContent>
                  {gisCredentials.map((cred) => (
                    <SelectItem key={cred.value} value={cred.value}>
                      {cred.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.gisCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.gisCredentials.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificationLevel">Certification Level</Label>
              <Select 
                value={form.watch("certificationLevel")} 
                onValueChange={(value) => form.setValue("certificationLevel", value)}
              >
                <SelectTrigger data-testid="select-certification-level">
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
              <Label htmlFor="specialization">GIS Specialization</Label>
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
              <Label htmlFor="softwareProficiency">Software Proficiency</Label>
              <Select 
                value={form.watch("softwareProficiency")} 
                onValueChange={(value) => form.setValue("softwareProficiency", value)}
              >
                <SelectTrigger data-testid="select-software-proficiency">
                  <SelectValue placeholder="Select your software proficiency" />
                </SelectTrigger>
                <SelectContent>
                  {softwareProficiencies.map((software) => (
                    <SelectItem key={software.value} value={software.value}>
                      {software.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.softwareProficiency && (
                <p className="text-sm text-red-600">{form.formState.errors.softwareProficiency.message}</p>
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
                  Verifying GIS Credentials...
                </div>
              ) : (
                "Access GIS Analyst Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Certified GIS professionals only. All spatial analysis activities are tracked for data integrity.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">GIS Professional Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}