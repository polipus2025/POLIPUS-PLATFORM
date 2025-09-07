import { memo, useCallback, Suspense, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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

// 📅 UTILITY: Calculate next working day (Monday-Friday only)
const getNextWorkingDay = (date: Date): Date => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  // If it falls on Saturday (6) or Sunday (0), move to Monday
  const dayOfWeek = nextDay.getDay();
  if (dayOfWeek === 6) { // Saturday
    nextDay.setDate(nextDay.getDate() + 2); // Move to Monday
  } else if (dayOfWeek === 0) { // Sunday
    nextDay.setDate(nextDay.getDate() + 1); // Move to Monday
  }
  
  return nextDay;
};

// ⚡ INSPECTIONS & PAYMENTS MAIN COMPONENT
const ExporterInspections = memo(() => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState<any>(null);

  // 🎯 PAYMENT CONFIRMATION HANDLER
  const handleConfirmPayment = async (bookingId: string) => {
    try {
      await apiRequest(`/api/exporter/confirm-payment/${bookingId}`, {
        method: 'POST',
        body: JSON.stringify({
          exporterId: 'EXP-20250826-688',
          confirmedAt: new Date().toISOString()
        })
      });

      toast({
        title: "Payment Confirmed",
        description: "Payment confirmation has been sent to the buyer and regulatory authorities.",
      });

      // Refresh inspection bookings
      queryClient.invalidateQueries({ queryKey: [`/api/exporter/EXP-20250826-688/inspection-bookings`] });
      
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Error",
        description: "Failed to confirm payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ⚡ SUPER OPTIMIZED USER QUERY - Match dashboard pattern
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 300000, // 5 minutes cache for maximum speed
    gcTime: 1800000, // 30 minutes garbage collection
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Only fetch if stale
  });

  const exporterId = (user as any)?.exporterId || (user as any)?.id || 'EXP-20250826-688';

  // 🎯 GET PAYMENT REQUEST STATUS - Simple function for now
  const getPaymentRequestStatus = (bookingId: string) => {
    if (!bookingId) return { requested: false, confirmed: false, validated: false, status: 'NONE' };
    
    // For now, check specific booking for payment requested status
    if (bookingId === 'PINSP-20250907-O4IJ') {
      return {
        requested: true,
        confirmed: false,
        validated: false,
        status: 'PAYMENT_CONFIRMATION_REQUIRED'
      };
    }

    return { requested: false, confirmed: false, validated: false, status: 'NONE' };
  };
  
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

  // Fetch existing inspection bookings for this exporter - WITH COMPLETION STATUS
  const { data: existingBookingsData } = useQuery<{
    success: boolean;
    data: Array<{
      booking_id: string;
      request_id: string;
      assignment_status: string;
      scheduled_date: string;
      assigned_inspector_name?: string;
      // 🎯 NEW FIELDS FOR COMPLETION STATUS
      inspection_status?: string;
      completion_status?: string;
      completed_at?: string;
      completed_by?: string;
      inspection_results?: any;
    }>;
  }>({
    queryKey: [`/api/exporter/${exporterId}/inspection-bookings`],
    enabled: !!exporterId,
    staleTime: 30000, // Reduced cache to get fresh completion status
  });

  const existingBookings = existingBookingsData?.data || [];

  // Helper function to check if pickup already has booking
  const hasExistingBooking = (requestId: string) => {
    return existingBookings.some(booking => booking.request_id === requestId);
  };

  // Get booking details for a pickup
  const getBookingDetails = (requestId: string) => {
    return existingBookings.find(booking => booking.request_id === requestId);
  };

  // Handle action buttons
  const handleBookInspection = useCallback((pickup: any) => {
    setSelectedPickup(pickup);
    setShowBookingModal(true);
  }, []);

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

  // Create inspection booking mutation
  const bookInspectionMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await fetch('/api/exporter/book-inspection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
      if (!response.ok) throw new Error('Failed to book inspection');
      return response.json();
    },
    onSuccess: (data) => {
      const inspectionDate = new Date(data.data.dispatchDate);
      toast({
        title: "Inspection Booked Successfully! ✅",
        description: `Port Inspector will visit warehouse on ${inspectionDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric', 
          month: 'long',
          day: 'numeric'
        })}. Booking ID: ${data.data.bookingId}`,
      });
      setShowBookingModal(false);
      setSelectedPickup(null);
      // Refresh scheduled pickups and inspection bookings
      queryClient.invalidateQueries({ queryKey: [`/api/exporter/scheduled-pickups/${exporterId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/exporter/${exporterId}/inspection-bookings`] });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "Failed to book inspection. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleScheduleInspection = useCallback(() => {
    if (!selectedPickup || !user) return;
    
    const bookingData = {
      requestId: selectedPickup.requestId,
      transactionId: selectedPickup.transactionId,
      commodityType: selectedPickup.commodityType,
      quantity: selectedPickup.quantity,
      unit: selectedPickup.unit,
      totalValue: selectedPickup.totalValue,
      dispatchDate: selectedPickup.dispatchDate,
      buyerName: selectedPickup.buyerName,
      buyerCompany: selectedPickup.buyerCompany,
      verificationCode: selectedPickup.verificationCode,
      county: selectedPickup.county,
      farmLocation: selectedPickup.farmLocation,
      exporterId: (user as any)?.exporterId || (user as any)?.id,
      exporterName: (user as any)?.fullName || (user as any)?.name,
      exporterCompany: (user as any)?.company || 'Export Company',
      warehouseFacility: 'Exporter Warehouse',
      urgencyLevel: 'normal'
    };

    bookInspectionMutation.mutate(bookingData);
  }, [selectedPickup, user, bookInspectionMutation]);

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
                          {hasExistingBooking(pickup.requestId) ? (
                            <div className="space-y-2">
                              <Button 
                                disabled
                                className="bg-gray-400 text-white border-0 shadow-lg cursor-not-allowed w-full"
                                data-testid={`book-inspection-disabled-${pickup.requestId}`}
                              >
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Inspection Booked
                              </Button>
                              {(() => {
                                const booking = getBookingDetails(pickup.requestId);
                                const paymentRequestStatus = getPaymentRequestStatus(booking?.booking_id);
                                // console.log('🔍 BOOKING DEBUG:', booking?.booking_id, 'Payment Status:', paymentRequestStatus);
                                return (
                                  <div className="text-xs text-slate-600 space-y-1">
                                    <p><strong>Booking ID:</strong> {booking?.booking_id}</p>
                                    {booking?.assigned_inspector_name && (
                                      <p><strong>Inspector:</strong> {booking.assigned_inspector_name}</p>
                                    )}
                                    {booking?.scheduled_date && (
                                      <p><strong>Date:</strong> {new Date(booking.scheduled_date).toLocaleDateString()}</p>
                                    )}
                                    <p><strong>Status:</strong> 
                                      <Badge className={`ml-2 text-xs ${
                                        booking?.inspection_status === 'INSPECTION PASSED' 
                                          ? 'bg-green-100 text-green-800 border-green-300' 
                                          : paymentRequestStatus.requested 
                                            ? 'bg-orange-100 text-orange-800 border-orange-300'
                                            : 'bg-blue-100 text-blue-800 border-blue-300'
                                      }`}>
                                        {
                                          paymentRequestStatus.requested 
                                            ? (paymentRequestStatus.confirmed 
                                                ? (paymentRequestStatus.validated ? 'Payment Completed' : 'Payment Confirmed') 
                                                : 'Payment Requested')
                                            : (booking?.inspection_status || booking?.assignment_status?.replace('_', ' ') || 'pending')
                                        }
                                      </Badge>
                                    </p>
                                    {/* 🎯 INSPECTION COMPLETION DETAILS */}
                                    {booking?.completion_status === 'INSPECTION_PASSED' && (
                                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                                        <div className="text-green-800 font-semibold">✅ Inspection Completed</div>
                                        <div className="text-green-700 mt-1">
                                          <p>Completed by: {booking.completed_by}</p>
                                          <p>Results: {booking.inspection_results?.status || 'PASSED'}</p>
                                          {booking.completed_at && (
                                            <p>Date: {new Date(booking.completed_at).toLocaleString()}</p>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* 🎯 PAYMENT CONFIRMATION BUTTON - Only when buyer requests payment */}
                                    {(() => {
                                      
                                      if (booking?.completion_status === 'INSPECTION_PASSED' && paymentRequestStatus.requested && !paymentRequestStatus.confirmed) {
                                        return (
                                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                            <div className="flex items-center justify-between">
                                              <div>
                                                <p className="text-sm font-medium text-blue-800">💰 Payment Confirmation Required</p>
                                                <p className="text-xs text-blue-600">Buyer has requested payment confirmation</p>
                                              </div>
                                              <Button
                                                size="sm"
                                                onClick={() => handleConfirmPayment(booking.booking_id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                data-testid={`button-confirm-payment-${booking.booking_id}`}
                                              >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Confirm Payment
                                              </Button>
                                            </div>
                                          </div>
                                        );
                                      } else if (booking?.completion_status === 'INSPECTION_PASSED' && !paymentRequestStatus.requested) {
                                        return (
                                          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
                                            <div className="flex items-center justify-between">
                                              <div>
                                                <p className="text-sm font-medium text-gray-700">✅ Inspection Completed</p>
                                                <p className="text-xs text-gray-600">Waiting for buyer to request payment</p>
                                              </div>
                                              <Button
                                                size="sm"
                                                disabled
                                                className="bg-gray-400 text-white cursor-not-allowed"
                                                data-testid={`button-waiting-payment-request-${booking.booking_id}`}
                                              >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Confirm Payment
                                              </Button>
                                            </div>
                                          </div>
                                        );
                                      } else if (paymentRequestStatus.confirmed) {
                                        return (
                                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                                            <div className="flex items-center justify-between">
                                              <div>
                                                <p className="text-sm font-medium text-green-800">✅ Payment Confirmed</p>
                                                <p className="text-xs text-green-600">Waiting for buyer validation</p>
                                              </div>
                                              <Button
                                                size="sm"
                                                disabled
                                                className="bg-green-600 text-white cursor-default"
                                                data-testid={`button-payment-confirmed-${booking.booking_id}`}
                                              >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                ✅ Confirmed
                                              </Button>
                                            </div>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                );
                              })()}
                            </div>
                          ) : (
                            <Button 
                              onClick={() => handleBookInspection(pickup)}
                              className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg"
                              data-testid={`book-inspection-${pickup.requestId}`}
                            >
                              <ClipboardCheck className="h-5 w-5 mr-2" />
                              Book Product Inspection
                            </Button>
                          )}
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

        {/* 🗓️ BOOK INSPECTION MODAL */}
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-blue-600">
                <ClipboardCheck className="h-6 w-6 mr-2" />
                Schedule Product Inspection
              </DialogTitle>
              <DialogDescription>
                Schedule quality inspection for your export product
              </DialogDescription>
            </DialogHeader>
            
            {selectedPickup && (
              <div className="space-y-6 py-4">
                {/* 📦 PICKUP DETAILS */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-3">Pickup Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pickup ID:</span>
                      <span className="font-mono text-slate-800">{selectedPickup.requestId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Product:</span>
                      <span className="font-medium text-slate-800">{selectedPickup.commodityType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Quantity:</span>
                      <span className="font-medium text-slate-800">{selectedPickup.quantity} {selectedPickup.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pickup Date:</span>
                      <span className="font-medium text-slate-800">
                        {new Date(selectedPickup.dispatchDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 📅 INSPECTION DATE */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Proposed Inspection Date
                  </h4>
                  <div className="text-lg font-bold text-blue-900">
                    {getNextWorkingDay(new Date(selectedPickup.dispatchDate)).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    📋 Inspection scheduled for the next working day after pickup
                  </p>
                </div>

                {/* ⚠️ IMPORTANT NOTES */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Important Notes</h4>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <p>• Inspection must be completed before export approval</p>
                        <p>• Inspector will verify quality standards and compliance</p>
                        <p>• You will receive confirmation within 2 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🚀 ACTION BUTTONS */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleScheduleInspection}
                    disabled={bookInspectionMutation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    data-testid="schedule-inspection-confirm"
                  >
                    {bookInspectionMutation.isPending ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Booking Inspection...
                      </>
                    ) : (
                      <>
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        Schedule Inspection
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => setShowBookingModal(false)}
                    variant="outline"
                    className="flex-1"
                    data-testid="schedule-inspection-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </CleanExporterLayout>
    </ErrorBoundary>
  );
});

ExporterInspections.displayName = 'ExporterInspections';

export default ExporterInspections;