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
  ArrowLeft
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
  quantityAvailable: string;
  pricePerMT: number;
  totalValue: number;
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
  counterQuantity: string;
  counterDeliveryTerms: string;
  counterPaymentTerms: string;
  modificationNotes: string;
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

  // Fetch all active offers
  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['/api/sellers-hub/offers'],
    refetchInterval: 30000 // Refresh every 30 seconds for real-time updates
  });

  // Get offers specifically for this exporter
  const { data: myOffers = [] } = useQuery({
    queryKey: [`/api/exporters/${(user as any)?.id}/offers`],
    refetchInterval: 30000,
    enabled: !!(user as any)?.id // Only run query when we have exporter ID
  });

  // Accept offer mutation
  const acceptOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      const result = await apiRequest("POST", `/api/buyer-exporter-offers/${offerId}/accept`, {
        exporterId: (user as any)?.id,
        exporterCompany: (user as any)?.companyName,
        exporterContact: (user as any)?.contactPerson
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
      const result = await apiRequest("POST", `/api/buyer-exporter-offers/${offerId}/reject`, {
        exporterId: (user as any)?.id,
        exporterCompany: (user as any)?.companyName,
        exporterContact: (user as any)?.contactPerson,
        rejectionReason: reason
      });
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Offer Rejected",
        description: "Your response has been sent to the buyer",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sellers-hub/offers'] });
      setSelectedOffer(null);
    }
  });

  // Start negotiation mutation
  const negotiateMutation = useMutation({
    mutationFn: async ({ offerId, negotiationData }: { offerId: string; negotiationData: NegotiationData }) => {
      const result = await apiRequest("POST", `/api/buyer-exporter-offers/${offerId}/negotiate`, {
        exporterId: (user as any)?.id,
        exporterCompany: (user as any)?.companyName,
        exporterContact: (user as any)?.contactPerson,
        ...negotiationData
      });
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Negotiation Started",
        description: "Your counter-offer has been sent to the buyer",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sellers-hub/offers'] });
      setShowNegotiationDialog(false);
      setSelectedOffer(null);
    }
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
              {offer.commodity} - {offer.quantityAvailable}
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">{offer.buyerCompany}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${offer.pricePerMT.toFixed(2)}/MT
            </div>
            <div className="text-sm text-slate-500">
              Total: ${offer.totalValue.toLocaleString()}
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
          <div className="text-xs text-slate-500">
            Posted {format(new Date(offer.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OfferDetailsDialog = () => {
    if (!selectedOffer) return null;

    const [negotiationData, setNegotiationData] = useState<NegotiationData>({
      counterPricePerMT: selectedOffer.pricePerMT,
      counterQuantity: selectedOffer.quantityAvailable,
      counterDeliveryTerms: selectedOffer.deliveryTerms,
      counterPaymentTerms: selectedOffer.paymentTerms,
      modificationNotes: ""
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
                <div className="text-sm text-slate-600">
                  Contact: {selectedOffer.buyerContact}
                </div>
                {selectedOffer.buyerPhone && (
                  <div className="text-sm text-slate-600">
                    Phone: {selectedOffer.buyerPhone}
                  </div>
                )}
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
                <div><strong>Price per MT:</strong> ${selectedOffer.pricePerMT.toFixed(2)}</div>
                <div><strong>Total Value:</strong> ${selectedOffer.totalValue.toLocaleString()}</div>
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

          {/* Negotiation Dialog */}
          <Dialog open={showNegotiationDialog} onOpenChange={setShowNegotiationDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Start Negotiation</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Counter Price per MT ($)</Label>
                    <Input
                      type="number"
                      value={negotiationData.counterPricePerMT}
                      onChange={(e) => setNegotiationData(prev => ({
                        ...prev,
                        counterPricePerMT: parseFloat(e.target.value) || 0
                      }))}
                      data-testid="counter-price-input"
                    />
                  </div>
                  <div>
                    <Label>Counter Quantity</Label>
                    <Input
                      value={negotiationData.counterQuantity}
                      onChange={(e) => setNegotiationData(prev => ({
                        ...prev,
                        counterQuantity: e.target.value
                      }))}
                      data-testid="counter-quantity-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Counter Delivery Terms</Label>
                    <Input
                      value={negotiationData.counterDeliveryTerms}
                      onChange={(e) => setNegotiationData(prev => ({
                        ...prev,
                        counterDeliveryTerms: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Counter Payment Terms</Label>
                    <Input
                      value={negotiationData.counterPaymentTerms}
                      onChange={(e) => setNegotiationData(prev => ({
                        ...prev,
                        counterPaymentTerms: e.target.value
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Modification Notes</Label>
                  <Textarea
                    value={negotiationData.modificationNotes}
                    onChange={(e) => setNegotiationData(prev => ({
                      ...prev,
                      modificationNotes: e.target.value
                    }))}
                    placeholder="Explain your counter-offer..."
                    rows={3}
                    data-testid="modification-notes-textarea"
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
                    {negotiateMutation.isPending ? "Submitting..." : "Submit Counter-Offer"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNegotiationDialog(false)}
                  >
                    Cancel
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
              ${offers.reduce((sum, offer) => sum + offer.totalValue, 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Total Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-offers" data-testid="all-offers-tab">All Offers</TabsTrigger>
          <TabsTrigger value="my-offers" data-testid="my-offers-tab">Direct & Targeted</TabsTrigger>
        </TabsList>

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
      </Tabs>

      {/* Dialogs */}
      <OfferDetailsDialog />
      <VerificationCodeDialog />
    </div>
  );
}