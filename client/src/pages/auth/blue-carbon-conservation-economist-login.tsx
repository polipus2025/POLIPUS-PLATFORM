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
import { Shield, DollarSign, AlertCircle, Eye, EyeOff, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  economistId: z.string().min(1, "Conservation Economist ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  economicCredentials: z.string().min(1, "Economic credentials are required"),
  expertiseLevel: z.string().min(1, "Expertise level is required"),
  conservationSector: z.string().min(1, "Conservation sector is required"),
  specialization: z.string().min(1, "Economic specialization is required"),
  academicCredentials: z.string().min(1, "Academic credentials are required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function BlueCarbonConservationEconomistLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      economistId: "",
      password: "",
      economicCredentials: "",
      expertiseLevel: "",
      conservationSector: "",
      specialization: "",
      academicCredentials: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/blue-carbon-conservation-economist-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "blue-carbon-conservation-economist",
          portalType: "conservation-economist"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Conservation Economist Login Successful",
          description: "Welcome to Blue Carbon 360 Economic Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "conservation-economist");
        localStorage.setItem("userType", "blue-carbon-conservation-economist");
        localStorage.setItem("conservationSector", data.conservationSector);
        
        window.location.href = "/blue-carbon-economic-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your conservation economist credentials.";
      setError(errorMessage);
      toast({
        title: "Conservation Economist Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const economicCredentials = [
    { value: "certified-environmental-economist", label: "Certified Environmental Economist (CEE)" },
    { value: "natural-resource-economist", label: "Natural Resource Economist" },
    { value: "conservation-finance-specialist", label: "Conservation Finance Specialist" },
    { value: "carbon-market-analyst", label: "Carbon Market Analyst" },
    { value: "ecosystem-services-economist", label: "Ecosystem Services Economist" },
    { value: "sustainable-development-economist", label: "Sustainable Development Economist" },
    { value: "payment-ecosystem-services", label: "Payment for Ecosystem Services (PES) Expert" }
  ];

  const expertiseLevels = [
    { value: "senior-conservation-economist", label: "Senior Conservation Economist" },
    { value: "principal-environmental-economist", label: "Principal Environmental Economist" },
    { value: "conservation-finance-manager", label: "Conservation Finance Manager" },
    { value: "carbon-market-specialist", label: "Carbon Market Specialist" },
    { value: "ecosystem-valuation-analyst", label: "Ecosystem Valuation Analyst" },
    { value: "environmental-economic-consultant", label: "Environmental Economic Consultant" }
  ];

  const conservationSectors = [
    { value: "liberian-blue-carbon-ecosystems", label: "Liberian Blue Carbon Ecosystems" },
    { value: "west-african-mangrove-economics", label: "West African Mangrove Economics" },
    { value: "coastal-wetland-valuation", label: "Coastal Wetland Valuation" },
    { value: "marine-protected-area-finance", label: "Marine Protected Area Financing" },
    { value: "carbon-credit-development", label: "Carbon Credit Development - Liberia" },
    { value: "sustainable-fisheries-economics", label: "Sustainable Fisheries Economics" },
    { value: "community-conservation-finance", label: "Community Conservation Finance" },
    { value: "climate-adaptation-economics", label: "Climate Adaptation Economics" }
  ];

  const specializations = [
    { value: "blue-carbon-valuation", label: "Blue Carbon Ecosystem Valuation" },
    { value: "mangrove-restoration-economics", label: "Mangrove Restoration Economics" },
    { value: "carbon-offset-development", label: "Carbon Offset Project Development" },
    { value: "payment-ecosystem-services", label: "Payment for Ecosystem Services Design" },
    { value: "conservation-impact-bonds", label: "Conservation Impact Bonds" },
    { value: "sustainable-tourism-economics", label: "Sustainable Marine Tourism Economics" },
    { value: "fisheries-value-chain", label: "Fisheries Value Chain Analysis" },
    { value: "climate-finance-mechanisms", label: "Climate Finance Mechanisms" }
  ];

  const academicCredentials = [
    { value: "phd-environmental-economics", label: "Ph.D. in Environmental Economics" },
    { value: "phd-natural-resource-economics", label: "Ph.D. in Natural Resource Economics" },
    { value: "masters-environmental-economics", label: "M.A./M.S. in Environmental Economics" },
    { value: "masters-development-economics", label: "M.A. in Development Economics" },
    { value: "masters-conservation-finance", label: "M.S. in Conservation Finance" },
    { value: "bachelors-economics-environmental", label: "B.A./B.S. in Economics (Environmental Focus)" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Blue Carbon 360 Conservation Economist Login - Environmental Economics & Finance Access</title>
        <meta name="description" content="Secure access portal for conservation economists and environmental finance specialists" />
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
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Blue Carbon 360 Portal
            </h1>
            <p className="text-slate-600">
              Conservation Economist - Environmental Economics & Finance
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Certified Environmental Economists Only
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
              <Label htmlFor="economistId">Conservation Economist ID</Label>
              <Input
                id="economistId"
                type="text"
                {...form.register("economistId")}
                className="w-full"
                placeholder="Enter your economist ID"
                data-testid="input-economist-id"
              />
              {form.formState.errors.economistId && (
                <p className="text-sm text-red-600">{form.formState.errors.economistId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="economicCredentials">Economic Credentials</Label>
              <Select 
                value={form.watch("economicCredentials")} 
                onValueChange={(value) => form.setValue("economicCredentials", value)}
              >
                <SelectTrigger data-testid="select-economic-credentials">
                  <SelectValue placeholder="Select your credentials" />
                </SelectTrigger>
                <SelectContent>
                  {economicCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.economicCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.economicCredentials.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertiseLevel">Expertise Level</Label>
              <Select 
                value={form.watch("expertiseLevel")} 
                onValueChange={(value) => form.setValue("expertiseLevel", value)}
              >
                <SelectTrigger data-testid="select-expertise-level">
                  <SelectValue placeholder="Select your expertise level" />
                </SelectTrigger>
                <SelectContent>
                  {expertiseLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.expertiseLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.expertiseLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="conservationSector">Conservation Sector</Label>
              <Select 
                value={form.watch("conservationSector")} 
                onValueChange={(value) => form.setValue("conservationSector", value)}
              >
                <SelectTrigger data-testid="select-conservation-sector">
                  <SelectValue placeholder="Select your sector" />
                </SelectTrigger>
                <SelectContent>
                  {conservationSectors.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.conservationSector && (
                <p className="text-sm text-red-600">{form.formState.errors.conservationSector.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Economic Specialization</Label>
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
                  Verifying Economic Credentials...
                </div>
              ) : (
                "Access Conservation Economics Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Certified environmental economists only. All conservation finance and carbon market activities are monitored for economic integrity.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Environmental Economics Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}