import { memo, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Download, Shield, Calendar } from 'lucide-react';
import { Link } from 'wouter';
import CleanExporterLayout from '@/components/layout/clean-exporter-layout';
import { useQuery } from '@tanstack/react-query';

// ⚡ MEMOIZED CERTIFICATES COMPONENT FOR SPEED
const ExporterCertificates = memo(() => {
  // ⚡ GET USER DATA
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 30000,
  });
  // ⚡ MEMOIZED CERTIFICATES DATA
  const certificates = useMemo(() => [
    {
      id: 'CERT-2025-001',
      type: 'Export License',
      commodity: 'Cocoa Beans',
      issueDate: '2025-01-15',
      expiryDate: '2025-12-31',
      status: 'Active',
      downloadUrl: '/certificates/export-license-001.pdf'
    },
    {
      id: 'CERT-2025-002',
      type: 'EUDR Compliance',
      commodity: 'Coffee Beans',
      issueDate: '2025-02-01',
      expiryDate: '2026-01-31',
      status: 'Active',
      downloadUrl: '/certificates/eudr-compliance-002.pdf'
    },
    {
      id: 'CERT-2025-003',
      type: 'Quality Certificate',
      commodity: 'Palm Oil',
      issueDate: '2025-01-20',
      expiryDate: '2025-06-20',
      status: 'Expiring Soon',
      downloadUrl: '/certificates/quality-cert-003.pdf'
    }
  ], []);

  // ⚡ MEMOIZED STATUS COLOR FUNCTION
  const getStatusColor = useMemo(() => {
    const statusColors = {
      'Active': 'bg-green-100 text-green-800',
      'Expiring Soon': 'bg-yellow-100 text-yellow-800',
      'Expired': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return (status: string) => statusColors[status as keyof typeof statusColors] || statusColors.default;
  }, []);

  return (
    <CleanExporterLayout user={user}>
      <Helmet>
        <title>Export Certificates - Exporter Portal</title>
        <meta name="description" content="Download and manage your export certificates and compliance documents" />
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/exporter-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Export Certificates</h1>
                <p className="text-sm text-slate-600">Download and manage compliance documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Certificates</p>
                  <p className="text-3xl font-bold text-green-900">2</p>
                </div>
                <Shield className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Expiring Soon</p>
                  <p className="text-3xl font-bold text-yellow-900">1</p>
                </div>
                <Calendar className="h-12 w-12 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Documents</p>
                  <p className="text-3xl font-bold text-blue-900">{certificates.length}</p>
                </div>
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Your Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{cert.type}</h3>
                      <p className="text-gray-600">{cert.commodity}</p>
                      <p className="text-sm text-gray-500">Certificate ID: {cert.id}</p>
                    </div>
                    <Badge className={getStatusColor(cert.status)}>
                      {cert.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Issue Date:</span>
                      <p className="font-medium">{cert.issueDate}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Expiry Date:</span>
                      <p className="font-medium">{cert.expiryDate}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <p className="font-medium">{cert.status}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Share</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Certificate Compliance Notice</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Always ensure certificates are valid before shipping</p>
                <p>• Renew expiring certificates at least 30 days before expiry</p>
                <p>• Keep digital copies accessible for customs verification</p>
                <p>• Contact LACRA for certificate renewal or updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CleanExporterLayout>
  );
});

ExporterCertificates.displayName = 'ExporterCertificates';
export default ExporterCertificates;