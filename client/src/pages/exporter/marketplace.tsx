import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShoppingCart, 
  Search, 
  Filter,
  MapPin,
  DollarSign,
  Package,
  User,
  Star,
  CheckCircle,
  Clock,
  MessageSquare,
  Handshake,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import ExporterNavbar from '@/components/layout/exporter-navbar';

export default function ExporterMarketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [commodityFilter, setCommodityFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // CORRECTED: Fetch buyer offers from backend - commodities buyers have FOR SALE
  const { data: buyerOffers = [], isLoading: isLoadingOffers } = useQuery({
    queryKey: ['/api/marketplace/buyer-offers', { commodity: commodityFilter, location: locationFilter, priceRange: 'all', status: 'active' }],
    retry: false,
  });

  // CORRECTED: Mock data for fallback - buyers selling commodities to exporters
  const mockBuyerOffers = [
    {
      id: 'OFF-2025-001',
      offerId: 'OFF-2025-001',
      buyerId: 'BYR-20250819-050',
      buyerCompany: 'Liberian Agricultural Trading Co.',
      buyerContact: 'John Pewee',
      rating: 4.8,
      verifiedSeller: true,
      commodity: 'Coffee',
      quantityAvailable: '500 MT', // What buyer has for sale
      pricePerMT: 2750, // Selling price to exporters
      totalValue: 1375000,
      qualityGrade: 'Premium Grade',
      sourceLocation: 'Lofa County', // Where buyer purchased from farmers
      farmerSources: ['Farmer John Kollie', 'Farmer Mary Pewee', 'Farmer David Konneh'],
      harvestDate: '2024-11-15',
      availableFromDate: '2025-01-25',
      expirationDate: '2025-03-15',
      deliveryLocation: 'Port of Monrovia',
      currentLocation: 'Liberian Agricultural Trading Co. Warehouse',
      paymentTerms: '30% advance, 70% on delivery',
      qualityCertificates: ['Organic', 'Fair Trade', 'EUDR Compliant'],
      eudrCompliance: true,
      certificationAvailable: ['Organic Certificate', 'Fair Trade Certificate', 'EUDR Declaration'],
      postedDate: '2025-01-22',
      description: 'Premium coffee beans sourced directly from Lofa County smallholder farmers. Ready for export.',
      complianceStatus: 'approved'
    },
    {
      id: 'OFF-2025-002', 
      offerId: 'OFF-2025-002',
      buyerId: 'BYR-20250820-051',
      buyerCompany: 'West African Commodities Ltd.',
      buyerContact: 'Maria Santos',
      rating: 4.6,
      verifiedSeller: true,
      commodity: 'Cocoa',
      quantityAvailable: '300 MT',
      pricePerMT: 3200,
      totalValue: 960000,
      qualityGrade: 'Grade 1',
      sourceLocation: 'Margibi County',
      farmerSources: ['Farmer Joseph Clarke', 'Farmer Grace Tubman'],
      harvestDate: '2024-10-20',
      availableFromDate: '2025-01-22',
      expirationDate: '2025-03-10',
      deliveryLocation: 'Port of Buchanan',
      currentLocation: 'West African Commodities Storage Facility',
      paymentTerms: '40% advance, 60% on shipment',
      qualityCertificates: ['Quality Certificate', 'EUDR Compliant', 'Rainforest Alliance'],
      eudrCompliance: true,
      certificationAvailable: ['Quality Certificate', 'EUDR Declaration', 'Rainforest Alliance Certificate'],
      postedDate: '2025-01-20',
      description: 'High-quality cocoa beans perfect for North American and European markets.',
      complianceStatus: 'approved'
    },
    {
      id: 'OFF-2025-003',
      offerId: 'OFF-2025-003',
      buyerId: 'BYR-20250821-052',
      buyerCompany: 'Global Rubber Trading',
      buyerContact: 'Ahmed Hassan',
      rating: 4.9,
      verifiedSeller: true,
      commodity: 'Rubber',
      quantityAvailable: '800 MT',
      pricePerMT: 1500,
      totalValue: 1200000,
      qualityGrade: 'RSS 1',
      sourceLocation: 'Bong County',
      farmerSources: ['Farmer Thomas Johnson', 'Farmer Rebecca Wilson', 'Farmer Michael Tarr'],
      harvestDate: '2024-12-05',
      availableFromDate: '2025-01-20',
      expirationDate: '2025-04-20',
      deliveryLocation: 'Port of Monrovia',
      currentLocation: 'Global Rubber Processing Center',
      paymentTerms: '25% advance, 75% on quality inspection',
      qualityCertificates: ['EUDR Compliant', 'ISO 9001'],
      eudrCompliance: true,
      certificationAvailable: ['EUDR Declaration', 'ISO Quality Report'],
      postedDate: '2025-01-18',
      description: 'Natural rubber from Bong County smallholder farmers. Excellent for tire manufacturing.',
      complianceStatus: 'approved'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pre_approved': return 'bg-blue-100 text-blue-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // CORRECTED: Submit purchase request (exporter buying from buyer)
  const submitPurchaseRequest = useMutation({
    mutationFn: async (purchaseData: any) => {
      return apiRequest('/api/exporter/submit-purchase-request', { 
        method: 'POST',
        body: JSON.stringify(purchaseData) 
      });
    },
    onSuccess: () => {
      toast({
        title: 'Purchase Request Submitted',
        description: 'Your purchase request has been sent to the buyer and DDGOTS for review.',
      });
      setIsNegotiationOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/exporter/purchase-requests'] });
    },
    onError: () => {
      toast({
        title: 'Submission Failed',
        description: 'Unable to submit purchase request. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmitPurchaseRequest = (formData: FormData) => {
    const purchaseData = {
      offerId: selectedBuyer?.offerId, // Buyer's offer being purchased
      buyerId: selectedBuyer?.buyerId,
      quantityRequested: formData.get('quantityRequested'), // How much exporter wants to buy
      agreedPricePerMT: formData.get('agreedPricePerMT'), // Agreed purchase price
      proposedPickupDate: formData.get('proposedPickupDate'),
      deliveryLocation: formData.get('deliveryLocation'),
      paymentTerms: formData.get('paymentTerms'),
      additionalRequests: formData.get('additionalRequests'),
      certificationRequests: formData.getAll('certificationRequests'),
    };
    
    submitPurchaseRequest.mutate(purchaseData);
  };

  // CORRECTED: Filter buyer offers (use mock data if backend not available)
  const availableOffers = (buyerOffers as any[]).length > 0 ? (buyerOffers as any[]) : mockBuyerOffers;
  const filteredOffers = availableOffers.filter((offer: any) => {
    const matchesSearch = offer.buyerCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.commodity?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCommodity = commodityFilter === 'all' || offer.commodity?.toLowerCase() === commodityFilter;
    const matchesLocation = locationFilter === 'all' || offer.sourceLocation?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesCommodity && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Marketplace - Exporter Portal</title>
        <meta name="description" content="Connect with verified buyers and submit proposals for export orders" />
      </Helmet>

      <ExporterNavbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            Buyer Marketplace
          </h1>
          <p className="text-gray-600 mt-2">
            Connect with verified buyers and submit proposals with DDGOTS compliance oversight
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search buyers or commodities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={commodityFilter} onValueChange={setCommodityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Commodity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Commodities</SelectItem>
              <SelectItem value="coffee">Coffee</SelectItem>
              <SelectItem value="cocoa">Cocoa</SelectItem>
              <SelectItem value="rubber">Rubber</SelectItem>
              <SelectItem value="palm oil">Palm Oil</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              <SelectItem value="lofa">Lofa County</SelectItem>
              <SelectItem value="margibi">Margibi County</SelectItem>
              <SelectItem value="bong">Bong County</SelectItem>
              <SelectItem value="nimba">Nimba County</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>

        {/* Loading State */}
        {isLoadingOffers && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            <span className="ml-3 text-gray-600">Loading buyer offers...</span>
          </div>
        )}

        {/* CORRECTED: Buyer Offers Grid */}
        <div className="grid grid-cols-1 gap-6">
          {!isLoadingOffers && filteredOffers.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">No buyer offers found</h3>
              <p className="text-gray-500">Check back later for new commodities for sale or adjust your filters.</p>
            </div>
          )}
          
          {!isLoadingOffers && filteredOffers.map((offer: any) => (
            <Card key={offer.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-900">
                        {offer.buyerCompany}
                      </span>
                      {offer.verifiedSeller && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified Seller
                        </Badge>
                      )}
                      <Badge className={getComplianceColor(offer.complianceStatus)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {offer.complianceStatus.replace('_', ' ')}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        {offer.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {offer.buyerContact}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Posted {offer.postedDate}
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    ${offer.pricePerMT}/MT
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* CORRECTED: Commodity Available for Purchase */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Commodity Available</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Commodity:</span> <span className="font-semibold">{offer.commodity}</span></p>
                      <p><span className="text-gray-600">Quantity Available:</span> {offer.quantityAvailable}</p>
                      <p><span className="text-gray-600">Grade:</span> {offer.qualityGrade}</p>
                      <p><span className="text-gray-600">Price per MT:</span> <span className="font-semibold text-green-600">${offer.pricePerMT}</span></p>
                      <p><span className="text-gray-600">Total Value:</span> <span className="font-semibold text-blue-600">${offer.totalValue?.toLocaleString()}</span></p>
                    </div>
                  </div>

                  {/* CORRECTED: Source & Delivery Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Source & Delivery</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Source Location:</span> {offer.sourceLocation}</p>
                      <p><span className="text-gray-600">Current Location:</span> {offer.currentLocation}</p>
                      <p><span className="text-gray-600">Delivery Port:</span> {offer.deliveryLocation}</p>
                      <p><span className="text-gray-600">Available From:</span> {offer.availableFromDate}</p>
                      <p><span className="text-gray-600">Expires:</span> {offer.expirationDate}</p>
                      <p><span className="text-gray-600">Payment Terms:</span> {offer.paymentTerms}</p>
                    </div>
                  </div>

                  {/* CORRECTED: Certifications & Purchase Action */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Quality Certifications</h4>
                    <div className="space-y-2 mb-4">
                      {offer.qualityCertificates?.map((cert: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Dialog open={isNegotiationOpen} onOpenChange={setIsNegotiationOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => setSelectedBuyer(offer)}
                          >
                            <Handshake className="h-4 w-4 mr-2" />
                            Submit Purchase Request
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Submit Purchase Request to {selectedBuyer?.buyerCompany}</DialogTitle>
                          </DialogHeader>
                          
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.currentTarget);
                              handleSubmitPurchaseRequest(formData);
                            }} 
                            className="space-y-6"
                          >
                            {/* CORRECTED: Offer Summary - What buyer is selling */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="font-medium text-blue-900 mb-2">Available Commodity</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <p><span className="text-blue-700">Commodity:</span> {selectedBuyer?.commodity}</p>
                                <p><span className="text-blue-700">Available Quantity:</span> {selectedBuyer?.quantityAvailable}</p>
                                <p><span className="text-blue-700">Seller's Price:</span> ${selectedBuyer?.pricePerMT}/MT</p>
                                <p><span className="text-blue-700">Total Value:</span> ${selectedBuyer?.totalValue?.toLocaleString()}</p>
                                <p><span className="text-blue-700">Available Until:</span> {selectedBuyer?.expirationDate}</p>
                                <p><span className="text-blue-700">Source Location:</span> {selectedBuyer?.sourceLocation}</p>
                              </div>
                            </div>

                            {/* CORRECTED: Purchase Request Details - What exporter wants to buy */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="quantityRequested">Quantity Requested (MT) *</Label>
                                <Input 
                                  id="quantityRequested" 
                                  name="quantityRequested"
                                  type="number"
                                  placeholder={selectedBuyer?.quantityAvailable?.split(' ')[0] || "500"}
                                  max={selectedBuyer?.quantityAvailable?.split(' ')[0]}
                                  required 
                                />
                                <p className="text-xs text-gray-500 mt-1">Max available: {selectedBuyer?.quantityAvailable}</p>
                              </div>
                              <div>
                                <Label htmlFor="agreedPricePerMT">Agreed Price per MT ($) *</Label>
                                <Input 
                                  id="agreedPricePerMT" 
                                  name="agreedPricePerMT"
                                  type="number"
                                  placeholder={selectedBuyer?.pricePerMT?.toString() || "2800"}
                                  defaultValue={selectedBuyer?.pricePerMT}
                                  required 
                                />
                              </div>
                              <div>
                                <Label htmlFor="proposedPickupDate">Proposed Pickup Date *</Label>
                                <Input 
                                  id="proposedPickupDate" 
                                  name="proposedPickupDate"
                                  type="date"
                                  min={selectedBuyer?.availableFromDate || new Date().toISOString().split('T')[0]}
                                  max={selectedBuyer?.expirationDate}
                                  required 
                                />
                              </div>
                              <div>
                                <Label htmlFor="deliveryLocation">Delivery Location *</Label>
                                <Select name="deliveryLocation" required>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select delivery location" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={selectedBuyer?.deliveryLocation || "port_monrovia"}>{selectedBuyer?.deliveryLocation || "Port of Monrovia"}</SelectItem>
                                    <SelectItem value="port_buchanan">Port of Buchanan</SelectItem>
                                    <SelectItem value="warehouse_pickup">Warehouse Pickup</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="paymentTerms">Preferred Payment Terms *</Label>
                              <Select name="paymentTerms" required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment terms" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="30_70">30% advance, 70% on delivery</SelectItem>
                                  <SelectItem value="40_60">40% advance, 60% on pickup</SelectItem>
                                  <SelectItem value="25_75">25% advance, 75% on inspection</SelectItem>
                                  <SelectItem value="50_50">50% advance, 50% on delivery</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="additionalRequests">Additional Requests</Label>
                              <Textarea 
                                id="additionalRequests" 
                                name="additionalRequests"
                                placeholder="Any additional requirements for this purchase..."
                                rows={3}
                              />
                            </div>

                            {/* CORRECTED: DDGOTS Notice for Purchase Requests */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-green-900">DDGOTS Compliance Review</h4>
                                  <p className="text-sm text-green-800 mt-1">
                                    This purchase request will be automatically reviewed by DDGOTS for compliance before being sent to the buyer. 
                                    All commodity purchases are monitored for LACRA regulations and EUDR requirements.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-3">
                              <Button 
                                type="button"
                                variant="outline" 
                                onClick={() => setIsNegotiationOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="submit" 
                                className="bg-green-600 hover:bg-green-700"
                                disabled={submitPurchaseRequest.isPending}
                              >
                                Submit Purchase Request
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="outline" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Buyer
                      </Button>
                    </div>
                  </div>
                </div>

                {/* CORRECTED: Description */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700">{offer.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span>🧑‍🌾 Farmer Sources: {offer.farmerSources?.join(', ')}</span>
                    <span>📅 Harvest Date: {offer.harvestDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CORRECTED: Use filteredOffers instead of filteredRequests */}
        {!isLoadingOffers && ((buyerOffers as any[]).length === 0 || filteredOffers.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buyer Offers Found</h3>
              <p className="text-gray-600">
                {searchTerm || commodityFilter !== 'all' || locationFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No buyers are currently selling commodities. Check back later or contact DDGOTS for assistance.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}