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
import { Leaf, MapPin, AlertCircle, Eye, EyeOff, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const LIBERIAN_COUNTIES = [
  "Bomi County", "Bong County", "Gbarpolu County", "Grand Bassa County",
  "Grand Cape Mount County", "Grand Gedeh County", "Grand Kru County",
  "Lofa County", "Margibi County", "Maryland County", "Montserrado County",
  "Nimba County", "River Cess County", "River Gee County", "Sinoe County"
];

const loginSchema = z.object({
  farmerId: z.string().min(1, "Farmer ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  county: z.string().min(1, "County is required"),
  phoneNumber: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function FarmerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showRegistration, setShowRegistration] = useState(false);
  const { toast } = useToast();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4">
      <Helmet>
        <title>Farmer Portal Login - AgriTrace360™ LACRA</title>
        <meta name="description" content="Secure login portal for registered farmers in Liberia" />
      </Helmet>

      <div className="w-full max-w-lg">
        <div className="isms-card p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <img 
                  src={lacraLogo} 
                  alt="LACRA Official Logo" 
                  className="w-28 h-28 object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              LACRA Farmer Portal
            </h1>
            <p className="text-slate-600 mb-1">
              Liberia Agriculture Commodity Regulatory Authority
            </p>
            <p className="text-sm text-slate-500">
              AgriTrace360™ Farm Management System
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Farmer ID */}
              <div>
                <Label htmlFor="farmerId" className="text-slate-700 font-medium">Farmer ID *</Label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-5 h-5 rounded-full isms-icon-bg-green flex items-center justify-center">
                      <Leaf className="h-3 w-3" />
                    </div>
                  </div>
                  <Input
                    id="farmerId"
                    type="text"
                    {...form.register("farmerId")}
                    className="pl-11 isms-input"
                    placeholder="e.g., FRM-2024-001"
                  />
                </div>
                {form.formState.errors.farmerId && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.farmerId.message}</p>
                )}
              </div>

              {/* County */}
              <div>
                <Label htmlFor="county" className="text-slate-700 font-medium">County *</Label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <div className="w-5 h-5 rounded-full isms-icon-bg-blue flex items-center justify-center">
                      <MapPin className="h-3 w-3" />
                    </div>
                  </div>
                  <Select 
                    value={form.watch("county")} 
                    onValueChange={(value) => form.setValue("county", value)}
                  >
                    <SelectTrigger className="pl-11 isms-input">
                      <SelectValue placeholder="Select your county" />
                    </SelectTrigger>
                    <SelectContent>
                      {LIBERIAN_COUNTIES.map(county => (
                        <SelectItem key={county} value={county}>
                          {county}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {form.formState.errors.county && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.county.message}</p>
                )}
              </div>

              {/* Phone Number (Optional) */}
              <div>
                <Label htmlFor="phoneNumber" className="text-slate-700 font-medium">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...form.register("phoneNumber")}
                  className="mt-2 isms-input"
                  placeholder="e.g., +231 77 123 4567"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-slate-700 font-medium">Password *</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    className="pr-10 isms-input"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
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
                className="w-full isms-button-primary h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Leaf className="h-5 w-5 mr-2" />
                    Access Farmer Portal
                  </>
                )}
              </Button>

              {/* Test Credentials Helper */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 rounded-full isms-icon-bg-blue flex items-center justify-center mr-2">
                    <Eye className="h-3 w-3" />
                  </div>
                  <p className="text-sm font-semibold text-blue-800">Test Credentials</p>
                </div>
                <div className="text-sm text-blue-700 space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span>Farmer ID:</span> 
                    <span className="font-mono bg-white px-2 py-1 rounded text-xs">FRM-2024-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Password:</span> 
                    <span className="font-mono bg-white px-2 py-1 rounded text-xs">farmer123</span>
                  </div>
                  <div className="flex justify-between">
                    <span>County:</span> 
                    <span className="font-mono bg-white px-2 py-1 rounded text-xs">Lofa County</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-sm bg-white/50 hover:bg-white border-blue-300 text-blue-700"
                  onClick={() => {
                    form.setValue("farmerId", "FRM-2024-001");
                    form.setValue("password", "farmer123");
                    form.setValue("county", "Lofa County");
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Fill Test Data
                </Button>
              </div>

              {/* Registration Link */}
              <div className="pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full isms-button-secondary h-11"
                  onClick={() => setShowRegistration(!showRegistration)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  New Farmer Registration
                </Button>
              </div>
            </form>

            {/* Registration Information */}
            {showRegistration && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full isms-icon-bg-green flex items-center justify-center mr-3">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <h4 className="text-lg font-semibold text-green-800">New Farmer Registration</h4>
                </div>
                <p className="text-sm text-green-700 mb-4">
                  To register as a new farmer in the AgriTrace360™ system:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-3"></div>
                    Contact your local LACRA field agent
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-3"></div>
                    Visit the nearest LACRA county office
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-3"></div>
                    Call LACRA hotline: +231 77 LACRA-1
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-3"></div>
                    Complete farmer onboarding process
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Liberia Agriculture Commodity Regulatory Authority
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Farmer portal for crop tracking & compliance
              </p>
            </div>
        </div>

        {/* Access Information */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-300 mb-3">Different access type?</p>
          <div className="flex justify-center gap-6">
            <a
              href="/regulatory-login"
              className="text-sm text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              Regulatory Portal
            </a>
            <a
              href="/field-agent-login"  
              className="text-sm text-orange-400 hover:text-orange-300 underline transition-colors"
            >
              Field Agent Portal
            </a>
            <a
              href="/exporter-login"
              className="text-sm text-purple-400 hover:text-purple-300 underline transition-colors"
            >
              Exporter Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}