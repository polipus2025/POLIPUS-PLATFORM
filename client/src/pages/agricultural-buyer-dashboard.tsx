import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Removed Tabs components - using conditional rendering instead
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Package2, 
  TrendingUp, 
  MapPin, 
  Clock, 
  DollarSign,
  Handshake,
  Truck,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PhoneCall,
  MessageCircle,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Send,
  Radio,
  Target,
  Building2,
  Loader2,
  XCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Upload, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Counter Offers Tab Component
function CounterOffersTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user to fetch counter-offers
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Fetch counter-offers for this buyer
  const { data: counterOffersResponse, isLoading } = useQuery({
    queryKey: [`/api/buyer/counter-offers/BYR-20250825-362`], // Use the actual buyer ID
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const counterOffers = counterOffersResponse?.data || [];

  // Accept counter-offer mutation
  const acceptCounterOfferMutation = useMutation({
    mutationFn: async (responseId: string) => {
      const result = await apiRequest(`/api/buyer/counter-offers/${responseId}/accept`, {
        method: "POST",
        body: JSON.stringify({
          buyerId: user?.id
        })
      });
      return result.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Counter-Offer Accepted! 🎉",
          description: `Verification code: ${data.verificationCode}`,
        });
        queryClient.invalidateQueries({ queryKey: [`/api/buyer/counter-offers/BYR-20250825-362`] });
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to accept counter-offer",
        variant: "destructive",
      });
    }
  });

  // Reject counter-offer mutation
  const rejectCounterOfferMutation = useMutation({
    mutationFn: async ({ responseId, reason }: { responseId: string; reason: string }) => {
      const result = await apiRequest(`/api/buyer/counter-offers/${responseId}/reject`, {
        method: "POST",
        body: JSON.stringify({
          buyerId: user?.id,
          rejectionReason: reason
        })
      });
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Counter-Offer Rejected",
        description: "Your response has been sent to the exporter",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/buyer/counter-offers/${user?.id}`] });
    }
  });

  if (userLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading counter-offers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Counter Offers from Exporters
          </CardTitle>
          <CardDescription>
            Review and respond to counter-offers from exporters for your marketplace listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {counterOffers && counterOffers.length > 0 ? (
            <div className="space-y-4">
              {counterOffers.map((counterOffer: any) => (
                <Card key={counterOffer.response_id} className="border border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-orange-100 text-orange-800">
                            Counter Offer
                          </Badge>
                          <span className="text-sm text-gray-500">
                            From: {counterOffer.exporter_company}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Commodity</p>
                            <p className="font-medium">{counterOffer.commodity}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Quantity</p>
                            <p className="font-medium">{counterOffer.quantity_available} MT</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Your Original Price</p>
                            <p className="font-medium text-gray-700">${counterOffer.original_price}/MT</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Exporter Counter Price</p>
                            <p className="font-bold text-lg text-orange-600">${counterOffer.counter_price_per_mt}/MT</p>
                          </div>
                        </div>

                        {counterOffer.modification_notes && (
                          <div>
                            <p className="text-sm text-gray-600">Exporter's Message</p>
                            <p className="text-sm bg-gray-50 p-3 rounded border-l-4 border-orange-400">
                              "{counterOffer.modification_notes}"
                            </p>
                          </div>
                        )}

                        <div className="text-xs text-gray-500">
                          Received: {new Date(counterOffer.created_at).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (confirm(`Accept counter-offer of $${counterOffer.counter_price_per_mt}/MT from ${counterOffer.exporter_company}?`)) {
                              acceptCounterOfferMutation.mutate(counterOffer.response_id);
                            }
                          }}
                          disabled={acceptCounterOfferMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          data-testid={`accept-counter-${counterOffer.response_id}`}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Accept
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const reason = window.prompt("Please provide a reason for rejecting this counter-offer:");
                            if (reason) {
                              rejectCounterOfferMutation.mutate({ 
                                responseId: counterOffer.response_id, 
                                reason 
                              });
                            }
                          }}
                          disabled={rejectCounterOfferMutation.isPending}
                          data-testid={`reject-counter-${counterOffer.response_id}`}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No counter-offers at this time</p>
              <p className="text-sm mt-2">Exporter responses to your marketplace offers will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AgriculturalBuyerDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [requestingBags, setRequestingBags] = useState<string | null>(null);
  const [farmersMenuOpen, setFarmersMenuOpen] = useState(false);
  
  // Manual payment confirmation states
  const [manualPaymentDialog, setManualPaymentDialog] = useState<{
    open: boolean;
    custodyId: string;
    amount: string;
  }>({ open: false, custodyId: '', amount: '' });
  const [transactionReference, setTransactionReference] = useState('');
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  // Sell to Exporter offer states
  const [sellOfferDialog, setSellOfferDialog] = useState<{
    open: boolean;
    lot: any;
  }>({ open: false, lot: null });
  const [offerType, setOfferType] = useState<'direct' | 'broadcast'>('broadcast');
  const [selectedExporter, setSelectedExporter] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [deliveryTerms, setDeliveryTerms] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [qualitySpecifications, setQualitySpecifications] = useState('');
  const [offerValidDays, setOfferValidDays] = useState('7');
  const [urgentOffer, setUrgentOffer] = useState(false);
  const [offerNotes, setOfferNotes] = useState('');
  const [creatingOffer, setCreatingOffer] = useState(false);

  // UNIVERSAL BUYER DETECTION - Same pattern as standalone transaction dashboard
  const [buyerId, setBuyerId] = useState<string>("");
  
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData?.user?.buyerId) {
          setBuyerId(parsedData.user.buyerId);
        }
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
    
    // Fallback to old method for backward compatibility
    if (!buyerId) {
      const fallbackBuyerId = localStorage.getItem("buyerId") || localStorage.getItem("userId") || "";
      setBuyerId(fallbackBuyerId);
    }
  }, []);
  
  // Fetch authentic DDGOTS-created buyer profile data
  const { data: buyerProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/buyer/profile', buyerId],
    queryFn: () => apiRequest(`/api/buyer/profile/${buyerId}`),
    enabled: !!buyerId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Use DDGOTS-created data instead of localStorage
  const buyerName = buyerProfile?.contactPersonFirstName && buyerProfile?.contactPersonLastName 
    ? `${buyerProfile.contactPersonFirstName} ${buyerProfile.contactPersonLastName}`
    : "Agricultural Buyer";
  const company = buyerProfile?.businessName || "Agricultural Trading Company";

  // Fetch product offer notifications for this buyer - REAL-TIME for offer competition
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/buyer/notifications', buyerId],
    queryFn: () => apiRequest(`/api/buyer/notifications/${buyerId}`),
    enabled: !!buyerId,
    staleTime: 0, // No cache - always fetch fresh for real-time offer status
    gcTime: 0, // Don't keep in cache
    refetchInterval: 5000, // Refresh every 5 seconds for real-time competition
  });

  // Fetch farmer harvests ready for purchase
  const { data: availableHarvests, isLoading: harvestsLoading } = useQuery({
    queryKey: ['/api/buyer/available-harvests'],
    queryFn: () => apiRequest('/api/buyer/available-harvests'),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Fetch buyer's active transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/buyer/transactions'],
    queryFn: () => apiRequest('/api/buyer/transactions'),
    staleTime: 90 * 1000, // Cache for 90 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  // Fetch marketplace data
  const { data: marketplace, isLoading: marketplaceLoading } = useQuery({
    queryKey: ['/api/buyer/marketplace'],
    queryFn: () => apiRequest('/api/buyer/marketplace'),
    staleTime: 3 * 60 * 1000, // Cache for 3 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
  });

  // Fetch buyer business metrics
  const { data: businessMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/buyer/business-metrics'],
    queryFn: () => apiRequest('/api/buyer/business-metrics'),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (metrics change slowly)
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  // Fetch confirmed transactions archive
  const { data: confirmedTransactions, isLoading: confirmedLoading } = useQuery({
    queryKey: ['/api/buyer/confirmed-transactions', buyerId],
    queryFn: () => apiRequest(`/api/buyer/confirmed-transactions/${buyerId}`),
    enabled: !!buyerId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Fetch warehouse custody lots for this buyer
  const { data: custodyLots, isLoading: custodyLoading, refetch: refetchCustodyLots } = useQuery({
    queryKey: ['/api/buyer/custody-lots', buyerId],
    queryFn: () => apiRequest(`/api/buyer/custody-lots/${buyerId}`),
    enabled: !!buyerId,
    staleTime: 30 * 1000, // Cache for 30 seconds (needs fresh data for payment status)
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
  });

  // Get current buyer's county from custodyLots
  const buyerCounty = custodyLots?.data?.[0]?.county || '';

  // Fetch available exporters for direct offers
  const { data: availableExporters, isLoading: exportersLoading } = useQuery({
    queryKey: ['/api/exporters/available'],
    queryFn: () => apiRequest('/api/exporters/available'),
    enabled: offerType === 'direct',
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch verification codes archive
  const { data: verificationCodesResponse, isLoading: codesLoading } = useQuery({
    queryKey: ['/api/buyer/verification-codes', buyerId], 
    queryFn: () => apiRequest(`/api/buyer/verification-codes/${buyerId}`),
    enabled: !!buyerId,
    staleTime: 0, // No cache - always fetch fresh data
    gcTime: 0, // Don't keep in cache
  });
  
  // Extract data from response structure
  const verificationCodes = verificationCodesResponse?.data || [];

  // Fetch existing buyer offers to check if lot already has offers
  const { data: myOffersResponse } = useQuery({
    queryKey: ['/api/buyer/my-offers', buyerId],
    queryFn: () => apiRequest(`/api/buyer/my-offers/${buyerId}`),
    enabled: !!buyerId,
    staleTime: 30 * 1000, // Cache for 30 seconds - needs to be fresh for button updates
  });
  
  // Extract offers from response
  const existingOffers = myOffersResponse?.data || [];


  // Helper function to check if lot already has offers
  const hasExistingOffers = (lot: any) => {
    if (!existingOffers || !Array.isArray(existingOffers)) return false;
    
    // Check if any offer exists for this custody lot
    return existingOffers.some((offer: any) => {
      // Match by custody ID (most reliable)
      if (lot.custodyId && offer.custodyId === lot.custodyId) return true;
      
      // Match by commodity type and weight (fallback)
      const sameType = offer.commodity === lot.commodityType;
      const sameWeight = Math.abs(parseFloat(offer.quantityAvailable || '0') - parseFloat(lot.totalWeight || '0')) < 0.1;
      
      return sameType && sameWeight;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('buyerId');
    localStorage.removeItem('buyerName');
    localStorage.removeItem('userType');
    localStorage.removeItem('company');
    navigate('/auth/farmer-login');
  };

  // Handle warehouse storage fee payment
  const handlePayStorageFees = async (custodyId: string, amount: string) => {
    try {
      const response = await apiRequest('/api/buyer/pay-storage-fees', {
        method: 'POST',
        body: JSON.stringify({
          custodyId,
          buyerId,
          paymentMethod: 'stripe',
          paymentReference: `STRIPE-${Date.now()}-${custodyId.slice(-3)}`
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      toast({
        title: "Payment Successful",
        description: `Storage fees of $${amount} paid successfully. You can now request authorization.`,
      });

      // Refresh custody lots data
      refetchCustodyLots();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to process storage fee payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle authorization request
  const handleRequestAuthorization = async (custodyId: string, commodityType: string) => {
    try {
      const response = await apiRequest('/api/buyer/request-authorization', {
        method: 'POST',
        body: JSON.stringify({
          custodyId,
          buyerId,
          requestReason: `Request authorization to sell ${commodityType} lot`,
          urgentRequest: false
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      toast({
        title: "Authorization Requested",
        description: `Authorization request submitted successfully. Reference: ${response.requestId}`,
      });

      // Refresh custody lots data
      refetchCustodyLots();
      
    } catch (error) {
      console.error('Authorization request error:', error);
      toast({
        title: "Request Failed",
        description: "Failed to submit authorization request. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Manual payment confirmation functions
  const openManualPaymentDialog = (custodyId: string, amount: string) => {
    setManualPaymentDialog({ open: true, custodyId, amount });
    setTransactionReference('');
  };

  const handleReceiptUpload = async () => {
    try {
      const response = await apiRequest('/api/receipts/upload-url', {
        method: 'POST'
      });
      return {
        method: "PUT" as const,
        url: response.uploadURL,
      };
    } catch (error) {
      console.error('Error getting upload URL:', error);
      throw error;
    }
  };

  const handleReceiptComplete = async (result: any) => {
    if (result.successful && result.successful.length > 0) {
      const receiptUrl = result.successful[0].uploadURL;
      
      try {
        setConfirmingPayment(true);
        await apiRequest('/api/storage-fees/confirm-payment-receipt', {
          method: 'POST',
          body: JSON.stringify({
            custodyId: manualPaymentDialog.custodyId,
            receiptUrl,
            buyerId
          }),
          headers: { 'Content-Type': 'application/json' }
        });
        
        toast({
          title: "Receipt Uploaded",
          description: "Payment receipt uploaded successfully. Awaiting warehouse verification.",
        });
        
        setManualPaymentDialog({ open: false, custodyId: '', amount: '' });
        refetchCustodyLots();
      } catch (error) {
        console.error('Error confirming payment:', error);
        toast({
          title: "Upload Failed",
          description: "Failed to confirm payment via receipt. Please try again.",
          variant: "destructive",
        });
      } finally {
        setConfirmingPayment(false);
      }
    }
  };

  const handleTransactionReferenceSubmit = async () => {
    if (!transactionReference.trim()) {
      toast({
        title: "Transaction Reference Required",
        description: "Please enter the transaction reference number.",
        variant: "destructive",
      });
      return;
    }

    try {
      setConfirmingPayment(true);
      await apiRequest('/api/storage-fees/confirm-payment-reference', {
        method: 'POST',
        body: JSON.stringify({
          custodyId: manualPaymentDialog.custodyId,
          transactionReference: transactionReference.trim(),
          buyerId
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      toast({
        title: "Reference Submitted",
        description: "Transaction reference submitted successfully. Awaiting warehouse verification.",
      });
      
      setManualPaymentDialog({ open: false, custodyId: '', amount: '' });
      setTransactionReference('');
      refetchCustodyLots();
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit transaction reference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConfirmingPayment(false);
    }
  };

  const connectWithFarmer = (farmerId: string) => {
    // API call to initiate connection with farmer
    // Connecting with farmer
  };

  // Open sell offer dialog
  const openSellOfferDialog = (lot: any) => {
    setSellOfferDialog({ open: true, lot });
    // Reset form fields
    setOfferType('broadcast');
    setSelectedExporter('');
    setPricePerUnit('');
    setDeliveryTerms('');
    setPaymentTerms('');
    setQualitySpecifications('');
    setOfferValidDays('7');
    setUrgentOffer(false);
    setOfferNotes('');
  };

  // Create sell offer to exporters
  const handleCreateSellOffer = async () => {
    setCreatingOffer(true);
    
    try {
      const lot = sellOfferDialog.lot;
      if (!lot || !pricePerUnit || !deliveryTerms || !paymentTerms) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const response = await apiRequest('/api/buyer/create-exporter-offer', {
        method: 'POST',
        body: JSON.stringify({
          buyerId,
          buyerCompany: localStorage.getItem('company') || 'Not specified',
          buyerContact: localStorage.getItem('buyerName') || 'Not specified',
          buyerCounty,
          custodyId: lot.custodyId,
          offerType,
          targetExporterId: offerType === 'direct' ? selectedExporter : null,
          pricePerUnit,
          deliveryTerms,
          paymentTerms,
          qualitySpecifications,
          offerValidDays: parseInt(offerValidDays),
          urgentOffer,
          offerNotes
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.success) {
        toast({
          title: "Offer Created Successfully",
          description: `${offerType === 'direct' ? 'Direct' : 'Broadcast'} offer sent to exporters. Total offer value: $${response.totalOfferPrice}`,
        });
        setSellOfferDialog({ open: false, lot: null });
        
        // Refresh existing offers to update button status
        queryClient.invalidateQueries({ queryKey: ['/api/buyer/my-offers', buyerId] });
      } else {
        throw new Error(response.message || 'Failed to create offer');
      }
    } catch (error) {
      toast({
        title: "Offer Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create offer",
        variant: "destructive",
      });
    } finally {
      setCreatingOffer(false);
    }
  };

  // Handle accepting a product offer
  const handleAcceptOffer = async (notificationId: string) => {
    try {
      const response = await apiRequest(`/api/buyer/accept-offer`, {
        method: 'POST',
        body: JSON.stringify({
          notificationId,
          buyerId: buyerId,
          buyerName: buyerName || "Michael Johnson",
          company: company || "Michael Johnson Trading"
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      // Show detailed success message with verification code
      toast({
        title: "🎉 Offerta Accettata con Successo!",
        description: `Transaction confirmed. Verification code: ${response.verificationCode}. Check transaction archive for complete details.`,
      });

      // Refresh all data
      queryClient.invalidateQueries({ queryKey: ['/api/buyer/notifications', buyerId] });
      queryClient.invalidateQueries({ queryKey: ['/api/buyer/confirmed-transactions', buyerId] });
      queryClient.invalidateQueries({ queryKey: ['/api/buyer/verification-codes', buyerId] });
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Impossibile accettare l'offerta. Potrebbe essere stata presa da un altro buyer.",
        variant: "destructive",
      });
    }
  };

  // Handle requesting bags from warehouse
  const handleRequestBags = async (verificationCode: string, acceptanceData: any) => {
    if (requestingBags) return;
    
    setRequestingBags(verificationCode);
    try {
      const response = await apiRequest('/api/buyer/request-bags', {
        method: 'POST',
        body: JSON.stringify({
          verificationCode,
          buyerId,
          buyerName,
          company,
          farmerName: acceptanceData.farmerName,
          commodityType: acceptanceData.commodityType,
          quantity: acceptanceData.quantity,
          totalValue: acceptanceData.totalValue,
          county: acceptanceData.county,
          farmLocation: acceptanceData.farmLocation
        })
      });
      
      toast({
        title: "✅ Bags Requested Successfully!",
        description: `Your request has been sent to ${acceptanceData.county} warehouse. Transaction: ${response.transactionId}`,
      });
      
      // Refresh verification codes to update status
      queryClient.invalidateQueries({ queryKey: ['/api/buyer/verification-codes', buyerId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to request bags from warehouse",
        variant: "destructive",
      });
    } finally {
      setRequestingBags(null);
    }
  };

  // SECURITY: Payment confirmation removed - only farmers can confirm payments to prevent fraud

  const accessMarketplace = () => {
    // Navigate to buyer marketplace
    navigate('/buyer-marketplace');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agricultural Buyer Portal</h1>
            {profileLoading ? (
              <p className="text-gray-600">Loading company details...</p>
            ) : (
              <p className="text-gray-600">{company}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              {profileLoading ? (
                <p className="font-medium text-gray-900">Loading...</p>
              ) : (
                <>
                  <p className="font-medium text-gray-900">{buyerName}</p>
                  {buyerProfile && (
                    <p className="text-xs text-gray-500">{buyerProfile.primaryEmail} • {buyerProfile.contactPersonTitle}</p>
                  )}
                </>
              )}
              <p className="text-sm text-gray-500">Buyer ID: {buyerId}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Enhanced Navigation with Farmers Dropdown - Prominent Styling */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200 rounded-xl mb-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            {/* Business Overview */}
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'ghost'} 
              size="lg"
              onClick={() => setActiveTab('overview')}
              className="font-semibold text-sm px-6 py-3 rounded-lg transition-all hover:scale-105"
            >
              Business Overview
            </Button>
            
            {/* My Products */}
            <Button 
              variant={activeTab === 'products' ? 'default' : 'ghost'} 
              size="lg"
              onClick={() => setActiveTab('products')}
              className="font-semibold text-sm px-6 py-3 rounded-lg transition-all hover:scale-105"
            >
              My Products
            </Button>

            {/* Farmers Dropdown Menu */}
            <div className="relative">
              <Button 
                variant={['farmers', 'notifications', 'confirmed', 'orders'].includes(activeTab) ? 'default' : 'ghost'} 
                size="lg"
                onClick={() => setFarmersMenuOpen(!farmersMenuOpen)}
                className="font-semibold text-sm px-6 py-3 rounded-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                Farmers
                {farmersMenuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
              
              {/* Enhanced Dropdown Menu */}
              {farmersMenuOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl z-20 min-w-[220px]">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setActiveTab('farmers');
                        setFarmersMenuOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 font-medium text-sm hover:bg-slate-50 transition-all ${
                        activeTab === 'farmers' ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500' : 'text-slate-700'
                      }`}
                    >
                      Farmer Connections
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setFarmersMenuOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 font-medium text-sm hover:bg-slate-50 transition-all ${
                        activeTab === 'notifications' ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500' : 'text-slate-700'
                      }`}
                    >
                      Product Offers
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('confirmed');
                        setFarmersMenuOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 font-medium text-sm hover:bg-slate-50 transition-all ${
                        activeTab === 'confirmed' ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500' : 'text-slate-700'
                      }`}
                    >
                      Confirmed Transactions
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('orders');
                        setFarmersMenuOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 font-medium text-sm hover:bg-slate-50 transition-all ${
                        activeTab === 'orders' ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500' : 'text-slate-700'
                      }`}
                    >
                      My Orders
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Counter Offers */}
            <Button 
              variant={activeTab === 'counter-offers' ? 'default' : 'ghost'} 
              size="lg"
              onClick={() => setActiveTab('counter-offers')}
              className="font-semibold text-sm px-6 py-3 rounded-lg transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Counter Offers
            </Button>

            {/* Transaction Dashboard */}
            <Button 
              variant={activeTab === 'transactions' ? 'default' : 'ghost'} 
              size="lg"
              onClick={() => setActiveTab('transactions')}
              className="font-semibold text-sm px-6 py-3 rounded-lg transition-all hover:scale-105"
            >
              Transaction Dashboard
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div>
          {/* Business Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-gray-600">Farmers Only</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Harvests</CardTitle>
                  <Package2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-gray-600">Ready for purchase</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Volume</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.5T</div>
                  <p className="text-xs text-gray-600">Commodities traded</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,200</div>
                  <p className="text-xs text-gray-600">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest connections and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">New harvest notification from John Doe</p>
                      <p className="text-sm text-gray-600">500kg cocoa beans ready - Bong County</p>
                    </div>
                    <Badge variant="outline">2 hours ago</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Exporter connection request accepted</p>
                      <p className="text-sm text-gray-600">Global Trading Ltd now available for sales</p>
                    </div>
                    <Badge variant="outline">5 hours ago</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Transaction completed</p>
                      <p className="text-sm text-gray-600">Coffee beans sold to International Export Co.</p>
                    </div>
                    <Badge variant="outline">1 day ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {/* Product Offers Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package2 className="w-5 h-5 mr-2" />
                  Product Offers from Farmers
                </CardTitle>
                <CardDescription>
                  Real-time notifications when farmers in your county submit product offers. First to accept wins!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notificationsLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading notifications...</div>
                ) : notifications && notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification: any) => (
                      <Card key={notification.notificationId} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{notification.commodityType}</h4>
                              <p className="text-sm text-gray-600">From: {notification.farmerName}</p>
                              <p className="text-sm text-gray-500">{notification.county}</p>
                            </div>
                            <Badge className={!notification.response ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {!notification.response ? 'Available' : 'Taken'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Quantity Available</p>
                              <p className="font-medium">{notification.quantityAvailable} tons</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Price per Unit</p>
                              <p className="font-medium">${notification.pricePerUnit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Value</p>
                              <p className="font-medium text-green-600">${(parseFloat(notification.quantityAvailable) * parseFloat(notification.pricePerUnit)).toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Quality Grade</p>
                              <p className="font-medium">Grade A</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Payment Terms</p>
                            <p className="text-sm">Cash on Delivery</p>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Delivery Terms</p>
                            <p className="text-sm">FOB Farm Gate</p>
                          </div>

                          {notification.description && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600">Additional Details</p>
                              <p className="text-sm">{notification.description}</p>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-3 border-t">
                            <div className="text-xs text-gray-500">
                              Posted: {new Date(notification.createdAt).toLocaleString()}
                            </div>
                            {!notification.response ? (
                              <Button 
                                onClick={() => handleAcceptOffer(notification.notificationId)}
                                className="bg-green-600 hover:bg-green-700"
                                data-testid={`button-accept-${notification.id}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Accept Offer
                              </Button>
                            ) : (
                              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                {notification.response === 'confirmed' ? '✅ You Accepted This' : '❌ Taken by Another Buyer'}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No product offers at this time.</p>
                    <p className="text-sm">Notifications will appear here when farmers in your county submit offers.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          )}

          {/* My Orders Tab - Buyer Acceptances with Request Bags */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  My Orders - Request Bags to Warehouse
                </CardTitle>
                <CardDescription>
                  Accepted offers ready for bag requests. Click "Request Bags" to send acceptance details to your county warehouse.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {codesLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading your orders...</div>
                ) : verificationCodes && verificationCodes.length > 0 ? (
                  <div className="space-y-4">
                    {verificationCodes.map((acceptance: any) => (
                      <Card key={acceptance.verificationCode} className="border border-blue-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{acceptance.commodityType}</h4>
                              <p className="text-sm text-gray-600">From: {acceptance.farmerName}</p>
                              <p className="text-sm text-gray-500">{acceptance.farmLocation}</p>
                            </div>
                            <Badge className={
                              acceptance.status === 'bags_requested' ? "bg-purple-100 text-purple-800" :
                              acceptance.status === 'payment_confirmed' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            }>
                              {acceptance.status === 'bags_requested' ? 'Bag Request Complete' :
                               acceptance.status === 'payment_confirmed' ? 'Payment Confirmed' : 'Ready for Bags'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Quantity</p>
                              <p className="font-medium">{acceptance.quantity} {acceptance.unit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Value</p>
                              <p className="font-medium text-green-600">${acceptance.totalValue}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">County</p>
                              <p className="font-medium">{acceptance.county}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Verification Code</p>
                              <p className="font-mono text-sm bg-gray-100 p-1 rounded">{acceptance.verificationCode}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Payment Terms</p>
                            <p className="text-sm">{acceptance.paymentTerms}</p>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t">
                            <div className="text-xs text-gray-500">
                              Accepted: {new Date(acceptance.confirmedAt).toLocaleString()}
                            </div>
                            {acceptance.status === 'bags_requested' ? (
                              <Button 
                                disabled
                                className="bg-gray-400 cursor-not-allowed"
                                data-testid={`button-bags-requested-${acceptance.verificationCode}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Requested
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => handleRequestBags(acceptance.verificationCode, acceptance)}
                                disabled={requestingBags === acceptance.verificationCode}
                                className="bg-blue-600 hover:bg-blue-700"
                                data-testid={`button-request-bags-${acceptance.verificationCode}`}
                              >
                                {requestingBags === acceptance.verificationCode ? (
                                  <>
                                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                                    Requesting...
                                  </>
                                ) : (
                                  <>
                                    <Truck className="w-4 h-4 mr-2" />
                                    Request Bags to Warehouse
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No confirmed orders ready for bag requests.</p>
                    <p className="text-sm">Complete payment confirmation on accepted offers to request bags from warehouse.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          )}

          {/* My Products Tab - Warehouse Custody Lots */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package2 className="w-5 h-5 mr-2" />
                    My Products in Warehouse Custody
                  </CardTitle>
                  <CardDescription>
                    Products stored in warehouse custody. Pay storage fees and request authorization to sell.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {custodyLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Loading custody lots...</span>
                    </div>
                  ) : !custodyLots?.data || custodyLots.data.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Package2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No Products in Custody</p>
                      <p className="text-sm">When warehouse creates custody of your product lots, they will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {custodyLots.data.map((lot: any) => (
                        <Card key={lot.custodyId} className="border-2">
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Product Information */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-bold text-lg text-slate-800">
                                    {lot.commodityType}
                                  </h3>
                                  <Badge 
                                    variant={lot.custodyType === 'multi_lot' ? 'secondary' : 'outline'}
                                    className="text-xs"
                                  >
                                    {lot.custodyType === 'multi_lot' ? 'Multi-Lot' : 'Single Lot'}
                                  </Badge>
                                </div>
                                
                                <div className="text-sm space-y-1">
                                  <p><span className="font-medium">Weight:</span> {lot.totalWeight} {lot.unit}</p>
                                  <p><span className="font-medium">Packages:</span> {lot.totalPackages} {lot.packagingType}</p>
                                  <p><span className="font-medium">Quality:</span> {lot.qualityGrade || 'Standard'}</p>
                                  <p><span className="font-medium">Warehouse:</span> {lot.warehouseName}</p>
                                  <p><span className="font-medium">County:</span> {lot.county}</p>
                                </div>

                                {/* Origins */}
                                <div className="text-sm">
                                  <p className="font-medium mb-1">Origins:</p>
                                  <div className="space-y-1 text-xs">
                                    {Array.isArray(lot.farmerNames) ? lot.farmerNames.map((farmer: string, index: number) => (
                                      <p key={index} className="text-gray-600">
                                        • {farmer} - {lot.farmLocations[index] || 'Location not specified'}
                                      </p>
                                    )) : (
                                      <p className="text-gray-600">• {lot.farmerNames} - {lot.farmLocations}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Storage & Payment Information */}
                              <div className="space-y-3">
                                <div className="text-sm space-y-1">
                                  <p><span className="font-medium">Custody ID:</span> {lot.custodyId}</p>
                                  <p><span className="font-medium">Registered:</span> {new Date(lot.registrationDate).toLocaleDateString()}</p>
                                  <p><span className="font-medium">Days in Storage:</span> {lot.daysInStorage} days</p>
                                  <p><span className="font-medium">Max Storage:</span> {lot.maxStorageDays} days</p>
                                  {lot.storageLocation && (
                                    <p><span className="font-medium">Location:</span> {lot.storageLocation}</p>
                                  )}
                                </div>

                                {/* Storage Fees */}
                                {lot.storageFees && (
                                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-medium text-blue-900 mb-2">Storage Fees</h4>
                                    <div className="text-sm space-y-1">
                                      <p><span className="font-medium">Rate:</span> ${lot.storageFees.storageRate}/metric ton</p>
                                      <p><span className="font-medium">Amount Due:</span> <span className="font-bold text-blue-700">${lot.storageFees.amountDue}</span></p>
                                      <p>
                                        <span className="font-medium">Payment Status:</span>
                                        <Badge 
                                          variant={lot.storageFees.paymentStatus === 'paid' ? 'default' : 'destructive'}
                                          className="ml-2 text-xs"
                                        >
                                          {lot.storageFees.paymentStatus}
                                        </Badge>
                                      </p>
                                      {lot.storageFees.paymentStatus === 'paid' && lot.storageFees.paidDate && (
                                        <p className="text-green-600">
                                          <span className="font-medium">Paid:</span> {new Date(lot.storageFees.paidDate).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Status & Actions */}
                              <div className="space-y-3">
                                <div className="text-sm space-y-1">
                                  <p>
                                    <span className="font-medium">Custody Status:</span>
                                    <Badge 
                                      variant={lot.custodyStatus === 'stored' ? 'secondary' : 'default'}
                                      className="ml-2 text-xs"
                                    >
                                      {lot.custodyStatus}
                                    </Badge>
                                  </p>
                                  <p>
                                    <span className="font-medium">Authorization:</span>
                                    <Badge 
                                      variant={lot.authorizationStatus === 'authorized' ? 'default' : 'outline'}
                                      className="ml-2 text-xs"
                                    >
                                      {lot.authorizationStatus}
                                    </Badge>
                                  </p>
                                  {lot.authorizedDate && (
                                    <p className="text-green-600">
                                      <span className="font-medium">Authorized:</span> {new Date(lot.authorizedDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                  {lot.storageFees?.paymentStatus !== 'paid' ? (
                                    <>
                                      <Button 
                                        onClick={() => handlePayStorageFees(lot.custodyId, lot.storageFees?.amountDue || '0')}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        size="sm"
                                      >
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Pay Warehouse Fees (${lot.storageFees?.amountDue || '0'})
                                      </Button>
                                      <Button 
                                        onClick={() => openManualPaymentDialog(lot.custodyId, lot.storageFees?.amountDue || '0')}
                                        variant="outline"
                                        className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                                        size="sm"
                                      >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Manual Payment Confirmation
                                      </Button>
                                    </>
                                  ) : lot.authorizationStatus !== 'authorized' ? (
                                    <Button 
                                      onClick={() => handleRequestAuthorization(lot.custodyId, lot.commodityType)}
                                      className="w-full bg-blue-600 hover:bg-blue-700"
                                      size="sm"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Request Authorization
                                    </Button>
                                  ) : hasExistingOffers(lot) ? (
                                    <Button 
                                      disabled
                                      className="w-full bg-orange-500 hover:bg-orange-600 cursor-not-allowed"
                                      size="sm"
                                    >
                                      <Clock className="w-4 h-4 mr-2" />
                                      Offer Created - Waiting Acceptance
                                    </Button>
                                  ) : (
                                    <Button 
                                      onClick={() => openSellOfferDialog(lot)}
                                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                                      size="sm"
                                    >
                                      <Send className="w-4 h-4 mr-2" />
                                      Sell This Lot
                                    </Button>
                                  )}

                                  {/* QR Code Info */}
                                  {lot.consolidatedQrCode && (
                                    <div className="text-xs text-gray-600 mt-2">
                                      <p><span className="font-medium">QR Code:</span> {lot.consolidatedQrCode}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {/* Summary */}
                      <Card className="bg-slate-50 border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-700">
                              Total Products: {custodyLots.data.length} lots
                            </span>
                            <span className="text-sm text-slate-600">
                              Total Weight: {custodyLots.data.reduce((sum: number, lot: any) => sum + parseFloat(lot.totalWeight), 0).toFixed(2)} tons
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Farmer Connections Tab */}
          {activeTab === 'farmers' && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Harvests from Farmers</CardTitle>
                <CardDescription>Farmers who have confirmed their harvesting and ready for purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {harvestsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading available harvests...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableHarvests && Array.isArray(availableHarvests) && availableHarvests.length > 0 ? (
                          availableHarvests.map((harvest: any, index: number) => (
                            <Card key={harvest.id || index} className={`border-2 ${harvest.farmerName === 'Paolo' ? 'border-blue-200 bg-blue-50' : 'border-green-200'}`}>
                              <CardHeader>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-lg">{harvest.farmerName}</CardTitle>
                                    <p className="text-sm text-gray-600">Farmer ID: {harvest.farmerId}</p>
                                    {harvest.farmerName === 'Paolo' && (
                                      <Badge className="bg-blue-100 text-blue-800 mt-1">🎯 Margibi County</Badge>
                                    )}
                                  </div>
                                  <Badge className={`${harvest.status === 'Ready' || harvest.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {harvest.status || 'Ready'}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm">
                                    <Package2 className="h-4 w-4 mr-2 text-green-600" />
                                    <span className="font-medium">
                                      {harvest.commodity || harvest.commodityType} - {harvest.quantity || harvest.quantityAvailable}{harvest.unit ? ` ${harvest.unit}` : ''}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>{harvest.county}{harvest.farmLocation ? `, ${harvest.farmLocation}` : ''}</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                    <span>Harvested: {harvest.harvestDate ? new Date(harvest.harvestDate).toLocaleDateString() : 'Recently'}</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                    <span className="font-medium">
                                      ${harvest.pricePerUnit || harvest.pricePerKg}/{harvest.unit || 'kg'}
                                      {harvest.totalValue && (
                                        <span className="text-blue-600 ml-2">(Total: ${harvest.totalValue})</span>
                                      )}
                                    </span>
                                  </div>
                                  {harvest.qualityGrade && (
                                    <div className="flex items-center text-sm">
                                      <CheckCircle className="h-4 w-4 mr-2 text-purple-500" />
                                      <span className="font-medium text-purple-700">Quality: {harvest.qualityGrade}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-2 mt-4">
                                  <Button 
                                    size="sm" 
                                    className={`flex-1 ${harvest.farmerName === 'Paolo' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                    onClick={() => connectWithFarmer(harvest.farmerId)}
                                  >
                                    <Handshake className="h-4 w-4 mr-1" />
                                    {harvest.farmerName === 'Paolo' ? 'Connect with Paolo Jr!' : 'Connect'}
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <PhoneCall className="h-4 w-4 mr-1" />
                                    Call
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">No harvests available at the moment</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {/* Confirmed Transactions Archive Tab */}
          {activeTab === 'confirmed' && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Confirmed Transactions Archive
                </CardTitle>
                <CardDescription>
                  Complete history of accepted offers with payment and delivery details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {confirmedLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading transactions...</div>
                ) : confirmedTransactions && confirmedTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {confirmedTransactions.map((transaction: any) => (
                      <Card key={transaction.id} className="border border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg text-green-800">{transaction.commodityType}</h4>
                              <p className="text-sm text-gray-600">Farmer: {transaction.farmerName}</p>
                              <p className="text-sm text-gray-500">{transaction.farmLocation}</p>
                            </div>
                            <Badge className="bg-green-600 text-white">Confirmed</Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Quantity</p>
                              <p className="font-medium">{transaction.quantityAvailable} {transaction.unit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Value</p>
                              <p className="font-medium text-green-600">${transaction.totalValue}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Verification Code</p>
                              <p className="font-mono font-bold text-blue-600">{transaction.verificationCode}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Payment Terms</p>
                              <p className="text-sm">{transaction.paymentTerms}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Delivery Terms</p>
                              <p className="text-sm">{transaction.deliveryTerms}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-green-200">
                            <div className="text-xs text-gray-500">
                              Confirmed: {new Date(transaction.confirmedAt).toLocaleString()}
                            </div>
                            <div className="flex items-center space-x-2">
                              {transaction.paymentConfirmed ? (
                                <Badge className="bg-green-600 text-white">
                                  ✓ Payment Confirmed by Farmer
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Awaiting Farmer Payment Confirmation
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                ID: {transaction.notificationId}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No confirmed transactions at this time</p>
                    <p className="text-sm mt-2">Accepted offers will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          )}

          {/* Counter Offers Tab */}
          {activeTab === 'counter-offers' && (
            <CounterOffersTab />
          )}

          {/* Transaction Dashboard Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Dashboard</CardTitle>
                <CardDescription>Overview of all your buying and selling activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                      <Package2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${confirmedTransactions?.reduce((sum: number, t: any) => sum + parseFloat(t.totalValue || 0), 0).toLocaleString() || '0'}
                      </div>
                      <p className="text-xs text-gray-600">From confirmed orders</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{confirmedTransactions?.length || 0}</div>
                      <p className="text-xs text-gray-600">Confirmed transactions</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                      <DollarSign className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {confirmedTransactions?.filter((t: any) => !t.paymentConfirmed).length || 0}
                      </div>
                      <p className="text-xs text-gray-600">Awaiting payment</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Transactions Table */}
                <div className="border rounded-lg">
                  <div className="p-4 border-b bg-gray-50">
                    <h4 className="font-medium">Recent Transactions</h4>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {confirmedTransactions && confirmedTransactions.length > 0 ? (
                        confirmedTransactions.slice(0, 4).map((transaction: any, index: number) => (
                          <div key={transaction.id} className="flex items-center justify-between py-2 border-b">
                            <div>
                              <p className="font-medium">Purchase from {transaction.farmerName}</p>
                              <p className="text-sm text-gray-600">{transaction.quantityAvailable} {transaction.unit} {transaction.commodityType}</p>
                              <p className="text-xs text-blue-600 font-mono">Code: {transaction.verificationCode}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-red-600">${transaction.totalValue}</p>
                              <p className="text-sm text-gray-600">{new Date(transaction.confirmedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-between py-2 border-b">
                          <div>
                            <p className="font-medium">No real transactions yet</p>
                            <p className="text-sm text-gray-600">Accept offers to see your purchases here</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-500">$0</p>
                            <p className="text-sm text-gray-600">Pending</p>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}
        </div>
      </div>

      {/* Manual Payment Confirmation Dialog */}
      <Dialog 
        open={manualPaymentDialog.open} 
        onOpenChange={(open) => setManualPaymentDialog(prev => ({...prev, open}))}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
              Manual Payment Confirmation
            </DialogTitle>
            <DialogDescription>
              Confirm your storage fee payment of ${manualPaymentDialog.amount} for custody lot {manualPaymentDialog.custodyId}.
              Choose one method below:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Option 1: Upload Receipt */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                <h4 className="font-semibold text-sm">Option 1: Upload Payment Receipt</h4>
              </div>
              <p className="text-sm text-gray-600">
                Upload a screenshot or photo of your payment confirmation from your bank or mobile money service.
              </p>
              <ObjectUploader
                maxNumberOfFiles={1}
                maxFileSize={5 * 1024 * 1024} // 5MB
                onGetUploadParameters={handleReceiptUpload}
                onComplete={handleReceiptComplete}
                buttonClassName="w-full bg-blue-600 hover:bg-blue-700"
              >
                <div className="flex items-center justify-center">
                  {confirmingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Payment Receipt
                    </>
                  )}
                </div>
              </ObjectUploader>
            </div>

            {/* Option 2: Transaction Reference */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                <h4 className="font-semibold text-sm">Option 2: Enter Transaction Reference</h4>
              </div>
              <p className="text-sm text-gray-600">
                Enter the transaction reference number or confirmation code from your payment.
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="transaction-ref" className="text-sm font-medium">
                    Transaction Reference Number
                  </Label>
                  <Input
                    id="transaction-ref"
                    placeholder="e.g., TXN123456789, MP240825001, etc."
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleTransactionReferenceSubmit}
                  disabled={!transactionReference.trim() || confirmingPayment}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {confirmingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Submit Reference Number
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> After submitting either option, the warehouse inspector will verify your payment. 
                You'll be notified once verification is complete and you can proceed with authorization requests.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sell Offer Dialog */}
      <Dialog open={sellOfferDialog.open} onOpenChange={(open) => setSellOfferDialog({ open, lot: sellOfferDialog.lot })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Send className="w-5 h-5 mr-2" />
              Sell Lot to Exporters
            </DialogTitle>
            <DialogDescription>
              Create an offer to sell your authorized custody lot to exporters in your county.
            </DialogDescription>
          </DialogHeader>
          
          {sellOfferDialog.lot && (
            <div className="space-y-6">
              {/* Lot Summary */}
              <div className="p-4 bg-slate-50 rounded-lg border">
                <h3 className="font-medium text-slate-800 mb-2">Lot Summary</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="font-medium">Product:</span> {sellOfferDialog.lot.commodityType}</div>
                  <div><span className="font-medium">Weight:</span> {sellOfferDialog.lot.totalWeight} {sellOfferDialog.lot.unit}</div>
                  <div><span className="font-medium">Grade:</span> {sellOfferDialog.lot.qualityGrade || 'Standard'}</div>
                  <div><span className="font-medium">County:</span> {sellOfferDialog.lot.county}</div>
                </div>
              </div>

              {/* Offer Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Offer Type</Label>
                <RadioGroup value={offerType} onValueChange={(value: 'direct' | 'broadcast') => setOfferType(value)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="broadcast" id="broadcast" />
                    <div className="flex items-center">
                      <Radio className="w-4 h-4 mr-2 text-blue-600" />
                      <Label htmlFor="broadcast" className="cursor-pointer">
                        <div>
                          <div className="font-medium">County-Wide Broadcast</div>
                          <div className="text-sm text-gray-600">Send offer to all exporters in {buyerCounty} County</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="direct" id="direct" />
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2 text-green-600" />
                      <Label htmlFor="direct" className="cursor-pointer">
                        <div>
                          <div className="font-medium">Direct to Specific Exporter</div>
                          <div className="text-sm text-gray-600">Send offer to a specific exporter</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Exporter Selection (for direct offers) */}
              {offerType === 'direct' && (
                <div className="space-y-2">
                  <Label htmlFor="exporter-select">Select Exporter</Label>
                  <Select value={selectedExporter} onValueChange={setSelectedExporter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an exporter..." />
                    </SelectTrigger>
                    <SelectContent>
                      {exportersLoading ? (
                        <SelectItem value="loading" disabled>Loading exporters...</SelectItem>
                      ) : availableExporters?.length > 0 ? (
                        availableExporters.map((exporter: any) => (
                          <SelectItem key={exporter.exporterId} value={exporter.exporterId}>
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 mr-2" />
                              {exporter.companyName} ({exporter.county})
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-exporters" disabled>No exporters available in {buyerCounty}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Offer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price-per-unit">Price per {sellOfferDialog.lot?.unit || 'unit'} ($) *</Label>
                  <Input
                    id="price-per-unit"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter price like: 500"
                    value={pricePerUnit}
                    onChange={(e) => {
                      // Only allow numbers and clear formatting
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setPricePerUnit(value);
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="text-xs text-slate-500">
                    Just type the number: 500, 600, 750, etc.
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offer-valid-days">Offer Valid (Days)</Label>
                  <Select value={offerValidDays} onValueChange={setOfferValidDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="14">14 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-terms">Delivery Terms *</Label>
                <Select value={deliveryTerms} onValueChange={setDeliveryTerms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery terms..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FOB Warehouse">FOB Warehouse</SelectItem>
                    <SelectItem value="Delivered to Port">Delivered to Port</SelectItem>
                    <SelectItem value="Delivered to Exporter">Delivered to Exporter</SelectItem>
                    <SelectItem value="Custom Arrangement">Custom Arrangement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-terms">Payment Terms *</Label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Payment on Delivery">Payment on Delivery</SelectItem>
                    <SelectItem value="Payment in Advance">Payment in Advance</SelectItem>
                    <SelectItem value="30 Days Net">30 Days Net</SelectItem>
                    <SelectItem value="Letter of Credit">Letter of Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality-specs">Quality Specifications</Label>
                <Textarea
                  id="quality-specs"
                  placeholder="Describe quality standards, certifications, etc..."
                  value={qualitySpecifications}
                  onChange={(e) => setQualitySpecifications(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offer-notes">Additional Notes</Label>
                <Textarea
                  id="offer-notes"
                  placeholder="Any additional information for exporters..."
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  rows={2}
                />
              </div>

              {pricePerUnit && sellOfferDialog.lot && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium text-green-800">Total Offer Value: </span>
                    <span className="text-lg font-bold text-green-900">
                      ${(parseFloat(pricePerUnit) * parseFloat(sellOfferDialog.lot.totalWeight)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSellOfferDialog({ open: false, lot: null })}
                  disabled={creatingOffer}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSellOffer}
                  disabled={creatingOffer || !pricePerUnit || !deliveryTerms || !paymentTerms || (offerType === 'direct' && !selectedExporter)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {creatingOffer ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Creating Offer...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {offerType === 'direct' ? 'Send Direct Offer' : 'Broadcast Offer'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}