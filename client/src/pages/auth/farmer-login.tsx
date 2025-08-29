import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Leaf, MapPin, AlertCircle, Eye, EyeOff, UserPlus, ShoppingCart, Users, ArrowLeft, Shield } from "lucide-react";
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

const buyerLoginSchema = z.object({
  buyerId: z.string().min(1, "Buyer ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  companyName: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type FarmerLoginForm = z.infer<typeof farmerLoginSchema>;
type BuyerLoginForm = z.infer<typeof buyerLoginSchema>;

export default function FarmerBuyerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const farmerForm = useForm<FarmerLoginForm>({
    resolver: zodResolver(farmerLoginSchema),
    defaultValues: {
      farmerId: "",
      password: "",
      county: "",
      phoneNumber: "",
    },
  });

  const buyerForm = useForm<BuyerLoginForm>({
    resolver: zodResolver(buyerLoginSchema),
    defaultValues: {
      buyerId: "",
      password: "",
      companyName: "",
      phoneNumber: "",
    },
  });

  const onFarmerSubmit = async (data: FarmerLoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/farmers/login", {
        method: "POST",
        body: JSON.stringify({
          credentialId: data.farmerId,
          password: data.password
        })
      });

      if (result && result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to your Farmer Portal",
        });
        
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "farmer");
        localStorage.setItem("userType", "farmer");
        localStorage.setItem("farmerId", result.farmer.farmerId);
        localStorage.setItem("credentialId", data.farmerId);
        localStorage.setItem("farmerFirstName", result.farmer.firstName);
        localStorage.setItem("farmerLastName", result.farmer.lastName);
        localStorage.setItem("farmerFullName", `${result.farmer.firstName} ${result.farmer.lastName}`);
        
        window.location.href = "/farmer-dashboard";
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

  const onBuyerSubmit = async (data: BuyerLoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/auth/buyer-login", {
        method: "POST",
        body: JSON.stringify({
          buyerId: data.buyerId,
          password: data.password,
          companyName: data.companyName,
          phoneNumber: data.phoneNumber,
          userType: "buyer"
        })
      });

      if (result && result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to your Buyer Portal",
        });
        
        // Clear any old regulatory tokens first
        localStorage.removeItem("dgToken");
        localStorage.removeItem("ddgotsToken");
        localStorage.removeItem("ddgafToken");
        
        // Set buyer credentials
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", "buyer");
        localStorage.setItem("userType", "buyer");
        localStorage.setItem("buyerId", data.buyerId);
        
        window.location.href = "/agricultural-buyer-dashboard";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Helmet>
        <title>Farmer & Buyer Portal Login - AgriTrace360™ LACRA</title>
        <meta name="description" content="Secure login portal for farmers and buyers in Liberia" />
      </Helmet>

      {/* Back to Platform Button */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Polipus Platform
          </Button>
        </Link>
      </div>
      
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
            <Users className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">LACRA Farmer & Buyer Portal</h1>
          <p className="text-slate-700">Agricultural Management Access System</p>
          <p className="text-slate-600 text-sm mt-1">Liberia Agriculture Commodity Regulatory Authority</p>
        </div>

        {/* Access Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          
          {/* Farmer Login Card */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all">
            <CardHeader className="text-center pb-3">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-2">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-slate-900 flex items-center justify-center gap-2">
                <Leaf className="w-4 h-4" />
                Farmer Portal
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">
                Agricultural Producers & Farm Managers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Badge variant="outline" className="w-full justify-center border-green-500 text-green-600 bg-green-50 text-xs py-1">
                Agricultural Operations Access
              </Badge>
              
              {error && (
                <Alert className="border-red-200 bg-red-50 py-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Farmer Login Form */}
              <form onSubmit={farmerForm.handleSubmit(onFarmerSubmit)} className="space-y-2">
                  <div>
                    <Label htmlFor="farmerId" className="text-sm">Farmer ID *</Label>
                    <Input
                      id="farmerId"
                      type="text"
                      {...farmerForm.register("farmerId")}
                      className="mt-1 h-8"
                      placeholder="e.g., FRM-2024-001"
                      data-testid="input-farmer-id"
                    />
                    {farmerForm.formState.errors.farmerId && (
                      <p className="text-xs text-red-600 mt-1">{farmerForm.formState.errors.farmerId.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="farmer-county" className="text-sm">County (Optional)</Label>
                    <Select 
                      value={farmerForm.watch("county")} 
                      onValueChange={(value) => farmerForm.setValue("county", value)}
                    >
                      <SelectTrigger className="mt-1 h-8" data-testid="select-farmer-county">
                        <SelectValue placeholder="Select your county" />
                      </SelectTrigger>
                      <SelectContent>
                        {LIBERIAN_COUNTIES.map(county => (
                          <SelectItem key={county} value={county}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span className="text-sm">{county}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="farmer-phone" className="text-sm">Phone Number (Optional)</Label>
                    <Input
                      id="farmer-phone"
                      type="tel"
                      {...farmerForm.register("phoneNumber")}
                      className="mt-1 h-8"
                      placeholder="e.g., +231 77 123 4567"
                      data-testid="input-farmer-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="farmer-password" className="text-sm">Password *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="farmer-password"
                        type={showPassword ? "text" : "password"}
                        {...farmerForm.register("password")}
                        className="pr-10 h-8"
                        placeholder="Enter your password"
                        data-testid="input-farmer-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                    </div>
                    {farmerForm.formState.errors.password && (
                      <p className="text-xs text-red-600 mt-1">{farmerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white group h-8 text-sm"
                  disabled={isLoading}
                  data-testid="button-farmer-login"
                >
                  {isLoading ? "Logging in..." : "Access Farmer Portal"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Buyer Login Card */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all">
            <CardHeader className="text-center pb-3">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-2">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-slate-900 flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Buyer Portal
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">
                Agricultural Commodity Buyers & Traders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Badge variant="outline" className="w-full justify-center border-blue-500 text-blue-600 bg-blue-50 text-xs py-1">
                Commercial Operations Access
              </Badge>
              
              {error && (
                <Alert className="border-red-200 bg-red-50 py-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Buyer Login Form */}
              <form onSubmit={buyerForm.handleSubmit(onBuyerSubmit)} className="space-y-2">
                  <div>
                    <Label htmlFor="buyerId" className="text-sm">Buyer ID *</Label>
                    <Input
                      id="buyerId"
                      type="text"
                      {...buyerForm.register("buyerId")}
                      className="mt-1 h-8"
                      placeholder="e.g., BUY-2024-001"
                      data-testid="input-buyer-id"
                    />
                    {buyerForm.formState.errors.buyerId && (
                      <p className="text-xs text-red-600 mt-1">{buyerForm.formState.errors.buyerId.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="companyName" className="text-sm">Company Name (Optional)</Label>
                    <Input
                      id="companyName"
                      type="text"
                      {...buyerForm.register("companyName")}
                      className="mt-1 h-8"
                      placeholder="e.g., ABC Trading Co."
                      data-testid="input-company-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="buyer-phone" className="text-sm">Phone Number (Optional)</Label>
                    <Input
                      id="buyer-phone"
                      type="tel"
                      {...buyerForm.register("phoneNumber")}
                      className="mt-1 h-8"
                      placeholder="e.g., +231 77 123 4567"
                      data-testid="input-buyer-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="buyer-password" className="text-sm">Password *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="buyer-password"
                        type={showPassword ? "text" : "password"}
                        {...buyerForm.register("password")}
                        className="pr-10 h-8"
                        placeholder="Enter your password"
                        data-testid="input-buyer-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        data-testid="button-toggle-buyer-password"
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                    </div>
                    {buyerForm.formState.errors.password && (
                      <p className="text-xs text-red-600 mt-1">{buyerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group h-8 text-sm"
                  disabled={isLoading}
                  data-testid="button-buyer-login"
                >
                  {isLoading ? "Logging in..." : "Access Buyer Portal"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="bg-white shadow-lg border border-slate-200 rounded-lg p-6 text-center">
          <Shield className="w-8 h-8 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure Agricultural Access Portal</h3>
          <p className="text-slate-600 text-sm mb-4">
            Each portal provides specialized access controls and agricultural management tools. 
            All sessions are secured with JWT authentication and comprehensive audit logging.
          </p>
          <div className="flex justify-center space-x-6 text-xs text-slate-500">
            <span>✓ Farmer Authentication</span>
            <span>✓ GPS Location Verification</span>
            <span>✓ Real-time Data Sync</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>AgriTrace360™ Agricultural Management Portal System</p>
          <p className="text-xs mt-1">Authorized Personnel Only • All Access Attempts are Logged</p>
        </div>
      </div>
    </div>
  );
}