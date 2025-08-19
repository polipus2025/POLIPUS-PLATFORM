import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CheckCircle, Clock, Building, FileText, Users, DollarSign, Shield, Plus, Eye, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Exporter {
  id: number;
  exporterId: string;
  companyName: string;
  businessType: string;
  businessLicense: string;
  taxIdNumber: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  district: string;
  county: string;
  exportLicense: string;
  licenseExpiryDate: Date;
  commodityTypes: string[];
  accountNumber?: string;
  bankName?: string;
  complianceStatus: 'pending' | 'approved' | 'suspended' | 'rejected';
  portalAccess: boolean;
  loginCredentialsGenerated: boolean;
  registrationDate: Date;
  approvedAt?: Date;
  approvedBy?: string;
  credentialsGeneratedAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ExporterCredentials {
  id: number;
  exporterId: string;
  username: string;
  isTemporary: boolean;
  lastPasswordChange: Date;
  loginAttempts: number;
  accountLocked: boolean;
  generatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ExporterDocument {
  id: number;
  exporterId: string;
  documentType: string;
  documentName: string;
  documentPath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
}

interface ExporterTransaction {
  id: number;
  exporterId: string;
  transactionType: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  recordedBy: string;
  createdAt: Date;
}

const liberianCounties = [
  "Montserrado County", "Bong County", "Nimba County", "Grand Bassa County", "Lofa County", 
  "Grand Cape Mount County", "Margibi County", "Grand Gedeh County", "Sinoe County", 
  "River Cess County", "Maryland County", "Grand Kru County", "Rivercess County", 
  "Gbarpolu County", "River Gee County"
];

const commodityTypes = [
  "Cocoa", "Coffee", "Palm Oil", "Rubber", "Timber", "Cassava", "Rice", "Plantains", "Yams", "Other"
];

const businessTypes = [
  "Limited Liability Company (LLC)", "Corporation", "Partnership", "Sole Proprietorship", "Cooperative", "Other"
];

export default function ExporterManagement() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);
  const [selectedExporter, setSelectedExporter] = useState<Exporter | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    companyName: "",
    businessType: "",
    businessLicense: "",
    taxIdNumber: "",
    contactPerson: "",
    email: "",
    phoneNumber: "",
    address: "",
    district: "",
    county: "",
    exportLicense: "",
    licenseExpiryDate: "",
    commodityTypes: [] as string[],
    accountNumber: "",
    bankName: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch exporters
  const { data: exporters = [], isLoading: exportersLoading } = useQuery<Exporter[]>({
    queryKey: ['/api/exporters'],
  });

  // Fetch selected exporter credentials
  const { data: exporterCredentials } = useQuery<ExporterCredentials | undefined>({
    queryKey: ['/api/exporters', selectedExporter?.id, 'credentials'],
    enabled: !!selectedExporter,
  });

  // Fetch selected exporter documents
  const { data: exporterDocuments = [] } = useQuery<ExporterDocument[]>({
    queryKey: ['/api/exporters', selectedExporter?.id, 'documents'],
    enabled: !!selectedExporter,
  });

  // Fetch selected exporter transactions
  const { data: exporterTransactions = [] } = useQuery<ExporterTransaction[]>({
    queryKey: ['/api/exporters', selectedExporter?.id, 'transactions'],
    enabled: !!selectedExporter,
  });

  // Create exporter mutation
  const createExporterMutation = useMutation({
    mutationFn: async (exporterData: any) => {
      return await apiRequest('POST', '/api/exporters', exporterData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/exporters'] });
      setShowOnboardingDialog(false);
      setOnboardingStep(1);
      setOnboardingData({
        companyName: "",
        businessType: "",
        businessLicense: "",
        taxIdNumber: "",
        contactPerson: "",
        email: "",
        phoneNumber: "",
        address: "",
        district: "",
        county: "",
        exportLicense: "",
        licenseExpiryDate: "",
        commodityTypes: [],
        accountNumber: "",
        bankName: ""
      });
      toast({
        title: "Exporter Registered",
        description: "New exporter has been successfully registered and is pending compliance review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register exporter",
        variant: "destructive",
      });
    },
  });

  // Approve exporter mutation with automatic credential generation
  const approveExporterMutation = useMutation({
    mutationFn: async (data: { id: number; complianceStatus: string; portalAccess: boolean }) => {
      return await apiRequest('POST', `/api/exporters/${data.id}/approve`, {
        complianceStatus: data.complianceStatus,
        portalAccess: data.portalAccess
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/exporters'] });
      toast({
        title: "Exporter Approved & Credentials Generated",
        description: `Portal access credentials created. Username: ${data.credentials.username}`,
      });
      
      // Show credentials in a separate dialog/alert
      alert(`Exporter Portal Access Credentials Generated:
Username: ${data.credentials.username}
Temporary Password: ${data.credentials.temporaryPassword}
Portal URL: ${window.location.origin}${data.credentials.portalUrl}

Please provide these credentials to the exporter. They will be required to change the password on first login.`);
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve exporter",
        variant: "destructive",
      });
    },
  });

  // Generate credentials mutation
  const generateCredentialsMutation = useMutation({
    mutationFn: async (exporterId: number) => {
      return await apiRequest('POST', `/api/exporters/${exporterId}/generate-credentials`);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/exporters'] });
      toast({
        title: "Credentials Generated",
        description: `Login credentials created successfully for ${data.credentials.exporter}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Credential Generation Failed",
        description: error.message || "Failed to generate login credentials",
        variant: "destructive",
      });
    },
  });

  const handleCommodityTypeToggle = (commodity: string) => {
    setOnboardingData(prev => ({
      ...prev,
      commodityTypes: prev.commodityTypes.includes(commodity)
        ? prev.commodityTypes.filter(c => c !== commodity)
        : [...prev.commodityTypes, commodity]
    }));
  };

  const handleNextStep = () => {
    if (onboardingStep < 5) {
      setOnboardingStep(onboardingStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const handleSubmitOnboarding = () => {
    createExporterMutation.mutate(onboardingData);
  };

  const getComplianceStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      suspended: "bg-red-100 text-red-800",
      rejected: "bg-gray-100 text-gray-800",
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'suspended':
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const pendingExporters = exporters.filter(e => e.complianceStatus === 'pending');
  const approvedExporters = exporters.filter(e => e.complianceStatus === 'approved');
  const suspendedExporters = exporters.filter(e => e.complianceStatus === 'suspended');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Exporter Management</h1>
              <p className="text-slate-600 mt-2">Comprehensive Exporter Onboarding & Credential Management System</p>
            </div>
            <Dialog open={showOnboardingDialog} onOpenChange={setShowOnboardingDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-new-exporter" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Register New Exporter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Exporter Registration - Step {onboardingStep} of 5</DialogTitle>
                </DialogHeader>

                {/* Step 1: Company Information */}
                {onboardingStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Company Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          data-testid="input-company-name"
                          value={onboardingData.companyName}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, companyName: e.target.value }))}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessType">Business Type *</Label>
                        <Select value={onboardingData.businessType} onValueChange={(value) => setOnboardingData(prev => ({ ...prev, businessType: value }))}>
                          <SelectTrigger data-testid="select-business-type">
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessLicense">Business License Number *</Label>
                        <Input
                          id="businessLicense"
                          data-testid="input-business-license"
                          value={onboardingData.businessLicense}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, businessLicense: e.target.value }))}
                          placeholder="Enter business license number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxIdNumber">Tax ID Number *</Label>
                        <Input
                          id="taxIdNumber"
                          data-testid="input-tax-id"
                          value={onboardingData.taxIdNumber}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, taxIdNumber: e.target.value }))}
                          placeholder="Enter tax ID number"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {onboardingStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input
                          id="contactPerson"
                          data-testid="input-contact-person"
                          value={onboardingData.contactPerson}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, contactPerson: e.target.value }))}
                          placeholder="Enter contact person name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          data-testid="input-email"
                          type="email"
                          value={onboardingData.email}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        data-testid="input-phone"
                        value={onboardingData.phoneNumber}
                        onChange={(e) => setOnboardingData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Location Information */}
                {onboardingStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Location Information</h3>
                    <div>
                      <Label htmlFor="address">Business Address *</Label>
                      <Textarea
                        id="address"
                        data-testid="textarea-address"
                        value={onboardingData.address}
                        onChange={(e) => setOnboardingData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter full business address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="district">District *</Label>
                        <Input
                          id="district"
                          data-testid="input-district"
                          value={onboardingData.district}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, district: e.target.value }))}
                          placeholder="Enter district"
                        />
                      </div>
                      <div>
                        <Label htmlFor="county">County *</Label>
                        <Select value={onboardingData.county} onValueChange={(value) => setOnboardingData(prev => ({ ...prev, county: value }))}>
                          <SelectTrigger data-testid="select-county">
                            <SelectValue placeholder="Select county" />
                          </SelectTrigger>
                          <SelectContent>
                            {liberianCounties.map((county) => (
                              <SelectItem key={county} value={county}>{county}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Export License & Commodities */}
                {onboardingStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Export License & Commodities</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="exportLicense">Export License Number *</Label>
                        <Input
                          id="exportLicense"
                          data-testid="input-export-license"
                          value={onboardingData.exportLicense}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, exportLicense: e.target.value }))}
                          placeholder="Enter export license number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="licenseExpiryDate">License Expiry Date *</Label>
                        <Input
                          id="licenseExpiryDate"
                          data-testid="input-license-expiry"
                          type="date"
                          value={onboardingData.licenseExpiryDate}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, licenseExpiryDate: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Commodity Types *</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {commodityTypes.map((commodity) => (
                          <div key={commodity} className="flex items-center space-x-2">
                            <Switch
                              data-testid={`switch-commodity-${commodity.toLowerCase()}`}
                              checked={onboardingData.commodityTypes.includes(commodity)}
                              onCheckedChange={() => handleCommodityTypeToggle(commodity)}
                            />
                            <Label className="text-sm">{commodity}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Banking Information */}
                {onboardingStep === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Banking Information (Optional)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          data-testid="input-bank-name"
                          value={onboardingData.bankName}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, bankName: e.target.value }))}
                          placeholder="Enter bank name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          data-testid="input-account-number"
                          value={onboardingData.accountNumber}
                          onChange={(e) => setOnboardingData(prev => ({ ...prev, accountNumber: e.target.value }))}
                          placeholder="Enter account number"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={onboardingStep === 1}
                    data-testid="button-previous"
                  >
                    Previous
                  </Button>
                  {onboardingStep < 5 ? (
                    <Button onClick={handleNextStep} data-testid="button-next">
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitOnboarding}
                      disabled={createExporterMutation.isPending}
                      data-testid="button-submit"
                    >
                      {createExporterMutation.isPending ? "Registering..." : "Register Exporter"}
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Exporters</p>
                  <p data-testid="text-total-exporters" className="text-3xl font-bold text-slate-800">{exporters.length}</p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Pending Review</p>
                  <p data-testid="text-pending-exporters" className="text-3xl font-bold text-slate-800">{pendingExporters.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Approved Exporters</p>
                  <p data-testid="text-approved-exporters" className="text-3xl font-bold text-slate-800">{approvedExporters.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Suspended</p>
                  <p data-testid="text-suspended-exporters" className="text-3xl font-bold text-slate-800">{suspendedExporters.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending">Pending ({pendingExporters.length})</TabsTrigger>
            <TabsTrigger value="approved" data-testid="tab-approved">Approved ({approvedExporters.length})</TabsTrigger>
            <TabsTrigger value="details" data-testid="tab-details">Exporter Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    All Exporters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Company</th>
                          <th className="text-left p-3">Exporter ID</th>
                          <th className="text-left p-3">Contact</th>
                          <th className="text-left p-3">County</th>
                          <th className="text-left p-3">Commodities</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exporters.map((exporter) => (
                          <tr key={exporter.id} className="border-b hover:bg-slate-50">
                            <td className="p-3">
                              <div>
                                <p data-testid={`text-company-name-${exporter.id}`} className="font-medium">{exporter.companyName}</p>
                                <p className="text-sm text-slate-600">{exporter.businessType}</p>
                              </div>
                            </td>
                            <td data-testid={`text-exporter-id-${exporter.id}`} className="p-3 font-mono text-sm">{exporter.exporterId}</td>
                            <td className="p-3">
                              <div>
                                <p data-testid={`text-contact-person-${exporter.id}`} className="text-sm">{exporter.contactPerson}</p>
                                <p className="text-sm text-slate-600">{exporter.email}</p>
                              </div>
                            </td>
                            <td data-testid={`text-county-${exporter.id}`} className="p-3">{exporter.county}</td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                {(exporter.commodityTypes || []).slice(0, 2).map((commodity, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {commodity}
                                  </Badge>
                                ))}
                                {(exporter.commodityTypes || []).length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{(exporter.commodityTypes || []).length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(exporter.complianceStatus)}
                                {getComplianceStatusBadge(exporter.complianceStatus)}
                              </div>
                            </td>
                            <td className="p-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedExporter(exporter);
                                  setSelectedTab("details");
                                }}
                                data-testid={`button-view-details-${exporter.id}`}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {exporters.length === 0 && (
                      <div className="text-center py-12">
                        <Building className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 text-lg">No exporters registered yet</p>
                        <p className="text-slate-500">Register your first exporter to get started</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Pending Exporters ({pendingExporters.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingExporters.map((exporter) => (
                    <div key={exporter.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 data-testid={`text-pending-company-${exporter.id}`} className="font-semibold">{exporter.companyName}</h3>
                          <p className="text-sm text-slate-600">{exporter.contactPerson} • {exporter.email}</p>
                          <p className="text-sm text-slate-600">{exporter.county} • {exporter.commodityTypes?.join(", ") || "No commodities specified"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => approveExporterMutation.mutate({ id: exporter.id, complianceStatus: 'approved', portalAccess: true })}
                            disabled={approveExporterMutation.isPending}
                            data-testid={`button-approve-${exporter.id}`}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedExporter(exporter);
                              setSelectedTab("details");
                            }}
                            data-testid={`button-view-pending-${exporter.id}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingExporters.length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600 text-lg">No pending exporters</p>
                      <p className="text-slate-500">All exporters have been reviewed</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Approved Exporters ({approvedExporters.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvedExporters.map((exporter) => (
                    <div key={exporter.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 data-testid={`text-approved-company-${exporter.id}`} className="font-semibold">{exporter.companyName}</h3>
                          <p className="text-sm text-slate-600">{exporter.contactPerson} • {exporter.email}</p>
                          <p className="text-sm text-slate-600">{exporter.county} • {exporter.commodityTypes?.join(", ") || "No commodities specified"}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant={exporter.loginCredentialsGenerated ? "default" : "secondary"}>
                              {exporter.loginCredentialsGenerated ? "Credentials Generated" : "Credentials Pending"}
                            </Badge>
                            <Badge variant={exporter.portalAccess ? "default" : "secondary"}>
                              {exporter.portalAccess ? "Portal Access Granted" : "Portal Access Pending"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!exporter.loginCredentialsGenerated && (
                            <Button
                              size="sm"
                              onClick={() => generateCredentialsMutation.mutate(exporter.id)}
                              disabled={generateCredentialsMutation.isPending}
                              data-testid={`button-generate-credentials-${exporter.id}`}
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Generate Credentials
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedExporter(exporter);
                              setSelectedTab("details");
                            }}
                            data-testid={`button-view-approved-${exporter.id}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {approvedExporters.length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600 text-lg">No approved exporters yet</p>
                      <p className="text-slate-500">Approve pending exporters to see them here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            {selectedExporter ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {selectedExporter.companyName}
                      {getComplianceStatusBadge(selectedExporter.complianceStatus)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Company Information */}
                      <div>
                        <h4 className="font-semibold mb-3">Company Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Exporter ID:</span> <span data-testid="text-detail-exporter-id">{selectedExporter.exporterId}</span></div>
                          <div><span className="font-medium">Business Type:</span> <span data-testid="text-detail-business-type">{selectedExporter.businessType}</span></div>
                          <div><span className="font-medium">Business License:</span> <span data-testid="text-detail-business-license">{selectedExporter.businessLicense}</span></div>
                          <div><span className="font-medium">Tax ID:</span> <span data-testid="text-detail-tax-id">{selectedExporter.taxIdNumber}</span></div>
                          <div><span className="font-medium">Export License:</span> <span data-testid="text-detail-export-license">{selectedExporter.exportLicense}</span></div>
                          <div><span className="font-medium">License Expires:</span> <span data-testid="text-detail-license-expiry">{new Date(selectedExporter.licenseExpiryDate).toLocaleDateString()}</span></div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h4 className="font-semibold mb-3">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Contact Person:</span> <span data-testid="text-detail-contact-person">{selectedExporter.contactPerson}</span></div>
                          <div><span className="font-medium">Email:</span> <span data-testid="text-detail-email">{selectedExporter.email}</span></div>
                          <div><span className="font-medium">Phone:</span> <span data-testid="text-detail-phone">{selectedExporter.phoneNumber}</span></div>
                          <div><span className="font-medium">Address:</span> <span data-testid="text-detail-address">{selectedExporter.address}</span></div>
                          <div><span className="font-medium">District:</span> <span data-testid="text-detail-district">{selectedExporter.district}</span></div>
                          <div><span className="font-medium">County:</span> <span data-testid="text-detail-county">{selectedExporter.county}</span></div>
                        </div>
                      </div>

                      {/* Export Information */}
                      <div>
                        <h4 className="font-semibold mb-3">Export Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Commodities:</span></div>
                          <div className="flex flex-wrap gap-1">
                            {selectedExporter.commodityTypes.map((commodity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {commodity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Banking Information */}
                      <div>
                        <h4 className="font-semibold mb-3">Banking Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Bank Name:</span> <span data-testid="text-detail-bank-name">{selectedExporter.bankName || "Not provided"}</span></div>
                          <div><span className="font-medium">Account Number:</span> <span data-testid="text-detail-account-number">{selectedExporter.accountNumber || "Not provided"}</span></div>
                        </div>
                      </div>
                    </div>

                    {/* System Information */}
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-3">System Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-medium">Registration Date:</span> <span data-testid="text-detail-registration-date">{new Date(selectedExporter.registrationDate).toLocaleDateString()}</span></div>
                        <div><span className="font-medium">Portal Access:</span> <span data-testid="text-detail-portal-access">{selectedExporter.portalAccess ? "Granted" : "Pending"}</span></div>
                        <div><span className="font-medium">Credentials Generated:</span> <span data-testid="text-detail-credentials-generated">{selectedExporter.loginCredentialsGenerated ? "Yes" : "No"}</span></div>
                        <div><span className="font-medium">Last Login:</span> <span data-testid="text-detail-last-login">{selectedExporter.lastLoginAt ? new Date(selectedExporter.lastLoginAt).toLocaleDateString() : "Never"}</span></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {selectedExporter.complianceStatus === 'pending' && (
                      <div className="mt-6 pt-6 border-t flex gap-4">
                        <Button
                          onClick={() => approveExporterMutation.mutate({
                            id: selectedExporter.id,
                            complianceStatus: 'approved',
                            portalAccess: true
                          })}
                          disabled={approveExporterMutation.isPending}
                          data-testid="button-approve-detail"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve & Generate Portal Access
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            // TODO: Add reject functionality
                            toast({
                              title: "Feature Coming Soon",
                              description: "Reject functionality will be added in the next update",
                            });
                          }}
                          data-testid="button-reject-detail"
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Reject Application
                        </Button>
                      </div>
                    )}

                    {selectedExporter.complianceStatus === 'approved' && !selectedExporter.loginCredentialsGenerated && (
                      <div className="mt-6 pt-6 border-t">
                        <Button
                          onClick={() => generateCredentialsMutation.mutate(selectedExporter.id)}
                          disabled={generateCredentialsMutation.isPending}
                          data-testid="button-generate-credentials-detail"
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Generate Login Credentials
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Additional Tabs for Documents and Transactions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documents ({exporterDocuments.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {exporterDocuments.length > 0 ? (
                        <div className="space-y-2">
                          {exporterDocuments.map((document) => (
                            <div key={document.id} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium text-sm">{document.documentName}</p>
                                <p className="text-xs text-slate-600">{document.documentType}</p>
                              </div>
                              <Badge variant={document.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                                {document.verificationStatus}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-600 text-sm">No documents uploaded</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Transactions ({exporterTransactions.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {exporterTransactions.length > 0 ? (
                        <div className="space-y-2">
                          {exporterTransactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium text-sm">{transaction.transactionType}</p>
                                <p className="text-xs text-slate-600">{transaction.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-sm">${transaction.amount.toLocaleString()}</p>
                                <Badge variant="outline" className="text-xs">{transaction.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-600 text-sm">No transactions recorded</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg">No exporter selected</p>
                  <p className="text-slate-500">Select an exporter from the other tabs to view detailed information</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}