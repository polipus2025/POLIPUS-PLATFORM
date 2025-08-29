import { useState, Suspense, memo, useMemo, lazy, useCallback } from 'react';
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
  ShoppingCart,
  Warehouse,
  ArrowRight
} from 'lucide-react';
import { Link } from "wouter";
import CleanExporterLayout from '@/components/layout/clean-exporter-layout';
import ErrorBoundary from '@/components/ErrorBoundary';

// ⚡ LAZY LOAD COMPONENTS - Instant performance boost
const SoftCommodityPricing = lazy(() => import('@/components/SoftCommodityPricing').then(module => ({ default: module.SoftCommodityPricing })));

// ⚡ PERFORMANCE OPTIMIZED SKELETON LOADER
const FastSkeleton = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-slate-600 font-medium">Loading Exporter Portal...</p>
    </div>
  </div>
));
FastSkeleton.displayName = 'FastSkeleton';

// ⚡ MEMOIZED STATUS BADGE COMPONENT
const StatusBadge = memo(({ status }: { status: string }) => {
  const statusColors = useMemo(() => ({
    'active': 'bg-green-100 text-green-800',
    'approved': 'bg-green-100 text-green-800',
    'verified': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'expired': 'bg-red-100 text-red-800',
    'rejected': 'bg-red-100 text-red-800',
    'default': 'bg-gray-100 text-gray-800'
  }), []);

  const colorClass = statusColors[status as keyof typeof statusColors] || statusColors.default;
  
  return <Badge className={colorClass}>{status}</Badge>;
});
StatusBadge.displayName = 'StatusBadge';

