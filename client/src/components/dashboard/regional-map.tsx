import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComplianceByCounty } from "@/lib/types";

interface RegionalMapProps {
  selectedCounty?: string;
}

export default function RegionalMap({ selectedCounty = "all" }: RegionalMapProps) {
  const { data: countyData = [], isLoading } = useQuery<ComplianceByCounty[]>({
    queryKey: ["/api/dashboard/compliance-by-county"],
    refetchInterval: 3000, // Refresh every 3 seconds for real-time updates
  });

  // Auto-scroll state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [displayData, setDisplayData] = useState<ComplianceByCounty[]>([]);

  // Filter county data based on selection with useMemo to prevent loop
  const filteredCountyData = React.useMemo(() => {
    return selectedCounty === "all" 
      ? countyData 
      : countyData.filter(county => {
          return county.county.toLowerCase().trim() === selectedCounty.toLowerCase().trim();
        });
  }, [selectedCounty, countyData]);

  // Reset when county changes - no effect needed for length changes
  const resetForNewCounty = (county: string) => {
    setCurrentIndex(0);
    setIsAutoScrolling(filteredCountyData.length > 4);
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling || filteredCountyData.length <= 4) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % Math.max(1, Math.ceil(filteredCountyData.length / 4))
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoScrolling, filteredCountyData.length]);

  // Update display data when data changes or index changes - with stable reference check
  useEffect(() => {
    if (filteredCountyData.length === 0) {
      setDisplayData([]);
      return;
    }
    
    // For single county or small datasets, show all data
    if (filteredCountyData.length <= 4) {
      setDisplayData(filteredCountyData);
      return;
    }
    
    const startIndex = currentIndex * 4;
    const endIndex = startIndex + 4;
    const newDisplayData = filteredCountyData.slice(startIndex, endIndex);
    setDisplayData(newDisplayData);
  }, [currentIndex, filteredCountyData.length, selectedCounty]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (rate: number) => {
    const safeRate = rate || 0;
    if (safeRate >= 95) return 'bg-success';
    if (safeRate >= 85) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-neutral">
            {selectedCounty === "all" ? "Regional Compliance Overview" : `${selectedCounty} County Overview`}
            {selectedCounty !== "all" && (
              <span className="text-sm font-normal text-green-600 ml-2">
                • Filtered View ({filteredCountyData.length} record{filteredCountyData.length !== 1 ? 's' : ''})
              </span>
            )}
          </CardTitle>
          
          {/* Auto-scroll Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className="h-8"
            >
              {isAutoScrolling ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="h-8"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            
            <span className="text-xs text-gray-500 min-w-[60px] text-center">
              {currentIndex + 1} / {Math.max(1, Math.ceil(filteredCountyData.length / 4))}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentIndex(Math.min(Math.ceil(filteredCountyData.length / 4) - 1, currentIndex + 1))}
              disabled={currentIndex >= Math.ceil(filteredCountyData.length / 4) - 1}
              className="h-8"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="relative h-64 bg-gray-50 rounded-lg overflow-hidden"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative h-full flex items-center justify-center">
            {/* Auto-scrolling Indicator */}
            {isAutoScrolling && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Live
              </div>
            )}
            
            {/* County Data Grid with Smooth Transitions */}
            <div className="grid grid-cols-2 gap-4 text-white transition-all duration-500 ease-in-out">
              {displayData.map((county, index) => (
                <div 
                  key={`${county.county}-${currentIndex}`} 
                  className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 transform transition-all duration-500 hover:bg-opacity-30"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isAutoScrolling ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${getStatusColor(county.complianceRate || 0)} rounded-full animate-pulse`}></div>
                    <span className="text-sm font-medium truncate">{county.county}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-200">
                      Compliance: <span className="font-semibold text-white">{county.complianceRate || 0}%</span>
                    </div>
                    <div className="text-xs text-gray-200">
                      Commodities: <span className="font-semibold text-white">{county.total || 0}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          (county.complianceRate || 0) >= 85 ? 'bg-green-400' :
                          (county.complianceRate || 0) >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${county.complianceRate || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State for No Data */}
            {displayData.length === 0 && (
              <div className="text-white text-center p-8">
                <div className="text-lg font-medium mb-2">
                  {selectedCounty === "all" ? "No county data available" : `No data found for ${selectedCounty}`}
                </div>
                <div className="text-sm opacity-75">
                  {selectedCounty === "all" 
                    ? "Please check your connection or try refreshing the page" 
                    : "This county may not have compliance data available yet"
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
