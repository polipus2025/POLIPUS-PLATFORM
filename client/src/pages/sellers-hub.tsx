import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  DollarSign, 
  Clock, 
  MapPin, 
  User, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Eye,
  Calendar,
  Smartphone,
  ArrowLeft,
  Mail,
  Phone
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

// Real exporter data from authentication system

interface BuyerExporterOffer {
  id: number;
  offerId: string;
  buyerId: number;
  buyerCompany: string;
  buyerContact: string;
  buyerPhone?: string;
  offerType: string;
  targetExporterId?: number;
  targetExporterCompany?: string;
  commodity: string;
  quantityAvailable: string | number;
  pricePerMT: string | number;
  totalValue: string | number;
  qualityGrade: string;
  deliveryTerms: string;
  paymentTerms: string;
  deliveryTimeframe: string;
  originLocation: string;
  county: string;
  proposedPort?: string;
  status: string;
  expiresAt: string;
  viewCount: number;
  responseCount: number;
  acceptedCount: number;
  createdAt: string;
  updatedAt: string;
}

interface NegotiationData {
  counterPricePerMT: number;
  messageToBuyer: string;
}

export default function SellersHub() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOffer, setSelectedOffer] = useState<BuyerExporterOffer | null>(null);
  const [showNegotiationDialog, setShowNegotiationDialog] = useState(false);
  const [showMobilePaymentDialog, setShowMobilePaymentDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [activeTab, setActiveTab] = useState("all-offers");

  // Get real authenticated exporter data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 30000, // 30 seconds cache for speed
    gcTime: 300000, // 5 minutes garbage collection
  });

  // Debug: Log user data to see what we're getting
  useEffect(() => {
    if (user) {
      console.log('🔍 Sellers Hub - Current User Data:', user);
    }
  }, [user]);

  // Fetch all active offers with proper typing
  const { data: offers = [], isLoading } = useQuery<BuyerExporterOffer[]>({
    queryKey: ['/api/sellers-hub/offers'],
    refetchInterval: 30000 // Refresh every 30 seconds for real-time updates
  });

  // Get offers specifically for this exporter with proper typing
  const { data: myOffers = [] } = useQuery<BuyerExporterOffer[]>({
    queryKey: [`/api/exporters/${(user as any)?.id}/offers`],
    refetchInterval: 30000,
    enabled: !!(user as any)?.id // Only run query when we have exporter ID
  });

  // Fetch rejected counter-offers for fallback opportunities
  const { data: rejectedCounterOffers = [] as any[], isLoading: rejectedLoading } = useQuery({
    queryKey: [`/api/exporter/rejected-counter-offers/${(user as any)?.exporterId || (user as any)?.id}`],
    enabled: !!((user as any)?.exporterId || (user as any)?.id),
  });

  // Accept offer mutation
  const acceptOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      const result = await apiRequest(`/api/exporter/accept-offer`, {
        method: "POST",
        body: JSON.stringify({
          offerId: offerId,
          exporterId: (user as any)?.id,
          exporterCompany: (user as any)?.companyName,
          responseNotes: "Accepted via Sellers Hub"
        })
      });
      return result.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setVerificationCode(data.verificationCode);
        toast({
          title: "Offer Accepted! 🎉",
          description: `Verification code: ${data.verificationCode}`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/sellers-hub/offers'] });
        setSelectedOffer(null);
      } else {
        toast({
          title: "Unable to Accept",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to accept offer",
        variant: "destructive",
      });
    }
  });

  // Reject offer mutation
  const rejectOfferMutation = useMutation({
    mutationFn: async ({ offerId, reason }: { offerId: string; reason: string }) => {
      const result = await apiRequest(`/api/exporter/reject-offer`, {
        method: "POST",
        body: JSON.stringify({
          offerId: offerId,
          exporterId: (user as any)?.id,
          exporterCompany: (user as any)?.companyName,
          rejectionReason: reason
        })
      });
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Offer Rejected",
        description: "Your response has been sent to the buyer",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sellers-hub/offers'] });
      queryClient.invalidateQueries({ queryKey: [`/api/exporters/${(user as any)?.id}/offers`] });
      setSelectedOffer(null);
    },
    onError: (error) => {
      console.error("Reject offer error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject offer",
        variant: "destructive",
      });
    }
  });

  // Start negotiation mutation
  const negotiateMutation = useMutation({
    mutationFn: async ({ offerId, negotiationData }: { offerId: string; negotiationData: NegotiationData }) => {
      const payload = {
        exporterId: (user as any)?.id,
        exporterCompany: (user as any)?.companyName,
        exporterContact: (user as any)?.contactPerson || (user as any)?.email,
        counterPricePerMT: negotiationData.counterPricePerMT,
        messageToBuyer: negotiationData.messageToBuyer
      };
      
      const response = await fetch(`/api/buyer-exporter-offers/${offerId}/negotiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send counter-offer: ${errorText}`);
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Counter-Offer Sent! 📤",
        description: "Your counter-price has been sent to the buyer for review",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sellers-hub/offers'] });
      setShowNegotiationDialog(false);
      setSelectedOffer(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send counter-offer: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Accept original price after counter-offer rejection
  const acceptOriginalPriceMutation = useMutation({
    mutationFn: async (responseId: string) => {
      const result = await apiRequest(`/api/exporter/accept-original-price/${responseId}`, {
        method: "POST",
        body: JSON.stringify({
          exporterId: (user as any)?.exporterId || (user as any)?.id
        })
      });
      return result.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setVerificationCode(data.verificationCode);
        toast({
          title: "Original Price Accepted! 🎉",
          description: `Deal closed at original price. Verification code: ${data.verificationCode}`,
        });
        queryClient.invalidateQueries({ queryKey: [`/api/exporter/rejected-counter-offers/${(user as any)?.exporterId || (user as any)?.id}`] });
      } else {
        toast({
          title: "Unable to Accept",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to accept original price",
        variant: "destructive",
      });
    },
  });

  const getOfferTypeColor = (type: string) => {
    switch (type) {
      case 'direct': return 'bg-blue-100 text-blue-800';
      case 'broadcast_all': return 'bg-purple-100 text-purple-800';
      case 'broadcast_county': return 'bg-green-100 text-green-800';
      case 'broadcast_commodity': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOfferTypeLabel = (type: string) => {
    switch (type) {
      case 'direct': return 'Direct Offer';
      case 'broadcast_all': return 'Open to All';
      case 'broadcast_county': return 'County Broadcast';
      case 'broadcast_commodity': return 'Commodity Broadcast';
      default: return type;
    }
  };

  const isOfferExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffHours = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours <= 0) return "Expired";
    if (diffHours < 24) return `${diffHours}h remaining`;
    const days = Math.ceil(diffHours / 24);
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  };

  // Smart price formatting - no decimals for whole numbers
  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price || 0;
    return numPrice % 1 === 0 ? numPrice.toString() : numPrice.toFixed(2);
  };

  const OfferCard = ({ offer }: { offer: BuyerExporterOffer }) => (
    <Card 
      key={offer.id} 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500"
      onClick={() => setSelectedOffer(offer)}
      data-testid={`offer-card-${offer.offerId}`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">
              {offer.commodity} - {typeof offer.quantityAvailable === 'string' ? parseFloat(offer.quantityAvailable || '0') : offer.quantityAvailable || 0} MT
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">{offer.buyerCompany}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${formatPrice(offer.pricePerMT || 0)}/MT
            </div>
            <div className="text-sm text-slate-500">
              Total: ${(typeof offer.totalValue === 'string' ? parseFloat(offer.totalValue) : offer.totalValue || 0).toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Badge className={getOfferTypeColor(offer.offerType)}>
            {getOfferTypeLabel(offer.offerType)}
          </Badge>
          <Badge variant="outline" className="text-slate-600">
            {offer.qualityGrade}
          </Badge>
          {isOfferExpired(offer.expiresAt) ? (
            <Badge variant="destructive">Expired</Badge>
          ) : (
            <Badge variant="secondary" className="text-orange-600">
              <Clock className="w-3 h-3 mr-1" />
              {getTimeRemaining(offer.expiresAt)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span>{offer.originLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-500" />
            <span>{offer.deliveryTerms}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-500" />
            <span>{offer.paymentTerms}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-500" />
            <span>{offer.viewCount} views</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500">
              Posted {format(new Date(offer.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex gap-2">
              {/* Call Button */}
              {offer.buyerPhone && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Show phone number in alert for calling
                    alert(`📞 Call Buyer:\n\nCompany: ${offer.buyerCompany}\nContact: ${offer.buyerContact}\nPhone: ${offer.buyerPhone}\n\nTap OK to call now`);
                    window.open(`tel:${offer.buyerPhone}`, '_self');
                  }}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  data-testid={`call-buyer-${offer.offerId}`}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
              )}
              
              {/* Chat Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOffer(offer);
                  setShowNegotiationDialog(true);
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                data-testid={`chat-buyer-${offer.offerId}`}
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                Chat
              </Button>
              
              {/* Accept & Reject Buttons */}
              {!isOfferExpired(offer.expiresAt) && offer.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Accept offer ${offer.offerId} for ${offer.commodity}?\n\nPrice: $${formatPrice(offer.pricePerMT || 0)}/MT\nQuantity: ${offer.quantityAvailable} MT\nTotal: $${(typeof offer.totalValue === 'string' ? parseFloat(offer.totalValue) : offer.totalValue || 0).toLocaleString()}\n\nA verification code will be generated.`)) {
                        acceptOfferMutation.mutate(offer.offerId);
                      }
                    }}
                    disabled={acceptOfferMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    data-testid={`quick-accept-${offer.offerId}`}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Accept
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      const reason = window.prompt("Please provide a reason for rejection:");
                      if (reason) {
                        rejectOfferMutation.mutate({ 
                          offerId: offer.offerId, 
                          reason 
                        });
                      }
                    }}
                    disabled={rejectOfferMutation.isPending}
                    data-testid={`quick-reject-${offer.offerId}`}
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OfferDetailsDialog = () => {
    if (!selectedOffer) return null;

    const [negotiationData, setNegotiationData] = useState<NegotiationData>({
      counterPricePerMT: typeof selectedOffer.pricePerMT === 'string' ? parseFloat(selectedOffer.pricePerMT) : selectedOffer.pricePerMT || 0,
      messageToBuyer: ""
    });

    const [rejectionReason, setRejectionReason] = useState("");

    return (
      <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Offer Details - {selectedOffer.offerId}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buyer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Buyer Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">{selectedOffer.buyerCompany}</span>
                </div>
                <div className="space-y-2 bg-blue-50 p-3 rounded-lg border">
                  <div className="text-sm font-medium text-blue-800">Contact for Negotiation:</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <a href={`mailto:${selectedOffer.buyerContact}`} className="text-blue-600 hover:underline">
                      {selectedOffer.buyerContact}
                    </a>
                  </div>
                  {selectedOffer.buyerPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-green-600" />
                      <a href={`tel:${selectedOffer.buyerPhone}`} className="text-green-600 hover:underline font-medium">
                        {selectedOffer.buyerPhone}
                      </a>
                      <span className="text-xs text-slate-500">(Tap to call)</span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-slate-600">
                  Location: {selectedOffer.originLocation}, {selectedOffer.county}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Product Details</h3>
              <div className="space-y-2">
                <div><strong>Commodity:</strong> {selectedOffer.commodity}</div>
                <div><strong>Quality Grade:</strong> {selectedOffer.qualityGrade}</div>
                <div><strong>Quantity:</strong> {selectedOffer.quantityAvailable}</div>
                <div><strong>Price per MT:</strong> ${formatPrice(selectedOffer.pricePerMT || 0)}</div>
                <div><strong>Total Value:</strong> ${(typeof selectedOffer.totalValue === 'string' ? parseFloat(selectedOffer.totalValue) : selectedOffer.totalValue || 0).toLocaleString()}</div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-semibold text-lg border-b pb-2">Terms & Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Delivery Terms:</strong> {selectedOffer.deliveryTerms}</div>
                <div><strong>Payment Terms:</strong> {selectedOffer.paymentTerms}</div>
                <div><strong>Delivery Timeframe:</strong> {selectedOffer.deliveryTimeframe}</div>
                {selectedOffer.proposedPort && (
                  <div><strong>Proposed Port:</strong> {selectedOffer.proposedPort}</div>
                )}
              </div>
            </div>

            {/* Offer Statistics */}
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{selectedOffer.viewCount}</div>
                  <div className="text-sm text-slate-600">Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{selectedOffer.responseCount}</div>
                  <div className="text-sm text-slate-600">Responses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{selectedOffer.acceptedCount}</div>
                  <div className="text-sm text-slate-600">Accepted</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!isOfferExpired(selectedOffer.expiresAt) && selectedOffer.status === 'active' && (
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <Button 
                onClick={() => acceptOfferMutation.mutate(selectedOffer.offerId)}
                disabled={acceptOfferMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
                data-testid={`accept-offer-${selectedOffer.offerId}`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {acceptOfferMutation.isPending ? "Accepting..." : "Accept Offer"}
              </Button>

              <Button 
                variant="outline"
                onClick={() => setShowNegotiationDialog(true)}
                data-testid={`negotiate-offer-${selectedOffer.offerId}`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Negotiate
              </Button>

              <Button 
                variant="destructive"
                onClick={() => {
                  const reason = window.prompt("Please provide a reason for rejection:");
                  if (reason) {
                    rejectOfferMutation.mutate({ 
                      offerId: selectedOffer.offerId, 
                      reason 
                    });
                  }
                }}
                disabled={rejectOfferMutation.isPending}
                data-testid={`reject-offer-${selectedOffer.offerId}`}
              >
                <XCircle className="w-4 h-4 mr-2" />
                {rejectOfferMutation.isPending ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          )}

          {/* Chat & Negotiation Dialog */}
          <Dialog open={showNegotiationDialog} onOpenChange={setShowNegotiationDialog}>
            <DialogContent className="max-w-3xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Chat & Negotiate with {selectedOffer.buyerCompany}
                </DialogTitle>
                <div className="text-sm text-slate-600">
                  Offer: {selectedOffer.offerId} • {selectedOffer.commodity} • {selectedOffer.quantityAvailable} MT • ${formatPrice(selectedOffer.pricePerMT || 0)}/MT
                </div>
              </DialogHeader>
              
              {/* Contact Information */}
              <div className="bg-blue-50 p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-blue-800">Direct Contact Info:</div>
                  {selectedOffer.buyerPhone && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        alert(`📞 Calling ${selectedOffer.buyerCompany}\n\nContact: ${selectedOffer.buyerContact}\nPhone: ${selectedOffer.buyerPhone}`);
                        window.open(`tel:${selectedOffer.buyerPhone}`, '_self');
                      }}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call Now
                    </Button>
                  )}
                </div>
                <div className="flex gap-4 text-sm mt-2">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <a href={`mailto:${selectedOffer.buyerContact}`} className="text-blue-600 hover:underline">
                      {selectedOffer.buyerContact}
                    </a>
                  </span>
                  {selectedOffer.buyerPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <a href={`tel:${selectedOffer.buyerPhone}`} className="text-green-600 hover:underline">
                        {selectedOffer.buyerPhone}
                      </a>
                    </span>
                  )}
                </div>
              </div>

              {/* Info: Accept/Reject on main cards */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Use Accept/Reject buttons on the main offer cards for quick decisions. This chat is for negotiation and counter-offers.
                </div>
              </div>
              
              {/* Simplified Counter-Offer Form */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-slate-700">Send a counter-offer:</div>
                
                <div>
                  <Label>Counter Price per MT ($)</Label>
                  <Input
                    type="text"
                    value={negotiationData.counterPricePerMT || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow typing numbers and decimal points
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setNegotiationData(prev => ({
                          ...prev,
                          counterPricePerMT: value === '' ? 0 : parseFloat(value) || 0
                        }));
                      }
                    }}
                    placeholder={`Original: $${formatPrice(selectedOffer.pricePerMT || 0)}`}
                    data-testid="counter-price-input"
                  />
                </div>

                <div>
                  <Label>Message to Buyer</Label>
                  <Textarea
                    value={negotiationData.messageToBuyer}
                    onChange={(e) => setNegotiationData(prev => ({
                      ...prev,
                      messageToBuyer: e.target.value
                    }))}
                    placeholder="Explain your counter-price or ask questions..."
                    rows={4}
                    data-testid="message-to-buyer-textarea"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => {
                      negotiateMutation.mutate({
                        offerId: selectedOffer.offerId,
                        negotiationData
                      });
                    }}
                    disabled={negotiateMutation.isPending}
                    data-testid="submit-negotiation-button"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {negotiateMutation.isPending ? "Sending..." : "Send Counter-Offer"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNegotiationDialog(false)}
                  >
                    Close Chat
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    );
  };

  // Verification Code Display Dialog
  const VerificationCodeDialog = () => (
    <Dialog open={!!verificationCode} onOpenChange={() => setVerificationCode("")}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">🎉 Offer Accepted!</DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <div className="bg-green-50 p-6 rounded-lg border">
            <p className="text-sm text-slate-600 mb-2">Verification Code:</p>
            <p className="text-3xl font-mono font-bold text-green-600 tracking-wider">
              {verificationCode}
            </p>
          </div>
          
          <p className="text-sm text-slate-600">
            Please save this verification code. You'll need it for payment processing and delivery coordination.
          </p>
          
          <Button 
            onClick={() => setShowMobilePaymentDialog(true)}
            className="w-full"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Process Mobile Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Filter offers based on active tab
  const filteredOffers = activeTab === 'my-offers' ? myOffers : offers;

  // Show loading state while user data or offers are loading
  if (userLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="ml-4 text-slate-600">Loading Sellers Hub...</p>
      </div>
    );
  }

  // If no user data, show error
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Authentication Error</p>
          <p className="text-slate-600">Unable to load exporter profile. Please log in again.</p>
          <Link href="/exporter-login">
            <Button className="mt-4">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Back Button */}
      <div className="flex items-center mb-4">
        <Link href="/exporter-dashboard">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
            data-testid="back-button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Sellers Hub</h1>
        <p className="text-slate-600">Browse buyer offers and grow your export business</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">{offers.length}</div>
            <div className="text-sm text-slate-600">Active Offers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">{myOffers.length}</div>
            <div className="text-sm text-slate-600">For You</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">
              {offers.filter(offer => !isOfferExpired(offer.expiresAt)).length}
            </div>
            <div className="text-sm text-slate-600">Valid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">
              ${offers.reduce((sum, offer) => sum + (typeof offer.totalValue === 'string' ? parseFloat(offer.totalValue) : offer.totalValue || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Total Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-offers" data-testid="all-offers-tab">All Offers</TabsTrigger>
          <TabsTrigger value="my-offers" data-testid="my-offers-tab">Direct & Targeted</TabsTrigger>
          <TabsTrigger value="rejected-offers" data-testid="rejected-offers-tab">Rejected Counter-offers</TabsTrigger>
        </TabsList>

        {/* Regular Offers Content */}
        {(activeTab === 'all-offers' || activeTab === 'my-offers') && (
          <TabsContent value={activeTab} className="mt-6">
            {filteredOffers.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-xl text-slate-600 mb-2">No offers available</p>
                  <p className="text-slate-500">
                    {activeTab === 'my-offers' 
                      ? "No direct offers targeting your company at the moment"
                      : "Check back soon for new buyer offers"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            )}
          </TabsContent>
        )}

        {/* Rejected Counter-offers Content */}
        {activeTab === 'rejected-offers' && (
          <TabsContent value="rejected-offers" className="mt-6">
            {rejectedLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="ml-4 text-slate-600">Loading rejected counter-offers...</p>
              </div>
            ) : rejectedCounterOffers.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <XCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-xl text-slate-600 mb-2">No rejected counter-offers</p>
                  <p className="text-slate-500">When buyers reject your counter-offers, you can still accept their original price here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rejectedCounterOffers.map((rejection: any) => (
                  <Card key={rejection.response_id} className="border-red-200 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-slate-800">
                            {rejection.commodity} - {rejection.buyer_company}
                          </CardTitle>
                          <p className="text-sm text-slate-600 mt-1">
                            Original Offer: {rejection.offer_id}
                          </p>
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          Counter-offer Rejected
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Quantity Available</p>
                          <p className="font-semibold">{rejection.quantity_available} MT</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Original Price</p>
                          <p className="font-semibold text-green-600">${rejection.original_price}/MT</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Your Counter Price</p>
                          <p className="font-semibold text-red-600">${rejection.counter_offer_price}/MT</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Total Value</p>
                          <p className="font-semibold">${rejection.total_value?.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {rejection.buyer_rejection_reason && (
                        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                          <p className="text-sm text-red-800">
                            <strong>Buyer's Reason:</strong> {rejection.buyer_rejection_reason}
                          </p>
                        </div>
                      )}

                      <div className="pt-2">
                        <Button 
                          onClick={() => {
                            if (window.confirm(`Accept original price of $${rejection.original_price}/MT for ${rejection.quantity_available} MT of ${rejection.commodity}?`)) {
                              acceptOriginalPriceMutation.mutate(rejection.response_id);
                            }
                          }}
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={acceptOriginalPriceMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Original Price (${rejection.original_price}/MT)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Dialogs */}
      <OfferDetailsDialog />
      <VerificationCodeDialog />
    </div>
  );
}