import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, ArrowLeft, ArrowRight, Building2, UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const buyerLoginSchema = z.object({
  buyerId: z.string().min(1, "Buyer ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  companyName: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const buyerRegistrationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactPersonName: z.string().min(1, "Contact person name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  businessAddress: z.string().min(1, "Business address is required"),
  businessLicense: z.string().optional(),
  commodityTypes: z.string().min(1, "Commodity types are required"),
});

type BuyerLoginForm = z.infer<typeof buyerLoginSchema>;
type BuyerRegistrationForm = z.infer<typeof buyerRegistrationSchema>;

export default function BuyerPortalLogin() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();

  const loginForm = useForm<BuyerLoginForm>({
    resolver: zodResolver(buyerLoginSchema),
    defaultValues: {
      buyerId: "",
      password: "",
      companyName: "",
      phoneNumber: "",
    },
  });

  const registrationForm = useForm<BuyerRegistrationForm>({
    resolver: zodResolver(buyerRegistrationSchema),
    defaultValues: {
      companyName: "",
      contactPersonName: "",
      phoneNumber: "",
      email: "",
      businessAddress: "",
      businessLicense: "",
      commodityTypes: "",
    },
  });

  const onLoginSubmit = async (data: BuyerLoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/buyers/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (result.success) {
        toast({
          title: "Login Successful",
          description: `Welcome back to ${result.buyer.companyName}!`,
        });
        
        localStorage.setItem('buyer_token', result.token);
        localStorage.setItem('buyer_id', result.buyer.buyerId);
        localStorage.setItem('buyer_company', result.buyer.companyName);
        
        navigate('/buyer-dashboard');
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

  const onRegistrationSubmit = async (data: BuyerRegistrationForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/buyers/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (result.success) {
        toast({
          title: "Registration Successful",
          description: `Welcome ${data.companyName}! Your Buyer ID is: ${result.buyer.buyerId}`,
          duration: 8000,
        });
        
        localStorage.setItem('buyer_token', result.token);
        localStorage.setItem('buyer_id', result.buyer.buyerId);
        localStorage.setItem('buyer_company', result.buyer.companyName);
        
        navigate('/buyer-dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Buyer Portal</h1>
          <p className="text-slate-700 text-lg">Agricultural Commerce Platform</p>
          <p className="text-slate-600 text-sm mt-2">Liberia Agriculture Commodity Regulatory Authority</p>
        </div>

        {/* Main Card */}
        <Card className="bg-white shadow-xl border-slate-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-900">
              {activeTab === "login" ? "Buyer Login" : "Register New Buyer"}
            </CardTitle>
            <CardDescription className="text-slate-600">
              {activeTab === "login" 
                ? "Access your agricultural commerce dashboard" 
                : "Join the LACRA agricultural marketplace"
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
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === "register"
                    ? "bg-white text-blue-600 shadow-sm"
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
                  <Label htmlFor="buyerId">Buyer ID</Label>
                  <Input
                    id="buyerId"
                    placeholder="Enter your Buyer ID"
                    {...loginForm.register("buyerId")}
                    data-testid="input-buyer-id"
                  />
                  {loginForm.formState.errors.buyerId && (
                    <p className="text-sm text-red-600">{loginForm.formState.errors.buyerId.message}</p>
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
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
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
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Company name"
                    {...registrationForm.register("companyName")}
                    data-testid="input-company-name"
                  />
                  {registrationForm.formState.errors.companyName && (
                    <p className="text-sm text-red-600">{registrationForm.formState.errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Contact Person Name</Label>
                  <Input
                    id="contactPersonName"
                    placeholder="Contact person name"
                    {...registrationForm.register("contactPersonName")}
                    data-testid="input-contact-name"
                  />
                  {registrationForm.formState.errors.contactPersonName && (
                    <p className="text-sm text-red-600">{registrationForm.formState.errors.contactPersonName.message}</p>
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

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input
                    id="businessAddress"
                    placeholder="Business address"
                    {...registrationForm.register("businessAddress")}
                    data-testid="input-address"
                  />
                  {registrationForm.formState.errors.businessAddress && (
                    <p className="text-sm text-red-600">{registrationForm.formState.errors.businessAddress.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Business License (Optional)</Label>
                  <Input
                    id="businessLicense"
                    placeholder="Business license number"
                    {...registrationForm.register("businessLicense")}
                    data-testid="input-license"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commodityTypes">Commodity Types</Label>
                  <Input
                    id="commodityTypes"
                    placeholder="e.g., Coffee, Cocoa, Rice, Cassava"
                    {...registrationForm.register("commodityTypes")}
                    data-testid="input-commodities"
                  />
                  {registrationForm.formState.errors.commodityTypes && (
                    <p className="text-sm text-red-600">{registrationForm.formState.errors.commodityTypes.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  disabled={isLoading}
                  data-testid="button-register"
                >
                  {isLoading ? "Creating Account..." : "Create Buyer Account"}
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