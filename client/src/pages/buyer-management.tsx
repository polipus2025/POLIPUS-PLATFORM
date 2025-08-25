import React, { useState, useEffect } from "react";
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  UserCheck, 
  UserX, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  Camera,
  CreditCard,
  User,
  ArrowLeft
} from "lucide-react";
import { z } from "zod";

// Buyer form schema
const buyerSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  contactPersonFirstName: z.string().min(2, "First name is required"),
  contactPersonLastName: z.string().min(2, "Last name is required"),
  contactPersonTitle: z.string().optional(),
  primaryEmail: z.string().email("Valid email is required"),
  secondaryEmail: z.string().email("Valid email format").optional().or(z.literal("")),
  primaryPhone: z.string().min(10, "Valid phone number is required"),
  secondaryPhone: z.string().optional(),
  businessAddress: z.string().min(5, "Business address is required"),
  city: z.string().min(2, "City is required"),
  county: z.string().min(1, "County is required"),
  postalCode: z.string().optional(),
  yearEstablished: z.number().min(1900).max(new Date().getFullYear()).optional(),
  numberOfEmployees: z.number().min(0).optional(),
  annualTurnover: z.string().optional(),
  interestedCommodities: z.string().optional(),
  tradingRegions: z.string().optional(),
  purchaseVolume: z.string().optional(),
  paymentTerms: z.string().optional(),
  creditLimit: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseType: z.string().optional(),
  notes: z.string().optional(),
  
  // Profile and Document Uploads - MANDATORY
  profilePhotoUrl: z.string().optional(),
  
  // Business Card Uploads - OPTIONAL
  businessCardFrontUrl: z.string().optional(),
  businessCardBackUrl: z.string().optional(),
});

type BuyerFormData = z.infer<typeof buyerSchema>;

const commodityOptions = [
  { value: "cocoa", label: "Cocoa" },
  { value: "coffee", label: "Coffee" },
  { value: "palm_oil", label: "Palm Oil" },
  { value: "rubber", label: "Rubber" },
  { value: "rice", label: "Rice" },
];

const liberianCounties = [
  "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount", 
  "Grand Gedeh", "Grand Kru", "Lofa", "Margibi", "Maryland", 
  "Montserrado", "Nimba", "River Cess", "River Gee", "Sinoe"
];

const businessTypes = [
  { value: "agency", label: "Agency" },
  { value: "entity", label: "Entity" },
];

