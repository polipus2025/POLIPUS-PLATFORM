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
  Users
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
    const url = type === 'eudr' 
      ? `/api/test/eudr-certificate/${selectedFarmerId}`
      : `/api/test/deforestation-certificate/${selectedFarmerId}`;
    window.open(url, '_blank');
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
            Generate and download professional EUDR & Deforestation certificates with realistic simulation data
          </p>
          <Badge variant="outline" className="text-sm px-4 py-2">
            Ready for Testing - Click to Generate & Download PDFs
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
              <p><strong>Step 3:</strong> Download both certificate types to review</p>
            </div>
          </CardContent>
        </Card>

        {/* Status Alert */}
        {showDownloads && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ Certificates ready! Both EUDR and Deforestation analysis PDFs are available for download below.
            </AlertDescription>
          </Alert>
        )}

        {/* Certificate Downloads */}
        {showDownloads && (
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* EUDR Certificate Card */}
            <Card className="border-blue-200 bg-white shadow-lg">
              <CardHeader className="bg-blue-50">
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-xl text-blue-900">EUDR Compliance Certificate</CardTitle>
                    <p className="text-blue-700 text-sm">EU Deforestation Regulation Compliance</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-sm text-slate-600">
                    <p><strong>Includes:</strong> Professional compliance status, risk analysis charts, GPS verification, supply chain documentation, certification statements</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => downloadCertificate('eudr')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download EUDR Certificate
                    </Button>
                    <Button 
                      onClick={() => downloadCertificate('eudr')}
                      variant="outline"
                      size="lg"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deforestation Certificate Card */}
            <Card className="border-green-200 bg-white shadow-lg">
              <CardHeader className="bg-green-50">
                <div className="flex items-center gap-3">
                  <TreePine className="h-8 w-8 text-green-600" />
                  <div>
                    <CardTitle className="text-xl text-green-900">Deforestation Analysis</CardTitle>
                    <p className="text-green-700 text-sm">Environmental Impact Assessment</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-sm text-slate-600">
                    <p><strong>Includes:</strong> Satellite monitoring data, forest cover analysis, biodiversity impact assessment, environmental certification, 24-month timeline</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => downloadCertificate('deforestation')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Deforestation Analysis
                    </Button>
                    <Button 
                      onClick={() => downloadCertificate('deforestation')}
                      variant="outline"
                      size="lg" 
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Eye className="h-5 w-5" />
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
            <CardTitle>Certificate Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">EUDR Certificate Includes:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Professional header with LACRA & ECOENVIROS branding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Compliance status indicators with visual checkmarks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Risk analysis charts with realistic data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>GPS coordinates and farm verification details</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Deforestation Analysis Includes:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>24-month satellite monitoring timeline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Forest cover percentage analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>NASA, ESA, USGS satellite data references</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Environmental impact assessment & certification</span>
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
                <p className="text-sm mt-1">Both certificates are ready for download above ↑</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}