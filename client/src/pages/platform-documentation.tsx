import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Satellite, 
  Globe, 
  Shield, 
  Zap, 
  BarChart3,
  Settings,
  Award,
  Lock,
  Microscope,
  Target
} from "lucide-react";

export default function PlatformDocumentation() {
  const handleDownloadDocumentation = () => {
    window.location.href = "/api/download/platform-documentation";
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Platform Documentation</h1>
          <p className="text-xl text-gray-600">Comprehensive technical documentation of the Polipus Platform ecosystem</p>
        </div>

        {/* Download Section */}
        <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              Complete Technical Documentation
            </CardTitle>
            <p className="text-gray-700">
              Download the comprehensive PDF documentation detailing all platform capabilities, 
              technical specifications, satellite integration, and comparative analysis.
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleDownloadDocumentation}
              size="lg"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Full Documentation PDF
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              24-page comprehensive technical analysis • Generated: {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        {/* Documentation Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Satellite className="h-5 w-5 text-blue-600" />
                Satellite Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-center">200+ Satellite Sources</Badge>
                <p className="text-sm text-gray-600">
                  Comprehensive coverage including Sentinel, Landsat, MODIS, Planet Labs, and commercial satellites
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Real-time earth observation</li>
                  <li>• Multi-spectral analysis</li>
                  <li>• Change detection algorithms</li>
                  <li>• Global coverage capabilities</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                GPS Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-center">Centimeter Precision</Badge>
                <p className="text-sm text-gray-600">
                  Advanced GPS integration with RTK positioning and multi-constellation support
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• RTK (Real-Time Kinematic)</li>
                  <li>• Multi-GNSS support</li>
                  <li>• DGPS enhancement</li>
                  <li>• Mobile optimization</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                8-Module Ecosystem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-center">Fully Integrated</Badge>
                <p className="text-sm text-gray-600">
                  Complete environmental and agricultural monitoring ecosystem
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• AgriTrace360™</li>
                  <li>• Live Trace</li>
                  <li>• Land Map360</li>
                  <li>• Mine Watch & More</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-center">Military Grade</Badge>
                <p className="text-sm text-gray-600">
                  Highest security standards with international compliance
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• ISO 27001 compliant</li>
                  <li>• GDPR & CCPA ready</li>
                  <li>• SOC 2 Type II</li>
                  <li>• Zero-trust architecture</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-center">99.99% Uptime</Badge>
                <p className="text-sm text-gray-600">
                  Exceptional performance across all operational metrics
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• &lt;200ms API response</li>
                  <li>• Real-time processing</li>
                  <li>• 100K+ concurrent users</li>
                  <li>• 10TB daily capacity</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-600" />
                Industry Leadership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-center">First of Its Kind</Badge>
                <p className="text-sm text-gray-600">
                  Revolutionary platform setting new industry standards
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• 99.3% accuracy rates</li>
                  <li>• Full EUDR automation</li>
                  <li>• Blockchain verification</li>
                  <li>• Cross-module analytics</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Target className="h-7 w-7 text-blue-600" />
              Key Platform Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-green-600" />
                  Technical Innovations
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• First integrated 8-module environmental monitoring ecosystem</li>
                  <li>• Unprecedented access to 200+ satellite data sources</li>
                  <li>• Centimeter-level GPS precision with RTK technology</li>
                  <li>• Real-time AI-powered satellite image analysis</li>
                  <li>• Cross-module data synchronization and analytics</li>
                  <li>• Blockchain-based verification and audit trails</li>
                  <li>• Complete EUDR compliance automation</li>
                  <li>• Advanced geospatial processing engines</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  Security & Compliance
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Military-grade AES-256 encryption</li>
                  <li>• ISO 27001 information security compliance</li>
                  <li>• GDPR and CCPA data protection adherence</li>
                  <li>• SOC 2 Type II service organization controls</li>
                  <li>• Zero-trust network architecture</li>
                  <li>• 24/7 security monitoring and incident response</li>
                  <li>• Immutable audit logs with blockchain verification</li>
                  <li>• Multi-factor authentication requirements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <BarChart3 className="h-7 w-7 text-purple-600" />
              Documentation Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Executive Summary</h4>
                <p className="text-sm text-gray-600">Platform overview and market positioning</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Architecture & Technology</h4>
                <p className="text-sm text-gray-600">Complete technical stack analysis</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Satellite Integration</h4>
                <p className="text-sm text-gray-600">200+ satellite sources and GPS technology</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Module Specifications</h4>
                <p className="text-sm text-gray-600">Detailed functionality of all 8 modules</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Interconnectivity</h4>
                <p className="text-sm text-gray-600">Cross-module integration and data flow</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Government Integration</h4>
                <p className="text-sm text-gray-600">Regulatory compliance and reporting</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Security Analysis</h4>
                <p className="text-sm text-gray-600">Cybersecurity and data protection</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Industry Comparison</h4>
                <p className="text-sm text-gray-600">Technical comparison with competitors</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Performance Metrics</h4>
                <p className="text-sm text-gray-600">Analytics and capability measurements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}