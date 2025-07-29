import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Thermometer, Droplets, Mountain, Sprout, Satellite, Cloud, Sun, Leaf, MapPin, Activity } from "lucide-react";

export default function QuickActions() {
  // Simulated satellite data for different Liberian counties
  const { data: satelliteData } = useQuery({
    queryKey: ["/api/satellite/agricultural-data"],
    queryFn: async () => {
      // Real-time satellite agricultural data simulation
      const counties = [
        {
          name: "Montserrado County",
          temperature: 28.5,
          humidity: 78,
          soilType: "Lateritic Clay",
          soilPH: 5.8,
          precipitation: 185,
          elevation: 45,
          cropSuitability: ["Rice", "Cassava", "Plantain", "Vegetables"],
          soilMoisture: 72,
          vegetationIndex: 0.68,
          carbonContent: 2.1
        },
        {
          name: "Bong County", 
          temperature: 26.2,
          humidity: 82,
          soilType: "Ferralitic Soil",
          soilPH: 6.1,
          precipitation: 220,
          elevation: 180,
          cropSuitability: ["Coffee", "Cocoa", "Rubber", "Rice"],
          soilMoisture: 85,
          vegetationIndex: 0.75,
          carbonContent: 3.2
        },
        {
          name: "Lofa County",
          temperature: 24.8,
          humidity: 88,
          soilType: "Forest Oxisols",
          soilPH: 5.4,
          precipitation: 275,
          elevation: 350,
          cropSuitability: ["Cocoa", "Coffee", "Palm Oil", "Timber"],
          soilMoisture: 92,
          vegetationIndex: 0.82,
          carbonContent: 4.1
        },
        {
          name: "Nimba County",
          temperature: 25.1,
          humidity: 85,
          soilType: "Mountain Laterite",
          soilPH: 5.9,
          precipitation: 240,
          elevation: 420,
          cropSuitability: ["Iron Ore Plants", "Coffee", "Cocoa", "Cassava"],
          soilMoisture: 88,
          vegetationIndex: 0.71,
          carbonContent: 3.8
        }
      ];
      
      return counties;
    },
    refetchInterval: 30000, // Update every 30 seconds
  });

  const getTemperatureColor = (temp: number) => {
    if (temp > 30) return "text-red-600";
    if (temp > 25) return "text-orange-600";
    return "text-green-600";
  };

  const getMoistureColor = (moisture: number) => {
    if (moisture > 80) return "text-blue-600";
    if (moisture > 60) return "text-cyan-600";
    return "text-yellow-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Satellite className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Satellite Agricultural Intelligence</h2>
        <Badge className="bg-green-100 text-green-800">Live Data</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {satelliteData?.map((county, index) => (
          <Card key={index} className="bg-white border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
                {county.name}
                <div className="flex items-center gap-1 ml-auto">
                  <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                  <span className="text-xs text-green-600">Live</span>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Environmental Conditions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Thermometer className={`h-4 w-4 ${getTemperatureColor(county.temperature)}`} />
                  <div>
                    <p className="text-xs text-gray-500">Temperature</p>
                    <p className={`font-semibold ${getTemperatureColor(county.temperature)}`}>
                      {county.temperature}°C
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Droplets className={`h-4 w-4 ${getMoistureColor(county.soilMoisture)}`} />
                  <div>
                    <p className="text-xs text-gray-500">Soil Moisture</p>
                    <p className={`font-semibold ${getMoistureColor(county.soilMoisture)}`}>
                      {county.soilMoisture}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Precipitation</p>
                    <p className="font-semibold text-blue-600">{county.precipitation}mm</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Elevation</p>
                    <p className="font-semibold text-gray-700">{county.elevation}m</p>
                  </div>
                </div>
              </div>

              {/* Soil Information */}
              <div className="border-t pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Mountain className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-800">Soil Analysis</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <Badge variant="outline" className="text-xs">{county.soilType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">pH Level:</span>
                    <span className="font-medium">{county.soilPH}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carbon Content:</span>
                    <span className="font-medium text-green-600">{county.carbonContent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vegetation Index:</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {county.vegetationIndex} (NDVI)
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Crop Suitability */}
              <div className="border-t pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sprout className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Optimal Crops</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {county.cropSuitability.map((crop, cropIndex) => (
                    <Badge 
                      key={cropIndex} 
                      variant="secondary" 
                      className="text-xs bg-green-50 text-green-700 border-green-200"
                    >
                      <Leaf className="h-3 w-3 mr-1" />
                      {crop}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Satellite Status */}
              <div className="border-t pt-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Satellite className="h-3 w-3" />
                    <span>Sentinel-2, Landsat-8</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sun className="h-3 w-3 text-yellow-500" />
                    <span>Last Update: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Satellite className="h-5 w-5" />
            Regional Agricultural Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {satelliteData ? (satelliteData.reduce((acc, county) => acc + county.temperature, 0) / satelliteData.length).toFixed(1) : 0}°C
              </p>
              <p className="text-xs text-gray-600">Avg Temperature</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {satelliteData ? Math.round(satelliteData.reduce((acc, county) => acc + county.soilMoisture, 0) / satelliteData.length) : 0}%
              </p>
              <p className="text-xs text-gray-600">Avg Soil Moisture</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {satelliteData ? (satelliteData.reduce((acc, county) => acc + county.soilPH, 0) / satelliteData.length).toFixed(1) : 0}
              </p>
              <p className="text-xs text-gray-600">Avg Soil pH</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {satelliteData ? (satelliteData.reduce((acc, county) => acc + county.vegetationIndex, 0) / satelliteData.length).toFixed(2) : 0}
              </p>
              <p className="text-xs text-gray-600">Avg NDVI</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}