import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  FileCheck, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Ship, 
  FileText, 
  Globe, 
  Shield, 
  Leaf,
  TreePine,
  Award,
  Building2,
  Calendar,
  DollarSign,
  Scale,
  MapPin,
  Clock,
  Users,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import lacraLogo from '@assets/LACRA LOGO_1753406166355.jpg';

const COMMODITIES = [
  'Cocoa', 'Coffee', 'Rubber', 'Palm Oil', 'Rice', 'Cassava', 'Plantain', 
  'Yam', 'Sweet Potato', 'Ginger', 'Turmeric', 'Black Pepper', 'Kola Nut',
  'Cashew', 'Sesame', 'Peanuts', 'Soybeans', 'Maize', 'Millet', 'Sorghum'
];

const DESTINATION_COUNTRIES = [
  'United States', 'Netherlands', 'Germany', 'Belgium', 'France', 'United Kingdom',
  'Italy', 'Spain', 'Canada', 'Japan', 'South Korea', 'China', 'India',
  'Ghana', 'Côte d\'Ivoire', 'Nigeria', 'Senegal', 'Guinea', 'Sierra Leone'
];

const CERTIFICATE_TYPES = [
  {
    id: 'phytosanitary',
    name: 'Phytosanitary Certificate',
    description: 'Plant health certification for agricultural exports',
    icon: Leaf,
    required: true,
    authority: 'Ministry of Agriculture',
    color: 'text-green-600'
  },
  {
    id: 'quality_control',
    name: 'Quality Control Certificate',
    description: 'Product quality and safety verification',
    icon: Award,
    required: true,
    authority: 'LACRA Quality Assurance',
    color: 'text-blue-600'
  },
  {
    id: 'certificate_origin',
    name: 'Certificate of Origin',
    description: 'Official document certifying product origin',
    icon: MapPin,
    required: true,
    authority: 'Liberia Chamber of Commerce',
    color: 'text-purple-600'
  },
  {
    id: 'eudr_certificate',
    name: 'EUDR Compliance Certificate',
    description: 'EU Deforestation Regulation compliance',
    icon: TreePine,
    required: false,
    authority: 'LACRA Environmental Unit',
    color: 'text-emerald-600'
  },
  {
    id: 'deforestation_certificate',
    name: 'Deforestation-Free Certificate',
    description: 'Zero deforestation supply chain verification',
    icon: Shield,
    required: false,
    authority: 'Forestry Development Authority',
    color: 'text-teal-600'
  },
  {
    id: 'organic_certificate',
    name: 'Organic Certification',
    description: 'Organic farming and processing certification',
    icon: Leaf,
    required: false,
    authority: 'International Organic Certifier',
    color: 'text-lime-600'
  },
  {
    id: 'fair_trade_certificate',
    name: 'Fair Trade Certificate',
    description: 'Fair trade compliance certification',
    icon: Users,
    required: false,
    authority: 'Fair Trade International',
    color: 'text-orange-600'
  },
  {
    id: 'halal_certificate',
    name: 'Halal Certificate',
    description: 'Islamic dietary compliance certification',
    icon: Award,
    required: false,
    authority: 'Islamic Certification Body',
    color: 'text-indigo-600'
  },
  {
    id: 'kosher_certificate',
    name: 'Kosher Certificate',
    description: 'Jewish dietary compliance certification',
    icon: Award,
    required: false,
    authority: 'Kosher Certification Authority',
    color: 'text-blue-700'
  },
  {
    id: 'gmp_certificate',
    name: 'Good Manufacturing Practices (GMP)',
    description: 'Manufacturing quality system certification',
    icon: Building2,
    required: false,
    authority: 'Manufacturing Standards Board',
    color: 'text-gray-600'
  },
  {
    id: 'haccp_certificate',
    name: 'HACCP Certificate',
    description: 'Hazard Analysis and Critical Control Points',
    icon: Shield,
    required: false,
    authority: 'Food Safety Authority',
    color: 'text-red-600'
  },
  {
    id: 'iso_certificate',
    name: 'ISO 22000 Certificate',
    description: 'Food safety management system',
    icon: Award,
    required: false,
    authority: 'ISO Certification Body',
    color: 'text-violet-600'
  }
];

