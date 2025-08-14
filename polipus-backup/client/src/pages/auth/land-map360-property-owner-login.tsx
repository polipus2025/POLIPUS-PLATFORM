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
import { Shield, Map, AlertCircle, Eye, EyeOff, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  ownerId: z.string().min(1, "Property Owner ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  propertyType: z.string().min(1, "Property type is required"),
  deedNumber: z.string().min(1, "Property deed number is required"),
  propertyCounty: z.string().min(1, "Property county is required"),
  ownershipStatus: z.string().min(1, "Ownership status is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LandMap360PropertyOwnerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      ownerId: "",
      password: "",
      propertyType: "",
      deedNumber: "",
      propertyCounty: "",
      ownershipStatus: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/land-map360-property-owner-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "land-map360-property-owner",
          portalType: "property-owner"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Property Owner Login Successful",
          description: "Welcome to Land Map360 Property Owner Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "property-owner");
        localStorage.setItem("userType", "land-map360-property-owner");
        localStorage.setItem("propertyCounty", data.propertyCounty);
        
        window.location.href = "/land-map360-property-owner-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your property ownership credentials.";
      setError(errorMessage);
      toast({
        title: "Property Owner Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const propertyTypes = [
    { value: "residential", label: "Residential Property" },
    { value: "commercial", label: "Commercial Property" },
    { value: "agricultural", label: "Agricultural Land" },
    { value: "industrial", label: "Industrial Property" },
    { value: "vacant-land", label: "Vacant Land" },
    { value: "mixed-use", label: "Mixed-Use Property" }
  ];

  const propertyCounties = [
    { value: "montserrado", label: "Montserrado County" },
    { value: "margibi", label: "Margibi County" },
    { value: "nimba", label: "Nimba County" },
    { value: "bong", label: "Bong County" },
    { value: "grand-cape-mount", label: "Grand Cape Mount County" },
    { value: "grand-bassa", label: "Grand Bassa County" },
    { value: "grand-gedeh", label: "Grand Gedeh County" },
    { value: "lofa", label: "Lofa County" },
    { value: "bomi", label: "Bomi County" },
    { value: "sinoe", label: "Sinoe County" }
  ];

  const ownershipStatuses = [
    { value: "full-ownership", label: "Full Legal Ownership" },
    { value: "joint-ownership", label: "Joint Ownership" },
    { value: "inherited-property", label: "Inherited Property" },
    { value: "customary-land-rights", label: "Customary Land Rights" },
    { value: "leasehold", label: "Leasehold Rights" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Land Map360 Property Owner Login - Land Registration & Title Verification</title>
        <meta name="description" content="Secure access portal for property owners to manage land registration and title verification" />
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
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Map className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Land Map360 Portal
            </h1>
            <p className="text-slate-600">
              Property Owner Access - Land Registration & Title Management
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Registered Property Owners Only
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
              <Label htmlFor="ownerId">Property Owner ID</Label>
              <Input
                id="ownerId"
                type="text"
                {...form.register("ownerId")}
                className="w-full"
                placeholder="Enter your property owner ID"
                data-testid="input-owner-id"
              />
              {form.formState.errors.ownerId && (
                <p className="text-sm text-red-600">{form.formState.errors.ownerId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deedNumber">Property Deed Number</Label>
              <Input
                id="deedNumber"
                type="text"
                {...form.register("deedNumber")}
                className="w-full"
                placeholder="Enter your property deed number"
                data-testid="input-deed-number"
              />
              {form.formState.errors.deedNumber && (
                <p className="text-sm text-red-600">{form.formState.errors.deedNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select 
                value={form.watch("propertyType")} 
                onValueChange={(value) => form.setValue("propertyType", value)}
              >
                <SelectTrigger data-testid="select-property-type">
                  <SelectValue placeholder="Select your property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.propertyType && (
                <p className="text-sm text-red-600">{form.formState.errors.propertyType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyCounty">Property County</Label>
              <Select 
                value={form.watch("propertyCounty")} 
                onValueChange={(value) => form.setValue("propertyCounty", value)}
              >
                <SelectTrigger data-testid="select-property-county">
                  <SelectValue placeholder="Select your property county" />
                </SelectTrigger>
                <SelectContent>
                  {propertyCounties.map((county) => (
                    <SelectItem key={county.value} value={county.value}>
                      {county.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.propertyCounty && (
                <p className="text-sm text-red-600">{form.formState.errors.propertyCounty.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownershipStatus">Ownership Status</Label>
              <Select 
                value={form.watch("ownershipStatus")} 
                onValueChange={(value) => form.setValue("ownershipStatus", value)}
              >
                <SelectTrigger data-testid="select-ownership-status">
                  <SelectValue placeholder="Select your ownership status" />
                </SelectTrigger>
                <SelectContent>
                  {ownershipStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.ownershipStatus && (
                <p className="text-sm text-red-600">{form.formState.errors.ownershipStatus.message}</p>
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
                  Verifying Property Ownership...
                </div>
              ) : (
                "Access Property Owner Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Registered property owners only. All property activities are tracked for legal compliance.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Property Registration Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}