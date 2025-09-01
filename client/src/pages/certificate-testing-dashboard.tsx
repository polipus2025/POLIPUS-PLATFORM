import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Download, 
  Eye, 
  TreePine,
  Award,
  Globe,
  CheckCircle,
  Users,
  ShieldCheck,
  MapPin,
  Star,
  FileCheck
} from "lucide-react";

export default function CertificateTestingDashboard() {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('1');
  const [showDownloads, setShowDownloads] = useState<boolean>(false);

  // Test farmers data
  const testFarmers = [
    { id: '1', name: 'John Kollie', location: 'Bong County, Gbarnga' },
    { id: '2', name: 'Mary Togba', location: 'Nimba County, Sanniquellie' },
    { id: '3', name: 'James Varney', location: 'Montserrado County, Careysburg' }
  ];

  const generateCertificates = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    setShowDownloads(true);
  };

  const downloadCertificate = (type: string) => {
    const certificateUrls = {
      'eudr': `/api/test/eudr-certificate/${selectedFarmerId}`,
      'deforestation': `/api/test/deforestation-certificate/${selectedFarmerId}`,
      'phytosanitary': `/api/test/phytosanitary-certificate/${selectedFarmerId}`,
      'origin': `/api/test/origin-certificate/${selectedFarmerId}`,
      'quality': `/api/test/quality-certificate/${selectedFarmerId}`,
      'compliance': `/api/test/compliance-declaration/${selectedFarmerId}`
    };
    
    const url = certificateUrls[type as keyof typeof certificateUrls];
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Award className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">Certificate Testing Dashboard</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Generate and download all 6 professional certificates: EUDR Compliance, Deforestation Analysis, Phytosanitary, Certificate of Origin, Quality Control with Grading, and Comprehensive LACRA & ECOENVIROS Declaration
          </p>
          <Badge variant="outline" className="text-sm px-4 py-2">
            Ready for Testing - Complete 6-Certificate System Available
          </Badge>
        </div>

        {/* Quick Start Instructions */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-blue-900">🚀 Quick Start</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-800 space-y-2">
              <p><strong>Step 1:</strong> Select a test farmer below</p>
              <p><strong>Step 2:</strong> Click "Generate Certificates" button</p>
              <p><strong>Step 3:</strong> Download all 6 certificate types to review comprehensive system</p>
            </div>
          </CardContent>
        </Card>

        {/* Status Alert */}
        {showDownloads && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ Certificates ready! All 6 professional certificates are available for download below - complete certification system ready.
            </AlertDescription>
          </Alert>
        )}

        {/* Certificate Downloads - All 6 Certificates */}
        {showDownloads && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Enhanced EUDR Certificate Card */}
            <Card className="border-blue-200 bg-white shadow-lg">
              <CardHeader className="bg-blue-50">
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg text-blue-900">Enhanced EUDR Certificate</CardTitle>
                    <p className="text-blue-700 text-sm">Cocoa Trade + Supply Chain Graphics</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-sm text-slate-600">
                    <p><strong>NEW:</strong> Cocoa HS codes, quantity specs, beautiful supply chain workflow graphics</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => downloadCertificate('eudr')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      onClick={() => downloadCertificate('eudr')}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deforestation Analysis Card */}
            <Card className="border-green-200 bg-white shadow-lg">
              <CardHeader className="bg-green-50">
                <div className="flex items-center gap-3">
                  <TreePine className="h-8 w-8 text-green-600" />
                  <div>
                    <CardTitle className="text-lg text-green-900">Deforestation Analysis</CardTitle>
                    <p className="text-green-700 text-sm">Environmental Impact Assessment</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-sm text-slate-600">
                    <p><strong>Includes:</strong> 24-month satellite monitoring, forest cover analysis, biodiversity assessment</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => downloadCertificate('deforestation')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      onClick={() => downloadCertificate('deforestation')}
                      variant="outline"
                      size="sm" 
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phytosanitary Certificate Card */}
            <Card className="border-emerald-200 bg-white shadow-lg">
              <CardHeader className="bg-emerald-50">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-emerald-600" />
                  <div>
                    <CardTitle className="text-lg text-emerald-900">Phytosanitary Certificate</CardTitle>
                    <p className="text-emerald-700 text-sm">International Plant Health</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-sm text-slate-600">
                    <p><strong>NEW:</strong> Official plant health declaration, quarantine pest verification, IPPC compliance</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => downloadCertificate('phytosanitary')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      onClick={() => downloadCertificate('phytosanitary')}
                      variant="outline"
                      size="sm"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certificate of Origin Card */}
            <Card className="border-amber-200 bg-white shadow-lg">
              <CardHeader className="bg-amber-50">
                <div className="flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-amber-600" />
                  <div>
                    <CardTitle className="text-lg text-amber-900">Certificate of Origin</CardTitle>
                    <p className="text-amber-700 text-sm">Liberian Origin Verification</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-sm text-slate-600">
                    <p><strong>NEW:</strong> Official Liberian origin declaration, supply chain verification, GPS coordinates</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => downloadCertificate('origin')}
                      className="flex-1 bg-amber-600 hover:bg-amber-700"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      onClick={() => downloadCertificate('origin')}
                      variant="outline"
                      size="sm"
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Control Certificate Card */}
            <Card className="border-red-200 bg-white shadow-lg">
              <CardHeader className="bg-red-50">
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-red-600" />
                  <div>
                    <CardTitle className="text-lg text-red-900">Quality Control Certificate</CardTitle>
                    <p className="text-red-700 text-sm">Premium Grading System</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-sm text-slate-600">
                    <p><strong>NEW:</strong> Comprehensive grading system, quality parameters, Grade I certification</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => downloadCertificate('quality')}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      onClick={() => downloadCertificate('quality')}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comprehensive Compliance Declaration Card */}
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader className="bg-slate-50">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-8 w-8 text-slate-600" />
                  <div>
                    <CardTitle className="text-lg text-slate-900">Comprehensive Declaration</CardTitle>
                    <p className="text-slate-700 text-sm">LACRA & ECOENVIROS Master</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-sm text-slate-600">
                    <p><strong>NEW:</strong> Master compliance declaration covering ALL certification activities comprehensively</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => downloadCertificate('compliance')}
                      className="flex-1 bg-slate-600 hover:bg-slate-700"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      onClick={() => downloadCertificate('compliance')}
                      variant="outline"
                      size="sm"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Farmer Selection */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-slate-600" />
              <CardTitle className="text-xl">Select Test Farmer & Generate Certificates</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-slate-600 mb-6">
              <p>Choose a farmer profile to generate certificates with realistic simulation data including GPS coordinates, farm details, and compliance assessments.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {testFarmers.map((farmer) => (
                <Card key={farmer.id} className="border-slate-200 hover:border-blue-300 transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-lg">{farmer.name}</h4>
                        <p className="text-sm text-slate-600">{farmer.location}</p>
                        <Badge variant="secondary" className="mt-2">Test Profile #{farmer.id}</Badge>
                      </div>
                      
                      <Button 
                        onClick={() => generateCertificates(farmer.id)}
                        className="w-full bg-slate-900 hover:bg-slate-800"
                        size="lg"
                      >
                        Generate Certificates
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Complete 6-Certificate System Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Enhanced EUDR Certificate:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Cocoa trade HS codes and quantity specifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Beautiful supply chain workflow graphics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Professional compliance status indicators</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Deforestation Analysis:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>24-month satellite monitoring timeline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>NASA, ESA, USGS satellite data references</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Environmental impact certification</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Phytosanitary Certificate:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>International plant health verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Quarantine pest verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>IPPC compliance documentation</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Certificate of Origin:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600" />
                    <span>Official Liberian origin declaration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600" />
                    <span>Supply chain origin verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600" />
                    <span>GPS coordinate verification</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Quality Control Certificate:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-600" />
                    <span>Comprehensive grading system A+ to F</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-600" />
                    <span>Quality parameter analysis charts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-600" />
                    <span>Premium Grade I certification</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Comprehensive Declaration:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-600" />
                    <span>LACRA & ECOENVIROS joint declaration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-600" />
                    <span>Master compliance verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-600" />
                    <span>Covers ALL certification activities</span>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Current Selection Info */}
        {showDownloads && (
          <Card className="border-slate-200 bg-slate-50">
            <CardContent className="pt-6">
              <div className="text-center text-slate-600">
                <p>Currently generating certificates for: <strong>{testFarmers.find(f => f.id === selectedFarmerId)?.name}</strong></p>
                <p className="text-sm mt-1">All 6 certificates are ready for download above ↑</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}