import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Search, UserPlus, MapPin, Shield, Phone, Mail, Calendar, 
  CheckCircle, XCircle, Key, Lock, Eye, Edit, History, 
  Users, TrendingUp, AlertTriangle, UserCheck
} from 'lucide-react';

interface Inspector {
  id: number;
  inspectorId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string | null;
  phoneNumber: string;
  nationalId: string;
  address: string;
  profilePicture: string | null;
  inspectionAreaCounty: string;
  inspectionAreaDistrict: string | null;
  inspectionAreaDescription: string | null;
  specializations: string | null;
  certificationLevel: string;
  isActive: boolean;
  canLogin: boolean;
  assignedBy: string;
  assignedAt: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface InspectorActivity {
  id: number;
  inspectorId: string;
  activityType: string;
  description: string;
  location: string | null;
  county: string | null;
  district: string | null;
  metadata: any;
  timestamp: string;
}

interface InspectorCredentials {
  inspectorId: string;
  username: string;
  mustChangePassword: boolean;
  lastPasswordChange: string | null;
  failedLoginAttempts: number;
  isLocked: boolean;
  lockedUntil: string | null;
  createdAt: string;
}

interface NewInspectorCredentials {
  username: string;
  temporaryPassword: string;
  mustChangePassword: boolean;
}

const liberianCounties = [
  "All Counties", "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount",
  "Grand Gedeh", "Grand Kru", "Lofa", "Margibi", "Maryland",
  "Montserrado", "Nimba", "River Cess", "River Gee", "Sinoe"
];

export default function InspectorManagement() {
  const [selectedCounty, setSelectedCounty] = useState("All Counties");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(null);
  const [showActivities, setShowActivities] = useState(false);
  const [activeTab, setActiveTab] = useState("management");
  const [showCredentials, setShowCredentials] = useState(false);
  const [newInspectorCredentials, setNewInspectorCredentials] = useState<NewInspectorCredentials | null>(null);
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
        description: "Inspector Management is only accessible to DDGOTS personnel. Redirecting to Inspector Dashboard...",
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
        description: "Please log in with DDGOTS credentials to access Inspector Management.",
        variant: "destructive"
      });
      setTimeout(() => {
        setLocation('/auth/ddgots-login');
      }, 2000);
      return;
    }
  }, [toast, setLocation]);

  // Fetch inspectors
  const { data: inspectors = [], isLoading } = useQuery<Inspector[]>({
    queryKey: ['/api/inspectors'],
  });

  // Fetch inspector activities
  const { data: activities = [] } = useQuery<InspectorActivity[]>({
    queryKey: ['/api/inspectors', selectedInspector?.id, 'activities'],
    enabled: !!selectedInspector,
  });

  // Mutations for inspector actions
  const activateInspectorMutation = useMutation({
    mutationFn: (inspectorId: number) => apiRequest(`/api/inspectors/${inspectorId}/activate`, { method: 'PUT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inspectors'] });
      toast({ title: "Inspector Activated", description: "Inspector has been activated successfully." });
    }
  });

  const deactivateInspectorMutation = useMutation({
    mutationFn: (inspectorId: number) => apiRequest(`/api/inspectors/${inspectorId}/deactivate`, { method: 'PUT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inspectors'] });
      toast({ title: "Inspector Deactivated", description: "Inspector has been deactivated successfully." });
    }
  });

  const enableLoginMutation = useMutation({
    mutationFn: (inspectorId: number) => apiRequest(`/api/inspectors/${inspectorId}/enable-login`, { method: 'PUT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inspectors'] });
      toast({ title: "Login Enabled", description: "Inspector login access has been enabled." });
    }
  });

  const disableLoginMutation = useMutation({
    mutationFn: (inspectorId: number) => apiRequest(`/api/inspectors/${inspectorId}/disable-login`, { method: 'PUT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inspectors'] });
      toast({ title: "Login Disabled", description: "Inspector login access has been disabled." });
    }
  });

  // Fetch inspector credentials
  const { data: selectedInspectorCredentials } = useQuery<InspectorCredentials>({
    queryKey: ['/api/inspectors', selectedInspector?.inspectorId, 'credentials'],
    enabled: !!selectedInspector && showCredentials,
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (inspectorId: string) => apiRequest(`/api/inspectors/${inspectorId}/reset-password`, { method: 'POST' }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/inspectors'] });
      setNewInspectorCredentials(data.credentials);
      toast({ title: "Password Reset", description: "New temporary password has been generated." });
    }
  });

  // Filter inspectors based on county and search term
  const filteredInspectors = inspectors.filter((inspector: Inspector) => {
    const matchesCounty = selectedCounty === "All Counties" || inspector.inspectionAreaCounty === selectedCounty;
    const matchesSearch = inspector.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspector.inspectorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspector.phoneNumber.includes(searchTerm);
    return matchesCounty && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: inspectors.length,
    active: inspectors.filter((i: Inspector) => i.isActive).length,
    inactive: inspectors.filter((i: Inspector) => !i.isActive).length,
    canLogin: inspectors.filter((i: Inspector) => i.canLogin).length,
  };

  const getStatusColor = (inspector: Inspector) => {
    if (!inspector.isActive) return 'bg-red-100 text-red-800';
    if (!inspector.canLogin) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (inspector: Inspector) => {
    if (!inspector.isActive) return 'Inactive';
    if (!inspector.canLogin) return 'Login Disabled';
    return 'Active';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Inline Inspector Onboarding Form Component
  const InspectorOnboardingForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      nationalId: '',
      address: '',
      inspectorType: '', // Land Inspector or Port Inspector
      inspectionAreaCounty: '',
      inspectionAreaDistrict: '',
      inspectionAreaDescription: '',
      specializations: '',
      certificationLevel: ''
    });

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
      try {
        const response = await apiRequest('/api/inspectors', { 
          method: 'POST', 
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' }
        });
        
        // Store the generated credentials for display
        if (response.credentials) {
          setNewInspectorCredentials(response.credentials);
        }
        
        toast({ 
          title: "Success", 
          description: "Inspector onboarded successfully! Login credentials have been generated." 
        });
        
        queryClient.invalidateQueries({ queryKey: ['/api/inspectors'] });
        setActiveTab('management');
        setCurrentStep(1);
        setFormData({
          firstName: '', lastName: '', email: '', phoneNumber: '', nationalId: '', 
          address: '', inspectorType: '', inspectionAreaCounty: '', inspectionAreaDistrict: '',
          inspectionAreaDescription: '', specializations: '', certificationLevel: ''
        });
      } catch (error) {
        toast({ title: "Error", description: "Failed to onboard inspector" });
      }
    };

    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Inspector Onboarding - Step {currentStep} of 3
          </CardTitle>
          <CardDescription>
            Complete the 3-step process to register a new agricultural inspector
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input 
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">National ID</label>
                  <Input 
                    value={formData.nationalId}
                    onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                    placeholder="Enter national ID number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Input 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter full address"
                  />
                </div>
              </div>
              
              {/* Inspector Type Selection */}
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-3 text-slate-900">Inspector Type Selection</h4>
                <div>
                  <label className="block text-sm font-medium mb-2">Inspector Type *</label>
                  <Select value={formData.inspectorType} onValueChange={(value) => setFormData({...formData, inspectorType: value})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select inspector type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Land Inspector">Land Inspector</SelectItem>
                      <SelectItem value="Port Inspector">Port Inspector</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1">
                    Land Inspectors monitor farm operations and agricultural facilities. Port Inspectors oversee export/import operations at ports.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location Assignment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Inspection Area County</label>
                  <Select value={formData.inspectionAreaCounty} onValueChange={(value) => setFormData({...formData, inspectionAreaCounty: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      {liberianCounties.slice(1).map(county => (
                        <SelectItem key={county} value={county}>{county}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">District (Optional)</label>
                  <Input 
                    value={formData.inspectionAreaDistrict || ''}
                    onChange={(e) => setFormData({...formData, inspectionAreaDistrict: e.target.value})}
                    placeholder="Enter district"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Area Description</label>
                <Input 
                  value={formData.inspectionAreaDescription || ''}
                  onChange={(e) => setFormData({...formData, inspectionAreaDescription: e.target.value})}
                  placeholder="Describe the inspection area coverage"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Qualifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Specializations</label>
                  <Input 
                    value={formData.specializations || ''}
                    onChange={(e) => setFormData({...formData, specializations: e.target.value})}
                    placeholder="e.g., Crop inspection, Livestock"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Certification Level</label>
                  <Select value={formData.certificationLevel} onValueChange={(value) => setFormData({...formData, certificationLevel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior Inspector</SelectItem>
                      <SelectItem value="Senior">Senior Inspector</SelectItem>
                      <SelectItem value="Lead">Lead Inspector</SelectItem>
                      <SelectItem value="Specialist">Specialist Inspector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}



          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 3 ? (
              <Button onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Complete Onboarding
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Inspector Management System
          </h1>
          <p className="text-slate-600">
            Complete inspector onboarding and management solution for agricultural compliance monitoring
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="onboarding" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Inspector Onboarding
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Inspector Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="onboarding" className="mt-6">
            <InspectorOnboardingForm />
          </TabsContent>

          <TabsContent value="management" className="mt-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600">Total Inspectors</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <UserCheck className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600">Active Inspectors</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <XCircle className="w-8 h-8 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600">Inactive</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.inactive}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Key className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600">Can Login</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.canLogin}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, ID, or phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {liberianCounties.map((county) => (
                    <SelectItem key={county} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Inspector List */}
            <div className="grid gap-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading inspectors...</p>
                </div>
              ) : filteredInspectors.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No inspectors found</h3>
                    <p className="text-slate-600 mb-4">No inspectors match your current search criteria.</p>
                    <Button onClick={() => setActiveTab('onboarding')}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add First Inspector
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredInspectors.map((inspector: Inspector) => (
                  <Card key={inspector.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={inspector.profilePicture || ""} />
                            <AvatarFallback>
                        {inspector.firstName[0]}{inspector.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{inspector.fullName}</h3>
                        <Badge className={getStatusColor(inspector)}>
                          {getStatusText(inspector)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {inspector.certificationLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span>ID: {inspector.inspectorId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{inspector.inspectionAreaCounty} County</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{inspector.phoneNumber}</span>
                        </div>
                        {inspector.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{inspector.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {formatDate(inspector.createdAt)}</span>
                        </div>
                        {inspector.lastLoginAt && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Last Login: {formatDate(inspector.lastLoginAt)}</span>
                          </div>
                        )}
                      </div>
                      {inspector.specializations && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {inspector.specializations.split(',').map((spec) => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec.trim().replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedInspector(inspector)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Inspector Details - {inspector.fullName}</DialogTitle>
                          <DialogDescription>
                            Complete inspector profile and activity information
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="profile" className="mt-4">
                          <TabsList>
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="activities">Activities</TabsTrigger>
                            <TabsTrigger value="areas">Area Assignments</TabsTrigger>
                          </TabsList>
                          <TabsContent value="profile" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-slate-600">Inspector ID</label>
                                <p className="font-mono">{inspector.inspectorId}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-slate-600">Full Name</label>
                                <p>{inspector.fullName}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-slate-600">Phone Number</label>
                                <p>{inspector.phoneNumber}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-slate-600">Email</label>
                                <p>{inspector.email || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-slate-600">National ID</label>
                                <p>{inspector.nationalId}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-slate-600">Certification Level</label>
                                <p className="capitalize">{inspector.certificationLevel}</p>
                              </div>
                              <div className="col-span-2">
                                <label className="text-sm font-medium text-slate-600">Address</label>
                                <p>{inspector.address}</p>
                              </div>
                              <div className="col-span-2">
                                <label className="text-sm font-medium text-slate-600">Inspection Area</label>
                                <p>{inspector.inspectionAreaCounty} County {inspector.inspectionAreaDistrict ? `- ${inspector.inspectionAreaDistrict}` : ''}</p>
                                {inspector.inspectionAreaDescription && (
                                  <p className="text-sm text-slate-600 mt-1">{inspector.inspectionAreaDescription}</p>
                                )}
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="activities">
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {activities.map((activity: InspectorActivity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{activity.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                      <span>{formatDate(activity.timestamp)}</span>
                                      <span className="capitalize">{activity.activityType.replace('_', ' ')}</span>
                                      {activity.county && <span>{activity.county} County</span>}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="areas">
                            <p className="text-center text-slate-500 py-8">
                              Area assignments functionality coming soon
                            </p>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                    
                    {inspector.isActive ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deactivateInspectorMutation.mutate(inspector.id)}
                        disabled={deactivateInspectorMutation.isPending}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => activateInspectorMutation.mutate(inspector.id)}
                        disabled={activateInspectorMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {inspector.canLogin ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => disableLoginMutation.mutate(inspector.id)}
                        disabled={disableLoginMutation.isPending}
                      >
                        <Lock className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => enableLoginMutation.mutate(inspector.id)}
                        disabled={enableLoginMutation.isPending}
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                    )}

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedInspector(inspector);
                        setShowCredentials(true);
                      }}
                      title="View Login Credentials"
                    >
                      <Shield className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Credentials Display Dialog */}
      <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Inspector Login Credentials
            </DialogTitle>
            <DialogDescription>
              {selectedInspector && (
                <>Manage login credentials for {selectedInspector.fullName} ({selectedInspector.inspectorId})</>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedInspectorCredentials && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Current Login Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Username</label>
                    <div className="p-2 bg-white border rounded text-sm font-mono">
                      {selectedInspectorCredentials.username}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Account Status</label>
                    <div className="p-2">
                      <Badge 
                        variant={selectedInspectorCredentials.isLocked ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {selectedInspectorCredentials.isLocked ? "Locked" : "Active"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Password Status</label>
                    <div className="p-2">
                      <Badge 
                        variant={selectedInspectorCredentials.mustChangePassword ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {selectedInspectorCredentials.mustChangePassword ? "Must Change" : "Set"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Failed Attempts</label>
                    <div className="p-2 text-sm">
                      {selectedInspectorCredentials.failedLoginAttempts} / 5
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => selectedInspector && resetPasswordMutation.mutate(selectedInspector.inspectorId)}
                  disabled={resetPasswordMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Reset Password
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Inspector Credentials Dialog */}
      <Dialog open={!!newInspectorCredentials} onOpenChange={() => setNewInspectorCredentials(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-green-600" />
              Inspector Login Credentials Generated
            </DialogTitle>
            <DialogDescription>
              New login credentials have been generated. Please provide these to the inspector.
            </DialogDescription>
          </DialogHeader>

          {newInspectorCredentials && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-green-800">Username</label>
                    <div className="p-3 bg-white border border-green-200 rounded font-mono text-lg">
                      {newInspectorCredentials.username}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-800">Temporary Password</label>
                    <div className="p-3 bg-white border border-green-200 rounded font-mono text-lg">
                      {newInspectorCredentials.temporaryPassword}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> The inspector must change this temporary password on first login.
                </p>
              </div>

              <Button 
                onClick={() => setNewInspectorCredentials(null)}
                className="w-full"
              >
                Got it
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}