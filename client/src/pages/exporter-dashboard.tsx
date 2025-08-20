import { useState, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Ship, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Package,
  Globe,
  MapPin,
  Phone,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  BarChart3,
  Truck,
  Shield,
  Award,
  ShoppingCart
} from 'lucide-react';
import { Link } from "wouter";
import ExporterNavbar from '@/components/layout/exporter-navbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SoftCommodityPricing } from '@/components/SoftCommodityPricing';

export default function ExporterDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Mock compliance data
  const complianceData = {
    exportLicense: { status: 'active', expiryDate: '2025-06-15' },
    lacraRegistration: { status: 'approved', registrationNumber: 'LACRA-EXP-2024-001' },
    eudrCompliance: { status: 'verified', lastUpdated: '2025-01-15' },
    pendingApplications: 2,
    approvedExports: 15,
    totalVolume: '2,450 MT'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      }>
        <div className="min-h-screen bg-gray-50">
          <Helmet>
        <title>Exporter Dashboard - AgriTrace360™</title>
        <meta name="description" content="Export management dashboard for licensed agricultural commodity exporters" />
      </Helmet>

      <ExporterNavbar user={user} />
      
      {/* User Profile Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {(user as any)?.exporterCredentialId ? (user as any).exporterCredentialId.slice(-3) : 'EXP'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {(user as any)?.companyName || (user as any)?.username || 'Licensed Exporter'}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Exporter ID: {(user as any)?.exporterCredentialId || (user as any)?.exporterId || 'EXP-DEMO-001'}</span>
                  <span>•</span>
                  <span>License Status: Active</span>
                  <span>•</span>
                  <span>Established: {(user as any)?.establishedDate || '2024'}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-green-100 text-green-800 mb-2">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verified Exporter
              </Badge>
              <p className="text-sm text-gray-600">
                Last Login: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <Link href="/export-permit-submission" className="block">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Export Permit</h3>
                      <p className="text-sm text-gray-600">Submit new permit</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <Link href="/exporter/marketplace" className="block">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Buyer Marketplace</h3>
                      <p className="text-sm text-gray-600">Connect with buyers</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <Link href="/exporter-payment-services" className="block">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Payment Services</h3>
                      <p className="text-sm text-gray-600">Pay fees & permits</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <Link href="/exporter/orders" className="block">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Export Orders</h3>
                      <p className="text-sm text-gray-600">Manage buyer orders</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Export License</p>
                    <Badge className={getStatusColor(complianceData.exportLicense.status)}>
                      {complianceData.exportLicense.status}
                    </Badge>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Expires: {complianceData.exportLicense.expiryDate}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">LACRA Registration</p>
                    <Badge className={getStatusColor(complianceData.lacraRegistration.status)}>
                      {complianceData.lacraRegistration.status}
                    </Badge>
                  </div>
                  <Award className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  ID: {complianceData.lacraRegistration.registrationNumber}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">EUDR Compliance</p>
                    <Badge className={getStatusColor(complianceData.eudrCompliance.status)}>
                      {complianceData.eudrCompliance.status}
                    </Badge>
                  </div>
                  <Globe className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Updated: {complianceData.eudrCompliance.lastUpdated}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Export Summary</p>
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Approved:</span>
                        <span className="text-xs font-semibold">{complianceData.approvedExports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Volume:</span>
                        <span className="text-xs font-semibold">{complianceData.totalVolume}</span>
                      </div>
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Export Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Recent Export Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Coffee Export - Europe</h4>
                    <p className="text-sm text-gray-600">Application #EXP-2025-001 • 500 MT</p>
                    <p className="text-xs text-gray-500">Submitted: January 22, 2025</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    <p className="text-xs text-gray-500 mt-1">Ready for shipment</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Cocoa Export - North America</h4>
                    <p className="text-sm text-gray-600">Application #EXP-2025-002 • 300 MT</p>
                    <p className="text-xs text-gray-500">Submitted: January 20, 2025</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                    <p className="text-xs text-gray-500 mt-1">LACRA processing</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Rubber Export - Asia</h4>
                    <p className="text-sm text-gray-600">Application #EXP-2025-003 • 800 MT</p>
                    <p className="text-xs text-gray-500">Submitted: January 18, 2025</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-100 text-blue-800">Inspection Scheduled</Badge>
                    <p className="text-xs text-gray-500 mt-1">Jan 25, 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Inspection Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Recent Inspection Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Coffee Processing Facility</h4>
                    <p className="text-sm text-gray-600">Request #INS-2025-001 • Lofa County</p>
                    <p className="text-xs text-gray-500">Submitted: January 22, 2025</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-100 text-blue-800">Officer Assigned</Badge>
                    <p className="text-xs text-gray-500 mt-1">Officer: Sarah Konneh</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Cocoa Storage Warehouse</h4>
                    <p className="text-sm text-gray-600">Request #INS-2025-002 • Margibi County</p>
                    <p className="text-xs text-gray-500">Submitted: January 20, 2025</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    <p className="text-xs text-gray-500 mt-1">Passed inspection</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Rubber Collection Center</h4>
                    <p className="text-sm text-gray-600">Request #INS-2025-003 • Bong County</p>
                    <p className="text-xs text-gray-500">Submitted: January 18, 2025</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    <p className="text-xs text-gray-500 mt-1">Awaiting officer assignment</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Operations */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Payment Services</h3>
                    <p className="text-sm text-gray-600">Export permits & certifications</p>
                    <Link href="/exporter-payment-services" className="text-green-600 hover:text-green-800 text-sm font-medium">
                      Access Payment Portal →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Network Partnership</h3>
                    <p className="text-sm text-gray-600">Manage business partnerships</p>
                    <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                      View Network →
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Logistics Tracking</h3>
                    <p className="text-sm text-gray-600">Track shipments & deliveries</p>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Shipments →
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>



        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Important Export Information</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• All export permits must be approved by LACRA before shipment</p>
                <p>• EUDR compliance documentation is required for EU exports</p>
                <p>• Inspection requests should be submitted 5-7 days before planned export date</p>
                <p>• For urgent exports, contact LACRA directly at +231 77 LACRA (52272)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}