import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Award, 
  Calendar, 
  FileText, 
  Building2, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

export default function ExportLicense() {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isRenewalOpen, setIsRenewalOpen] = useState(false);
  const { toast } = useToast();

  // Mock license data - in production this would come from API
  const licenseData = {
    currentLicense: {
      licenseNumber: 'EXP-LIC-2024-001',
      status: 'active',
      issueDate: '2024-01-15',
      expiryDate: '2025-01-14',
      daysUntilExpiry: 15,
      companyName: 'Liberia Agri Export Ltd.',
      licenseType: 'Agricultural Commodity Export License',
      commodities: ['Coffee', 'Cocoa', 'Rubber', 'Cashew'],
      annualQuota: '2,500 MT',
      utilizationRate: '78%'
    },
    renewalHistory: [
      { year: '2023', status: 'completed', renewalDate: '2023-12-10', feesPaid: '$2,500' },
      { year: '2022', status: 'completed', renewalDate: '2022-12-08', feesPaid: '$2,200' },
      { year: '2021', status: 'completed', renewalDate: '2021-12-15', feesPaid: '$2,000' }
    ]
  };

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  const handleLicenseApplication = (formData: FormData) => {
    toast({
      title: 'Export License Application Submitted',
      description: 'Your new export license application has been submitted to LACRA for review. Processing time is typically 14-21 business days.',
    });
    setIsApplicationOpen(false);
  };

  const handleLicenseRenewal = (formData: FormData) => {
    toast({
      title: 'License Renewal Application Submitted',
      description: 'Your license renewal application has been submitted to LACRA. Renewal processing typically takes 7-10 business days.',
    });
    setIsRenewalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (userLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Export License Management - AgriTrace360™</title>
        <meta name="description" content="Manage your LACRA export license applications and renewals" />
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Award className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
              Export License Management
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Manage your LACRA export license applications and renewals
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* New License Application */}
            <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                  <FileText className="h-4 w-4 mr-2" />
                  New License Application
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    New Export License Application
                  </DialogTitle>
                </DialogHeader>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleLicenseApplication(formData);
                  }} 
                  className="space-y-6"
                >
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Company Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input 
                          id="companyName" 
                          name="companyName"
                          defaultValue="Liberia Agri Export Ltd."
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessRegNumber">Business Registration Number *</Label>
                        <Input 
                          id="businessRegNumber" 
                          name="businessRegNumber"
                          placeholder="BR-2020-001234"
                          required 
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="companyAddress">Company Address *</Label>
                      <Textarea 
                        id="companyAddress" 
                        name="companyAddress"
                        placeholder="Complete physical address"
                        rows={2}
                        required 
                      />
                    </div>
                  </div>

                  {/* License Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">License Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="licenseType">License Type *</Label>
                        <Select name="licenseType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select license type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agricultural">Agricultural Commodity Export</SelectItem>
                            <SelectItem value="processed">Processed Agricultural Products</SelectItem>
                            <SelectItem value="timber">Timber Export License</SelectItem>
                            <SelectItem value="specialty">Specialty Crops Export</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="requestedQuota">Requested Annual Quota (MT) *</Label>
                        <Input 
                          id="requestedQuota" 
                          name="requestedQuota"
                          placeholder="e.g., 2500"
                          type="number"
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Commodities */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Commodities to Export</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="coffee" className="rounded" />
                        <span>Coffee</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="cocoa" className="rounded" />
                        <span>Cocoa</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="rubber" className="rounded" />
                        <span>Rubber</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="cashew" className="rounded" />
                        <span>Cashew</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="palm_oil" className="rounded" />
                        <span>Palm Oil</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="rice" className="rounded" />
                        <span>Rice</span>
                      </label>
                    </div>
                  </div>

                  {/* Processing Facilities */}
                  <div>
                    <Label htmlFor="processingFacilities">Processing Facilities</Label>
                    <Textarea 
                      id="processingFacilities" 
                      name="processingFacilities"
                      placeholder="List all processing facilities, warehouses, and storage locations..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsApplicationOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Submit Application
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* License Renewal */}
            <Dialog open={isRenewalOpen} onOpenChange={setIsRenewalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renew License
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-green-600" />
                    Export License Renewal
                  </DialogTitle>
                </DialogHeader>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleLicenseRenewal(formData);
                  }} 
                  className="space-y-6"
                >
                  {/* Current License Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Current License</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>License Number:</strong> {licenseData.currentLicense.licenseNumber}
                      </div>
                      <div>
                        <strong>Expiry Date:</strong> {licenseData.currentLicense.expiryDate}
                      </div>
                      <div>
                        <strong>Annual Quota:</strong> {licenseData.currentLicense.annualQuota}
                      </div>
                      <div>
                        <strong>Utilization:</strong> {licenseData.currentLicense.utilizationRate}
                      </div>
                    </div>
                  </div>

                  {/* Renewal Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Renewal Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="renewalPeriod">Renewal Period *</Label>
                        <Select name="renewalPeriod" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select renewal period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1year">1 Year</SelectItem>
                            <SelectItem value="2years">2 Years</SelectItem>
                            <SelectItem value="3years">3 Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="requestedQuotaRenewal">Requested Annual Quota (MT)</Label>
                        <Input 
                          id="requestedQuotaRenewal" 
                          name="requestedQuotaRenewal"
                          defaultValue="2500"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Changes in Operations */}
                  <div>
                    <Label htmlFor="operationalChanges">Changes in Operations</Label>
                    <Textarea 
                      id="operationalChanges" 
                      name="operationalChanges"
                      placeholder="Describe any changes in facilities, commodities, or operations since last renewal..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsRenewalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Submit Renewal
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Current License Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Current Export License
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{licenseData.currentLicense.licenseNumber}</h3>
                  <p className="text-gray-600">{licenseData.currentLicense.licenseType}</p>
                </div>
                <Badge className={getStatusColor(licenseData.currentLicense.status)}>
                  {licenseData.currentLicense.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Issue Date</p>
                  <p className="font-semibold">{licenseData.currentLicense.issueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expiry Date</p>
                  <p className="font-semibold">{licenseData.currentLicense.expiryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Annual Quota</p>
                  <p className="font-semibold">{licenseData.currentLicense.annualQuota}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Utilization Rate</p>
                  <p className="font-semibold">{licenseData.currentLicense.utilizationRate}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Authorized Commodities</p>
                <div className="flex flex-wrap gap-2">
                  {licenseData.currentLicense.commodities.map((commodity) => (
                    <Badge key={commodity} variant="outline">{commodity}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Renewal Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="bg-orange-100 p-6 rounded-lg">
                <AlertTriangle className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-orange-800">{licenseData.currentLicense.daysUntilExpiry} Days</p>
                <p className="text-sm text-orange-700">Until License Expires</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Reminder:</strong> License renewal applications should be submitted at least 30 days before expiry date.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Renewal History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-green-600" />
            License Renewal History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {licenseData.renewalHistory.map((renewal, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">License Renewal {renewal.year}</h4>
                  <p className="text-sm text-gray-600">Renewed on: {renewal.renewalDate}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-800 mb-1">{renewal.status}</Badge>
                  <p className="text-sm text-gray-600">Fees: {renewal.feesPaid}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}