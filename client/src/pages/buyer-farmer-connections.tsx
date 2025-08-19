import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, MapPin, Phone, Calendar } from "lucide-react";

export default function BuyerFarmerConnections() {
  const { data: harvests = [], isLoading } = useQuery({
    queryKey: ["/api/buyer/available-harvests"],
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farmer Connections</h1>
          <p className="text-gray-600">Connect with farmers who have confirmed harvesting and are ready for purchase</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {harvests.map((harvest: any) => (
            <Card key={harvest.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    {harvest.farmerName}
                  </CardTitle>
                  <Badge 
                    variant={harvest.status === 'Ready' ? 'default' : 'secondary'}
                    className={harvest.status === 'Ready' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {harvest.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {harvest.county}, {harvest.district}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">Commodity</div>
                    <div className="text-gray-600">{harvest.commodity}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Quantity</div>
                    <div className="text-gray-600">{harvest.quantity}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Price</div>
                    <div className="text-gray-600">${harvest.pricePerKg}/kg</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Harvest Date</div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(harvest.harvestDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  <div className="font-medium">GPS Coordinates</div>
                  <div>{harvest.gpsCoordinates}</div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {harvests.length === 0 && (
          <div className="text-center py-12">
            <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Harvests</h3>
            <p className="text-gray-600">Check back later for new farmer connections</p>
          </div>
        )}
      </div>
    </div>
  );
}