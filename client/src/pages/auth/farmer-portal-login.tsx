import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, ArrowLeft, ArrowRight, MapPin, UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const LIBERIAN_COUNTIES = [
  "Bomi County", "Bong County", "Gbarpolu County", "Grand Bassa County",
  "Grand Cape Mount County", "Grand Gedeh County", "Grand Kru County",
  "Lofa County", "Margibi County", "Maryland County", "Montserrado County",
  "Nimba County", "River Cess County", "River Gee County", "Sinoe County"
];

const farmerLoginSchema = z.object({
  farmerId: z.string().min(1, "Farmer ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  county: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const farmerRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  county: z.string().min(1, "County is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  district: z.string().optional(),
  village: z.string().optional(),
  community: z.string().optional(),
});

type FarmerLoginForm = z.infer<typeof farmerLoginSchema>;
type FarmerRegistrationForm = z.infer<typeof farmerRegistrationSchema>;

export default function FarmerPortalLogin() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();

  const loginForm = useForm<FarmerLoginForm>({
    resolver: zodResolver(farmerLoginSchema),
    defaultValues: {
      farmerId: "",
      password: "",
      county: "",
      phoneNumber: "",
    },
  });

  const registrationForm = useForm<FarmerRegistrationForm>({
    resolver: zodResolver(farmerRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      county: "",
      phoneNumber: "",
      email: "",
      district: "",
      village: "",
      community: "",
    },
  });

  const onLoginSubmit = async (data: FarmerLoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/farmers/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (result.success) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.farmer.firstName}!`,
        });
        
        localStorage.setItem('farmer_token', result.token);
        localStorage.setItem('farmer_id', result.farmer.farmerId);
        localStorage.setItem('farmer_name', result.farmer.firstName);
        
        navigate('/farmer-dashboard');
      } else {
        setError(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegistrationSubmit = async (data: FarmerRegistrationForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/farmers/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (result.success) {
        toast({
          title: "Registration Successful",
          description: `Welcome ${data.firstName}! Your Farmer ID is: ${result.farmer.farmerId}`,
          duration: 8000,
        });
        
        localStorage.setItem('farmer_token', result.token);
        localStorage.setItem('farmer_id', result.farmer.farmerId);
        localStorage.setItem('farmer_name', result.farmer.firstName);
        
        navigate('/farmer-dashboard');
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      {/* Back to Platform Button */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Polipus Platform
          </Button>
        </Link>
      </div>
      
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <img 
              src={lacraLogo} 
              alt="LACRA Logo" 
              className="w-16 h-16 object-contain rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Farmer Portal</h1>
          <p className="text-slate-700 text-lg">Agricultural Traceability System</p>
          <p className="text-slate-600 text-sm mt-2">Liberia Agriculture Commodity Regulatory Authority</p>
        </div>

        {/* Main Card */}
        <Card className="bg-white shadow-xl border-slate-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-900">
              {activeTab === "login" ? "Farmer Login" : "Register New Farmer"}
            </CardTitle>
            <CardDescription className="text-slate-600">
              {activeTab === "login" 
                ? "Access your agricultural traceability dashboard" 
                : "Join the LACRA agricultural traceability system"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tab Buttons */}
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === "login"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === "register"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="farmerId">Farmer ID</Label>
                  <Input
                    id="farmerId"
                    placeholder="Enter your Farmer ID"
                    {...loginForm.register("farmerId")}
                    data-testid="input-farmer-id"
                  />
                  {loginForm.formState.errors.farmerId && (
                    <p className="text-sm text-red-600">{loginForm.formState.errors.farmerId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...loginForm.register("password")}
                      data-testid="input-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500" />
                      )}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  disabled={isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}

            {/* Registration Form */}
            {activeTab === "register" && (
              <form onSubmit={registrationForm.handleSubmit(onRegistrationSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      {...registrationForm.register("firstName")}
                      data-testid="input-first-name"
                    />
                    {registrationForm.formState.errors.firstName && (
                      <p className="text-sm text-red-600">{registrationForm.formState.errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      {...registrationForm.register("lastName")}
                      data-testid="input-last-name"
                    />
                    {registrationForm.formState.errors.lastName && (
                      <p className="text-sm text-red-600">{registrationForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="county">County</Label>
                  <Select onValueChange={(value) => registrationForm.setValue("county", value)}>
                    <SelectTrigger data-testid="select-county">
                      <SelectValue placeholder="Select your county" />
                    </SelectTrigger>
                    <SelectContent>
                      {LIBERIAN_COUNTIES.map((county) => (
                        <SelectItem key={county} value={county}>
                          {county}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {registrationForm.formState.errors.county && (
                    <p className="text-sm text-red-600">{registrationForm.formState.errors.county.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Phone number"
                    {...registrationForm.register("phoneNumber")}
                    data-testid="input-phone"
                  />
                  {registrationForm.formState.errors.phoneNumber && (
                    <p className="text-sm text-red-600">{registrationForm.formState.errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    {...registrationForm.register("email")}
                    data-testid="input-email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district">District (Optional)</Label>
                    <Input
                      id="district"
                      placeholder="District"
                      {...registrationForm.register("district")}
                      data-testid="input-district"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="village">Village (Optional)</Label>
                    <Input
                      id="village"
                      placeholder="Village"
                      {...registrationForm.register("village")}
                      data-testid="input-village"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  disabled={isLoading}
                  data-testid="button-register"
                >
                  {isLoading ? "Creating Account..." : "Create Farmer Account"}
                  <UserPlus className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}