// ⚡ MAIN EXPORTER DASHBOARD COMPONENT - OPTIMIZED FOR SPEED
const ExporterDashboard = memo(() => {
  const [activeTab, setActiveTab] = useState('overview');

  // ⚡ OPTIMIZED QUERY with stale time for speed
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 30000, // 30 seconds cache for speed
    gcTime: 300000, // 5 minutes garbage collection
  });

  // ⚡ FETCH ACCEPTED DEALS FOR WAREHOUSE TRANSPORT
  const { data: acceptedDealsData, isLoading: dealsLoading } = useQuery<{
    success: boolean;
    deals: Array<{
      offer_id: string;
      buyer_company: string;
      buyer_contact: string;
      buyer_phone: string;
      commodity: string;
      quantity_available: string;
      price_per_unit: string;
      total_value: string;
      verification_code: string;
      accepted_date: string;
    }>;
  }>({
    queryKey: [`/api/exporter/${(user as any)?.exporterId || (user as any)?.id}/accepted-deals`],
    enabled: !!((user as any)?.exporterId || (user as any)?.id),
    staleTime: 10000, // 10 seconds cache
  });


  // ⚡ MEMOIZED COMPLIANCE DATA - No recalculation
  const complianceData = useMemo(() => ({
    exportLicense: { status: 'active', expiryDate: '2025-06-15' },
    lacraRegistration: { status: 'approved', registrationNumber: 'LACRA-EXP-2024-001' },
    eudrCompliance: { status: 'verified', lastUpdated: '2025-01-15' },
    pendingApplications: 2,
    approvedExports: 15,
    totalVolume: '2,450 MT'
  }), []);

  // ⚡ MEMOIZED METRICS DATA
  const metricsData = useMemo(() => [
    { title: 'Total Exports', value: '247', change: '+12%', icon: Ship, color: 'blue' },
    { title: 'Revenue (USD)', value: '$2.4M', change: '+8%', icon: DollarSign, color: 'green' },
    { title: 'Active Orders', value: '18', change: '+3', icon: Package, color: 'purple' },
    { title: 'Compliance Score', value: '98%', change: '+2%', icon: Shield, color: 'emerald' }
  ], []);

  // ⚡ MEMOIZED TAB HANDLER
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // ⚡ OPTIMIZED LOADING STATE
  if (userLoading) {
    return <FastSkeleton />;
  }

  return (
    <ErrorBoundary>
      <CleanExporterLayout user={user}>
        <Helmet>
          <title>Exporter Dashboard - AgriTrace360™</title>
          <meta name="description" content="High-performance export management dashboard for licensed agricultural commodity exporters" />
        </Helmet>
        
        {/* ⚡ OPTIMIZED USER PROFILE SECTION */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {(user as any)?.exporterId?.slice(-3) || 'EXP'}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {(user as any)?.companyName || 'Licensed Exporter'}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Exporter ID: {(user as any)?.exporterId || 'EXP-DEMO-001'}</span>
                    <span>•</span>
                    <span>License Status: Active</span>
                    <span>•</span>
                    <span>Last Login: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status="verified" />
                <p className="text-sm text-gray-600 mt-1">Verified Exporter</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ⚡ PERFORMANCE METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <p className={`text-sm text-${metric.color}-600`}>{metric.change} from last month</p>
                    </div>
                    <div className={`bg-${metric.color}-100 p-3 rounded-lg`}>
                      <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ⚡ QUICK ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Ship className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Export Orders</h3>
                    <p className="text-sm text-gray-600">Manage your export orders</p>
                    <span className="text-gray-500 text-sm">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Marketplace</h3>
                    <p className="text-sm text-gray-600">Browse available commodities</p>
                    <span className="text-gray-500 text-sm">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Certificates</h3>
                    <p className="text-sm text-gray-600">Download export certificates</p>
                    <span className="text-gray-500 text-sm">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ⚡ ACCEPTED DEALS - WAREHOUSE TRANSPORT ARRANGEMENTS */}
          {acceptedDealsData?.deals && Array.isArray(acceptedDealsData.deals) && acceptedDealsData.deals.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Warehouse className="h-5 w-5 text-blue-600" />
                  <span>Accepted Deals - Transport Required</span>
                  <Badge className="bg-blue-100 text-blue-800">{acceptedDealsData.deals.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {acceptedDealsData.deals?.map((deal: any) => (
                    <div key={deal.offer_id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Deal Details */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{deal.commodity}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Quantity: <span className="font-medium">{deal.quantity_available} MT</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: <span className="font-medium">${deal.price_per_unit}/MT</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Total Value: <span className="font-medium text-green-600">${deal.total_value}</span>
                          </p>
                        </div>

                        {/* Buyer Contact */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Buyer Contact</h4>
                          <p className="text-sm">
                            <span className="font-medium">{deal.buyer_company}</span>
                          </p>
                          <p className="text-sm text-gray-600">{deal.buyer_contact}</p>
                          <p className="text-sm text-blue-600">{deal.buyer_phone}</p>
                          <p className="text-sm text-gray-600">
                            Location: {deal.county} → {deal.proposed_port}
                          </p>
                        </div>

                        {/* Transport Arrangement */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Transport Details</h4>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-green-800">Verification Code</p>
                            <p className="text-lg font-mono text-green-900">{deal.verification_code}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Accepted: {new Date(deal.accepted_date).toLocaleDateString()}
                          </p>
                          <Button size="sm" className="w-full mt-2" variant="outline">
                            <Truck className="h-4 w-4 mr-1" />
                            Arrange Transport
                          </Button>
                        </div>
                      </div>

                      {/* Action Instruction */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Next Step:</span> Contact buyer to arrange transport from their warehouse to your export facility using verification code: <span className="font-mono">{deal.verification_code}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ⚡ COMPLIANCE STATUS */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Compliance Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Export License</h4>
                    <p className="text-sm text-gray-600">Expires: {complianceData.exportLicense.expiryDate}</p>
                  </div>
                  <StatusBadge status={complianceData.exportLicense.status} />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">LACRA Registration</h4>
                    <p className="text-sm text-gray-600">{complianceData.lacraRegistration.registrationNumber}</p>
                  </div>
                  <StatusBadge status={complianceData.lacraRegistration.status} />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">EUDR Compliance</h4>
                    <p className="text-sm text-gray-600">Last Updated: {complianceData.eudrCompliance.lastUpdated}</p>
                  </div>
                  <StatusBadge status={complianceData.eudrCompliance.status} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ⚡ LAZY LOADED PRICING COMPONENT */}
          <Suspense fallback={
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          }>
            <SoftCommodityPricing />
          </Suspense>

          {/* ⚡ IMPORTANT INFORMATION */}
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
      </CleanExporterLayout>
    </ErrorBoundary>
  );
});

ExporterDashboard.displayName = 'ExporterDashboard';
export default ExporterDashboard;