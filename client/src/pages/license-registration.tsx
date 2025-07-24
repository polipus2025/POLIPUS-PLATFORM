import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, FileText, Building, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const LIBERIAN_COUNTIES = [
  'Bomi', 'Bong', 'Gbarpolu', 'Grand Bassa', 'Grand Cape Mount', 'Grand Gedeh', 
  'Grand Kru', 'Lofa', 'Margibi', 'Maryland', 'Montserrado', 'Nimba', 
  'River Cess', 'River Gee', 'Sinoe'
];

const COMMODITY_TYPES = [
  'Coffee', 'Cocoa', 'Rubber', 'Palm Oil', 'Rice', 'Cassava', 'Sugar Cane',
  'Plantain', 'Banana', 'Ginger', 'Pepper', 'Timber', 'Gold', 'Iron Ore',
  'Diamond', 'Fish', 'Livestock', 'Poultry', 'Vegetables', 'Fruits'
];

export default function LicenseRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    businessRegistrationNumber: '',
    taxIdentificationNumber: '',
    licenseNumber: '',
    
    // Contact Information
    contactPerson: '',
    phoneNumber: '',
    emailAddress: '',
    physicalAddress: '',
    county: '',
    
    // Business Details
    primaryCommodities: [] as string[],
    businessType: '',
    operatingYears: '',
    employeeCount: '',
    
    // License Details
    licenseType: '',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    issuingAuthority: '',
    
    // Additional Information
    bankName: '',
    accountNumber: '',
    additionalNotes: ''
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('/api/license/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: 'Registration Successful',
        description: 'Your license registration has been submitted for review.',
      });
      setLocation('/exporter-login');
    },
    onError: (error: any) => {
      setError(error.message || 'Registration failed. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.companyName || !formData.licenseNumber || !formData.contactPerson) {
      setError('Please fill in all required fields');
      return;
    }
    
    registrationMutation.mutate(formData);
  };

  const handleCommodityChange = (commodity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      primaryCommodities: checked 
        ? [...prev.primaryCommodities, commodity]
        : prev.primaryCommodities.filter(c => c !== commodity)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <Helmet>
        <title>Export License Registration - AgriTrace360™</title>
        <meta name="description" content="Register your export license for agricultural commodity trading in Liberia" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <FileText className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Export License Registration
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Register your agricultural commodity export license with LACRA
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Company Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Export License Number *</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      placeholder="EXP-YYYY-XXX"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessRegistrationNumber">Business Registration Number</Label>
                    <Input
                      id="businessRegistrationNumber"
                      value={formData.businessRegistrationNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessRegistrationNumber: e.target.value }))}
                      placeholder="BR-YYYY-XXXX"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="taxIdentificationNumber">Tax ID Number</Label>
                    <Input
                      id="taxIdentificationNumber"
                      value={formData.taxIdentificationNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, taxIdentificationNumber: e.target.value }))}
                      placeholder="TIN-XXXXXXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                      placeholder="Full name of contact person"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+231-XX-XXX-XXXX"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, emailAddress: e.target.value }))}
                      placeholder="company@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Select value={formData.county} onValueChange={(value) => setFormData(prev => ({ ...prev, county: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {LIBERIAN_COUNTIES.map((county) => (
                          <SelectItem key={county} value={county}>{county}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="physicalAddress">Physical Address</Label>
                  <Textarea
                    id="physicalAddress"
                    value={formData.physicalAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, physicalAddress: e.target.value }))}
                    placeholder="Complete physical address"
                    rows={3}
                  />
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Business Details</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary Commodities (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border border-gray-200 rounded-lg">
                      {COMMODITY_TYPES.map((commodity) => (
                        <label key={commodity} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.primaryCommodities.includes(commodity)}
                            onChange={(e) => handleCommodityChange(commodity, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{commodity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="corporation">Corporation</SelectItem>
                          <SelectItem value="cooperative">Cooperative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="operatingYears">Years in Operation</Label>
                      <Input
                        id="operatingYears"
                        type="number"
                        value={formData.operatingYears}
                        onChange={(e) => setFormData(prev => ({ ...prev, operatingYears: e.target.value }))}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="employeeCount">Number of Employees</Label>
                      <Input
                        id="employeeCount"
                        type="number"
                        value={formData.employeeCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, employeeCount: e.target.value }))}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* License Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">License Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseType">License Type</Label>
                    <Select value={formData.licenseType} onValueChange={(value) => setFormData(prev => ({ ...prev, licenseType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select license type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agricultural-export">Agricultural Export License</SelectItem>
                        <SelectItem value="general-export">General Export License</SelectItem>
                        <SelectItem value="special-export">Special Export License</SelectItem>
                        <SelectItem value="temporary-export">Temporary Export License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                    <Input
                      id="issuingAuthority"
                      value={formData.issuingAuthority}
                      onChange={(e) => setFormData(prev => ({ ...prev, issuingAuthority: e.target.value }))}
                      placeholder="LACRA / Ministry of Commerce"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licenseIssueDate">License Issue Date</Label>
                    <Input
                      id="licenseIssueDate"
                      type="date"
                      value={formData.licenseIssueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseIssueDate: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
                    <Input
                      id="licenseExpiryDate"
                      type="date"
                      value={formData.licenseExpiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiryDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Banking Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <Mail className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Banking Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                      placeholder="Name of banking institution"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                      placeholder="Bank account number"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  placeholder="Any additional information or special requirements"
                  rows={4}
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/exporter-login')}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
                
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                  disabled={registrationMutation.isPending}
                >
                  {registrationMutation.isPending ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}