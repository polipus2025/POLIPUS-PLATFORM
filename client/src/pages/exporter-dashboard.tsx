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
  const [isReportAbuseOpen, setIsReportAbuseOpen] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState('');
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
      // EU & European Standards
      eudrCompliant: formData.get('eudrCompliant') === 'on',
      euOrganicCert: formData.get('euOrganicCert') === 'on',
      globalGapCert: formData.get('globalGapCert') === 'on',
      brcCert: formData.get('brcCert') === 'on',
      // US Standards
      usdaOrganicCert: formData.get('usdaOrganicCert') === 'on',
      fdaFoodSafety: formData.get('fdaFoodSafety') === 'on',
      sqfCert: formData.get('sqfCert') === 'on',
      // Fair Trade & Sustainability
      fairTradeUSA: formData.get('fairTradeUSA') === 'on',
      fairTradeIntl: formData.get('fairTradeIntl') === 'on',
      rainforestAlliance: formData.get('rainforestAlliance') === 'on',
      utzCert: formData.get('utzCert') === 'on',
      // Crop-Specific
      sca4C: formData.get('sca4C') === 'on',
      icoCoffee: formData.get('icoCoffee') === 'on',
      iccoCocoa: formData.get('iccoCocoa') === 'on',
      rspopalm: formData.get('rspopalm') === 'on',
      fscTimber: formData.get('fscTimber') === 'on',
      pefc: formData.get('pefc') === 'on',
      cashewQuality: formData.get('cashewQuality') === 'on',
      riceQuality: formData.get('riceQuality') === 'on',
      // Conventional Crops
      gmpStandards: formData.get('gmpStandards') === 'on',
      gapStandards: formData.get('gapStandards') === 'on',
      ippmStandards: formData.get('ippmStandards') === 'on',
      traceabilitySystem: formData.get('traceabilitySystem') === 'on',
      residueCompliance: formData.get('residueCompliance') === 'on',
      phytosanitaryCert: formData.get('phytosanitaryCert') === 'on',
      gradeStandards: formData.get('gradeStandards') === 'on',
      moistureContent: formData.get('moistureContent') === 'on',
      // Quality & Safety
      iso22000: formData.get('iso22000') === 'on',
      haccp: formData.get('haccp') === 'on',
      ifs: formData.get('ifs') === 'on',
      kosherCert: formData.get('kosherCert') === 'on',
      halalCert: formData.get('halalCert') === 'on',
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

  const handleReportAbuse = (formData: FormData) => {
    const reportData = {
      reportType: formData.get('reportType') as string,
      incidentDate: formData.get('incidentDate') as string,
      location: formData.get('location') as string,
      county: formData.get('county') as string,
      personsInvolved: formData.get('personsInvolved') as string,
      organization: formData.get('organization') as string,
      description: formData.get('description') as string,
      evidence: formData.get('evidence') as string,
      contactMethod: formData.get('contactMethod') as string,
      contactInfo: formData.get('contactInfo') as string,
    };

    toast({
      title: 'Anonymous Report Submitted',
      description: 'Your report has been securely submitted to LACRA\'s Anti-Corruption Unit. All reports are treated confidentially and investigated thoroughly. Reference: ABU-2025-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    });
    
    setIsReportAbuseOpen(false);
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
            
            {/* Report Abuse Button */}
            <Dialog open={isReportAbuseOpen} onOpenChange={setIsReportAbuseOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg font-semibold shadow-lg">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Report Abuse
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Anonymous Abuse Report System
                  </DialogTitle>
                </DialogHeader>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleReportAbuse(formData);
                  }} 
                  className="space-y-6"
                >
                  {/* Anonymity Notice */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800">Confidential Reporting</h4>
                        <p className="text-sm text-red-700 mt-1">
                          This is an anonymous reporting system for corruption, bribery, illegal activities, and regulatory violations. 
                          Your identity will be protected. All reports are investigated by LACRA's Anti-Corruption Unit.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Report Type */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Report Type</h3>
                    <div>
                      <Label htmlFor="reportType">Type of Abuse/Illegal Activity *</Label>
                      <Select name="reportType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bribery">Bribery/Corruption</SelectItem>
                          <SelectItem value="fraud">Document Fraud</SelectItem>
                          <SelectItem value="illegal_export">Illegal Export Activities</SelectItem>
                          <SelectItem value="license_violation">License Violations</SelectItem>
                          <SelectItem value="quality_fraud">Quality/Grade Fraud</SelectItem>
                          <SelectItem value="tax_evasion">Tax Evasion</SelectItem>
                          <SelectItem value="environmental">Environmental Violations</SelectItem>
                          <SelectItem value="labor_abuse">Labor Abuse</SelectItem>
                          <SelectItem value="other">Other Illegal Activity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Incident Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Incident Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="incidentDate">Incident Date</Label>
                        <Input 
                          id="incidentDate" 
                          name="incidentDate"
                          type="date"
                          max={new Date().toISOString().split('T')[0]}
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
                      <Label htmlFor="location">Specific Location</Label>
                      <Input 
                        id="location" 
                        name="location"
                        placeholder="e.g., LACRA Office Monrovia, Port of Monrovia, Processing Plant Name"
                      />
                    </div>
                  </div>

                  {/* Persons/Organizations Involved */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Persons/Organizations Involved</h3>
                    <div>
                      <Label htmlFor="personsInvolved">Names of Individuals (if known)</Label>
                      <Textarea 
                        id="personsInvolved" 
                        name="personsInvolved"
                        placeholder="Names, positions, or descriptions of persons involved in the illegal activity"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization/Company</Label>
                      <Input 
                        id="organization" 
                        name="organization"
                        placeholder="Name of company, government agency, or organization"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea 
                      id="description" 
                      name="description"
                      placeholder="Provide detailed description of the illegal activity, including what happened, when, how much money was involved (if applicable), witnesses present, etc."
                      rows={4}
                      required
                    />
                  </div>

                  {/* Evidence */}
                  <div>
                    <Label htmlFor="evidence">Evidence Available</Label>
                    <Textarea 
                      id="evidence" 
                      name="evidence"
                      placeholder="Describe any evidence you have (documents, photos, recordings, receipts, witness contacts). Do not upload files - just describe what evidence exists."
                      rows={3}
                    />
                  </div>

                  {/* Contact Method (Optional) */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information (Optional)</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        Providing contact information is optional but helps investigators follow up for additional details if needed. Your identity remains confidential.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactMethod">Preferred Contact Method</Label>
                        <Select name="contactMethod">
                          <SelectTrigger>
                            <SelectValue placeholder="Select contact method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="anonymous">Remain Anonymous</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="contactInfo">Contact Information</Label>
                        <Input 
                          id="contactInfo" 
                          name="contactInfo"
                          placeholder="Phone number or email (optional)"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsReportAbuseOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      Submit Anonymous Report
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
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
                            <SelectItem value="peanuts">Peanuts</SelectItem>
                            <SelectItem value="sesame">Sesame Seeds</SelectItem>
                            <SelectItem value="plantain">Plantain</SelectItem>
                            <SelectItem value="sweet_potato">Sweet Potato</SelectItem>
                            <SelectItem value="yam">Yam</SelectItem>
                            <SelectItem value="ginger">Ginger</SelectItem>
                            <SelectItem value="turmeric">Turmeric</SelectItem>
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
                        <Select 
                          name="commodityType" 
                          required 
                          onValueChange={setSelectedCommodity}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select commodity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="coffee">Coffee</SelectItem>
                            <SelectItem value="cocoa">Cocoa</SelectItem>
                            <SelectItem value="rubber">Rubber</SelectItem>
                            <SelectItem value="palm_oil">Palm Oil</SelectItem>
                            <SelectItem value="timber">Timber</SelectItem>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="cassava">Cassava</SelectItem>
                            <SelectItem value="cashew">Cashew</SelectItem>
                            <SelectItem value="peanuts">Peanuts</SelectItem>
                            <SelectItem value="sesame">Sesame Seeds</SelectItem>
                            <SelectItem value="plantain">Plantain</SelectItem>
                            <SelectItem value="sweet_potato">Sweet Potato</SelectItem>
                            <SelectItem value="yam">Yam</SelectItem>
                            <SelectItem value="ginger">Ginger</SelectItem>
                            <SelectItem value="turmeric">Turmeric</SelectItem>
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

                  {/* Compliance & Certifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">International Compliance & Certifications</h3>
                    {selectedCommodity && (
                      <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                        Showing certifications relevant for: <strong>{selectedCommodity.charAt(0).toUpperCase() + selectedCommodity.slice(1).replace('_', ' ')}</strong>
                      </p>
                    )}
                    
                    {/* Conventional Crops Standards - Always Available */}
                    <div className="space-y-3">
                      <h4 className="text-md font-medium text-gray-700">Conventional Crops Standards (Available for all crops)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="gmpStandards" className="rounded" />
                          <span>Good Manufacturing Practices (GMP)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="gapStandards" className="rounded" />
                          <span>Good Agricultural Practices (GAP)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="ippmStandards" className="rounded" />
                          <span>Integrated Pest Management (IPM)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="traceabilitySystem" className="rounded" />
                          <span>Traceability System Compliance</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="residueCompliance" className="rounded" />
                          <span>Maximum Residue Limits (MRL)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="phytosanitaryCert" className="rounded" />
                          <span>Phytosanitary Certification</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="gradeStandards" className="rounded" />
                          <span>International Grade Standards</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="moistureContent" className="rounded" />
                          <span>Moisture Content Standards</span>
                        </label>
                      </div>
                    </div>

                    {/* EU & European Standards */}
                    {(selectedCommodity === 'coffee' || selectedCommodity === 'cocoa' || selectedCommodity === 'palm_oil' || selectedCommodity === 'timber') && (
                      <div className="space-y-3">
                        <h4 className="text-md font-medium text-gray-700">EU & European Standards</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="eudrCompliant" className="rounded" />
                            <span>EU Deforestation Regulation (EUDR)</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="euOrganicCert" className="rounded" />
                            <span>EU Organic Certification</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="globalGapCert" className="rounded" />
                            <span>GLOBALG.A.P. Certification</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="brcCert" className="rounded" />
                            <span>BRC Global Standards</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* US Standards */}
                    {(selectedCommodity === 'coffee' || selectedCommodity === 'cocoa' || selectedCommodity === 'rice' || selectedCommodity === 'cashew' || selectedCommodity === 'peanuts') && (
                      <div className="space-y-3">
                        <h4 className="text-md font-medium text-gray-700">US Standards</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="usdaOrganicCert" className="rounded" />
                            <span>USDA Organic Certification</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="fdaFoodSafety" className="rounded" />
                            <span>FDA Food Safety Standards</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="sqfCert" className="rounded" />
                            <span>SQF (Safe Quality Food)</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Fair Trade & Sustainability */}
                    {(selectedCommodity === 'coffee' || selectedCommodity === 'cocoa' || selectedCommodity === 'cashew') && (
                      <div className="space-y-3">
                        <h4 className="text-md font-medium text-gray-700">Fair Trade & Sustainability</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="fairTradeUSA" className="rounded" />
                            <span>Fairtrade USA</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="fairTradeIntl" className="rounded" />
                            <span>Fairtrade International</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="rainforestAlliance" className="rounded" />
                            <span>Rainforest Alliance</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="utzCert" className="rounded" />
                            <span>UTZ Certification</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Crop-Specific Certifications */}
                    {selectedCommodity && (
                      <div className="space-y-3">
                        <h4 className="text-md font-medium text-gray-700">Crop-Specific International Standards</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedCommodity === 'coffee' && (
                            <>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" name="sca4C" className="rounded" />
                                <span>4C Coffee Certification</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" name="icoCoffee" className="rounded" />
                                <span>ICO Coffee Quality Standards</span>
                              </label>
                            </>
                          )}
                          {selectedCommodity === 'cocoa' && (
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" name="iccoCocoa" className="rounded" />
                              <span>ICCO Cocoa Standards</span>
                            </label>
                          )}
                          {selectedCommodity === 'palm_oil' && (
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" name="rspopalm" className="rounded" />
                              <span>RSPO Palm Oil Certification</span>
                            </label>
                          )}
                          {selectedCommodity === 'timber' && (
                            <>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" name="fscTimber" className="rounded" />
                                <span>FSC Forest Certification</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" name="pefc" className="rounded" />
                                <span>PEFC Forest Certification</span>
                              </label>
                            </>
                          )}
                          {selectedCommodity === 'cashew' && (
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" name="cashewQuality" className="rounded" />
                              <span>INC Cashew Quality Standards</span>
                            </label>
                          )}
                          {selectedCommodity === 'rice' && (
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" name="riceQuality" className="rounded" />
                              <span>IRC Rice Quality Standards</span>
                            </label>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quality & Safety Standards */}
                    {selectedCommodity && (
                      <div className="space-y-3">
                        <h4 className="text-md font-medium text-gray-700">Quality & Safety Standards</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="iso22000" className="rounded" />
                            <span>ISO 22000 Food Safety</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="haccp" className="rounded" />
                            <span>HACCP Certification</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="ifs" className="rounded" />
                            <span>IFS Food Standards</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="kosherCert" className="rounded" />
                            <span>Kosher Certification</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" name="halalCert" className="rounded" />
                            <span>Halal Certification</span>
                          </label>
                        </div>
                      </div>
                    )}
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