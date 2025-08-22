import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, MapPin, Star, TrendingUp, Phone, Mail, Package2 } from "lucide-react";

export default function BuyerExporterNetwork() {
  const { data: farmers = [], isLoading } = useQuery({
    queryKey: ["/api/buyer/available-farmers"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mt-20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Marketplace</h1>
          <p className="text-gray-600">Browse available agricultural products directly from local farmers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample farmer products - in real app this would come from API */}
          {[
            {
              id: 1,
              farmName: "John Doe Farm",
              farmer: "John Doe",
              product: "Premium Cocoa Beans",
              quantity: "500kg",
              price: "$2.80/kg",
              quality: "Grade I",
              location: "Bong County",
              status: "Available",
              rating: 4.8,
              harvestDate: "January 2024"
            },
            {
              id: 2,
              farmName: "Mary's Organic Farm",
              farmer: "Mary Johnson",
              product: "Arabica Coffee Beans",
              quantity: "300kg",
              price: "$3.50/kg",
              quality: "Organic",
              location: "Grand Bassa County",
              status: "Premium",
              rating: 4.9,
              harvestDate: "December 2023"
            },
            {
              id: 3,
              farmName: "Green Valley Plantation",
              farmer: "Samuel Williams",
              product: "Palm Oil Seeds",
              quantity: "800kg",
              price: "$1.20/kg",
              quality: "Grade II",
              location: "Sinoe County",
              status: "Available",
              rating: 4.5,
              harvestDate: "February 2024"
            }
          ].map((listing: any) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    {listing.product}
                  </CardTitle>
                  <Badge 
                    variant={listing.status === 'Premium' ? 'default' : 'secondary'}
                    className={listing.status === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}
                  >
                    {listing.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Farm: {listing.farmName} • Farmer: {listing.farmer}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{listing.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Harvested: {listing.harvestDate}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">Quantity Available</div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <Package2 className="h-3 w-3" />
                      {listing.quantity}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">Price per kg</div>
                    <div className="text-gray-600 text-lg font-semibold text-green-600">{listing.price}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">Quality Grade</div>
                    <div className="text-gray-600">{listing.quality}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">Location</div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {listing.location}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact Farmer
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Send Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {farmers.length === 0 && false && (
          <div className="text-center py-12">
            <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">New farmer listings will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}