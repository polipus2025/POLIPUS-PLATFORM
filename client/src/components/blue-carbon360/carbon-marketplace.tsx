import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Award, 
  MapPin,
  Calendar,
  Star,
  Eye,
  Download
} from "lucide-react";

interface CarbonMarketplaceProps {
  data?: any[];
  isLoading?: boolean;
}

export default function CarbonMarketplace({ data = [], isLoading = false }: CarbonMarketplaceProps) {
  const mockData = [
    {
      id: 1,
      listingTitle: "Verified Blue Carbon Credits - Mangrove Project",
      projectId: 1,
      creditType: "blue_carbon",
      creditsAvailable: 450,
      pricePerCredit: 18.50,
      totalValue: 8325,
      vintage: 2024,
      listingStatus: "active",
      sellerOrganization: "Conservation International Liberia",
      ecosystemType: "mangrove",
      location: "Grand Cape Mount County",
      verificationStandard: "Verra VCS",
      marketplaceRating: 4.8,
      listingDate: "2024-06-15",
      permanenceGuarantee: "30 years",
      cobenefits: ["Biodiversity Protection", "Community Employment", "Coastal Protection"]
    },
    {
      id: 2,
      listingTitle: "Premium Seagrass Carbon Offsets - Buchanan Bay",
      projectId: 2,
      creditType: "verified_carbon_standard",
      creditsAvailable: 320,
      pricePerCredit: 22.00,
      totalValue: 7040,
      vintage: 2024,
      listingStatus: "active",
      sellerOrganization: "EPA Liberia Marine Division",
      ecosystemType: "seagrass",
      location: "Grand Bassa County",
      verificationStandard: "Gold Standard",
      marketplaceRating: 4.6,
      listingDate: "2024-07-20",
      permanenceGuarantee: "25 years",
      cobenefits: ["Marine Habitat Restoration", "Fish Population Recovery", "Water Quality Improvement"]
    }
  ];

  const marketplaceData = data.length > 0 ? data : mockData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'sold': return 'text-blue-600 bg-blue-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getCreditTypeColor = (type: string) => {
    switch (type) {
      case 'blue_carbon': return 'text-blue-600 bg-blue-100';
      case 'verified_carbon_standard': return 'text-green-600 bg-green-100';
      case 'gold_standard': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  if (isLoading) {
    return (
      <Card className="isms-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            <span>Carbon Marketplace</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-slate-600 mt-2">Loading marketplace data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="isms-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            <span>Carbon Marketplace</span>
          </div>
          <Button size="sm">
            Create Listing
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {marketplaceData.map((listing) => (
            <div key={listing.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{listing.listingTitle}</h4>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className={getCreditTypeColor(listing.creditType)}>
                      {listing.creditType.replace('_', ' ')}
                    </Badge>
                    <Badge className={getStatusColor(listing.listingStatus)}>
                      {listing.listingStatus}
                    </Badge>
                    <Badge variant="outline" className="text-slate-600">
                      {listing.verificationStandard}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Vintage {listing.vintage}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{listing.marketplaceRating}/5.0</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  <div className="text-3xl font-bold text-green-600">${listing.pricePerCredit}</div>
                  <div className="text-sm text-slate-600">per credit</div>
                  <div className="text-xs text-slate-500 mt-1">Total: ${listing.totalValue.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-xl font-bold text-green-700">{listing.creditsAvailable}</div>
                  <div className="text-sm text-green-600">Credits Available</div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xl font-bold text-blue-700">{listing.permanenceGuarantee}</div>
                  <div className="text-sm text-blue-600">Permanence</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-xl font-bold text-purple-700 capitalize">{listing.ecosystemType}</div>
                  <div className="text-sm text-purple-600">Ecosystem</div>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="font-medium text-slate-900 mb-2">Co-benefits:</h5>
                <div className="flex flex-wrap gap-2">
                  {listing.cobenefits.map((benefit: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                <span className="font-medium">Seller: {listing.sellerOrganization}</span>
                <span>Listed: {listing.listingDate}</span>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Purchase Credits
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Documentation
                </Button>
              </div>
            </div>
          ))}
        </div>

        {marketplaceData.length === 0 && (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">No marketplace listings available</p>
            <p className="text-sm text-slate-500 mb-4">Be the first to list your carbon credits</p>
            <Button>
              Create First Listing
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}