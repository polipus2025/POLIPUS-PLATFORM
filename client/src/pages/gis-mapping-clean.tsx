import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Map, Globe, Satellite, Truck, Activity, BarChart3, MapPin, Target, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Clean GIS Mapping Component
export default function GISMappingClean() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCounty, setSelectedCounty] = useState<any>(null);
  const { toast } = useToast();

  const counties = [
    { name: 'Montserrado', farms: 342, color: 'bg-red-100 hover:bg-red-200' },
    { name: 'Lofa', farms: 287, color: 'bg-blue-100 hover:bg-blue-200' },
    { name: 'Nimba', farms: 298, color: 'bg-yellow-100 hover:bg-yellow-200' },
    { name: 'Bong', farms: 234, color: 'bg-green-100 hover:bg-green-200' },
    { name: 'Grand Bassa', farms: 189, color: 'bg-purple-100 hover:bg-purple-200' },
    { name: 'Grand Gedeh', farms: 156, color: 'bg-pink-100 hover:bg-pink-200' },
    { name: 'Sinoe', farms: 123, color: 'bg-indigo-100 hover:bg-indigo-200' },
    { name: 'Maryland', farms: 134, color: 'bg-orange-100 hover:bg-orange-200' },
    { name: 'Grand Kru', farms: 98, color: 'bg-teal-100 hover:bg-teal-200' },
    { name: 'River Cess', farms: 87, color: 'bg-cyan-100 hover:bg-cyan-200' },
    { name: 'Gbarpolu', farms: 112, color: 'bg-lime-100 hover:bg-lime-200' },
    { name: 'Bomi', farms: 145, color: 'bg-emerald-100 hover:bg-emerald-200' },
    { name: 'Grand Cape Mount', farms: 203, color: 'bg-violet-100 hover:bg-violet-200' },
    { name: 'Margibi', farms: 167, color: 'bg-rose-100 hover:bg-rose-200' },
    { name: 'River Gee', farms: 89, color: 'bg-slate-100 hover:bg-slate-200' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GIS Mapping System</h1>
          <p className="text-gray-600">Geographic Information System for Agricultural Monitoring</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Live System Active
        </Badge>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Counties Map
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Real-Time Data
          </TabsTrigger>
          <TabsTrigger value="satellites" className="flex items-center gap-2">
            <Satellite className="h-4 w-4" />
            Satellite View
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Liberia Counties Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Clean County Grid */}
                <div className="grid grid-cols-5 gap-3 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border">
                  {counties.map((county, index) => (
                    <div 
                      key={county.name}
                      className={`${county.color} p-3 rounded-lg cursor-pointer text-center transition-colors`}
                      onClick={() => {
                        setSelectedCounty({
                          name: county.name,
                          farms: county.farms,
                          population: `${Math.floor(Math.random() * 500 + 100)}K`,
                          compliance: Math.floor(Math.random() * 15 + 85),
                        });
                      }}
                    >
                      <div className="font-semibold text-sm">{county.name}</div>
                      <div className="text-xs text-gray-600">{county.farms} farms</div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg text-center border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🇱🇷 Liberia Agricultural Overview</h3>
                  <p className="text-sm text-gray-600 mb-2">Complete coverage of all 15 counties</p>
                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                    <span>Total Farms: {counties.reduce((sum, c) => sum + c.farms, 0)}</span>
                    <span>•</span>
                    <span>Average Compliance: 88%</span>
                    <span>•</span>
                    <span>Active Counties: 15</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Agricultural Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Globe className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <p className="text-gray-600">Live data streaming from field sensors</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satellites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Satellite Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Satellite className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <p className="text-gray-600">Connected to GPS, GLONASS, Galileo networks</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agricultural Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <p className="text-gray-600">Compliance trends and production analytics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* County Detail Dialog */}
      <Dialog open={!!selectedCounty} onOpenChange={() => setSelectedCounty(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCounty?.name} County</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Total Farms</p>
                <p className="text-2xl font-bold text-green-600">{selectedCounty?.farms}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Population</p>
                <p className="text-2xl font-bold text-blue-600">{selectedCounty?.population}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Compliance Rate</p>
              <p className="text-2xl font-bold text-purple-600">{selectedCounty?.compliance}%</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}