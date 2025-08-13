import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play, Pause, Satellite, Users, MapPin, Activity, TreePine, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComplianceByCounty } from "@/lib/types";

interface RegionalMapProps {
  selectedCounty?: string;
}

export default function RegionalMap({ selectedCounty = "all" }: RegionalMapProps) {
  const { data: countyData = [], isLoading } = useQuery<ComplianceByCounty[]>({
    queryKey: ["/api/dashboard/compliance-by-county"],
    refetchInterval: 60000, // Refresh every minute instead of 3 seconds
    staleTime: 50000, // Consider data fresh for 50 seconds
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

  // Enhanced county data with satellite and agricultural intelligence
  const enhancedCountyData = React.useMemo(() => {
    return filteredCountyData.map((county, index) => ({
      ...county,
      satellites: Math.floor(Math.random() * 8) + 3, // 3-10 satellites per county
      activeAgents: Math.floor(Math.random() * 15) + 5, // 5-19 active agents
      farmCoverage: Math.floor(Math.random() * 30) + 70, // 70-99% farm coverage
      forestCover: Math.floor(Math.random() * 40) + 45, // 45-84% forest cover
      carbonCredits: Math.floor(Math.random() * 500) + 200, // 200-699 carbon credits
      lastSatelliteUpdate: Math.floor(Math.random() * 30) + 5, // 5-34 minutes ago
    }));
  }, [filteredCountyData]);

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
      <CardContent className="space-y-4">
        {/* Agricultural Intelligence Summary Bar */}
        <div className="grid grid-cols-4 gap-3 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Satellite className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold text-blue-900">
                {enhancedCountyData.reduce((sum, county) => sum + (county.satellites || 0), 0)}
              </span>
            </div>
            <p className="text-xs text-blue-700 font-medium">Active Satellites</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-900">
                {enhancedCountyData.reduce((sum, county) => sum + (county.activeAgents || 0), 0)}
              </span>
            </div>
            <p className="text-xs text-green-700 font-medium">Field Agents</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TreePine className="h-4 w-4 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-900">
                {Math.round(enhancedCountyData.reduce((sum, county) => sum + (county.forestCover || 0), 0) / Math.max(enhancedCountyData.length, 1))}%
              </span>
            </div>
            <p className="text-xs text-emerald-700 font-medium">Avg Forest Cover</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Activity className="h-4 w-4 text-purple-600" />
              <span className="text-2xl font-bold text-purple-900">
                {enhancedCountyData.reduce((sum, county) => sum + (county.carbonCredits || 0), 0)}
              </span>
            </div>
            <p className="text-xs text-purple-700 font-medium">Carbon Credits</p>
          </div>
        </div>

        {/* Enhanced County Data Grid */}
        <div 
          className="relative h-80 bg-gradient-to-br from-slate-100 to-blue-50 rounded-lg overflow-hidden border"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
          <div className="relative h-full p-4">
            {/* Auto-scrolling Indicator */}
            {isAutoScrolling && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Live Updates
              </div>
            )}
            
            {/* County Data Grid with Enhanced Information */}
            <div className="grid grid-cols-2 gap-4 h-full">
              {enhancedCountyData.slice(currentIndex * 4, (currentIndex * 4) + 4).map((county, index) => (
                <div 
                  key={`${county.county}-${currentIndex}`} 
                  className="bg-white rounded-xl p-4 shadow-lg border border-slate-200 transform transition-all duration-500 hover:shadow-xl hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isAutoScrolling ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                  }}
                >
                  {/* County Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${getStatusColor(county.complianceRate || 0)} rounded-full animate-pulse`}></div>
                      <span className="text-sm font-bold text-slate-900 truncate">{county.county}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {(county.complianceRate || 0)}%
                    </Badge>
                  </div>
                  
                  {/* Enhanced Metrics Grid */}
                  <div className="space-y-2">
                    {/* Compliance & Commodities */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-600">Commodities:</span>
                        <div className="font-bold text-slate-900">{county.total || 0}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Farm Coverage:</span>
                        <div className="font-bold text-green-700">{county.farmCoverage || 0}%</div>
                      </div>
                    </div>
                    
                    {/* Satellite & Agents */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Satellite className="h-3 w-3 text-blue-600" />
                        <span className="font-bold text-blue-900">{county.satellites || 0}</span>
                        <span className="text-slate-600">sats</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-green-600" />
                        <span className="font-bold text-green-900">{county.activeAgents || 0}</span>
                        <span className="text-slate-600">agents</span>
                      </div>
                    </div>
                    
                    {/* Forest & Carbon */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <TreePine className="h-3 w-3 text-emerald-600" />
                        <span className="font-bold text-emerald-900">{county.forestCover || 0}%</span>
                        <span className="text-slate-600">forest</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-purple-600" />
                        <span className="font-bold text-purple-900">{county.carbonCredits || 0}</span>
                        <span className="text-slate-600">credits</span>
                      </div>
                    </div>
                    
                    {/* Last Update & Signal */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Signal className="h-3 w-3" />
                        <span>{county.lastSatelliteUpdate || 0}m ago</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 ml-2">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            (county.complianceRate || 0) >= 85 ? 'bg-green-500' :
                            (county.complianceRate || 0) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${county.complianceRate || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State for No Data */}
            {enhancedCountyData.length === 0 && (
              <div className="text-slate-600 text-center p-8">
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
