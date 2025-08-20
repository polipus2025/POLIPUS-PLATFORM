import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Award, Download, FileText, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function ExporterCertificates() {
  const mockCertificates = [
    {
      id: 'CERT-2025-001',
      type: 'EUDR Compliance Certificate',
      commodity: 'Cocoa Beans',
      issueDate: '2025-08-15',
      expiryDate: '2025-12-15',
      status: 'Valid',
      authority: 'LACRA',
      documentNumber: 'EUDR-COC-2025-001'
    },
    {
      id: 'CERT-2025-002',
      type: 'Export Eligibility Certificate',
      commodity: 'Coffee Beans',
      issueDate: '2025-08-10',
      expiryDate: '2026-02-10',
      status: 'Valid',
      authority: 'LACRA',
      documentNumber: 'EXP-COF-2025-002'
    },
    {
      id: 'CERT-2025-003',
      type: 'Quality Assurance Certificate',
      commodity: 'Palm Oil',
      issueDate: '2025-07-25',
      expiryDate: '2025-10-25',
      status: 'Expiring Soon',
      authority: 'LACRA',
      documentNumber: 'QA-PAL-2025-003'
    },
    {
      id: 'CERT-2025-004',
      type: 'Phytosanitary Certificate',
      commodity: 'Rubber',
      issueDate: '2025-06-15',
      expiryDate: '2025-09-15',
      status: 'Expired',
      authority: 'LACRA',
      documentNumber: 'PHY-RUB-2025-004'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Valid': return 'bg-green-100 text-green-800';
      case 'Expiring Soon': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Valid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Expiring Soon': return <Calendar className="h-4 w-4 text-yellow-600" />;
      case 'Expired': return <Calendar className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Certificates - Exporter Portal</title>
        <meta name="description" content="Manage your export certificates and compliance documents" />
      </Helmet>

      {/* Header with Back Button */}
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
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Certificates & Documents</h1>
                <p className="text-sm text-slate-600">Manage your export certificates and compliance documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Certificate Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Valid Certificates</p>
                  <p className="text-3xl font-bold text-green-900">2</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-600" />
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

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Expired</p>
                  <p className="text-3xl font-bold text-red-900">1</p>
                </div>
                <FileText className="h-12 w-12 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Certificates</p>
                  <p className="text-3xl font-bold text-blue-900">4</p>
                </div>
                <Award className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Your Certificates
              </CardTitle>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Request New Certificate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCertificates.map((certificate) => (
                <div key={certificate.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(certificate.status)}
                      <div>
                        <h3 className="font-semibold text-lg">{certificate.type}</h3>
                        <p className="text-gray-600">Document: {certificate.documentNumber}</p>
                        <p className="text-sm text-gray-500">Commodity: {certificate.commodity}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(certificate.status)}>
                      {certificate.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Issue Date:</span>
                      <p className="font-medium">{certificate.issueDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Expiry Date:</span>
                      <p className="font-medium">{certificate.expiryDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Authority:</span>
                      <p className="font-medium">{certificate.authority}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Certificate ID:</span>
                      <p className="font-medium">{certificate.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {certificate.status === 'Expired' && (
                      <Button size="sm">
                        Renew Certificate
                      </Button>
                    )}
                    {certificate.status === 'Expiring Soon' && (
                      <Button size="sm" variant="outline">
                        Renew Early
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}