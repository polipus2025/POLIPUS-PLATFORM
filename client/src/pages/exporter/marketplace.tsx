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
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Fetch buyer requests from backend
  const { data: buyerRequests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ['/api/marketplace/buyer-requests', { commodity: commodityFilter, location: locationFilter, urgency: 'all', status: 'active' }],
    retry: false,
  });

  // Mock data for fallback - buyers looking for products
  const mockBuyerRequests = [
    {
      id: 'REQ-2025-001',
      buyerId: 'BYR-20250819-050',
      buyerCompany: 'Liberian Agricultural Trading Co.',
      buyerContact: 'John Pewee',
      rating: 4.8,
      verifiedBuyer: true,
      commodity: 'Coffee',
      quantityNeeded: '500 MT',
      priceRange: '$2,600 - $2,900 per MT',
      qualityGrade: 'Premium Grade',
      deliveryLocation: 'Port of Monrovia',
      preferredCounty: 'Lofa County',
      urgency: 'high',
      paymentTerms: '30% deposit, 70% on delivery',
      certificationRequired: ['EUDR Compliant', 'Organic Certified', 'Fair Trade'],
      postedDate: '2025-01-22',
      deadline: '2025-02-15',
      description: 'Looking for premium coffee beans for European export. Must meet EUDR requirements.',
      complianceStatus: 'pre_approved'
    },
    {
      id: 'REQ-2025-002',
      buyerId: 'BYR-20250820-051',
      buyerCompany: 'West African Commodities Ltd.',
      buyerContact: 'Maria Santos',
      rating: 4.6,
      verifiedBuyer: true,
      commodity: 'Cocoa',
      quantityNeeded: '300 MT',
      priceRange: '$3,100 - $3,300 per MT',
      qualityGrade: 'Grade 1',
      deliveryLocation: 'Port of Monrovia',
      preferredCounty: 'Margibi County',
      urgency: 'medium',
      paymentTerms: '40% deposit, 60% on shipment',
      certificationRequired: ['EUDR Compliant', 'Rainforest Alliance'],
      postedDate: '2025-01-20',
      deadline: '2025-02-10',
      description: 'High-quality cocoa beans needed for North American markets.',
      complianceStatus: 'approved'
    },
    {
      id: 'REQ-2025-003',
      buyerId: 'BYR-20250821-052',
      buyerCompany: 'Global Rubber Trading',
      buyerContact: 'Ahmed Hassan',
      rating: 4.9,
      verifiedBuyer: true,
      commodity: 'Rubber',
      quantityNeeded: '800 MT',
      priceRange: '$1,400 - $1,600 per MT',
      qualityGrade: 'RSS 1',
      deliveryLocation: 'Port of Buchanan',
      preferredCounty: 'Bong County',
      urgency: 'low',
      paymentTerms: '25% deposit, 75% on quality inspection',
      certificationRequired: ['EUDR Compliant', 'ISO 9001'],
      postedDate: '2025-01-18',
      deadline: '2025-02-05',
      description: 'Natural rubber for tire manufacturing. Long-term partnership opportunity.',
      complianceStatus: 'pending_review'
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

  const submitProposal = useMutation({
    mutationFn: async (proposalData: any) => {
      return apiRequest('POST', '/api/exporter/submit-proposal', proposalData);
    },
    onSuccess: () => {
      toast({
        title: 'Proposal Submitted',
        description: 'Your proposal has been sent to the buyer and DDGOTS for review.',
      });
      setIsNegotiationOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/exporter/proposals'] });
    },
    onError: (error) => {
      toast({
        title: 'Submission Failed',
        description: 'Unable to submit proposal. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmitProposal = (formData: FormData) => {
    const proposalData = {
      requestId: selectedBuyer?.id,
      buyerId: selectedBuyer?.buyerId,
      pricePerMT: formData.get('pricePerMT'),
      totalQuantity: formData.get('totalQuantity'),
      deliveryDate: formData.get('deliveryDate'),
      qualityGrade: formData.get('qualityGrade'),
      paymentTerms: formData.get('paymentTerms'),
      additionalNotes: formData.get('additionalNotes'),
      certifications: formData.getAll('certifications'),
    };
    
    submitProposal.mutate(proposalData);
  };

  const filteredRequests = (buyerRequests || []).filter(request => {
    const matchesSearch = request.buyerCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.commodity?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCommodity = commodityFilter === 'all' || request.commodity?.toLowerCase() === commodityFilter;
    const matchesLocation = locationFilter === 'all' || request.preferredCounty?.toLowerCase().includes(locationFilter.toLowerCase());
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
        {isLoadingRequests && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            <span className="ml-3 text-gray-600">Loading buyer requests...</span>
          </div>
        )}

        {/* Buyer Requests Grid */}
        <div className="grid grid-cols-1 gap-6">
          {!isLoadingRequests && filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">No buyer requests found</h3>
              <p className="text-gray-500">Check back later for new opportunities or adjust your filters.</p>
            </div>
          )}
          
          {!isLoadingRequests && filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-900">
                        {request.buyerCompany}
                      </span>
                      {request.verifiedBuyer && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge className={getComplianceColor(request.complianceStatus)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {request.complianceStatus.replace('_', ' ')}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        {request.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {request.buyerContact}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Posted {request.postedDate}
                      </span>
                    </div>
                  </div>
                  <Badge className={getUrgencyColor(request.urgency)}>
                    {request.urgency} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Commodity Requirements */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Commodity Requirements</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Commodity:</span> <span className="font-semibold">{request.commodity}</span></p>
                      <p><span className="text-gray-600">Quantity:</span> {request.quantityNeeded}</p>
                      <p><span className="text-gray-600">Grade:</span> {request.qualityGrade}</p>
                      <p><span className="text-gray-600">Price Range:</span> <span className="font-semibold text-green-600">{request.priceRange}</span></p>
                    </div>
                  </div>

                  {/* Delivery & Location */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Delivery Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Preferred Source:</span> {request.preferredCounty}</p>
                      <p><span className="text-gray-600">Delivery Port:</span> {request.deliveryLocation}</p>
                      <p><span className="text-gray-600">Deadline:</span> {request.deadline}</p>
                      <p><span className="text-gray-600">Payment:</span> {request.paymentTerms}</p>
                    </div>
                  </div>

                  {/* Certifications & Actions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Required Certifications</h4>
                    <div className="space-y-2 mb-4">
                      {request.certificationRequired.map((cert, index) => (
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
                            onClick={() => setSelectedBuyer(request)}
                          >
                            <Handshake className="h-4 w-4 mr-2" />
                            Submit Proposal
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Submit Proposal to {selectedBuyer?.buyerCompany}</DialogTitle>
                          </DialogHeader>
                          
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.currentTarget);
                              handleSubmitProposal(formData);
                            }} 
                            className="space-y-6"
                          >
                            {/* Request Summary */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="font-medium text-blue-900 mb-2">Request Summary</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <p><span className="text-blue-700">Commodity:</span> {selectedBuyer?.commodity}</p>
                                <p><span className="text-blue-700">Quantity:</span> {selectedBuyer?.quantityNeeded}</p>
                                <p><span className="text-blue-700">Price Range:</span> {selectedBuyer?.priceRange}</p>
                                <p><span className="text-blue-700">Deadline:</span> {selectedBuyer?.deadline}</p>
                              </div>
                            </div>

                            {/* Proposal Details */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="pricePerMT">Your Price per MT ($) *</Label>
                                <Input 
                                  id="pricePerMT" 
                                  name="pricePerMT"
                                  type="number"
                                  placeholder="2800"
                                  required 
                                />
                              </div>
                              <div>
                                <Label htmlFor="totalQuantity">Quantity Available (MT) *</Label>
                                <Input 
                                  id="totalQuantity" 
                                  name="totalQuantity"
                                  type="number"
                                  placeholder="500"
                                  required 
                                />
                              </div>
                              <div>
                                <Label htmlFor="deliveryDate">Delivery Date *</Label>
                                <Input 
                                  id="deliveryDate" 
                                  name="deliveryDate"
                                  type="date"
                                  min={new Date().toISOString().split('T')[0]}
                                  required 
                                />
                              </div>
                              <div>
                                <Label htmlFor="qualityGrade">Quality Grade *</Label>
                                <Select name="qualityGrade" required>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select grade" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="premium">Premium Grade</SelectItem>
                                    <SelectItem value="grade1">Grade 1</SelectItem>
                                    <SelectItem value="grade2">Grade 2</SelectItem>
                                    <SelectItem value="standard">Standard Grade</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="paymentTerms">Payment Terms *</Label>
                              <Select name="paymentTerms" required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment terms" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="30_70">30% deposit, 70% on delivery</SelectItem>
                                  <SelectItem value="40_60">40% deposit, 60% on shipment</SelectItem>
                                  <SelectItem value="25_75">25% deposit, 75% on inspection</SelectItem>
                                  <SelectItem value="50_50">50% deposit, 50% on delivery</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="additionalNotes">Additional Notes</Label>
                              <Textarea 
                                id="additionalNotes" 
                                name="additionalNotes"
                                placeholder="Any additional information about your proposal..."
                                rows={3}
                              />
                            </div>

                            {/* DDGOTS Notice */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-green-900">DDGOTS Compliance Review</h4>
                                  <p className="text-sm text-green-800 mt-1">
                                    This proposal will be automatically reviewed by DDGOTS for compliance before being sent to the buyer. 
                                    All transactions are monitored for LACRA regulations and EUDR requirements.
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
                                disabled={submitProposal.isPending}
                              >
                                Submit Proposal
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

                {/* Description */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700">{request.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buyer Requests Found</h3>
              <p className="text-gray-600">
                {searchTerm || commodityFilter !== 'all' || locationFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No buyers are currently looking for your commodities. Check back later or contact DDGOTS for assistance.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}