export default function BuyerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Check authentication and permissions
  useEffect(() => {
    const ddgotsToken = localStorage.getItem('ddgotsToken');
    const inspectorToken = localStorage.getItem('authToken');
    
    // If inspector is logged in instead of DDGOTS, redirect to inspector dashboard
    if (inspectorToken && !ddgotsToken) {
      toast({
        title: "Access Denied",
        description: "Buyer Management is only accessible to DDGOTS personnel. Redirecting to Inspector Dashboard...",
        variant: "destructive"
      });
      setTimeout(() => {
        setLocation('/inspector-farmer-land-management');
      }, 2000);
      return;
    }
    
    // If no DDGOTS token, redirect to DDGOTS login
    if (!ddgotsToken) {
      toast({
        title: "Authentication Required",
        description: "Please log in with DDGOTS credentials to access Buyer Management.",
        variant: "destructive"
      });
      setTimeout(() => {
        setLocation('/auth/ddgots-login');
      }, 2000);
      return;
    }
  }, [toast, setLocation]);

  const form = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      contactPersonFirstName: "",
      contactPersonLastName: "",
      primaryEmail: "",
      primaryPhone: "",
      businessAddress: "",
      city: "",
      county: "",
      interestedCommodities: "",
      tradingRegions: "",
    },
  });

  // Fetch buyers
  const { data: buyers, isLoading } = useQuery({
    queryKey: ["/api/buyers"],
  });

  // Create buyer mutation
  const createBuyerMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/buyers", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Buyer registered successfully with auto-generated credentials",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/buyers"] });
      setShowAddForm(false);
      form.reset();
      setSelectedCommodities([]);
      setSelectedRegions([]);
    },
    onError: (error: any) => {
      console.error("Buyer registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || error.errors?.[0]?.message || "Failed to register buyer. Please check all required fields.",
        variant: "destructive",
      });
    },
  });

  // Approve buyer mutation
  const approveBuyerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/buyers/${id}/approve`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Buyer approved and portal access granted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/buyers"] });
    },
  });

  // Generate credentials mutation
  const generateCredentialsMutation = useMutation({
    mutationFn: (buyerId: number) => 
      apiRequest(`/api/buyers/${buyerId}/generate-credentials`, { method: "POST" }),
    onSuccess: (data) => {
      toast({
        title: "Credentials Generated",
        description: `Username: ${data.credentials.username}, Temporary Password: ${data.credentials.temporaryPassword}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/buyers"] });
    },
  });

  const onSubmit = (data: BuyerFormData) => {
    console.log("✅ Form validation passed - submitting data:", data);
    console.log("Form errors:", form.formState.errors);
    console.log("Selected commodities:", selectedCommodities);
    console.log("Selected regions:", selectedRegions);
    
    const formattedData = {
      ...data,
      country: "Liberia", // Required field that was missing
      interestedCommodities: JSON.stringify(selectedCommodities),
      tradingRegions: JSON.stringify(selectedRegions),
      annualTurnover: data.annualTurnover ? parseFloat(data.annualTurnover) : null,
      creditLimit: data.creditLimit ? parseFloat(data.creditLimit) : null,
    };

    console.log("Formatted data being sent:", formattedData);
    createBuyerMutation.mutate(formattedData);
  };
  
  // Add helper to show validation errors
  const checkFormValidation = () => {
    console.log("🔍 Form Validation Check:");
    console.log("Form valid:", form.formState.isValid);
    console.log("Form errors:", form.formState.errors);
    console.log("Form values:", form.getValues());
    
    if (!form.formState.isValid) {
      toast({
        title: "Form Validation Failed",
        description: "Please fill in all required fields (marked with *)",
        variant: "destructive",
      });
    }
  };

  const filteredBuyers = Array.isArray(buyers) ? buyers.filter((buyer: any) => {
    const matchesSearch = buyer.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.primaryEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && buyer.complianceStatus === filterStatus;
  }) : [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      suspended: { color: "bg-red-100 text-red-800", icon: XCircle },
      rejected: { color: "bg-gray-100 text-gray-800", icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleBackToDashboard = () => {
    setLocation('/ddgots-dashboard');
  };

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">
      {/* Navigation Header */}
      <div className="mb-6">
        <Button 
          onClick={handleBackToDashboard}
          variant="ghost" 
          className="mb-4 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to DDGOTS Dashboard
        </Button>
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buyer Management</h1>
          <p className="text-gray-600 mt-1">Onboard and manage agricultural commodity buyers</p>
        </div>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-buyer">
              <Plus className="w-4 h-4 mr-2" />
              Add New Buyer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Buyer</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="business">Business</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-business-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Type *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-business-type">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {businessTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contactPersonFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact First Name *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-contact-first-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactPersonLastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Last Name *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-contact-last-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="contactPersonTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., CEO, Manager, Director" data-testid="input-contact-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="primaryEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Email *</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} data-testid="input-primary-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="secondaryEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} data-testid="input-secondary-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="primaryPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Phone *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-primary-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="secondaryPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Phone</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-secondary-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="businessAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Address *</FormLabel>
                          <FormControl>
                            <Textarea {...field} data-testid="textarea-business-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="county"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>County *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-county">
                                  <SelectValue placeholder="Select county" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {liberianCounties.map((county) => (
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
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-postal-code" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="business" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="yearEstablished"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year Established</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                data-testid="input-year-established"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="numberOfEmployees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Employees</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                data-testid="input-employees"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="annualTurnover"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Turnover (USD)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="0.00" data-testid="input-annual-turnover" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <Label>Interested Commodities *</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {commodityOptions.map((commodity) => (
                          <Button
                            key={commodity.value}
                            type="button"
                            variant={selectedCommodities.includes(commodity.value) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              if (selectedCommodities.includes(commodity.value)) {
                                setSelectedCommodities(selectedCommodities.filter(c => c !== commodity.value));
                              } else {
                                setSelectedCommodities([...selectedCommodities, commodity.value]);
                              }
                            }}
                            data-testid={`button-commodity-${commodity.value}`}
                          >
                            {commodity.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Trading Regions *</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {liberianCounties.map((county) => (
                          <Button
                            key={county}
                            type="button"
                            variant={selectedRegions.includes(county) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              if (selectedRegions.includes(county)) {
                                setSelectedRegions(selectedRegions.filter(r => r !== county));
                              } else {
                                setSelectedRegions([...selectedRegions, county]);
                              }
                            }}
                            data-testid={`button-region-${county.toLowerCase().replace(' ', '-')}`}
                          >
                            {county}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="purchaseVolume"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Purchase Volume</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 100 tons/month" data-testid="input-purchase-volume" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="creditLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credit Limit (USD)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="0.00" data-testid="input-credit-limit" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="compliance" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="licenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Number</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-license-number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="licenseType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-license-type">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="trading_license">Trading License</SelectItem>
                                <SelectItem value="export_license">Export License</SelectItem>
                                <SelectItem value="processing_license">Processing License</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea {...field} data-testid="textarea-notes" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Camera className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium text-blue-900 dark:text-blue-100">Document Requirements</h3>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Profile photo is mandatory for all buyers. Business cards are optional but recommended.
                      </p>
                    </div>

                    {/* Profile Photo - MANDATORY */}
                    <FormField
                      control={form.control}
                      name="profilePhotoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Profile Photo *
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          </FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-600 mb-2">
                                Upload profile photo (JPG, PNG, max 5MB)
                              </p>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    // For now, we'll use a placeholder URL
                                    // In production, this would upload to object storage
                                    field.onChange(`/uploads/profiles/${file.name}`);
                                  }
                                }}
                                data-testid="input-profile-photo"
                              />
                              {field.value && (
                                <p className="text-xs text-green-600 mt-2">✓ Photo uploaded</p>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Business Card Front - OPTIONAL */}
                    <FormField
                      control={form.control}
                      name="businessCardFrontUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Business Card (Front)
                            <Badge variant="secondary" className="text-xs">Optional</Badge>
                          </FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-600 mb-2">
                                Upload business card front (JPG, PNG, max 5MB)
                              </p>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    field.onChange(`/uploads/business-cards/${file.name}`);
                                  }
                                }}
                                data-testid="input-business-card-front"
                              />
                              {field.value && (
                                <p className="text-xs text-green-600 mt-2">✓ Front uploaded</p>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Business Card Back - OPTIONAL */}
                    <FormField
                      control={form.control}
                      name="businessCardBackUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Business Card (Back)
                            <Badge variant="secondary" className="text-xs">Optional</Badge>
                          </FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-600 mb-2">
                                Upload business card back (JPG, PNG, max 5MB)
                              </p>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    field.onChange(`/uploads/business-cards/${file.name}`);
                                  }
                                }}
                                data-testid="input-business-card-back"
                              />
                              {field.value && (
                                <p className="text-xs text-green-600 mt-2">✓ Back uploaded</p>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createBuyerMutation.isPending}
                    data-testid="button-register-buyer"
                    onClick={() => {
                      checkFormValidation();
                    }}
                  >
                    {createBuyerMutation.isPending ? "Registering..." : "Register Buyer"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Buyers</p>
                <p className="text-2xl font-bold text-gray-900">{Array.isArray(buyers) ? buyers.length : 0}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {Array.isArray(buyers) ? buyers.filter((b: any) => b.complianceStatus === 'pending').length : 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {Array.isArray(buyers) ? buyers.filter((b: any) => b.complianceStatus === 'approved').length : 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Portal Users</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Array.isArray(buyers) ? buyers.filter((b: any) => b.portalAccess).length : 0}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search buyers by business name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-buyers"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48" data-testid="select-filter-status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Buyers List */}
      <div className="grid gap-4">
        {filteredBuyers.map((buyer: any) => (
          <Card key={buyer.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        {buyer.businessName}
                        <span className="ml-3 text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {buyer.buyerId}
                        </span>
                      </h3>
                      <p className="text-gray-600 capitalize">{buyer.businessType}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(buyer.complianceStatus)}
                      {buyer.portalAccess && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Portal Access
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {buyer.primaryEmail}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {buyer.primaryPhone}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {buyer.city}, {buyer.county}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Contact: {buyer.contactPersonFirstName} {buyer.contactPersonLastName}</span>
                    {buyer.contactPersonTitle && (
                      <span>• {buyer.contactPersonTitle}</span>
                    )}
                    <span>• Registered: {new Date(buyer.createdAt).toLocaleDateString()}</span>
                  </div>

                  {buyer.interestedCommodities && (
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        try {
                          const commodities = JSON.parse(buyer.interestedCommodities || '[]');
                          return Array.isArray(commodities) ? commodities : [];
                        } catch (error) {
                          // If JSON parsing fails, treat as comma-separated string
                          return buyer.interestedCommodities.split(',').map(c => c.trim()).filter(c => c);
                        }
                      })().map((commodity: string) => (
                        <Badge key={commodity} variant="secondary" className="text-xs">
                          {commodity}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm" data-testid={`button-view-${buyer.id}`}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  {buyer.complianceStatus === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => approveBuyerMutation.mutate({ 
                        id: buyer.id, 
                        data: { complianceStatus: 'approved', portalAccess: true } 
                      })}
                      disabled={approveBuyerMutation.isPending}
                      data-testid={`button-approve-${buyer.id}`}
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  )}

                  {buyer.complianceStatus === 'approved' && !buyer.loginCredentialsGenerated && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => generateCredentialsMutation.mutate(buyer.id)}
                      disabled={generateCredentialsMutation.isPending}
                      data-testid={`button-credentials-${buyer.id}`}
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Generate Credentials
                    </Button>
                  )}

                  {buyer.complianceStatus === 'approved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => approveBuyerMutation.mutate({ 
                        id: buyer.id, 
                        data: { complianceStatus: 'suspended', portalAccess: false } 
                      })}
                      data-testid={`button-suspend-${buyer.id}`}
                    >
                      <UserX className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredBuyers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No buyers found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by adding your first buyer"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}