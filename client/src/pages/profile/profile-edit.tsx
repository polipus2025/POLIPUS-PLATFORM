import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { ArrowLeft, Save, User } from 'lucide-react';

// Define validation schemas for each user type
const farmerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  county: z.string().min(2, 'County is required'),
  farmSize: z.string().optional(),
  primaryCrops: z.string().optional(),
});

const buyerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  businessType: z.string().optional(),
  licenseNumber: z.string().optional(),
});

const exporterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  exportLicenseNumber: z.string().optional(),
});

const inspectorSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  county: z.string().min(2, 'County is required'),
  inspectorType: z.string().optional(),
  badgeNumber: z.string().optional(),
});

const regulatorySchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  department: z.string().min(2, 'Department is required'),
});

interface ProfileEditProps {
  userType: 'farmer' | 'buyer' | 'exporter' | 'inspector' | 'regulatory';
  userId: string;
}

export default function ProfileEdit({ userType, userId }: ProfileEditProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get appropriate schema based on user type
  const getSchema = () => {
    switch (userType) {
      case 'farmer': return farmerSchema;
      case 'buyer': return buyerSchema;
      case 'exporter': return exporterSchema;
      case 'inspector': return inspectorSchema;
      case 'regulatory': return regulatorySchema;
      default: return farmerSchema;
    }
  };

  const schema = getSchema();
  type FormData = z.infer<typeof schema>;

  // Fetch current profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: [`/api/${userType}/profile`, userId],
    enabled: !!userId
  });

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {}
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      form.reset(profile);
    }
  }, [profile, form]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest('PUT', `/api/${userType}/profile`, data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/${userType}/profile`, userId] });
      navigate(`/profile?type=${userType}&id=${userId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(`/profile?type=${userType}&id=${userId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="border-b bg-slate-50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="p-2"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Edit Profile
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Update your {userType} profile information
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Common fields for all user types */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {userType === 'farmer' ? 'Name' : 'Full Name'}
                </Label>
                <Input
                  id="name"
                  {...form.register(userType === 'farmer' ? 'name' : 'fullName')}
                  data-testid="input-name"
                />
                {form.formState.errors[userType === 'farmer' ? 'name' : 'fullName'] && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors[userType === 'farmer' ? 'name' : 'fullName']?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  data-testid="input-email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...form.register('phone')}
                  data-testid="input-phone"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              {(userType === 'buyer' || userType === 'exporter') && (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    {...form.register('companyName')}
                    data-testid="input-company-name"
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.companyName.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                rows={3}
                {...form.register('address')}
                data-testid="input-address"
              />
              {form.formState.errors.address && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            {/* User type specific fields */}
            {userType === 'farmer' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="county">County</Label>
                  <Input
                    id="county"
                    {...form.register('county')}
                    data-testid="input-county"
                  />
                  {form.formState.errors.county && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.county.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                  <Input
                    id="farmSize"
                    {...form.register('farmSize')}
                    data-testid="input-farm-size"
                  />
                </div>
              </div>
            )}

            {userType === 'farmer' && (
              <div className="space-y-2">
                <Label htmlFor="primaryCrops">Primary Crops</Label>
                <Input
                  id="primaryCrops"
                  placeholder="e.g., Coffee, Cocoa, Rice"
                  {...form.register('primaryCrops')}
                  data-testid="input-primary-crops"
                />
              </div>
            )}

            {userType === 'buyer' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    {...form.register('businessType')}
                    data-testid="input-business-type"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    {...form.register('licenseNumber')}
                    data-testid="input-license-number"
                  />
                </div>
              </div>
            )}

            {userType === 'exporter' && (
              <div className="space-y-2">
                <Label htmlFor="exportLicenseNumber">Export License Number</Label>
                <Input
                  id="exportLicenseNumber"
                  {...form.register('exportLicenseNumber')}
                  data-testid="input-export-license"
                />
              </div>
            )}

            {userType === 'inspector' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="county">County</Label>
                  <Input
                    id="county"
                    {...form.register('county')}
                    data-testid="input-county"
                  />
                  {form.formState.errors.county && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.county.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspectorType">Inspector Type</Label>
                  <Input
                    id="inspectorType"
                    {...form.register('inspectorType')}
                    data-testid="input-inspector-type"
                  />
                </div>
              </div>
            )}

            {userType === 'inspector' && (
              <div className="space-y-2">
                <Label htmlFor="badgeNumber">Badge Number</Label>
                <Input
                  id="badgeNumber"
                  {...form.register('badgeNumber')}
                  data-testid="input-badge-number"
                />
              </div>
            )}

            {userType === 'regulatory' && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  {...form.register('department')}
                  data-testid="input-department"
                />
                {form.formState.errors.department && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.department.message}
                  </p>
                )}
              </div>
            )}

            {/* Form actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex-1"
                data-testid="button-save"
              >
                {updateProfileMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}