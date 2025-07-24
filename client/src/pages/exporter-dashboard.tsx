import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Ship, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Package,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ExporterDashboard() {
  const [isExportApplicationOpen, setIsExportApplicationOpen] = useState(false);
  const { toast } = useToast();

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Mock data for LACRA compliance status
  const complianceData = {
    exportLicense: { status: 'active', expiryDate: '2025-06-15' },
    lacraRegistration: { status: 'approved', registrationNumber: 'LACRA-EXP-2024-001' },
    eudrCompliance: { status: 'verified', lastUpdated: '2025-01-15' },
    pendingApplications: 2,
    approvedExports: 15,
    totalVolume: '2,450 MT'
  };

  const handleSubmitExportApplication = (formData: FormData) => {
    const applicationData = {
      companyName: formData.get('companyName') as string,
      businessLicense: formData.get('businessLicense') as string,
      taxId: formData.get('taxId') as string,
      contactPerson: formData.get('contactPerson') as string,
      commodityType: formData.get('commodityType') as string,
      estimatedVolume: formData.get('estimatedVolume') as string,
      primaryMarket: formData.get('primaryMarket') as string,
      eudrCompliant: formData.get('eudrCompliant') === 'on',
      organicCertified: formData.get('organicCertified') === 'on',
      fairTrade: formData.get('fairTrade') === 'on',
      applicationNotes: formData.get('applicationNotes') as string,
    };

    toast({
      title: 'Application Submitted to LACRA',
      description: 'Your export license application has been successfully submitted to LACRA for official review and approval. You will receive confirmation within 5-7 business days.',
    });
    
    setIsExportApplicationOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'approved': case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (userLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Exporter Dashboard - AgriTrace360™</title>
        <meta name="description" content="Export management dashboard for licensed agricultural commodity exporters" />
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Ship className="h-8 w-8 text-blue-600" />
              Exporter Portal
            </h1>
            <p className="text-gray-600">
              LACRA Licensed Exporter - {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Export Application Button - Main CTA for LACRA approval */}
            <Dialog open={isExportApplicationOpen} onOpenChange={setIsExportApplicationOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg font-semibold shadow-lg">
                  <FileText className="h-5 w-5 mr-2" />
                  Submit Export Application to LACRA
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Export License Application
                  </DialogTitle>
                </DialogHeader>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSubmitExportApplication(formData);
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
                        <Label htmlFor="businessLicense">Business License Number *</Label>
                        <Input 
                          id="businessLicense" 
                          name="businessLicense"
                          placeholder="BL-2024-001"
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxId">Tax ID Number *</Label>
                        <Input 
                          id="taxId" 
                          name="taxId"
                          placeholder="TIN-123456789"
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input 
                          id="contactPerson" 
                          name="contactPerson"
                          defaultValue="Marcus Bawah"
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Export Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Export Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="commodityType">Commodity Type *</Label>
                        <Select name="commodityType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select commodity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="coffee">Coffee</SelectItem>
                            <SelectItem value="cocoa">Cocoa</SelectItem>
                            <SelectItem value="rubber">Rubber</SelectItem>
                            <SelectItem value="palm_oil">Palm Oil</SelectItem>
                            <SelectItem value="timber">Timber</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="estimatedVolume">Estimated Volume (MT) *</Label>
                        <Input 
                          id="estimatedVolume" 
                          name="estimatedVolume"
                          placeholder="e.g., 500"
                          type="number"
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="primaryMarket">Primary Export Market *</Label>
                        <Select name="primaryMarket" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select market" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="europe">Europe</SelectItem>
                            <SelectItem value="north_america">North America</SelectItem>
                            <SelectItem value="asia">Asia</SelectItem>
                            <SelectItem value="africa">Africa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Compliance Certifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Compliance & Certifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="eudrCompliant" className="rounded" />
                        <span>EUDR Compliant</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="organicCertified" className="rounded" />
                        <span>Organic Certified</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="fairTrade" className="rounded" />
                        <span>Fair Trade Certified</span>
                      </label>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="applicationNotes">Additional Notes</Label>
                    <Textarea 
                      id="applicationNotes" 
                      name="applicationNotes"
                      placeholder="Any additional information or special requirements..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsExportApplicationOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Submit Application
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* LACRA Export Application Information */}
      <Card className="mb-8 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Submit Export Requests to LACRA
              </h3>
              <p className="text-green-700 mb-3">
                Use the "Submit Export Application to LACRA" button above to submit your export license requests 
                for official LACRA review and approval. All applications are processed within 5-7 business days.
              </p>
              <div className="text-sm text-green-600">
                <strong>Required documents:</strong> Company registration, commodity details, destination markets, compliance certificates
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LACRA Compliance Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Export License</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(complianceData.exportLicense.status)}>
                {complianceData.exportLicense.status}
              </Badge>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Expires: {complianceData.exportLicense.expiryDate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">LACRA Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(complianceData.lacraRegistration.status)}>
                {complianceData.lacraRegistration.status}
              </Badge>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ID: {complianceData.lacraRegistration.registrationNumber}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">EUDR Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(complianceData.eudrCompliance.status)}>
                {complianceData.eudrCompliance.status}
              </Badge>
              <Globe className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Updated: {complianceData.eudrCompliance.lastUpdated}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Export Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Approved:</span>
                <span className="font-semibold">{complianceData.approvedExports}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Volume:</span>
                <span className="font-semibold">{complianceData.totalVolume}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Export Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Recent Export Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock recent applications */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">Coffee Export to Germany</h4>
                <p className="text-sm text-gray-600">Application #EXP-2025-001 • 500 MT Arabica Coffee</p>
                <p className="text-xs text-gray-500">Submitted: January 20, 2025</p>
              </div>
              <div className="text-right">
                <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                <p className="text-xs text-gray-500 mt-1">Est. approval: 3-5 days</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">Cocoa Export to Netherlands</h4>
                <p className="text-sm text-gray-600">Application #EXP-2025-002 • 750 MT Premium Cocoa</p>
                <p className="text-xs text-gray-500">Submitted: January 18, 2025</p>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-800">Approved</Badge>
                <p className="text-xs text-gray-500 mt-1">Certificate issued</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LACRA Contact Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>LACRA Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Export Licensing Department</h4>
              <p className="text-sm text-gray-600">Phone: +231 77 123 4567</p>
              <p className="text-sm text-gray-600">Email: exports@lacra.gov.lr</p>
              <p className="text-sm text-gray-600">Office Hours: Mon-Fri 8:00 AM - 5:00 PM</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Compliance & Verification</h4>
              <p className="text-sm text-gray-600">Phone: +231 77 234 5678</p>
              <p className="text-sm text-gray-600">Email: compliance@lacra.gov.lr</p>
              <p className="text-sm text-gray-600">Emergency: +231 88 999 0000</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}