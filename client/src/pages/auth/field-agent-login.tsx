import { useState } from "react";
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
import { Users, MapPin, AlertCircle, Eye, EyeOff, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { OfflineDetector } from "@/components/offline-detector";
import { GPSPermissionHandler } from "@/components/gps-permission-handler";
import { MobileGPSTester } from "@/components/mobile-gps-tester";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const LIBERIAN_COUNTIES = [
  "Bomi County", "Bong County", "Gbarpolu County", "Grand Bassa County",
  "Grand Cape Mount County", "Grand Gedeh County", "Grand Kru County",
  "Lofa County", "Margibi County", "Maryland County", "Montserrado County",
  "Nimba County", "River Cess County", "River Gee County", "Sinoe County"
];

const loginSchema = z.object({
  agentId: z.string().min(1, "Agent ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  jurisdiction: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function FieldAgentLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      agentId: "",
      password: "",
      jurisdiction: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    // Enhanced offline check with connection test
    if (!navigator.onLine) {
      setError("You're currently offline. Login requires an internet connection. Please connect to the internet and try again.");
      setIsLoading(false);
      toast({
        title: "Offline Mode",
        description: "Internet connection required for login",
        variant: "destructive",
      });
      return;
    }



    try {
      console.log('Submitting field agent login:', data);
      const result = await apiRequest("/api/auth/field-agent-login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userType: "field_agent"
        })
      });
      
      console.log('Login result:', result);
      
      if (result && result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to your Field Agent Portal",
        });
        
        // Store session data
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "field_agent");
        localStorage.setItem("userType", "field_agent");
        localStorage.setItem("agentId", data.agentId);
        localStorage.setItem("jurisdiction", data.jurisdiction || "");
        
        // Redirect to dashboard
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      console.error('Field agent login error:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-3 sm:p-4">
      <Helmet>
        <title>Field Agent Portal Login - AgriTrace360™ LACRA</title>
        <meta name="description" content="Secure login portal for LACRA field agents and extension officers" />
      </Helmet>

      <OfflineDetector />
      
      {/* Simple GPS Test - Always Visible */}
      <div className="w-full max-w-4xl mb-6">
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-4">
          <h3 className="font-bold text-blue-800">GPS System Test</h3>
          <p className="text-blue-700">Testing GPS integration for mobile devices</p>
          <button 
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                (pos) => alert(`GPS Working! Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`),
                (err) => alert(`GPS Error: ${err.message}`)
              );
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test GPS Now
          </button>
        </div>
        
        <MobileGPSTester />
        
        <GPSPermissionHandler 
          onPermissionGranted={(position) => {
            console.log('GPS enabled for field agent operations:', position.coords);
            toast({
              title: "Location Services Active",
              description: "GPS tracking enabled for field inspections and reporting",
            });
          }}
          onPermissionDenied={() => {
            toast({
              title: "GPS Required for Field Work",
              description: "Location services are essential for field agent operations",
              variant: "destructive",
            });
          }}
          showCard={true}
          autoRequest={false}
        />
      </div>

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
              <div className="p-3 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              LACRA Field Agent Portal
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Liberia Agriculture Commodity Regulatory Authority
            </p>
            <p className="text-sm text-gray-500">
              AgriTrace360™ Mobile Field Operations
            </p>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Agent ID */}
              <div>
                <Label htmlFor="agentId">Agent ID *</Label>
                <Input
                  id="agentId"
                  type="text"
                  {...form.register("agentId")}
                  className="mt-1"
                  placeholder="e.g., AGT-2024-001"
                />
                {form.formState.errors.agentId && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.agentId.message}</p>
                )}
              </div>

              {/* Jurisdiction */}
              <div>
                <Label htmlFor="jurisdiction">Assigned County/District (Optional)</Label>
                <Select 
                  value={form.watch("jurisdiction")} 
                  onValueChange={(value) => form.setValue("jurisdiction", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your assigned area (optional)" />
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
                    <SelectItem value="multi_county">
                      <div className="flex items-center gap-2">
                        <Clipboard className="h-4 w-4" />
                        Multi-County Assignment
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.jurisdiction && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.jurisdiction.message}</p>
                )}
              </div>

              {/* Phone Number (Optional) */}
              <div>
                <Label htmlFor="phoneNumber">Mobile Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...form.register("phoneNumber")}
                  className="mt-1"
                  placeholder="e.g., +231 77 123 4567"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for field data sync and emergency contact
                </p>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    className="pr-10"
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
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-medium py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  "Access Field Agent Portal"
                )}
              </Button>
            </form>

            {/* Field Agent Features */}
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Field Agent Tools</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Register new farmers and farm plots</li>
                <li>• Conduct field inspections and GPS mapping</li>
                <li>• Generate batch codes for crop harvests</li>
                <li>• Submit compliance reports and documentation</li>
                <li>• Mobile-optimized data collection forms</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Liberia Agriculture Commodity Regulatory Authority
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Field operations portal for extension services
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
              href="/farmer-login"
              className="text-sm text-green-600 hover:text-green-800 underline"
            >
              Farmer Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}