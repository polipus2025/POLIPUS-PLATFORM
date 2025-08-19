import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Globe, Star, TrendingUp, Phone, Mail } from "lucide-react";

export default function BuyerExporterNetwork() {
  const { data: exporters = [], isLoading } = useQuery({
    queryKey: ["/api/buyer/connected-exporters"],
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exporter Network</h1>
          <p className="text-gray-600">Connect with trusted exporters to sell your commodities globally</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exporters.map((exporter: any) => (
            <Card key={exporter.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    {exporter.companyName}
                  </CardTitle>
                  <Badge 
                    variant={exporter.status === 'Premium' ? 'default' : 'secondary'}
                    className={exporter.status === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}
                  >
                    {exporter.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Contact: {exporter.contactPerson}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{exporter.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {exporter.completedTrades} completed trades
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">Specialties</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {exporter.specialties.map((specialty: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">Price Range</div>
                    <div className="text-gray-600">{exporter.priceRange}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">Export Destinations</div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {exporter.destinations.join(", ")}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Send Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {exporters.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Exporters Available</h3>
            <p className="text-gray-600">New exporter partnerships will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}