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
import { Shield, Truck, AlertCircle, Eye, EyeOff, Route } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  coordinatorId: z.string().min(1, "Transport Coordinator ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  transportCredentials: z.string().min(1, "Transport credentials are required"),
  coordinationLevel: z.string().min(1, "Coordination level is required"),
  routeSpecialization: z.string().min(1, "Route specialization is required"),
  fleetSize: z.string().min(1, "Fleet size is required"),
  safetyCredentials: z.string().min(1, "Safety credentials are required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function MineWatchTransportCoordinatorLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      coordinatorId: "",
      password: "",
      transportCredentials: "",
      coordinationLevel: "",
      routeSpecialization: "",
      fleetSize: "",
      safetyCredentials: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/mine-watch-transport-coordinator-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "mine-watch-transport-coordinator",
          portalType: "transport-coordinator"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Transport Coordinator Login Successful",
          description: "Welcome to Mine Watch Transport Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "transport-coordinator");
        localStorage.setItem("userType", "mine-watch-transport-coordinator");
        localStorage.setItem("routeSpecialization", data.routeSpecialization);
        
        window.location.href = "/mine-watch-transport-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your transport coordinator credentials.";
      setError(errorMessage);
      toast({
        title: "Transport Coordinator Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const transportCredentials = [
    { value: "commercial-transport-license", label: "Commercial Transport License (CDL)" },
    { value: "hazmat-transport-certified", label: "HAZMAT Transport Certified" },
    { value: "heavy-haul-specialist", label: "Heavy Haul Transport Specialist" },
    { value: "mining-transport-certified", label: "Mining Transport Certified" },
    { value: "fleet-management-certified", label: "Fleet Management Certified" },
    { value: "logistics-coordinator", label: "Professional Logistics Coordinator" }
  ];

  const coordinationLevels = [
    { value: "fleet-manager", label: "Fleet Manager" },
    { value: "transport-supervisor", label: "Transport Supervisor" },
    { value: "logistics-coordinator", label: "Logistics Coordinator" },
    { value: "route-coordinator", label: "Route Coordinator" },
    { value: "dispatch-coordinator", label: "Dispatch Coordinator" },
    { value: "safety-coordinator", label: "Transport Safety Coordinator" }
  ];

  const routeSpecializations = [
    { value: "mine-to-port-transport", label: "Mine-to-Port Transport (Buchanan Port)" },
    { value: "mine-to-processing-plant", label: "Mine-to-Processing Plant Transport" },
    { value: "heavy-equipment-transport", label: "Heavy Mining Equipment Transport" },
    { value: "inter-county-mining-routes", label: "Inter-County Mining Routes" },
    { value: "export-logistics", label: "Export Logistics & Shipping" },
    { value: "supply-chain-coordination", label: "Mining Supply Chain Coordination" }
  ];

  const fleetSizes = [
    { value: "small-fleet-1-10", label: "Small Fleet (1-10 vehicles)" },
    { value: "medium-fleet-11-25", label: "Medium Fleet (11-25 vehicles)" },
    { value: "large-fleet-26-50", label: "Large Fleet (26-50 vehicles)" },
    { value: "enterprise-fleet-50+", label: "Enterprise Fleet (50+ vehicles)" }
  ];

  const safetyCredentials = [
    { value: "dot-safety-certified", label: "DOT Safety Certified" },
    { value: "defensive-driving-instructor", label: "Defensive Driving Instructor" },
    { value: "vehicle-inspection-certified", label: "Vehicle Inspection Certified" },
    { value: "emergency-response-trained", label: "Emergency Response Trained" },
    { value: "accident-investigation", label: "Accident Investigation Certified" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Mine Watch Transport Coordinator Login - Mining Transport & Logistics Management Access</title>
        <meta name="description" content="Secure access portal for transport coordinators and logistics specialists" />
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
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Mine Watch Portal
            </h1>
            <p className="text-slate-600">
              Transport Coordinator - Mining Transport & Logistics Management
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Licensed Transport Coordinators Only
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
              <Label htmlFor="coordinatorId">Transport Coordinator ID</Label>
              <Input
                id="coordinatorId"
                type="text"
                {...form.register("coordinatorId")}
                className="w-full"
                placeholder="Enter your coordinator ID"
                data-testid="input-coordinator-id"
              />
              {form.formState.errors.coordinatorId && (
                <p className="text-sm text-red-600">{form.formState.errors.coordinatorId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transportCredentials">Transport Credentials</Label>
              <Select 
                value={form.watch("transportCredentials")} 
                onValueChange={(value) => form.setValue("transportCredentials", value)}
              >
                <SelectTrigger data-testid="select-transport-credentials">
                  <SelectValue placeholder="Select your transport credentials" />
                </SelectTrigger>
                <SelectContent>
                  {transportCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.transportCredentials && (
                <p className="text-sm text-red-600">{form.formState.errors.transportCredentials.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinationLevel">Coordination Level</Label>
              <Select 
                value={form.watch("coordinationLevel")} 
                onValueChange={(value) => form.setValue("coordinationLevel", value)}
              >
                <SelectTrigger data-testid="select-coordination-level">
                  <SelectValue placeholder="Select your coordination level" />
                </SelectTrigger>
                <SelectContent>
                  {coordinationLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.coordinationLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.coordinationLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="routeSpecialization">Route Specialization</Label>
              <Select 
                value={form.watch("routeSpecialization")} 
                onValueChange={(value) => form.setValue("routeSpecialization", value)}
              >
                <SelectTrigger data-testid="select-route-specialization">
                  <SelectValue placeholder="Select your route specialization" />
                </SelectTrigger>
                <SelectContent>
                  {routeSpecializations.map((route) => (
                    <SelectItem key={route.value} value={route.value}>
                      {route.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.routeSpecialization && (
                <p className="text-sm text-red-600">{form.formState.errors.routeSpecialization.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fleetSize">Fleet Size</Label>
              <Select 
                value={form.watch("fleetSize")} 
                onValueChange={(value) => form.setValue("fleetSize", value)}
              >
                <SelectTrigger data-testid="select-fleet-size">
                  <SelectValue placeholder="Select your fleet size" />
                </SelectTrigger>
                <SelectContent>
                  {fleetSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.fleetSize && (
                <p className="text-sm text-red-600">{form.formState.errors.fleetSize.message}</p>
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
                  {safetyCredentials.map((credential) => (
                    <SelectItem key={credential.value} value={credential.value}>
                      {credential.label}
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
                  Verifying Transport Credentials...
                </div>
              ) : (
                "Access Transport Coordinator Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Licensed transport coordinators only. All transport operations are tracked for safety and compliance monitoring.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Transport Coordination Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}