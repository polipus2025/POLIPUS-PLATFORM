import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { insertInspectorSchema } from '@shared/schema';
import { Users, MapPin, Shield, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

const formSchema = insertInspectorSchema.extend({
  confirmPhoneNumber: z.string().min(8, "Phone number confirmation is required"),
}).refine((data) => data.phoneNumber === data.confirmPhoneNumber, {
  message: "Phone numbers don't match",
  path: ["confirmPhoneNumber"],
});

type FormData = z.infer<typeof formSchema>;

const liberianCounties = [
  "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount",
  "Grand Gedeh", "Grand Kru", "Lofa", "Margibi", "Maryland",
  "Montserrado", "Nimba", "River Cess", "River Gee", "Sinoe"
];

const certificationLevels = [
  { value: "junior", label: "Junior Inspector", description: "Entry-level inspector for basic inspections" },
  { value: "senior", label: "Senior Inspector", description: "Experienced inspector for complex inspections" },
  { value: "lead", label: "Lead Inspector", description: "Team leader with supervisory responsibilities" },
  { value: "expert", label: "Expert Inspector", description: "Specialist for high-risk and specialized inspections" }
];

const specializations = [
  "cocoa", "coffee", "palm_oil", "rubber", "rice", "cassava", "plantain", 
  "vegetables", "livestock", "fisheries", "forest_products", "minerals"
];

export default function InspectorOnboarding() {
  const [step, setStep] = useState(1);

  const [createdInspector, setCreatedInspector] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      confirmPhoneNumber: "",
      nationalId: "",
      address: "",
      inspectorType: "land",
      inspectionAreaCounty: "",
      inspectionAreaDistrict: "",
      inspectionAreaDescription: "",
      specializations: "",
      certificationLevel: "junior"
    }
  });

  const createInspectorMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const inspectorData = {
        ...data,
        specializations: data.specializations
      };
      delete (inspectorData as any).confirmPhoneNumber;
      
      const response = await apiRequest('/api/inspectors', {
        method: 'POST',
        body: JSON.stringify(inspectorData)
      });
      return response;
    },
    onSuccess: (data) => {
      setCreatedInspector(data);
      setStep(4);
      queryClient.invalidateQueries({ queryKey: ['/api/inspectors'] });
      toast({
        title: "Inspector Created Successfully",
        description: `${data.inspector.fullName} has been onboarded as an inspector.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Inspector",
        description: error.message || "Failed to create inspector profile",
        variant: "destructive",
      });
    }
  });

  // const handleGetUploadParameters = async () => {
  //   const response = await apiRequest('/api/inspectors/upload-picture', {
  //     method: 'POST',
  //     body: JSON.stringify({})
  //   });
  //   const data = response;
  //   return {
  //     method: 'PUT' as const,
  //     url: data.uploadURL,
  //   };
  // };

  // const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
  //   if (result.successful && result.successful.length > 0) {
  //     const uploadedFile = result.successful[0];
  //     setProfilePictureUrl(uploadedFile.uploadURL as string);
  //     toast({
  //       title: "Profile Picture Uploaded",
  //       description: "Profile picture uploaded successfully!",
  //     });
  //   }
  // };

  const onSubmit = (data: FormData) => {
    createInspectorMutation.mutate(data);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const resetForm = () => {
    form.reset();
    setStep(1);
    setCreatedInspector(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Inspector Onboarding System
        </h1>
        <p className="text-slate-600">
          Complete registration for new field inspectors in the LACRA AgriTrace360™ system
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNum 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-200 text-slate-600'
            }`}>
              {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
            </div>
            {stepNum < 4 && (
              <div className={`w-16 h-1 mx-2 ${
                step > stepNum ? 'bg-green-500' : 'bg-slate-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Enter the inspector's basic personal details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+231 XX XXX XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="nationalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>National ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter national ID number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter full address" className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Inspector Type Selection - Critical Field */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 mb-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-blue-900">Inspector Type Selection</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="inspectorType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-900 font-semibold text-base">
                          Choose Inspector Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} required>
                            <SelectTrigger 
                              className="bg-white border-2 border-blue-300 h-12 text-base font-medium"
                              data-testid="inspector-type-select"
                            >
                              <SelectValue placeholder="🔍 Select inspector type..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="land" className="p-3 text-base">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">🌾</span>
                                  <div>
                                    <div className="font-semibold">Land Inspector</div>
                                    <div className="text-sm text-gray-600">Agricultural Land & Crop Inspections</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="port" className="p-3 text-base">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">🚢</span>
                                  <div>
                                    <div className="font-semibold">Port Inspector</div>
                                    <div className="text-sm text-gray-600">Maritime Port & Export Inspections</div>
                                  </div>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                        <div className="bg-white rounded-lg p-3 mt-2 border border-blue-200">
                          <p className="text-sm text-blue-800 font-medium">
                            💡 This determines your specialized training, access permissions, and inspection responsibilities.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep}>
                    Continue to Location Assignment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Location & Area Assignment */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Location & Area Assignment
                </CardTitle>
                <CardDescription>
                  Assign the inspector to their primary inspection area and county.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="inspectionAreaCounty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary County Assignment</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select county" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {liberianCounties.map((county) => (
                            <SelectItem key={county} value={county}>
                              {county} County
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
                  name="inspectionAreaDistrict"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter specific district" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inspectionAreaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the specific inspection area, boundaries, or coverage zone" className="min-h-[100px]" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Continue to Qualifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Qualifications & Profile Picture */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  Qualifications & Profile
                </CardTitle>
                <CardDescription>
                  Set the inspector's certification level, specializations, and upload profile picture.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="certificationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certification Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select certification level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {certificationLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <div>
                                <div className="font-medium">{level.label}</div>
                                <div className="text-sm text-slate-500">{level.description}</div>
                              </div>
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
                  name="specializations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specializations</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter specializations (comma separated: e.g., cocoa,coffee,palm_oil)" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {specializations.map((spec) => (
                          <Badge key={spec} variant="outline" className="text-xs">
                            {spec.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                {/* Profile picture upload removed to fix React mounting issues */}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createInspectorMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {createInspectorMutation.isPending ? "Creating Inspector..." : "Create Inspector"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Success & Credentials */}
          {step === 4 && createdInspector && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  Inspector Successfully Created
                </CardTitle>
                <CardDescription className="text-green-700">
                  {createdInspector.inspector.fullName} has been successfully onboarded to the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium mb-3">Inspector Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-slate-600">Inspector ID:</label>
                      <div className="font-mono">{createdInspector.inspector.inspectorId}</div>
                    </div>
                    <div>
                      <label className="text-slate-600">Full Name:</label>
                      <div>{createdInspector.inspector.fullName}</div>
                    </div>
                    <div>
                      <label className="text-slate-600">County Assignment:</label>
                      <div>{createdInspector.inspector.inspectionAreaCounty}</div>
                    </div>
                    <div>
                      <label className="text-slate-600">Certification Level:</label>
                      <div className="capitalize">{createdInspector.inspector.certificationLevel}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-medium mb-3 text-orange-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Login Credentials (Temporary)
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-orange-700">Username:</label>
                      <div className="font-mono bg-white px-2 py-1 rounded border">
                        {createdInspector.credentials.username}
                      </div>
                    </div>
                    <div>
                      <label className="text-orange-700">Temporary Password:</label>
                      <div className="font-mono bg-white px-2 py-1 rounded border">
                        {createdInspector.credentials.temporaryPassword}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-orange-700 mt-2">
                    ⚠️ The inspector must change their password on first login.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Create Another Inspector
                  </Button>
                  <Button type="button" onClick={() => window.location.href = '/regulatory/inspector-management'}>
                    Go to Inspector Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
}