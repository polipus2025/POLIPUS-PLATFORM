import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MapPin, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const LIBERIAN_COUNTIES = [
  "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount",
  "Grand Gedeh", "Grand Kru", "Lofa", "Margibi", "Maryland",
  "Montserrado", "Nimba", "River Cess", "River Gee", "Sinoe"
];

const loginSchema = z.object({
  agentId: z.string().min(1, "Agent ID is required"),
  password: z.string().min(1, "Password is required"),
  jurisdiction: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function MobileFieldAgentLogin() {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <Helmet>
        <title>Field Agent Portal - LACRA Mobile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>

      {/* Mobile Container */}
      <div className="max-w-sm mx-auto">
        
        {/* Compact GPS Test */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <h4 className="font-semibold text-blue-800 text-sm mb-2">Mobile GPS Testing Center</h4>
          <button 
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                (pos) => alert(`GPS Working!\nLat: ${pos.coords.latitude.toFixed(6)}\nLng: ${pos.coords.longitude.toFixed(6)}`),
                (err) => alert(`GPS Error: ${err.message}`)
              );
            }}
            className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Test GPS Permission
          </button>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src={lacraLogo} 
                  alt="LACRA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-lg font-bold text-gray-900">
              LACRA Field Agent Portal
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Mobile Field Operations
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
                  placeholder="e.g., agent001"
                />
                {form.formState.errors.agentId && (
                  <p className="text-xs text-red-600 mt-1">{form.formState.errors.agentId.message}</p>
                )}
              </div>

              {/* Jurisdiction */}
              <div>
                <Label htmlFor="jurisdiction" className="text-sm font-medium">County (Optional)</Label>
                <Select 
                  value={form.watch("jurisdiction")} 
                  onValueChange={(value) => form.setValue("jurisdiction", value)}
                >
                  <SelectTrigger className="mt-1 h-12">
                    <SelectValue placeholder="Select county" />
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
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-medium">Mobile Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...form.register("phoneNumber")}
                  className="mt-1 h-12 text-base"
                  placeholder="+231 77 123 4567"
                />
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
                    placeholder="Enter password"
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
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-medium h-12 text-base"
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
                <li>• Register farmers and plots</li>
                <li>• GPS field inspections</li>
                <li>• Generate batch codes</li>
                <li>• Submit compliance reports</li>
                <li>• Mobile data collection</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Liberia Agriculture Commodity Regulatory Authority
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Field operations portal
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Access Links */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Different access?</p>
          <div className="flex justify-center gap-4">
            <a
              href="/regulatory-login"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Regulatory
            </a>
            <a
              href="/farmer-login"
              className="text-sm text-green-600 hover:text-green-800 underline"
            >
              Farmer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}