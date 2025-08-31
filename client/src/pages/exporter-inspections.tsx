import { memo, useCallback, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardCheck,
  Calendar,
  MapPin,
  Building2,
  User,
  Package,
  DollarSign,
  FileCheck,
  CreditCard,
  Eye,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';
import CleanExporterLayout from '@/components/layout/clean-exporter-layout';
import ErrorBoundary from '@/components/ErrorBoundary';

// ⚡ INSPECTIONS & PAYMENTS MAIN COMPONENT
const ExporterInspections = memo(() => {
  const { toast } = useToast();
  
  // ⚡ SUPER OPTIMIZED USER QUERY - Match dashboard pattern
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 300000, // 5 minutes cache for maximum speed
    gcTime: 1800000, // 30 minutes garbage collection
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Only fetch if stale
  });

  const exporterId = (user as any)?.exporterId || (user as any)?.id;
  
  // Fetch scheduled pickups for this exporter
  const { data: scheduledPickupsData, isLoading: pickupsLoading } = useQuery<{
    success: boolean;
    data: Array<{
      requestId: string;
      transactionId: string;
      commodityType: string;
      quantity: string;
      unit: string;
      totalValue: string;
      dispatchDate: string;
      confirmedBy: string;
      status: string;
      buyerName: string;
      buyerCompany: string;
      verificationCode: string;
      county: string;
      farmLocation: string;
      confirmedAt: string;
    }>;
  }>({
    queryKey: [`/api/exporter/scheduled-pickups/${exporterId}`],
    enabled: !!exporterId,
    staleTime: 60000, // 1 minute cache
  });

  const scheduledPickups = scheduledPickupsData?.data || [];

  // Handle action buttons
  const handleBookInspection = useCallback((pickup: any) => {
    toast({
      title: "Product Inspection Booking",
      description: `Booking inspection for ${pickup.commodityType} (${pickup.requestId})`,
    });
  }, [toast]);

  const handleCertifications = useCallback((pickup: any) => {
    toast({
      title: "International Certifications",
      description: `Processing certifications for ${pickup.commodityType} (${pickup.requestId})`,
    });
  }, [toast]);

  const handlePaymentConfirmation = useCallback((pickup: any) => {
    toast({
      title: "Payment Confirmation",
      description: `Confirming payment for ${pickup.commodityType} (${pickup.requestId})`,
    });
  }, [toast]);

  if (userLoading) {
    return (
      <CleanExporterLayout user={user}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="bg-white shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-slate-600">Loading exporter data...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CleanExporterLayout>
    );
  }

  return (
    <ErrorBoundary>
      <CleanExporterLayout user={user}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* 📋 PAGE HEADER */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <ClipboardCheck className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Inspections & Payments</h1>
                  <p className="text-slate-600">Manage product inspections, certifications, and payment workflows</p>
                </div>
              </div>
            </div>

            {/* 📦 SCHEDULED PICKUPS SECTION */}
            {pickupsLoading ? (
              <Card className="bg-white shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                    <span className="ml-3 text-slate-600">Loading scheduled pickups...</span>
                  </div>
                </CardContent>
              </Card>
            ) : scheduledPickups.length === 0 ? (
              <Card className="bg-white shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="bg-slate-100 p-4 rounded-lg inline-block mb-4">
                    <Package className="h-12 w-12 text-slate-400 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No Scheduled Pickups</h3>
                  <p className="text-slate-600">
                    You don't have any scheduled warehouse pickups at the moment.
                    <br />
                    Accept buyer offers to schedule product pickups.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <Package className="h-7 w-7 text-purple-600 mr-3" />
                    Scheduled Pickups ({scheduledPickups.length})
                  </h2>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {scheduledPickups.length} Active
                  </Badge>
                </div>

                {/* 📦 PICKUP CARDS */}
                <div className="grid gap-6">
                  {scheduledPickups.map((pickup) => (
                    <Card key={pickup.requestId} className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                              <Package className="h-6 w-6 text-purple-600 mr-3" />
                              Pickup #{pickup.requestId}
                            </CardTitle>
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(pickup.dispatchDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                {pickup.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-slate-800">
                              ${Number(pickup.totalValue).toLocaleString()}
                            </div>
                            <div className="text-sm text-slate-600">{pickup.quantity} {pickup.unit}</div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {/* 📋 PRODUCT DETAILS */}
                        <div className="bg-slate-50 rounded-lg p-4">
                          <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                            <Eye className="h-5 w-5 text-slate-600 mr-2" />
                            Product Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Commodity:</span>
                                <span className="font-medium text-slate-800">{pickup.commodityType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Transaction ID:</span>
                                <span className="font-mono text-slate-800">{pickup.transactionId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Verification Code:</span>
                                <span className="font-mono text-slate-800">{pickup.verificationCode}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Warehouse:</span>
                                <span className="font-medium text-slate-800">{pickup.confirmedBy}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Buyer:</span>
                                <span className="font-medium text-slate-800">{pickup.buyerName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Company:</span>
                                <span className="font-medium text-slate-800">{pickup.buyerCompany}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 🚀 ACTION BUTTONS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Button 
                            onClick={() => handleBookInspection(pickup)}
                            className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg"
                            data-testid={`book-inspection-${pickup.requestId}`}
                          >
                            <ClipboardCheck className="h-5 w-5 mr-2" />
                            Book Product Inspection
                          </Button>
                          <Button 
                            onClick={() => handleCertifications(pickup)}
                            className="bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-lg"
                            data-testid={`certifications-${pickup.requestId}`}
                          >
                            <FileText className="h-5 w-5 mr-2" />
                            International Certifications
                          </Button>
                          <Button 
                            onClick={() => handlePaymentConfirmation(pickup)}
                            className="bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg"
                            disabled={pickup.status !== 'payment_requested'}
                            data-testid={`payment-confirmation-${pickup.requestId}`}
                          >
                            <CreditCard className="h-5 w-5 mr-2" />
                            Payment Confirmation
                          </Button>
                        </div>

                        {/* ℹ️ ADDITIONAL INFO */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <AlertTriangle className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-blue-900 mb-1">Important Notes</h4>
                              <div className="text-sm text-blue-800 space-y-1">
                                <p>• Product inspection must be completed before export approval</p>
                                <p>• Payment confirmation is only available when buyer requests payment</p>
                                <p>• All certifications will be processed within 2-3 business days</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 📊 ADDITIONAL INFORMATION */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mt-8">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Inspection & Payment Workflow</h3>
                    <div className="text-slate-700 space-y-2">
                      <p className="flex items-center">
                        <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-bold flex items-center justify-center mr-3">1</span>
                        Book product inspection for quality verification
                      </p>
                      <p className="flex items-center">
                        <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full text-xs font-bold flex items-center justify-center mr-3">2</span>
                        Obtain international certifications (EUDR, organic, etc.)
                      </p>
                      <p className="flex items-center">
                        <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center justify-center mr-3">3</span>
                        Confirm payment when requested by buyer
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </CleanExporterLayout>
    </ErrorBoundary>
  );
});

ExporterInspections.displayName = 'ExporterInspections';

export default ExporterInspections;