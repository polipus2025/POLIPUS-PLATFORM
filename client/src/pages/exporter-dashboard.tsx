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
  Globe,
  ClipboardCheck,
  MapPin,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ExporterDashboard() {
  const [isExportApplicationOpen, setIsExportApplicationOpen] = useState(false);
  const [isInspectionRequestOpen, setIsInspectionRequestOpen] = useState(false);
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
      plannedExportDate: formData.get('plannedExportDate') as string,
      exportTimeframe: formData.get('exportTimeframe') as string,
      exportUrgency: formData.get('exportUrgency') as string,
      eudrCompliant: formData.get('eudrCompliant') === 'on',
      organicCertified: formData.get('organicCertified') === 'on',
      fairTrade: formData.get('fairTrade') === 'on',
      applicationNotes: formData.get('applicationNotes') as string,
    };

    const plannedDate = new Date(applicationData.plannedExportDate).toLocaleDateString();
    const timeframe = applicationData.exportTimeframe;
    
    toast({
      title: 'Application Submitted to LACRA',
      description: `Your export license application has been successfully submitted to LACRA for official review and approval. Planned export: ${plannedDate} (${timeframe}). You will receive confirmation within 5-7 business days.`,
    });
    
    setIsExportApplicationOpen(false);
  };

  const handleSubmitInspectionRequest = (formData: FormData) => {
    const inspectionData = {
      facilityName: formData.get('facilityName') as string,
      facilityAddress: formData.get('facilityAddress') as string,
      county: formData.get('county') as string,
      commodityType: formData.get('commodityType') as string,
      quantity: formData.get('quantity') as string,
      preferredDate: formData.get('preferredDate') as string,
      contactPerson: formData.get('contactPerson') as string,
      contactPhone: formData.get('contactPhone') as string,
      urgencyLevel: formData.get('urgencyLevel') as string,
      inspectionNotes: formData.get('inspectionNotes') as string,
    };

    toast({
      title: 'Inspection Request Submitted to LACRA',
      description: 'Your inspection request has been submitted to LACRA. A LACRA officer will be assigned and will contact you within 2-3 business days to schedule the inspection.',
    });
    
    setIsInspectionRequestOpen(false);
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
            {/* Request Inspection Button */}
            <Dialog open={isInspectionRequestOpen} onOpenChange={setIsInspectionRequestOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-semibold shadow-lg">
                  <ClipboardCheck className="h-5 w-5 mr-2" />
                  Request LACRA Inspection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-blue-600" />
                    Request LACRA Officer Inspection
                  </DialogTitle>
                </DialogHeader>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSubmitInspectionRequest(formData);
                  }} 
                  className="space-y-6"
                >
                  {/* Facility Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Facility Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="facilityName">Facility/Farm Name *</Label>
                        <Input 
                          id="facilityName" 
                          name="facilityName"
                          placeholder="e.g., Liberia Agri Processing Plant"
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="county">County *</Label>
                        <Select name="county" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select county" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="montserrado">Montserrado</SelectItem>
                            <SelectItem value="margibi">Margibi</SelectItem>
                            <SelectItem value="bong">Bong</SelectItem>
                            <SelectItem value="lofa">Lofa</SelectItem>
                            <SelectItem value="nimba">Nimba</SelectItem>
                            <SelectItem value="grand_bassa">Grand Bassa</SelectItem>
                            <SelectItem value="sinoe">Sinoe</SelectItem>
                            <SelectItem value="rivercess">River Cess</SelectItem>
                            <SelectItem value="grand_gedeh">Grand Gedeh</SelectItem>
                            <SelectItem value="maryland">Maryland</SelectItem>
                            <SelectItem value="river_gee">River Gee</SelectItem>
                            <SelectItem value="grand_cape_mount">Grand Cape Mount</SelectItem>
                            <SelectItem value="gbarpolu">Gbarpolu</SelectItem>
                            <SelectItem value="bomi">Bomi</SelectItem>
                            <SelectItem value="grand_kru">Grand Kru</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="facilityAddress">Complete Address *</Label>
                      <Textarea 
                        id="facilityAddress" 
                        name="facilityAddress"
                        placeholder="Provide detailed address, landmarks, and GPS coordinates if available"
                        rows={2}
                        required 
                      />
                    </div>
                  </div>

                  {/* Crop/Commodity Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Crop/Commodity Details</h3>
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
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="cassava">Cassava</SelectItem>
                            <SelectItem value="cashew">Cashew</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="quantity">Estimated Quantity (MT) *</Label>
                        <Input 
                          id="quantity" 
                          name="quantity"
                          placeholder="e.g., 100"
                          type="number"
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inspection Schedule */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Inspection Schedule</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preferredDate">Preferred Inspection Date *</Label>
                        <Input 
                          id="preferredDate" 
                          name="preferredDate"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="urgencyLevel">Urgency Level *</Label>
                        <Select name="urgencyLevel" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Routine (5-7 days)</SelectItem>
                            <SelectItem value="priority">Priority (2-3 days)</SelectItem>
                            <SelectItem value="urgent">Urgent (Next day)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input 
                          id="contactPerson" 
                          name="contactPerson"
                          defaultValue="Marcus Bawah"
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone">Phone Number *</Label>
                        <Input 
                          id="contactPhone" 
                          name="contactPhone"
                          placeholder="+231 77 123 4567"
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="inspectionNotes">Additional Notes</Label>
                    <Textarea 
                      id="inspectionNotes" 
                      name="inspectionNotes"
                      placeholder="Any special requirements, access instructions, or additional information for the LACRA inspector..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsInspectionRequestOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Submit Inspection Request
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

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

                  {/* Export Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Export Timeline</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="plannedExportDate">Planned Export Date *</Label>
                        <Input 
                          id="plannedExportDate" 
                          name="plannedExportDate"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                          required 
                        />
                        <p className="text-xs text-gray-500 mt-1">Select date within 1-90 days from today</p>
                      </div>
                      <div>
                        <Label htmlFor="exportTimeframe">Export Timeframe *</Label>
                        <Select name="exportTimeframe" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-7">Within 1-7 days</SelectItem>
                            <SelectItem value="8-14">Within 8-14 days</SelectItem>
                            <SelectItem value="15-30">Within 15-30 days</SelectItem>
                            <SelectItem value="31-60">Within 31-60 days</SelectItem>
                            <SelectItem value="61-90">Within 61-90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="exportUrgency">Export Urgency Level *</Label>
                      <Select name="exportUrgency" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine - Standard processing time</SelectItem>
                          <SelectItem value="priority">Priority - Expedited processing needed</SelectItem>
                          <SelectItem value="urgent">Urgent - Immediate processing required</SelectItem>
                        </SelectContent>
                      </Select>
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

      {/* LACRA Services Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <ClipboardCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Request LACRA Inspection
                </h3>
                <p className="text-blue-700 mb-3">
                  Request a LACRA officer to inspect your crops and facilities. Required for export certification.
                </p>
                <div className="text-sm text-blue-600">
                  <strong>Response time:</strong> 2-3 business days for assignment
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Submit Export Applications
                </h3>
                <p className="text-green-700 mb-3">
                  Submit export license requests for official LACRA review and approval.
                </p>
                <div className="text-sm text-green-600">
                  <strong>Processing time:</strong> 5-7 business days
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* Recent LACRA Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Inspection Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
              Recent Inspection Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Coffee Processing Facility</h4>
                  <p className="text-sm text-gray-600">Request #INS-2025-001 • Lofa County</p>
                  <p className="text-xs text-gray-500">Submitted: January 22, 2025</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-100 text-blue-800">Officer Assigned</Badge>
                  <p className="text-xs text-gray-500 mt-1">Officer: Sarah Konneh</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Cocoa Storage Warehouse</h4>
                  <p className="text-sm text-gray-600">Request #INS-2025-002 • Margibi County</p>
                  <p className="text-xs text-gray-500">Submitted: January 20, 2025</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  <p className="text-xs text-gray-500 mt-1">Passed inspection</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Export Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Recent Export Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
      </div>

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