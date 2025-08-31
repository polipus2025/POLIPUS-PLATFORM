import React, { useState, Suspense, memo, useMemo, lazy, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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

// ⚡ PREFETCH CRITICAL PAGES - Load likely destinations in background
const prefetchPages = () => {
  // Prefetch likely pages user will visit
  import('./exporter/orders');
  import('./exporter/marketplace');
  import('./exporter/certificates');
};

// ⚡ PRELOAD STRATEGY - Start prefetching after component mount
const usePagePrefetch = () => {
  React.useEffect(() => {
    // Prefetch after 2 seconds to not interfere with initial load
    const timer = setTimeout(prefetchPages, 2000);
    return () => clearTimeout(timer);
  }, []);
};

// ⚡ PERFORMANCE OPTIMIZED SKELETON LOADER - Enhanced with transitions
const FastSkeleton = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="text-center space-y-4 animate-pulse">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <div className="space-y-2">
        <p className="text-slate-600 font-medium">Loading Exporter Portal...</p>
        <div className="w-48 h-2 bg-slate-200 rounded-full mx-auto">
          <div className="h-2 bg-blue-600 rounded-full animate-pulse" style={{width: '60%'}}></div>
        </div>
      </div>
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
  
  // ⚡ ACTIVATE PREFETCHING STRATEGY
  usePagePrefetch();

  // ⚡ SUPER OPTIMIZED QUERY - Maximum performance
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 300000, // 5 minutes cache for maximum speed
    gcTime: 1800000, // 30 minutes garbage collection
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Only fetch if stale
  });

  // ⚡ SUPER FAST DEALS QUERY - Aggressive caching
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
    staleTime: 120000, // 2 minutes cache for speed
    gcTime: 600000, // 10 minutes garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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

  // 🛡️ TOAST FOR USER FEEDBACK
  const { toast } = useToast();

  // Payment confirmation functionality removed as requested

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
        <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">
                    {(user as any)?.exporterId?.slice(-3) || 'EXP'}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Welcome, {(user as any)?.companyName || 'Licensed Exporter'}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span>Exporter ID: {(user as any)?.exporterId || 'EXP-DEMO-001'}</span>
                    <span>•</span>
                    <span>License Status: Active</span>
                    <span>•</span>
                    <span>Last Login: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 shadow-sm">
                  <Shield className="w-4 h-4 mr-1" />
                  Verified Exporter
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ⚡ PERFORMANCE METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <Card key={index} className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                      <p className={`text-sm text-${metric.color}-600`}>{metric.change} from last month</p>
                    </div>
                    <div className={`bg-gradient-to-br from-${metric.color}-500 to-${metric.color}-600 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform`}>
                      <metric.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ⚡ QUICK ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Ship className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Export Orders</h3>
                    <p className="text-sm text-slate-600">Manage your export orders</p>
                    <Link href="/exporter/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Orders →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Marketplace</h3>
                    <p className="text-sm text-slate-600">Browse available commodities</p>
                    <Link href="/exporter/marketplace" className="text-green-600 hover:text-green-800 text-sm font-medium">
                      Explore Market →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Certificates</h3>
                    <p className="text-sm text-slate-600">Download export certificates</p>
                    <Link href="/exporter/certificates" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                      View Certificates →
                    </Link>
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
                    <div key={deal.offer_id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Deal Details */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{deal.commodity}</span>
                          </div>
                          <p className="text-sm text-slate-600">
                            Quantity: <span className="font-medium">{deal.quantity_available} MT</span>
                          </p>
                          <p className="text-sm text-slate-600">
                            Price: <span className="font-medium">${deal.price_per_unit}/MT</span>
                          </p>
                          <p className="text-sm text-slate-600">
                            Total Value: <span className="font-medium text-green-600">${deal.total_value}</span>
                          </p>
                        </div>

                        {/* Buyer Contact */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-slate-900">Buyer Contact</h4>
                          <p className="text-sm">
                            <span className="font-medium">{deal.buyer_business_name || deal.buyer_company}</span>
                          </p>
                          <p className="text-sm text-slate-600">
                            {deal.contact_person_first_name && deal.contact_person_last_name 
                              ? `${deal.contact_person_first_name} ${deal.contact_person_last_name}`
                              : deal.buyer_contact}
                          </p>
                          <p className="text-sm text-blue-600">
                            {deal.buyer_phone_verified || deal.buyer_phone}
                          </p>
                          <p className="text-sm text-slate-600">
                            Location: {deal.buyer_county || deal.county}, {deal.buyer_country || 'Liberia'}
                          </p>
                          {deal.custody_id && (
                            <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                              🔗 Custody: {deal.custody_id}
                            </p>
                          )}
                        </div>

                        {/* Transport Arrangement */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-slate-900">Transport Details</h4>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-green-800">Verification Code</p>
                            <p className="text-lg font-mono text-green-900">{deal.verification_code}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Accepted: {new Date(deal.accepted_date).toLocaleDateString()}
                          </p>
                          <div className="space-y-2">
                            <Button 
                              size="sm" 
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                              onClick={async () => {
                                const dispatchDate = prompt('Schedule pickup date (YYYY-MM-DD):');
                                if (!dispatchDate) return;
                                
                                try {
                                  const response = await fetch('/api/exporter/schedule-dispatch', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      offerId: deal.offer_id,
                                      verificationCode: deal.verification_code,
                                      dispatchDate,
                                      custodyId: deal.custody_id
                                    })
                                  });
                                  
                                  const result = await response.json();
                                  if (result.success) {
                                    alert(`✅ Dispatch Scheduled!\n\nRequest ID: ${result.requestId}\nPickup Date: ${dispatchDate}\nWarehouse will be notified to prepare your order.`);
                                    window.location.reload();
                                  } else {
                                    alert(`❌ Error: ${result.message}`);
                                  }
                                } catch (error) {
                                  alert('❌ Failed to schedule dispatch. Please try again.');
                                }
                              }}
                              data-testid={`schedule-dispatch-${deal.offer_id}`}
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Schedule Warehouse Pickup
                            </Button>
                            
                            <Button 
                              size="sm" 
                              className="w-full" 
                              variant="outline"
                              onClick={() => {
                                alert(`📞 Buyer Contact Information\n\nCompany: ${deal.buyer_business_name || deal.buyer_company}\nContact: ${deal.contact_person_first_name ? `${deal.contact_person_first_name} ${deal.contact_person_last_name}` : deal.buyer_contact}\nPhone: ${deal.buyer_phone_verified || deal.buyer_phone}\nLocation: ${deal.buyer_county || deal.county}, ${deal.buyer_country || 'Liberia'}\n\nVerification Code: ${deal.verification_code}`);
                              }}
                              data-testid={`contact-buyer-${deal.offer_id}`}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Contact Buyer
                            </Button>
                          </div>
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
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Compliance Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Export License</h4>
                    <p className="text-sm text-slate-600">Expires: {complianceData.exportLicense.expiryDate}</p>
                  </div>
                  <StatusBadge status={complianceData.exportLicense.status} />
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">LACRA Registration</h4>
                    <p className="text-sm text-slate-600">{complianceData.lacraRegistration.registrationNumber}</p>
                  </div>
                  <StatusBadge status={complianceData.lacraRegistration.status} />
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">EUDR Compliance</h4>
                    <p className="text-sm text-slate-600">Last Updated: {complianceData.eudrCompliance.lastUpdated}</p>
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
        </div>
      </CleanExporterLayout>
    </ErrorBoundary>
  );
});

ExporterDashboard.displayName = 'ExporterDashboard';
export default ExporterDashboard;