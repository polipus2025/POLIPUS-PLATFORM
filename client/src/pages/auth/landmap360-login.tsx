import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EyeIcon, EyeOffIcon, Map, MapPin, Satellite } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

const LIBERIAN_COUNTIES = [
  "Bomi County", "Bong County", "Gbarpolu County", "Grand Bassa County",
  "Grand Cape Mount County", "Grand Gedeh County", "Grand Kru County",
  "Lofa County", "Margibi County", "Maryland County", "Montserrado County",
  "Nimba County", "River Cess County", "River Gee County", "Sinoe County"
];

const USER_ROLES = [
  { value: "surveyor", label: "Land Surveyor" },
  { value: "administrator", label: "Land Administrator" },
  { value: "registrar", label: "Land Registrar" },
  { value: "inspector", label: "Land Inspector" },
  { value: "analyst", label: "GIS Analyst" },
  { value: "manager", label: "Land Manager" }
];

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Please select your role"),
  county: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LandMap360Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "",
      county: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);

    try {
      const result = await apiRequest("/api/auth/landmap360-login", {
        method: "POST",
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          role: data.role,
          county: data.county,
          userType: "landmap360"
        })
      });

      if (result && result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to LandMap360 Land Management System",
        });
        
        // Store session data
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userType", "landmap360");
        localStorage.setItem("userName", data.username);
        localStorage.setItem("county", data.county || "");
        
        // Redirect based on role
        if (data.role === "surveyor") {
          window.location.href = "/landmap360/surveyor-dashboard";
        } else if (data.role === "administrator") {
          window.location.href = "/landmap360/administrator-dashboard";
        } else if (data.role === "registrar") {
          window.location.href = "/landmap360/registrar-dashboard";
        } else {
          window.location.href = "/landmap360/main-dashboard";
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please check your credentials.";
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-3 sm:p-4">
      <Helmet>
        <title>LandMap360 Login - Land Management System</title>
        <meta name="description" content="Secure login portal for LandMap360 Land Management professionals in Liberia" />
      </Helmet>

      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src={lacraLogo}
                  alt="LACRA Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-16 h-16 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
                <Map className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
              LandMap360
            </CardTitle>
            <p className="text-slate-600 text-sm">
              Land Management & GIS Platform
            </p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your username"
                          className="h-11"
                          data-testid="input-username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="h-11 pr-10"
                            data-testid="input-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            data-testid="button-toggle-password"
                          >
                            {showPassword ? (
                              <EyeOffIcon className="h-4 w-4 text-slate-500" />
                            ) : (
                              <EyeIcon className="h-4 w-4 text-slate-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11" data-testid="select-role">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {USER_ROLES.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">County (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11" data-testid="select-county">
                            <SelectValue placeholder="Select your county" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LIBERIAN_COUNTIES.map((county) => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  disabled={isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Sign In to LandMap360
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 pt-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500 mb-2">
                Professional Land Management System
              </p>
              <div className="flex justify-center items-center gap-2 text-xs text-slate-400">
                <Satellite className="h-3 w-3" />
                <span>Powered by Advanced GIS Technology</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}