import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Edit3, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  Shield,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';
import { useLocation } from 'wouter';

interface ProfileViewProps {
  userType: 'farmer' | 'buyer' | 'exporter' | 'inspector' | 'regulatory';
  userId: string;
}

export default function ProfileView({ userType, userId }: ProfileViewProps) {
  const [, navigate] = useLocation();

  // Fetch profile data based on user type
  const { data: profile, isLoading, error } = useQuery({
    queryKey: [`/api/${userType}/profile`, userId],
    enabled: !!userId
  });

  const handleEditProfile = () => {
    navigate(`/profile/edit?type=${userType}&id=${userId}`);
  };

  const handleSettings = () => {
    navigate(`/profile/settings?type=${userType}&id=${userId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to load profile information</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Profile Not Found</h3>
          <p className="text-gray-500 mb-4">No profile information available for this user.</p>
          <Button onClick={() => navigate(`/profile/create?type=${userType}&id=${userId}`)}>
            Create Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'active': { color: 'bg-green-100 text-green-800', label: 'Active' },
      'inactive': { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'suspended': { color: 'bg-red-100 text-red-800', label: 'Suspended' },
      'verified': { color: 'bg-blue-100 text-blue-800', label: 'Verified' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    
    return (
      <Badge className={`${statusInfo.color} border-0`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getUserTypeDisplay = (type: string) => {
    const typeMap = {
      'farmer': { icon: User, label: 'Farmer', color: 'text-green-600' },
      'buyer': { icon: Briefcase, label: 'Buyer', color: 'text-blue-600' },
      'exporter': { icon: Building, label: 'Exporter', color: 'text-purple-600' },
      'inspector': { icon: Shield, label: 'Inspector', color: 'text-orange-600' },
      'regulatory': { icon: CheckCircle, label: 'Regulatory', color: 'text-red-600' }
    };
    return typeMap[type as keyof typeof typeMap] || typeMap.farmer;
  };

  const userTypeInfo = getUserTypeDisplay(userType);
  const UserTypeIcon = userTypeInfo.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src={profile.profileImageUrl || ''} alt={profile.name || profile.fullName} />
                <AvatarFallback className="bg-slate-100 text-slate-700 text-xl font-semibold">
                  {(profile.name || profile.fullName || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-800">
                    {profile.name || profile.fullName || profile.companyName}
                  </h1>
                  {profile.status && getStatusBadge(profile.status)}
                </div>
                
                <div className="flex items-center gap-2 text-slate-600">
                  <UserTypeIcon className={`w-4 h-4 ${userTypeInfo.color}`} />
                  <span className="font-medium">{userTypeInfo.label}</span>
                  {profile[`${userType}Id`] && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                        {profile[`${userType}Id`]}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSettings}
                className="flex items-center gap-2"
                data-testid="button-settings"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button
                size="sm"
                onClick={handleEditProfile}
                className="flex items-center gap-2"
                data-testid="button-edit-profile"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-700">Email</p>
                  <p className="text-slate-600" data-testid="text-email">{profile.email}</p>
                </div>
              </div>
            )}
            
            {profile.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-700">Phone</p>
                  <p className="text-slate-600" data-testid="text-phone">{profile.phone}</p>
                </div>
              </div>
            )}
            
            {(profile.address || profile.location) && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-700">Address</p>
                  <p className="text-slate-600" data-testid="text-address">
                    {profile.address || profile.location}
                  </p>
                  {(profile.county || profile.city) && (
                    <p className="text-sm text-slate-500">
                      {profile.city && `${profile.city}, `}{profile.county}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.onboardingDate && (
              <div>
                <p className="font-medium text-slate-700">Registered</p>
                <p className="text-sm text-slate-600" data-testid="text-registration-date">
                  {new Date(profile.onboardingDate).toLocaleDateString()}
                </p>
              </div>
            )}
            
            {profile.createdAt && (
              <div>
                <p className="font-medium text-slate-700">Created</p>
                <p className="text-sm text-slate-600" data-testid="text-created-date">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
            
            {profile.lastLogin && (
              <div>
                <p className="font-medium text-slate-700">Last Login</p>
                <p className="text-sm text-slate-600" data-testid="text-last-login">
                  {new Date(profile.lastLogin).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Type-specific information */}
      {userType === 'farmer' && profile.farmSize && (
        <Card>
          <CardHeader>
            <CardTitle>Farm Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-slate-700">Farm Size</p>
                <p className="text-slate-600" data-testid="text-farm-size">{profile.farmSize} hectares</p>
              </div>
              {profile.primaryCrops && (
                <div>
                  <p className="font-medium text-slate-700">Primary Crops</p>
                  <p className="text-slate-600" data-testid="text-primary-crops">{profile.primaryCrops}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {userType === 'buyer' && profile.businessType && (
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-slate-700">Business Type</p>
                <p className="text-slate-600" data-testid="text-business-type">{profile.businessType}</p>
              </div>
              {profile.licenseNumber && (
                <div>
                  <p className="font-medium text-slate-700">License Number</p>
                  <p className="text-slate-600" data-testid="text-license-number">{profile.licenseNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {userType === 'exporter' && profile.companyName && (
        <Card>
          <CardHeader>
            <CardTitle>Export Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-slate-700">Company</p>
                <p className="text-slate-600" data-testid="text-company-name">{profile.companyName}</p>
              </div>
              {profile.exportLicenseNumber && (
                <div>
                  <p className="font-medium text-slate-700">Export License</p>
                  <p className="text-slate-600" data-testid="text-export-license">{profile.exportLicenseNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {userType === 'inspector' && profile.inspectorType && (
        <Card>
          <CardHeader>
            <CardTitle>Inspector Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-slate-700">Inspector Type</p>
                <p className="text-slate-600" data-testid="text-inspector-type">{profile.inspectorType}</p>
              </div>
              {profile.badgeNumber && (
                <div>
                  <p className="font-medium text-slate-700">Badge Number</p>
                  <p className="text-slate-600" data-testid="text-badge-number">{profile.badgeNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}