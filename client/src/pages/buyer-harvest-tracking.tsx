import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Calendar, MapPin, Truck, CheckCircle } from "lucide-react";

export default function BuyerHarvestTracking() {
  const { data: harvests = [], isLoading } = useQuery({
    queryKey: ["/api/buyer/harvest-tracking"],
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Harvest Tracking</h1>
          <p className="text-gray-600">Track your purchased harvests from farm to delivery</p>
        </div>

        <div className="space-y-6">
          {harvests.map((harvest: any) => (
            <Card key={harvest.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    Order #{harvest.orderId}
                  </CardTitle>
                  <Badge 
                    variant="default"
                    className={
                      harvest.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      harvest.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      harvest.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {harvest.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  From: {harvest.farmerName} • {harvest.commodity}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">Purchase Date</div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(harvest.purchaseDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Quantity</div>
                    <div className="text-gray-600">{harvest.quantity} kg</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Total Value</div>
                    <div className="text-gray-600">${harvest.totalValue}</div>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="font-medium text-gray-900 mb-2">Location</div>
                  <div className="text-gray-600 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {harvest.currentLocation}
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="border-t pt-4">
                  <div className="font-medium text-gray-900 mb-3">Tracking Status</div>
                  <div className="space-y-2">
                    {harvest.timeline?.map((event: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <CheckCircle className={`h-4 w-4 ${event.completed ? 'text-green-500' : 'text-gray-300'}`} />
                        <div className="flex-1">
                          <div className={`${event.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {event.description}
                          </div>
                          {event.completed && event.timestamp && (
                            <div className="text-gray-500 text-xs">
                              {new Date(event.timestamp).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Truck className="h-4 w-4 mr-1" />
                    Track Delivery
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Contact Driver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {harvests.length === 0 && (
          <div className="text-center py-12">
            <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Deliveries</h3>
            <p className="text-gray-600">Your purchased harvests will appear here for tracking</p>
          </div>
        )}
      </div>
    </div>
  );
}