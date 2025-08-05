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
import { Shield, Pickaxe, AlertCircle, Eye, EyeOff, HardHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const loginSchema = z.object({
  operatorId: z.string().min(1, "Mine Operator ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  miningLicense: z.string().min(1, "Mining license number is required"),
  operationLevel: z.string().min(1, "Operation level is required"),
  mineLocation: z.string().min(1, "Mine location is required"),
  mineralType: z.string().min(1, "Primary mineral type is required"),
  safetyCredentials: z.string().min(1, "Safety credentials are required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function MineWatchMineOperatorLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      operatorId: "",
      password: "",
      miningLicense: "",
      operationLevel: "",
      mineLocation: "",
      mineralType: "",
      safetyCredentials: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/mine-watch-mine-operator-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "mine-watch-mine-operator",
          portalType: "mine-operator"
        })
      });
      
      if (result && result.success) {
        toast({
          title: "Mine Operator Login Successful",
          description: "Welcome to Mine Watch Operator Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "mine-operator");
        localStorage.setItem("userType", "mine-watch-mine-operator");
        localStorage.setItem("mineLocation", data.mineLocation);
        
        window.location.href = "/mine-watch-operator-dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please verify your mine operator credentials.";
      setError(errorMessage);
      toast({
        title: "Mine Operator Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const operationLevels = [
    { value: "mine-manager", label: "Mine Manager" },
    { value: "operations-supervisor", label: "Operations Supervisor" },
    { value: "shift-supervisor", label: "Shift Supervisor" },
    { value: "section-foreman", label: "Section Foreman" },
    { value: "mine-operator", label: "Mine Operator" },
    { value: "equipment-operator", label: "Equipment Operator" }
  ];

  const mineLocations = [
    { value: "nimba-mountains", label: "Nimba Mountains (Iron Ore)" },
    { value: "bong-county", label: "Bong County (Gold)" },
    { value: "grand-cape-mount", label: "Grand Cape Mount (Rutile)" },
    { value: "grand-bassa", label: "Grand Bassa (Iron Ore)" },
    { value: "sinoe-county", label: "Sinoe County (Titanium)" },
    { value: "lofa-county", label: "Lofa County (Diamond)" },
    { value: "margibi-county", label: "Margibi County (Sand & Gravel)" },
    { value: "montserrado-county", label: "Montserrado County (Quarry)" }
  ];

  const mineralTypes = [
    { value: "iron-ore", label: "Iron Ore" },
    { value: "gold", label: "Gold" },
    { value: "diamond", label: "Diamond" },
    { value: "rutile", label: "Rutile (Titanium Dioxide)" },
    { value: "bauxite", label: "Bauxite" },
    { value: "sand-gravel", label: "Sand & Gravel" },
    { value: "limestone", label: "Limestone" },
    { value: "kyanite", label: "Kyanite" }
  ];

  const safetyCredentials = [
    { value: "msha-certified", label: "MSHA Certified Operator" },
    { value: "hazmat-trained", label: "HAZMAT Trained" },
    { value: "first-aid-certified", label: "First Aid & CPR Certified" },
    { value: "equipment-safety", label: "Heavy Equipment Safety" },
    { value: "explosion-safety", label: "Explosion Safety Trained" },
    { value: "environmental-safety", label: "Environmental Safety Certified" }
  ];

  return (
    <div className="min-h-screen isms-gradient flex items-center justify-center p-4">
      <Helmet>
        <title>Mine Watch Mine Operator Login - Mining Operations Management Access</title>
        <meta name="description" content="Secure access portal for mine operators and mining supervisors" />
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
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                <Pickaxe className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Mine Watch Portal
            </h1>
            <p className="text-slate-600">
              Mine Operator Access - Mining Operations & Safety Management
            </p>
            <div className="text-xs text-slate-500 mt-2">
              Licensed Mining Operators Only
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
              <Label htmlFor="operatorId">Mine Operator ID</Label>
              <Input
                id="operatorId"
                type="text"
                {...form.register("operatorId")}
                className="w-full"
                placeholder="Enter your operator ID"
                data-testid="input-operator-id"
              />
              {form.formState.errors.operatorId && (
                <p className="text-sm text-red-600">{form.formState.errors.operatorId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="miningLicense">Mining License Number</Label>
              <Input
                id="miningLicense"
                type="text"
                {...form.register("miningLicense")}
                className="w-full"
                placeholder="Enter your mining license number"
                data-testid="input-mining-license"
              />
              {form.formState.errors.miningLicense && (
                <p className="text-sm text-red-600">{form.formState.errors.miningLicense.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="operationLevel">Operation Level</Label>
              <Select 
                value={form.watch("operationLevel")} 
                onValueChange={(value) => form.setValue("operationLevel", value)}
              >
                <SelectTrigger data-testid="select-operation-level">
                  <SelectValue placeholder="Select your operation level" />
                </SelectTrigger>
                <SelectContent>
                  {operationLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.operationLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.operationLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mineLocation">Mine Location</Label>
              <Select 
                value={form.watch("mineLocation")} 
                onValueChange={(value) => form.setValue("mineLocation", value)}
              >
                <SelectTrigger data-testid="select-mine-location">
                  <SelectValue placeholder="Select your mine location" />
                </SelectTrigger>
                <SelectContent>
                  {mineLocations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.mineLocation && (
                <p className="text-sm text-red-600">{form.formState.errors.mineLocation.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mineralType">Primary Mineral Type</Label>
              <Select 
                value={form.watch("mineralType")} 
                onValueChange={(value) => form.setValue("mineralType", value)}
              >
                <SelectTrigger data-testid="select-mineral-type">
                  <SelectValue placeholder="Select primary mineral type" />
                </SelectTrigger>
                <SelectContent>
                  {mineralTypes.map((mineral) => (
                    <SelectItem key={mineral.value} value={mineral.value}>
                      {mineral.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.mineralType && (
                <p className="text-sm text-red-600">{form.formState.errors.mineralType.message}</p>
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
                  Verifying Mining Credentials...
                </div>
              ) : (
                "Access Mine Operator Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Licensed mining operators only. All mining operations are monitored for safety and environmental compliance.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Mining Operations Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}