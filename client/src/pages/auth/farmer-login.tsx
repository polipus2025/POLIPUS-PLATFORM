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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, MapPin, AlertCircle, Eye, EyeOff, UserPlus, ShoppingCart, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
  const [activeTab, setActiveTab] = useState("farmer");
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
        
        window.location.href = "/buyer-dashboard";
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
        <title>Farmer & Buyer Portal Login - AgriTrace360™ LACRA</title>
        <meta name="description" content="Secure login portal for farmers and buyers in Liberia" />
      </Helmet>

      <div className="w-full max-w-lg">
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
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Farmer & Buyer Portal
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Liberia Agriculture Commodity Regulatory Authority
            </p>
            <p className="text-sm text-gray-500">
              AgriTrace360™ Agricultural Management System
            </p>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="farmer" className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Farmer Login
                </TabsTrigger>
                <TabsTrigger value="buyer" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Buyer Login
                </TabsTrigger>
              </TabsList>

              {/* Farmer Login Tab */}
              <TabsContent value="farmer" className="space-y-4">
                <form onSubmit={farmerForm.handleSubmit(onFarmerSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="farmerId">Farmer ID *</Label>
                    <Input
                      id="farmerId"
                      type="text"
                      {...farmerForm.register("farmerId")}
                      className="mt-1"
                      placeholder="e.g., FRM-2024-001"
                      data-testid="input-farmer-id"
                    />
                    {farmerForm.formState.errors.farmerId && (
                      <p className="text-sm text-red-600 mt-1">{farmerForm.formState.errors.farmerId.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="farmer-county">County (Optional)</Label>
                    <Select 
                      value={farmerForm.watch("county")} 
                      onValueChange={(value) => farmerForm.setValue("county", value)}
                    >
                      <SelectTrigger className="mt-1" data-testid="select-farmer-county">
                        <SelectValue placeholder="Select your county" />
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

                  <div>
                    <Label htmlFor="farmer-phone">Phone Number (Optional)</Label>
                    <Input
                      id="farmer-phone"
                      type="tel"
                      {...farmerForm.register("phoneNumber")}
                      className="mt-1"
                      placeholder="e.g., +231 77 123 4567"
                      data-testid="input-farmer-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="farmer-password">Password *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="farmer-password"
                        type={showPassword ? "text" : "password"}
                        {...farmerForm.register("password")}
                        className="pr-10"
                        placeholder="Enter your password"
                        data-testid="input-farmer-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {farmerForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">{farmerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                    data-testid="button-farmer-login"
                  >
                    {isLoading ? "Logging in..." : "Login as Farmer"}
                  </Button>
                </form>
              </TabsContent>

              {/* Buyer Login Tab */}
              <TabsContent value="buyer" className="space-y-4">
                <form onSubmit={buyerForm.handleSubmit(onBuyerSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="buyerId">Buyer ID *</Label>
                    <Input
                      id="buyerId"
                      type="text"
                      {...buyerForm.register("buyerId")}
                      className="mt-1"
                      placeholder="e.g., BUY-2024-001"
                      data-testid="input-buyer-id"
                    />
                    {buyerForm.formState.errors.buyerId && (
                      <p className="text-sm text-red-600 mt-1">{buyerForm.formState.errors.buyerId.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="companyName">Company Name (Optional)</Label>
                    <Input
                      id="companyName"
                      type="text"
                      {...buyerForm.register("companyName")}
                      className="mt-1"
                      placeholder="e.g., ABC Trading Co."
                      data-testid="input-company-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="buyer-phone">Phone Number (Optional)</Label>
                    <Input
                      id="buyer-phone"
                      type="tel"
                      {...buyerForm.register("phoneNumber")}
                      className="mt-1"
                      placeholder="e.g., +231 77 123 4567"
                      data-testid="input-buyer-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="buyer-password">Password *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="buyer-password"
                        type={showPassword ? "text" : "password"}
                        {...buyerForm.register("password")}
                        className="pr-10"
                        placeholder="Enter your password"
                        data-testid="input-buyer-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        data-testid="button-toggle-buyer-password"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {buyerForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">{buyerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                    data-testid="button-buyer-login"
                  >
                    {isLoading ? "Logging in..." : "Login as Buyer"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Need help with registration?
                </p>
                <p className="text-sm text-gray-500">
                  Contact your local agricultural extension officer or visit the nearest LACRA office for farmer registration assistance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}