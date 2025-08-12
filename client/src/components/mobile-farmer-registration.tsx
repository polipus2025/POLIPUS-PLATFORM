import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Smartphone, User, Phone, Globe, WifiOff, CheckCircle, Map, Satellite, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import EnhancedSatelliteMapper from "@/components/maps/enhanced-satellite-mapper";

const LIBERIAN_COUNTIES = [
  "Bomi County", "Bong County", "Gbarpolu County", "Grand Bassa County",
  "Grand Cape Mount County", "Grand Gedeh County", "Grand Kru County",
  "Lofa County", "Margibi County", "Maryland County", "Montserrado County",
  "Nimba County", "River Cess County", "River Gee County", "Sinoe County"
];

const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(8, "Valid phone number required"),
  county: z.string().min(1, "County is required"),
  district: z.string().optional(),
  community: z.string().optional(),
  farmSize: z.string().optional(),
  cropTypes: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  gpsCoordinates: z.string().optional(),
  farmBoundary: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationForm = z.infer<typeof registrationSchema>;

interface MobileFarmerRegistrationProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function MobileFarmerRegistration({ onSuccess, onCancel }: MobileFarmerRegistrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showMapping, setShowMapping] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<string>("");
  const [farmBoundary, setFarmBoundary] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { toast } = useToast();

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      county: "",
      district: "",
      community: "",
      farmSize: "",
      cropTypes: "",
      password: "",
      confirmPassword: "",
      gpsCoordinates: "",
    },
  });

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "GPS Not Available",
        description: "Your device doesn't support GPS location.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = `${position.coords.latitude}, ${position.coords.longitude}`;
        setGpsCoordinates(coordinates);
        form.setValue("gpsCoordinates", coordinates);
        
        toast({
          title: "GPS Location Captured",
          description: "Your farm location has been recorded.",
        });
        setIsLoading(false);
      },
      (error) => {
        console.error("GPS Error:", error);
        toast({
          title: "GPS Error",
          description: "Unable to get your location. Please check GPS settings.",
          variant: "destructive",
        });
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const onSubmit = async (data: RegistrationForm) => {
    setIsLoading(true);

    try {
      if (isOffline) {
        // Store registration data for later sync
        const offlineRegistrations = JSON.parse(localStorage.getItem("offline-farmer-registrations") || "[]");
        const newRegistration = {
          ...data,
          gpsCoordinates: gpsCoordinates || data.gpsCoordinates,
          farmBoundary: farmBoundary || data.farmBoundary,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          status: "pending_sync"
        };
        
        offlineRegistrations.push(newRegistration);
        localStorage.setItem("offline-farmer-registrations", JSON.stringify(offlineRegistrations));
        
        toast({
          title: "Registration Saved Offline",
          description: "Your registration will be submitted when you're back online.",
        });

        if (onSuccess) onSuccess();
        return;
      }

      // Online registration
      const result = await apiRequest("/api/farmers", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          gpsCoordinates: gpsCoordinates || data.gpsCoordinates,
          farmBoundary: farmBoundary || data.farmBoundary,
          registrationDate: new Date().toISOString(),
          status: "active"
        })
      });

      if (result && result.success) {
        toast({
          title: "Registration Successful!",
          description: `Welcome ${data.firstName}! Your Farmer ID is: ${result.farmerId}`,
        });

        // Store credentials for offline login
        localStorage.setItem("farmer-credentials", JSON.stringify({
          farmerId: result.farmerId,
          password: data.password,
          firstName: data.firstName
        }));

        if (onSuccess) onSuccess();
      } else {
        throw new Error(result?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMapping = () => {
    setShowMapping(prev => !prev);
  };

  return (
    <div className="mobile-farmer-form bg-gray-50 py-4 px-4">
      <div className="max-w-md mx-auto pb-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            Farmer Registration
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Join the LACRA Agricultural Network
          </p>
        </div>

        {/* Offline Status */}
        {isOffline && (
          <Alert className="mb-4 border-yellow-300 bg-yellow-50">
            <WifiOff className="h-4 w-4" />
            <AlertDescription className="text-yellow-800">
              You're offline. Registration will be saved and submitted when you reconnect.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Farmer Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Personal Information */}
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...form.register("firstName")}
                      className="mt-1 min-h-[44px] text-base"
                      placeholder="Your first name"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-red-600 text-sm mt-1">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...form.register("lastName")}
                      className="mt-1 min-h-[44px] text-base"
                      placeholder="Your last name"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-red-600 text-sm mt-1">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      {...form.register("phoneNumber")}
                      className="mt-1 min-h-[44px] text-base"
                      placeholder="+231 XXX XXXX"
                    />
                    {form.formState.errors.phoneNumber && (
                      <p className="text-red-600 text-sm mt-1">{form.formState.errors.phoneNumber.message}</p>
                    )}
                  </div>

              {/* Location & Farm Details */}
                  <div>
                    <Label htmlFor="county">County *</Label>
                    <Select onValueChange={(value) => form.setValue("county", value)}>
                      <SelectTrigger className="mt-1 min-h-[44px]">
                        <SelectValue placeholder="Select your county" />
                      </SelectTrigger>
                      <SelectContent>
                        {LIBERIAN_COUNTIES.map((county) => (
                          <SelectItem key={county} value={county}>{county}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.county && (
                      <p className="text-red-600 text-sm mt-1">{form.formState.errors.county.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="community">Community/Village</Label>
                    <Input
                      id="community"
                      {...form.register("community")}
                      className="mt-1 min-h-[44px] text-base"
                      placeholder="Your community name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="farmSize">Farm Size (acres)</Label>
                    <Input
                      id="farmSize"
                      type="number"
                      {...form.register("farmSize")}
                      className="mt-1 min-h-[44px] text-base"
                      placeholder="Size of your farm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cropTypes">Main Crops</Label>
                    <Input
                      id="cropTypes"
                      {...form.register("cropTypes")}
                      className="mt-1 min-h-[44px] text-base"
                      placeholder="e.g., Rice, Cassava, Cocoa"
                    />
                  </div>

                  {/* GPS Location */}
                  <div>
                    <Label>Farm Location (GPS)</Label>
                    <div className="mt-2 space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={getCurrentLocation}
                        disabled={isLoading}
                        className="w-full min-h-[44px]"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {isLoading ? "Getting Location..." : "Capture GPS Location"}
                      </Button>
                      {gpsCoordinates && (
                        <p className="text-sm text-green-600">
                          📍 Location captured: {gpsCoordinates}
                        </p>
                      )}
                    </div>
                  </div>

              {/* Account Security */}
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      {...form.register("password")}
                      className="mt-1 min-h-[44px] text-base"
                      placeholder="Create a secure password"
                    />
                    {form.formState.errors.password && (
                      <p className="text-red-600 text-sm mt-1">{form.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...form.register("confirmPassword")}
                      className="mt-1 min-h-[44px] text-base"
                      placeholder="Confirm your password"
                    />
                    {form.formState.errors.confirmPassword && (
                      <p className="text-red-600 text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Alert className="border-blue-300 bg-blue-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-blue-800">
                      Your account will be created with offline login capability. 
                      You can access your dashboard even without internet connection.
                    </AlertDescription>
                  </Alert>

              {/* Farm Boundary Mapping */}
              <div className="space-y-4">
                <Button
                  type="button"
                  onClick={toggleMapping}
                  variant="outline"
                  className="w-full"
                >
                  <Satellite className="h-4 w-4 mr-2" />
                  {showMapping ? "Hide" : "Show"} Satellite Farm Mapping
                </Button>

                {showMapping && (
                  <div className="border rounded-lg p-4 space-y-4">
                    <Alert className="border-green-300 bg-green-50">
                      <Satellite className="h-4 w-4" />
                      <AlertDescription className="text-green-800">
                        <strong>Satellite Mapping System</strong><br />
                        Click on satellite imagery to create boundary points. Automatically generates EUDR Compliance and Deforestation reports.
                      </AlertDescription>
                    </Alert>

                    <div className="min-h-[400px] border rounded-lg overflow-hidden">
                      <EnhancedSatelliteMapper
                        onBoundaryComplete={(boundary) => {
                          setFarmBoundary(boundary);
                          form.setValue("farmBoundary", boundary);
                          toast({
                            title: "Farm Boundary Mapped",
                            description: `Successfully mapped ${boundary.points?.length || 0} GPS points covering ${boundary.area?.toFixed(2) || 0} hectares.`,
                          });
                        }}
                        minPoints={3}
                        enableRealTimeGPS={true}
                        farmerId={form.watch("phoneNumber") || ""}
                        farmerName={`${form.watch("firstName")} ${form.watch("lastName")}`}
                      />
                    </div>

                    {farmBoundary && (
                      <Alert className="border-green-300 bg-green-50">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-green-800">
                          <strong>Satellite Mapping Complete!</strong><br />
                          Area: {farmBoundary.area?.toFixed(2) || 0} hectares<br />
                          GPS Points: {farmBoundary.points?.length || 0}<br />
                          ✓ EUDR Compliance Report Generated<br />
                          ✓ Deforestation Analysis Report Generated
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 min-h-[44px] bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Creating Account..." : "Complete Registration"}
                </Button>
              </div>

              {/* Cancel Button */}
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  className="w-full min-h-[44px] mt-2"
                >
                  Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}