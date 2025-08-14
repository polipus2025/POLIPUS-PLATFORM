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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, MapPin, AlertCircle, Eye, EyeOff, Clipboard, Satellite } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

export default function TestFieldAgentLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [gpsStatus, setGpsStatus] = useState<string>("Ready to test");
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

    // Test credentials
    if (data.agentId === "agent001" && data.password === "password123") {
      toast({
        title: "Login Successful",
        description: "Welcome to your Field Agent Portal",
      });
      window.location.href = "/field-agent-dashboard";
      return;
    }
    
    setError("Invalid credentials. Use agent001/password123 for testing.");
    toast({
      title: "Login Failed", 
      description: "Invalid credentials. Use agent001/password123 for testing.",
      variant: "destructive",
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600">
      <Helmet>
        <title>🚨 TEST VERSION - Field Agent Portal</title>
      </Helmet>

      {/* MASSIVE UPDATE INDICATOR */}
      <div className="bg-red-600 text-white p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">🚨 NEW VERSION ACTIVE 🚨</h1>
        <h2 className="text-2xl">GPS BUTTON IS COMPACT NOW - NOT BIG SECTION!</h2>
        <p className="text-lg mt-2">Timestamp: {Date.now()}</p>
      </div>

      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center px-4 pb-4">
          <div className="w-full max-w-sm">
            <Card className="shadow-xl border-4 border-yellow-400 bg-white">
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
                <CardTitle className="text-lg sm:text-xl font-bold text-green-900 leading-tight">
                  🚨 TEST VERSION - COMPACT GPS BUTTON BELOW 🚨
                </CardTitle>
                
                {/* COMPACT GPS TEST BUTTON - THIS IS THE SOLUTION! */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 text-sm px-4 py-2 border-blue-400 text-blue-700 hover:bg-blue-50 font-semibold"
                    >
                      <Satellite className="h-4 w-4 mr-2" />
                      🧪 Test GPS (Popup)
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="text-lg text-center">📍 Mobile GPS Testing Center</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                        <p><strong>GPS Status:</strong> {gpsStatus}</p>
                      </div>
                      
                      <Button
                        onClick={() => {
                          setGpsStatus("Testing location access...");
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              const coords = `Lat: ${pos.coords.latitude.toFixed(6)}, Lng: ${pos.coords.longitude.toFixed(6)}`;
                              setGpsStatus(`✅ GPS Working! ${coords}`);
                              toast({
                                title: "🎯 GPS Location Found",
                                description: coords,
                              });
                            },
                            (err) => {
                              setGpsStatus(`❌ GPS Error: ${err.message}`);
                              toast({
                                title: "GPS Error",
                                description: err.message,
                                variant: "destructive",
                              });
                            }
                          );
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                      >
                        <Satellite className="h-4 w-4 mr-2" />
                        🚀 Start GPS Test
                      </Button>
                      
                      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                        <p><strong>📋 Instructions:</strong></p>
                        <ol className="list-decimal list-inside space-y-1 mt-2">
                          <li>Click "Start GPS Test"</li>
                          <li>Allow location access</li>
                          <li>Check coordinates</li>
                          <li>Verify accuracy</li>
                        </ol>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <p className="text-gray-600 text-sm mt-3">
                  ✅ See? GPS is now a small button with popup!
                </p>
              </CardHeader>

              <CardContent className="space-y-4 px-4 pb-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="agentId" className="text-sm font-medium text-gray-700">
                      Agent ID
                    </Label>
                    <Input
                      id="agentId"
                      placeholder="Enter your agent ID"
                      {...form.register("agentId")}
                      className="h-12 text-base"
                      data-testid="input-agent-id"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...form.register("password")}
                        className="h-12 text-base pr-10"
                        data-testid="input-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-yellow-600 text-white font-semibold text-base hover:from-orange-600 hover:to-yellow-700"
                    disabled={isLoading}
                    data-testid="button-login"
                  >
                    {isLoading ? "Logging in..." : "Login to Field Agent Portal"}
                  </Button>
                </form>

                <div className="text-center text-xs text-gray-500 pt-2">
                  <p>Test Credentials: agent001 / password123</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}