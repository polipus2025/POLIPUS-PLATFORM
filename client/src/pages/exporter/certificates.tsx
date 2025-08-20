import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Award, 
  Download, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Globe,
  Shield
} from 'lucide-react';
import ExporterNavbar from '@/components/layout/exporter-navbar';

export default function ExporterCertificates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Mock certificates data
  const certificates = [
    {
      id: 'CERT-2025-001',
      type: 'Export License',
      title: 'Agricultural Export License 2025',
      issuedBy: 'LACRA',
      issuedDate: '2025-01-15',
      expiryDate: '2025-12-31',
      status: 'active',
      commodities: ['Coffee', 'Cocoa', 'Rubber'],
      certificateNumber: 'LACRA-EXP-2025-001',
      downloadUrl: '/certificates/export-license-2025.pdf',
      ddgotsOfficer: 'Sarah Konneh',
      description: 'Official LACRA export license for agricultural commodities'
    },
    {
      id: 'CERT-2025-002',
      type: 'EUDR Compliance',
      title: 'EU Deforestation Regulation Certificate',
      issuedBy: 'LACRA - EUDR Division',
      issuedDate: '2025-01-20',
      expiryDate: '2025-07-20',
      status: 'active',
      commodities: ['Coffee', 'Cocoa'],
      certificateNumber: 'EUDR-LIB-2025-002',
      downloadUrl: '/certificates/eudr-compliance-2025.pdf',
      ddgotsOfficer: 'James Wilson',
      description: 'EUDR compliance certification for deforestation-free commodities'
    },
    {
      id: 'CERT-2025-003',
      type: 'Quality Certificate',
      title: 'Premium Coffee Quality Certificate',
      issuedBy: 'LACRA Quality Assurance',
      issuedDate: '2025-01-22',
      expiryDate: '2025-04-22',
      status: 'active',
      commodities: ['Coffee'],
      certificateNumber: 'QA-COF-2025-003',
      downloadUrl: '/certificates/coffee-quality-2025.pdf',
      ddgotsOfficer: 'Patricia Johnson',
      description: 'Quality assessment certificate for premium grade coffee'
    },
    {
      id: 'CERT-2024-015',
      type: 'Phytosanitary',
      title: 'Phytosanitary Certificate - Cocoa Export',
      issuedBy: 'LACRA Plant Protection',
      issuedDate: '2024-12-15',
      expiryDate: '2025-03-15',
      status: 'expiring_soon',
      commodities: ['Cocoa'],
      certificateNumber: 'PHY-COC-2024-015',
      downloadUrl: '/certificates/phytosanitary-cocoa-2024.pdf',
      ddgotsOfficer: 'Michael Togba',
      description: 'Plant health certificate for cocoa exports'
    },
    {
      id: 'CERT-2025-004',
      type: 'Fair Trade',
      title: 'Fair Trade Certification - Coffee',
      issuedBy: 'Fair Trade International',
      issuedDate: '2025-01-10',
      expiryDate: '2026-01-10',
      status: 'pending_verification',
      commodities: ['Coffee'],
      certificateNumber: 'FT-LIB-COF-2025-004',
      downloadUrl: null,
      ddgotsOfficer: 'Grace Kumah',
      description: 'Fair Trade certification for sustainably sourced coffee'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expiring_soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending_verification':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'expiring_soon':
        return <AlertTriangle className="h-4 w-4" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4" />;
      case 'pending_verification':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'export license':
        return <Award className="h-5 w-5 text-blue-600" />;
      case 'eudr compliance':
        return <Globe className="h-5 w-5 text-green-600" />;
      case 'quality certificate':
        return <Shield className="h-5 w-5 text-purple-600" />;
      case 'phytosanitary':
        return <FileText className="h-5 w-5 text-orange-600" />;
      case 'fair trade':
        return <Award className="h-5 w-5 text-emerald-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    const matchesType = typeFilter === 'all' || cert.type.toLowerCase().replace(' ', '_') === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Certificates - Exporter Portal</title>
        <meta name="description" content="Manage your export certificates and compliance documents" />
      </Helmet>

      <ExporterNavbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Award className="h-6 w-6 text-blue-600" />
            Export Certificates
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your export certificates and compliance documents issued by LACRA and international bodies
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Certificates</p>
                  <p className="text-2xl font-bold text-green-600">
                    {certificates.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {certificates.filter(c => c.status === 'expiring_soon').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {certificates.filter(c => c.status === 'pending_verification').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {certificates.length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="pending_verification">Pending Verification</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="export_license">Export License</SelectItem>
              <SelectItem value="eudr_compliance">EUDR Compliance</SelectItem>
              <SelectItem value="quality_certificate">Quality Certificate</SelectItem>
              <SelectItem value="phytosanitary">Phytosanitary</SelectItem>
              <SelectItem value="fair_trade">Fair Trade</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {getTypeIcon(certificate.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {certificate.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Certificate #: {certificate.certificateNumber}</span>
                        <span>Issued by: {certificate.issuedBy}</span>
                        <span>DDGOTS Officer: {certificate.ddgotsOfficer}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(certificate.status)} flex items-center gap-1`}>
                    {getStatusIcon(certificate.status)}
                    {certificate.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Certificate Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Certificate Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Type:</span> {certificate.type}</p>
                      <p><span className="text-gray-600">Issued:</span> {certificate.issuedDate}</p>
                      <p><span className="text-gray-600">Expires:</span> {certificate.expiryDate}</p>
                    </div>
                  </div>

                  {/* Covered Commodities */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Covered Commodities</h4>
                    <div className="space-y-1">
                      {certificate.commodities.map((commodity, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                          {commodity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                    <p className="text-sm text-gray-700">{certificate.description}</p>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                    <div className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {certificate.downloadUrl ? (
                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="w-full" disabled>
                          <Clock className="h-4 w-4 mr-2" />
                          Processing
                        </Button>
                      )}
                      {certificate.status === 'expiring_soon' && (
                        <Button size="sm" variant="outline" className="w-full text-yellow-700 border-yellow-300">
                          <Calendar className="h-4 w-4 mr-2" />
                          Request Renewal
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCertificates.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You don\'t have any certificates yet. Contact DDGOTS to apply for export certificates.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}