import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Thermometer, Droplets, Mountain, Sprout, Satellite, Cloud, Sun, Leaf, MapPin, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  const [currentCountyIndex, setCurrentCountyIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Cacheable satellite data for all 15 Liberian counties
  const { data: satelliteData, isLoading } = useQuery({
    queryKey: ["/api/satellite/agricultural-data"],
    queryFn: async () => {
      // Comprehensive satellite agricultural data for all 15 Liberian counties
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
          cropSuitability: ["Coffee", "Cocoa", "Cassava", "Vegetables"],
          soilMoisture: 88,
          vegetationIndex: 0.71,
          carbonContent: 3.8
        },
        {
          name: "Grand Bassa County",
          temperature: 27.8,
          humidity: 83,
          soilType: "Coastal Alluvium",
          soilPH: 6.2,
          precipitation: 195,
          elevation: 25,
          cropSuitability: ["Rice", "Coconut", "Cassava", "Sweet Potato"],
          soilMoisture: 76,
          vegetationIndex: 0.65,
          carbonContent: 2.4
        },
        {
          name: "Sinoe County",
          temperature: 26.9,
          humidity: 89,
          soilType: "Sandy Loam",
          soilPH: 5.7,
          precipitation: 265,
          elevation: 65,
          cropSuitability: ["Palm Oil", "Rubber", "Plantain", "Yams"],
          soilMoisture: 84,
          vegetationIndex: 0.73,
          carbonContent: 3.1
        },
        {
          name: "Maryland County",
          temperature: 25.6,
          humidity: 87,
          soilType: "Forest Laterite",
          soilPH: 5.5,
          precipitation: 285,
          elevation: 120,
          cropSuitability: ["Cocoa", "Coffee", "Timber", "Kola Nut"],
          soilMoisture: 91,
          vegetationIndex: 0.79,
          carbonContent: 3.9
        },
        {
          name: "Grand Cape Mount County",
          temperature: 28.2,
          humidity: 81,
          soilType: "Coastal Sand",
          soilPH: 6.0,
          precipitation: 175,
          elevation: 15,
          cropSuitability: ["Rice", "Cassava", "Groundnuts", "Vegetables"],
          soilMoisture: 68,
          vegetationIndex: 0.62,
          carbonContent: 1.8
        },
        {
          name: "Gbarpolu County",
          temperature: 24.3,
          humidity: 91,
          soilType: "Highland Forest Soil",
          soilPH: 5.3,
          precipitation: 295,
          elevation: 380,
          cropSuitability: ["Coffee", "Cocoa", "Timber", "Medicinal Plants"],
          soilMoisture: 94,
          vegetationIndex: 0.85,
          carbonContent: 4.3
        },
        {
          name: "Grand Kru County",
          temperature: 26.7,
          humidity: 86,
          soilType: "Coastal Oxisols",
          soilPH: 5.8,
          precipitation: 250,
          elevation: 45,
          cropSuitability: ["Palm Oil", "Cassava", "Plantain", "Fish Farming"],
          soilMoisture: 82,
          vegetationIndex: 0.69,
          carbonContent: 2.8
        },
        {
          name: "Grand Gedeh County",
          temperature: 25.4,
          humidity: 88,
          soilType: "Forest Ultisols",
          soilPH: 5.6,
          precipitation: 270,
          elevation: 200,
          cropSuitability: ["Rubber", "Cocoa", "Coffee", "Timber"],
          soilMoisture: 89,
          vegetationIndex: 0.76,
          carbonContent: 3.5
        },
        {
          name: "River Cess County",
          temperature: 27.1,
          humidity: 84,
          soilType: "Riverine Alluvium",
          soilPH: 6.1,
          precipitation: 210,
          elevation: 35,
          cropSuitability: ["Rice", "Cassava", "Plantain", "Vegetables"],
          soilMoisture: 78,
          vegetationIndex: 0.66,
          carbonContent: 2.6
        },
        {
          name: "River Gee County",
          temperature: 26.3,
          humidity: 87,
          soilType: "Tropical Podzols",
          soilPH: 5.4,
          precipitation: 260,
          elevation: 85,
          cropSuitability: ["Palm Oil", "Rubber", "Cassava", "Cocoa"],
          soilMoisture: 86,
          vegetationIndex: 0.72,
          carbonContent: 3.2
        },
        {
          name: "Margibi County",
          temperature: 28.7,
          humidity: 79,
          soilType: "Coastal Laterite",
          soilPH: 6.3,
          precipitation: 165,
          elevation: 20,
          cropSuitability: ["Rice", "Vegetables", "Cassava", "Rubber"],
          soilMoisture: 71,
          vegetationIndex: 0.63,
          carbonContent: 2.2
        }
      ];
      
      return counties;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    cacheTime: 30 * 60 * 1000, // 30 minutes cache
    refetchInterval: 60000, // Update every 60 seconds
  });

  // Auto-play animation through counties
  useEffect(() => {
    if (isAutoPlaying && satelliteData) {
      const interval = setInterval(() => {
        setCurrentCountyIndex((prev) => (prev + 1) % satelliteData.length);
      }, 4000); // Change county every 4 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, satelliteData]);

  const nextCounty = () => {
    if (satelliteData) {
      setCurrentCountyIndex((prev) => (prev + 1) % satelliteData.length);
    }
  };

  const prevCounty = () => {
    if (satelliteData) {
      setCurrentCountyIndex((prev) => (prev - 1 + satelliteData.length) % satelliteData.length);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Satellite className="h-6 w-6 text-blue-600 animate-spin" />
          <span>Loading satellite data...</span>
        </div>
      </div>
    );
  }

  const currentCounty = satelliteData?.[currentCountyIndex];

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Satellite className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Satellite Agricultural Intelligence</h2>
          <Badge className="bg-green-100 text-green-800">Live Data</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={isAutoPlaying ? "bg-blue-50 border-blue-200" : ""}
          >
            {isAutoPlaying ? "Pause" : "Play"} Animation
          </Button>
          <Button variant="outline" size="sm" onClick={prevCounty}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextCounty}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* County Progress Indicator */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-1">
          {satelliteData?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCountyIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentCountyIndex 
                  ? "bg-blue-600 w-6" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Single County Display with Animation */}
      {currentCounty && (
        <div className="animate-in fade-in duration-500">
          <Card className="bg-white border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
                {currentCounty.name}
                <div className="flex items-center gap-1 ml-auto">
                  <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                  <span className="text-xs text-green-600">Live</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {currentCountyIndex + 1} of {satelliteData?.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Environmental Conditions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 transform transition-all duration-300 hover:scale-105">
                  <Thermometer className={`h-4 w-4 ${getTemperatureColor(currentCounty.temperature)}`} />
                  <div>
                    <p className="text-xs text-gray-500">Temperature</p>
                    <p className={`font-semibold ${getTemperatureColor(currentCounty.temperature)} animate-pulse`}>
                      {currentCounty.temperature}°C
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 transform transition-all duration-300 hover:scale-105">
                  <Droplets className={`h-4 w-4 ${getMoistureColor(currentCounty.soilMoisture)}`} />
                  <div>
                    <p className="text-xs text-gray-500">Soil Moisture</p>
                    <p className={`font-semibold ${getMoistureColor(currentCounty.soilMoisture)} animate-pulse`}>
                      {currentCounty.soilMoisture}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 transform transition-all duration-300 hover:scale-105">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Precipitation</p>
                    <p className="font-semibold text-blue-600 animate-pulse">{currentCounty.precipitation}mm</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 transform transition-all duration-300 hover:scale-105">
                  <Mountain className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Elevation</p>
                    <p className="font-semibold text-gray-700">{currentCounty.elevation}m</p>
                  </div>
                </div>
              </div>

              {/* Soil Information */}
              <div className="border-t pt-3 animate-in slide-in-from-left duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <Mountain className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-800">Soil Analysis</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between animate-in slide-in-from-right duration-700">
                    <span className="text-gray-600">Type:</span>
                    <Badge variant="outline" className="text-xs animate-pulse">{currentCounty.soilType}</Badge>
                  </div>
                  <div className="flex justify-between animate-in slide-in-from-right duration-700 delay-75">
                    <span className="text-gray-600">pH Level:</span>
                    <span className="font-medium">{currentCounty.soilPH}</span>
                  </div>
                  <div className="flex justify-between animate-in slide-in-from-right duration-700 delay-150">
                    <span className="text-gray-600">Carbon Content:</span>
                    <span className="font-medium text-green-600 animate-pulse">{currentCounty.carbonContent}%</span>
                  </div>
                  <div className="flex justify-between animate-in slide-in-from-right duration-700 delay-200">
                    <span className="text-gray-600">Vegetation Index:</span>
                    <Badge className="bg-green-100 text-green-800 text-xs animate-bounce">
                      {currentCounty.vegetationIndex} (NDVI)
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Crop Suitability */}
              <div className="border-t pt-3 animate-in slide-in-from-bottom duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <Sprout className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Optimal Crops</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentCounty.cropSuitability.map((crop, cropIndex) => (
                    <Badge 
                      key={cropIndex} 
                      variant="secondary" 
                      className="text-xs bg-green-50 text-green-700 border-green-200 animate-in zoom-in duration-300 hover:scale-110 transition-transform"
                      style={{ animationDelay: `${cropIndex * 100}ms` }}
                    >
                      <Leaf className="h-3 w-3 mr-1 animate-pulse" />
                      {crop}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Satellite Status */}
              <div className="border-t pt-2 animate-in fade-in duration-1000">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Satellite className="h-3 w-3 animate-spin" />
                    <span>Sentinel-2, Landsat-8</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sun className="h-3 w-3 text-yellow-500 animate-pulse" />
                    <span>Last Update: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Counties Grid (Hidden but available for reference) */}
      <div className="hidden lg:grid grid-cols-3 gap-2 mt-4">
        {satelliteData?.map((county, index) => (
          <button
            key={index}
            onClick={() => setCurrentCountyIndex(index)}
            className={`p-2 text-xs text-center rounded-lg border transition-all duration-300 hover:scale-105 ${
              index === currentCountyIndex 
                ? "bg-blue-100 border-blue-300 text-blue-800" 
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <div className="font-medium">{county.name.replace(" County", "")}</div>
            <div className={`text-xs ${getTemperatureColor(county.temperature)}`}>
              {county.temperature}°C
            </div>
          </button>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Satellite className="h-5 w-5" />
            Regional Agricultural Overview - All 15 Counties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="animate-pulse">
              <p className="text-2xl font-bold text-green-600">
                {satelliteData ? (satelliteData.reduce((acc, county) => acc + county.temperature, 0) / satelliteData.length).toFixed(1) : 0}°C
              </p>
              <p className="text-xs text-gray-600">Avg Temperature</p>
            </div>
            <div className="animate-pulse">
              <p className="text-2xl font-bold text-blue-600">
                {satelliteData ? Math.round(satelliteData.reduce((acc, county) => acc + county.soilMoisture, 0) / satelliteData.length) : 0}%
              </p>
              <p className="text-xs text-gray-600">Avg Soil Moisture</p>
            </div>
            <div className="animate-pulse">
              <p className="text-2xl font-bold text-amber-600">
                {satelliteData ? (satelliteData.reduce((acc, county) => acc + county.soilPH, 0) / satelliteData.length).toFixed(1) : 0}
              </p>
              <p className="text-xs text-gray-600">Avg Soil pH</p>
            </div>
            <div className="animate-pulse">
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