const exportPermitSchema = z.object({
  exporterName: z.string().min(1, 'Exporter name is required'),
  exporterLicense: z.string().min(1, 'Export license number is required'),
  commodity: z.string().min(1, 'Commodity selection is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  unit: z.string().min(1, 'Unit is required'),
  estimatedValue: z.string().min(1, 'Estimated value is required'),
  destinationCountry: z.string().min(1, 'Destination country is required'),
  destinationPort: z.string().min(1, 'Destination port is required'),
  exportDate: z.string().min(1, 'Expected export date is required'),
  transportMethod: z.string().min(1, 'Transport method is required'),
  specialInstructions: z.string().optional(),
});

type ExportPermitForm = z.infer<typeof exportPermitSchema>;

export default function ExportPermitSubmission() {
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ExportPermitForm>({
    resolver: zodResolver(exportPermitSchema),
    defaultValues: {
      exporterName: '',
      exporterLicense: '',
      commodity: '',
      quantity: '',
      unit: 'tonnes',
      estimatedValue: '',
      destinationCountry: '',
      destinationPort: '',
      exportDate: '',
      transportMethod: 'sea_freight',
      specialInstructions: '',
    },
  });

  const handleCertificateToggle = (certificateId: string) => {
    setSelectedCertificates(prev => 
      prev.includes(certificateId) 
        ? prev.filter(id => id !== certificateId)
        : [...prev, certificateId]
    );
  };

  const handleFileUpload = (certificateId: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [certificateId]: file }));
    toast({
      title: 'File Uploaded',
      description: `${file.name} uploaded successfully`,
    });
  };

  const removeFile = (certificateId: string) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[certificateId];
      return updated;
    });
  };

  const onSubmit = async (data: ExportPermitForm) => {
    setIsSubmitting(true);
    setSubmissionProgress(0);

    try {
      // Simulate submission progress
      const progressInterval = setInterval(() => {
        setSubmissionProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Prepare submission data
      const submissionData = {
        ...data,
        certificates: selectedCertificates,
        attachments: Object.keys(uploadedFiles),
        submissionDate: new Date().toISOString(),
        status: 'pending_review'
      };

      // Submit to API
      const response = await apiRequest('/api/export-permits', {
        method: 'POST',
        body: JSON.stringify(submissionData)
      });

      clearInterval(progressInterval);
      setSubmissionProgress(100);

      setTimeout(() => {
        setShowSuccess(true);
        setIsSubmitting(false);
        toast({
          title: 'Export Permit Submitted',
          description: 'Your export permit application has been submitted successfully',
        });
      }, 500);

    } catch (error: any) {
      setIsSubmitting(false);
      setSubmissionProgress(0);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit export permit application',
        variant: 'destructive',
      });
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-500 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-green-700">
              Export Permit Submitted Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-gray-600">
              Your export permit application has been submitted to LACRA for review.
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-medium text-green-800">Application Reference: EXP-{Date.now()}</p>
              <p className="text-sm text-green-600 mt-1">
                You will receive email notifications about the status of your application.
              </p>
            </div>
            <div className="flex gap-4 justify-center mt-6">
              <Button 
                onClick={() => window.location.href = '/exporter-dashboard'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowSuccess(false);
                  form.reset();
                  setSelectedCertificates([]);
                  setUploadedFiles({});
                }}
              >
                Submit Another Permit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Helmet>
        <title>Export Permit Submission - AgriTrace360™ LACRA</title>
        <meta name="description" content="Submit export permit applications with comprehensive certificate attachments" />
      </Helmet>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden">
                <img 
                  src={lacraLogo} 
                  alt="LACRA Official Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Export Permit Submission</h1>
                <p className="text-sm text-gray-600">LACRA - Liberia Agriculture Commodity Regulatory Authority</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/exporter-dashboard'}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {isSubmitting && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-center justify-between">
                <span>Submitting export permit application...</span>
                <span className="font-medium">{submissionProgress}%</span>
              </div>
              <Progress value={submissionProgress} className="mt-2" />
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Export Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-purple-600" />
                Export Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="exporterName">Exporter Company Name</Label>
                <Input 
                  id="exporterName" 
                  {...form.register('exporterName')}
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <Label htmlFor="exporterLicense">Export License Number</Label>
                <Input 
                  id="exporterLicense" 
                  {...form.register('exporterLicense')}
                  placeholder="EXP-2024-XXX"
                />
              </div>

              <div>
                <Label htmlFor="commodity">Commodity</Label>
                <Select onValueChange={(value) => form.setValue('commodity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMODITIES.map((commodity) => (
                      <SelectItem key={commodity} value={commodity}>
                        {commodity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    {...form.register('quantity')}
                    placeholder="0"
                    type="number"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select onValueChange={(value) => form.setValue('unit', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tonnes">Tonnes</SelectItem>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="containers">Containers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="estimatedValue">Estimated Value (USD)</Label>
                <Input 
                  id="estimatedValue" 
                  {...form.register('estimatedValue')}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="destinationCountry">Destination Country</Label>
                <Select onValueChange={(value) => form.setValue('destinationCountry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {DESTINATION_COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="destinationPort">Destination Port</Label>
                <Input 
                  id="destinationPort" 
                  {...form.register('destinationPort')}
                  placeholder="Port name"
                />
              </div>

              <div>
                <Label htmlFor="exportDate">Expected Export Date</Label>
                <Input 
                  id="exportDate" 
                  {...form.register('exportDate')}
                  type="date"
                />
              </div>

              <div>
                <Label htmlFor="transportMethod">Transport Method</Label>
                <Select onValueChange={(value) => form.setValue('transportMethod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sea_freight">Sea Freight</SelectItem>
                    <SelectItem value="air_freight">Air Freight</SelectItem>
                    <SelectItem value="land_transport">Land Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea 
                  id="specialInstructions" 
                  {...form.register('specialInstructions')}
                  placeholder="Any special handling or shipping instructions"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Certificate Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-purple-600" />
                Certificate Attachments
              </CardTitle>
              <p className="text-sm text-gray-600">
                Select and upload all required certificates for your export permit application
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {CERTIFICATE_TYPES.map((cert) => {
                  const IconComponent = cert.icon;
                  const isSelected = selectedCertificates.includes(cert.id);
                  const hasFile = uploadedFiles[cert.id];

                  return (
                    <div key={cert.id} className={`border rounded-lg p-4 transition-all ${
                      isSelected ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleCertificateToggle(cert.id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className={`h-5 w-5 ${cert.color}`} />
                            <span className="font-medium">{cert.name}</span>
                            {cert.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{cert.description}</p>
                          <p className="text-xs text-gray-500">Issued by: {cert.authority}</p>
                          
                          {isSelected && (
                            <div className="mt-3">
                              {!hasFile ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600 mb-2">Upload {cert.name}</p>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleFileUpload(cert.id, file);
                                    }}
                                    className="text-sm"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-3">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">
                                      {hasFile.name}
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(cert.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Alert className="mt-6 border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Note:</strong> Required certificates must be uploaded for permit approval. 
                  Additional certificates may improve processing speed and compliance verification.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Ready to Submit?</h3>
                  <p className="text-sm text-gray-600">
                    {selectedCertificates.length} certificates selected, 
                    {Object.keys(uploadedFiles).length} files uploaded
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700 px-8"
                  disabled={isSubmitting || selectedCertificates.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4 mr-2" />
                      Submit Export Permit
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}