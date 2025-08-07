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
// import { OfflineDetector } from "@/components/offline-detector"; // Removed to allow offline functionality
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

  // Offline authentication function
  const tryOfflineAuthentication = async (credentials: LoginForm) => {
    // Check against known test accounts
    const testAccounts = [
      { agentId: "agent001", password: "password123" },
      { agentId: "agent002", password: "password123" },
      { agentId: "field001", password: "password123" },
    ];
    
    const isValidAccount = testAccounts.some(
      account => account.agentId === credentials.agentId && account.password === credentials.password
    );
    
    if (isValidAccount) {
      // Store offline auth
      localStorage.setItem("authToken", "offline-token-" + Date.now());
      localStorage.setItem("userType", "field_agent");
      localStorage.setItem("userId", credentials.agentId);
      localStorage.setItem("offlineMode", "true");
      
      return { success: true };
    }
    
    return { success: false };
  };

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");
    
    // Simple offline check - works with test credentials
    if ((data.agentId === "agent001" || data.agentId === "agent002" || data.agentId === "field001") && 
        data.password === "password123") {
      
      // Store auth data
      localStorage.setItem("authToken", "offline-token-" + Date.now());
      localStorage.setItem("userType", "field_agent");
      localStorage.setItem("userRole", "field_agent");
      localStorage.setItem("agentId", data.agentId);
      localStorage.setItem("jurisdiction", data.jurisdiction || "");
      localStorage.setItem("offlineMode", "true");
      
      toast({
        title: "Login Successful",
        description: "Welcome to your Field Agent Portal",
      });
      
      // Direct redirect
      window.location.href = "/field-agent-dashboard";
      setIsLoading(false);
      return;
    }
    
    // Invalid credentials
    setError("Invalid credentials. Use agent001/password123 for testing.");
    toast({
      title: "Login Failed", 
      description: "Invalid credentials. Use agent001/password123 for testing.",
      variant: "destructive",
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-red-500">
      <Helmet>
        <title>Field Agent Portal Login - AgriTrace360™ LACRA</title>
        <meta name="description" content="Secure login portal for LACRA field agents and extension officers" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>

      {/* Force reload indicator for debugging */}
      <div style={{ position: 'fixed', top: 0, right: 0, background: 'red', color: 'white', padding: '8px 16px', fontSize: '14px', zIndex: 9999, fontWeight: 'bold' }}>
        🚨 CACHE BUSTER v{Date.now()} 🚨
      </div>
      
      {/* Mobile-optimized container */}
      <div className="flex flex-col min-h-screen">
        


        {/* FORCE UPDATE TEST - BRIGHT RED BACKGROUND */}
        <div className="bg-yellow-400 p-4 text-black text-center font-bold text-2xl">
          🚨 THIS IS THE NEW VERSION WITH GPS BUTTON 🚨
        </div>

        {/* Login Form Container - Mobile Centered */}
        <div className="flex-1 flex items-center justify-center px-4 pb-4">
          <div className="w-full max-w-sm">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="text-center pb-4 px-4">
                <div className="flex justify-center items-center gap-2 mb-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img 
                      src={lacraLogo} 
                      alt="LACRA Official Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-red-900 leading-tight">
                  🚨 UPDATED VERSION - GPS BUTTON ACTIVE 🚨
                </CardTitle>
                <p className="text-gray-600 text-sm mt-1">
                  Liberia Agriculture Commodity Regulatory Authority
                </p>
                <p className="text-xs text-gray-500">
                  AgriTrace360™ Mobile Operations
                </p>
                

              </CardHeader>

              <CardContent className="px-4 pb-6">
                {error && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Agent ID */}
                  <div>
                    <Label htmlFor="agentId" className="text-sm font-medium">Agent ID *</Label>
                    <Input
                      id="agentId"
                      type="text"
                      {...form.register("agentId")}
                      className="mt-1 h-12 text-base"
                      placeholder="e.g., AGT-2024-001"
                    />
                    {form.formState.errors.agentId && (
                      <p className="text-xs text-red-600 mt-1">{form.formState.errors.agentId.message}</p>
                    )}
                  </div>

                  {/* Jurisdiction */}
                  <div>
                    <Label htmlFor="jurisdiction" className="text-sm font-medium">Assigned County/District (Optional)</Label>
                    <Select 
                      value={form.watch("jurisdiction")} 
                      onValueChange={(value) => form.setValue("jurisdiction", value)}
                    >
                      <SelectTrigger className="mt-1 h-12">
                        <SelectValue placeholder="Select your assigned area" />
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
                    <Label htmlFor="phoneNumber" className="text-sm font-medium">Mobile Number (Optional)</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      {...form.register("phoneNumber")}
                      className="mt-1 h-12 text-base"
                      placeholder="e.g., +231 77 123 4567"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Used for field data sync and emergency contact
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...form.register("password")}
                        className="pr-10 h-12 text-base"
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
                      <p className="text-xs text-red-600 mt-1">{form.formState.errors.password.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-medium py-3 h-12 text-base"
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
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2 text-sm">Field Agent Tools</h4>
                  <ul className="text-xs text-orange-700 space-y-1">
                    <li>• Register new farmers and farm plots</li>
                    <li>• Conduct field inspections and GPS mapping</li>
                    <li>• Generate batch codes for crop harvests</li>
                    <li>• Submit compliance reports and documentation</li>
                    <li>• Mobile-optimized data collection forms</li>
                  </ul>
                </div>

                {/* Footer */}
                <div className="mt-4 text-center">
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
            <div className="mt-4 text-center">
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
      </div>
    </div>
  );
}