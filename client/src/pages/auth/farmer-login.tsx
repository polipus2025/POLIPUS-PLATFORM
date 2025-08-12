import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, MapPin, AlertCircle, Eye, EyeOff, UserPlus, WifiOff, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";
import MobileFarmerRegistration from "@/components/mobile-farmer-registration";

const LIBERIAN_COUNTIES = [
  "Bomi County", "Bong County", "Gbarpolu County", "Grand Bassa County",
  "Grand Cape Mount County", "Grand Gedeh County", "Grand Kru County",
  "Lofa County", "Margibi County", "Maryland County", "Montserrado County",
  "Nimba County", "River Cess County", "River Gee County", "Sinoe County"
];

const loginSchema = z.object({
  farmerId: z.string().min(1, "Farmer ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  county: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function FarmerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  // Handle online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Show registration component if requested
  if (showRegistration) {
    return (
      <MobileFarmerRegistration
        onSuccess={() => {
          setShowRegistration(false);
          toast({
            title: "Registration Complete!",
            description: "You can now log in with your new account.",
          });
        }}
        onCancel={() => setShowRegistration(false)}
      />
    );
  }

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      farmerId: "",
      password: "",
      county: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      // Check if we're offline
      const isOffline = !navigator.onLine;
      
      if (isOffline) {
        // Offline login with cached credentials
        const cachedCredentials = localStorage.getItem("farmer-credentials");
        
        if (cachedCredentials) {
          const parsed = JSON.parse(cachedCredentials);
          
          if (parsed.farmerId === data.farmerId && parsed.password === data.password) {
            toast({
              title: "Offline Login Successful",
              description: "Welcome back! Working in offline mode.",
            });
            
            // Set offline session
            localStorage.setItem("authToken", `offline-${Date.now()}`);
            localStorage.setItem("userRole", "farmer");
            localStorage.setItem("userType", "farmer");
            localStorage.setItem("farmerId", data.farmerId);
            localStorage.setItem("farmerFirstName", parsed.firstName || "Farmer");
            localStorage.setItem("isOfflineSession", "true");
            
            window.location.href = "/farmer-dashboard";
            return;
          }
        }
        
        throw new Error("No cached credentials found for offline login. Please connect to internet for first-time login.");
      }

      // Online login
      const result = await apiRequest("/api/auth/farmer-login", {
        method: "POST",
        body: JSON.stringify({
          farmerId: data.farmerId,
          password: data.password,
          county: data.county,
          phoneNumber: data.phoneNumber,
          userType: "farmer"
        })
      });

      if (result && result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to your Farmer Portal",
        });
        
        // Store session data
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "farmer");
        localStorage.setItem("userType", "farmer");
        
        // Cache credentials for offline use
        localStorage.setItem("farmer-credentials", JSON.stringify({
          farmerId: data.farmerId,
          password: data.password,
          firstName: result.farmerName || "Farmer"
        }));
        localStorage.setItem("farmerId", data.farmerId);
        
        // Redirect to dashboard (authenticated route)
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-3 sm:p-4">
      <Helmet>
        <title>Farmer Portal Login - AgriTrace360™ LACRA</title>
        <meta name="description" content="Secure login portal for registered farmers in Liberia" />
      </Helmet>

      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img 
                  src={lacraLogo} 
                  alt="LACRA Official Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                <Leaf className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              LACRA Farmer Portal
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Liberia Agriculture Commodity Regulatory Authority
            </p>
            <p className="text-sm text-gray-500">
              AgriTrace360™ Farm Management System
            </p>
          </CardHeader>

          <CardContent>
            {/* Online/Offline Status */}
            <div className="mb-4">
              <div className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm ${
                isOnline 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              }`}>
                {isOnline ? (
                  <>
                    <Wifi className="h-4 w-4" />
                    <span>Online - Full access available</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4" />
                    <span>Offline - Limited functionality</span>
                  </>
                )}
              </div>
            </div>

            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Farmer ID */}
              <div>
                <Label htmlFor="farmerId">Farmer ID *</Label>
                <Input
                  id="farmerId"
                  type="text"
                  {...form.register("farmerId")}
                  className="mt-1 min-h-[44px] text-base"
                  placeholder="e.g., FRM-2024-001"
                />
                {form.formState.errors.farmerId && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.farmerId.message}</p>
                )}
              </div>

              {/* County */}
              <div>
                <Label htmlFor="county">County (Optional)</Label>
                <Select 
                  value={form.watch("county")} 
                  onValueChange={(value) => form.setValue("county", value)}
                >
                  <SelectTrigger className="mt-1 min-h-[44px]">
                    <SelectValue placeholder="Select your county (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIBERIAN_COUNTIES.map(county => (
                      <SelectItem key={county} value={county}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {county}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.county && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.county.message}</p>
                )}
              </div>

              {/* Phone Number (Optional) */}
              <div>
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...form.register("phoneNumber")}
                  className="mt-1 min-h-[44px] text-base"
                  placeholder="e.g., +231 77 123 4567"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    className="pr-10 min-h-[44px] text-base"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 min-h-[44px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  "Access Farmer Portal"
                )}
              </Button>

              {/* Test Credentials Helper */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">Test Credentials:</p>
                <div className="text-xs text-blue-600 space-y-1 mb-2">
                  <div>Farmer ID: <span className="font-mono bg-white px-1 rounded">FRM-2024-001</span></div>
                  <div>Password: <span className="font-mono bg-white px-1 rounded">farmer123</span></div>
                  <div>County: <span className="font-mono bg-white px-1 rounded">Lofa County</span></div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    form.setValue("farmerId", "FRM-2024-001");
                    form.setValue("password", "farmer123");
                    form.setValue("county", "Lofa County");
                  }}
                >
                  Fill Test Data
                </Button>
              </div>

              {/* Registration Link */}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-green-300 text-green-700 hover:bg-green-50 min-h-[44px]"
                  onClick={() => setShowRegistration(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  New Farmer Registration
                </Button>
              </div>
            </form>



            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Liberia Agriculture Commodity Regulatory Authority
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Farmer portal for crop tracking & compliance
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Access Information */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Different access type?</p>
          <div className="flex justify-center gap-4">
            <a
              href="/regulatory-login"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Regulatory Portal
            </a>
            <a
              href="/field-agent-login"
              className="text-sm text-orange-600 hover:text-orange-800 underline"
            >
              Field Agent Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}