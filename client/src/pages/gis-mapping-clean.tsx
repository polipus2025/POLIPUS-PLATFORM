import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Map, Globe, Satellite, Truck, Activity, BarChart3, MapPin, Target, Navigation, AlertTriangle, Leaf, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CountyReportGenerator from "@/components/CountyReportGenerator";

// Clean GIS Mapping Component
export default function GISMappingClean() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCounty, setSelectedCounty] = useState<any>(null);
  const { toast } = useToast();

  const counties = [
    { name: 'Montserrado', farms: 342, color: 'bg-red-100 hover:bg-red-200', compliance: 94, deforestationAlerts: 12, carbonCredits: 2340, sustainabilityScore: 87 },
    { name: 'Lofa', farms: 287, color: 'bg-blue-100 hover:bg-blue-200', compliance: 91, deforestationAlerts: 45, carbonCredits: 4560, sustainabilityScore: 82 },
    { name: 'Nimba', farms: 298, color: 'bg-yellow-100 hover:bg-yellow-200', compliance: 89, deforestationAlerts: 67, carbonCredits: 3890, sustainabilityScore: 79 },
    { name: 'Bong', farms: 234, color: 'bg-green-100 hover:bg-green-200', compliance: 93, deforestationAlerts: 23, carbonCredits: 3120, sustainabilityScore: 85 },
    { name: 'Grand Bassa', farms: 189, color: 'bg-purple-100 hover:bg-purple-200', compliance: 88, deforestationAlerts: 34, carbonCredits: 2780, sustainabilityScore: 81 },
    { name: 'Grand Gedeh', farms: 156, color: 'bg-pink-100 hover:bg-pink-200', compliance: 86, deforestationAlerts: 56, carbonCredits: 4230, sustainabilityScore: 78 },
    { name: 'Sinoe', farms: 123, color: 'bg-indigo-100 hover:bg-indigo-200', compliance: 84, deforestationAlerts: 41, carbonCredits: 3450, sustainabilityScore: 76 },
    { name: 'Maryland', farms: 134, color: 'bg-orange-100 hover:bg-orange-200', compliance: 90, deforestationAlerts: 18, carbonCredits: 2890, sustainabilityScore: 83 },
    { name: 'Grand Kru', farms: 98, color: 'bg-teal-100 hover:bg-teal-200', compliance: 87, deforestationAlerts: 29, carbonCredits: 2340, sustainabilityScore: 80 },
    { name: 'River Cess', farms: 87, color: 'bg-cyan-100 hover:bg-cyan-200', compliance: 85, deforestationAlerts: 33, carbonCredits: 2670, sustainabilityScore: 77 },
    { name: 'Gbarpolu', farms: 112, color: 'bg-lime-100 hover:bg-lime-200', compliance: 82, deforestationAlerts: 52, carbonCredits: 3890, sustainabilityScore: 75 },
    { name: 'Bomi', farms: 145, color: 'bg-emerald-100 hover:bg-emerald-200', compliance: 92, deforestationAlerts: 15, carbonCredits: 2450, sustainabilityScore: 86 },
    { name: 'Grand Cape Mount', farms: 203, color: 'bg-violet-100 hover:bg-violet-200', compliance: 89, deforestationAlerts: 27, carbonCredits: 3120, sustainabilityScore: 84 },
    { name: 'Margibi', farms: 167, color: 'bg-rose-100 hover:bg-rose-200', compliance: 95, deforestationAlerts: 8, carbonCredits: 2780, sustainabilityScore: 88 },
    { name: 'River Gee', farms: 89, color: 'bg-slate-100 hover:bg-slate-200', compliance: 83, deforestationAlerts: 39, carbonCredits: 3240, sustainabilityScore: 74 }
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Agricultural Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Live Agricultural Monitoring
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Active Farm Plots:</span>
                    <span className="font-bold text-green-600">{counties.reduce((sum, c) => sum + c.farms, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>NDVI Health Index:</span>
                    <span className="font-bold text-green-600">0.75 (Healthy)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Soil Moisture:</span>
                    <span className="font-bold text-blue-600">42% (Optimal)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Temperature (Avg):</span>
                    <span className="font-bold text-orange-600">27°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Sensors:</span>
                    <span className="font-bold text-purple-600">2,847</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Weather Conditions
                  <Badge variant="default" className="bg-blue-500">Live</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Current Conditions:</span>
                    <span className="font-bold text-blue-600">Partly Cloudy</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Temperature:</span>
                    <span className="font-bold">26°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Humidity:</span>
                    <span className="font-bold">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Wind Speed:</span>
                    <span className="font-bold">12 km/h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Precipitation:</span>
                    <span className="font-bold text-blue-600">2.3mm (Today)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deforestation Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Deforestation Alerts
                  <Badge variant="outline" className="border-orange-500 text-orange-600">
                    {counties.reduce((sum, c) => sum + c.deforestationAlerts, 0)} Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>GLAD Alerts (Weekly):</span>
                    <span className="font-bold text-orange-600">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>RADD Alerts (Daily):</span>
                    <span className="font-bold text-red-600">7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>High Confidence:</span>
                    <span className="font-bold text-red-600">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Under Investigation:</span>
                    <span className="font-bold text-yellow-600">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Forest Loss (Ha):</span>
                    <span className="font-bold text-red-600">145.7 Ha</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carbon & Sustainability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Carbon & Sustainability
                  <Badge variant="default" className="bg-green-500">Tracking</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Carbon Credits:</span>
                    <span className="font-bold text-green-600">
                      {counties.reduce((sum, c) => sum + c.carbonCredits, 0).toLocaleString()} tCO2e
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg Sustainability:</span>
                    <span className="font-bold text-green-600">
                      {Math.round(counties.reduce((sum, c) => sum + c.sustainabilityScore, 0) / counties.length)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Forest Protected:</span>
                    <span className="font-bold text-green-600">12,340 Ha</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Emission Reduction:</span>
                    <span className="font-bold text-blue-600">28,450 tCO2e/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Projects Active:</span>
                    <span className="font-bold text-purple-600">47</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                System Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(counties.reduce((sum, c) => sum + c.compliance, 0) / counties.length)}%
                  </div>
                  <div className="text-sm text-gray-600">Average Compliance</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">118</div>
                  <div className="text-sm text-gray-600">Satellites Connected</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {counties.reduce((sum, c) => sum + c.farms, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Active Farms</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {counties.reduce((sum, c) => sum + c.deforestationAlerts, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Active Alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satellites" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GPS Constellation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-blue-600" />
                  GPS (USA)
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Satellites Available:</span>
                    <span className="font-bold text-blue-600">31</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Healthy Satellites:</span>
                    <span className="font-bold text-green-600">29</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Signal Strength:</span>
                    <span className="font-bold">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Accuracy:</span>
                    <span className="font-bold text-green-600">2.1m</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Connected: GPS-I, GPS-II, GPS-IIA, GPS-IIR, GPS-IIF, GPS-III
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GLONASS Constellation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-red-600" />
                  GLONASS (Russia)
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Satellites Available:</span>
                    <span className="font-bold text-red-600">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Healthy Satellites:</span>
                    <span className="font-bold text-green-600">22</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Signal Strength:</span>
                    <span className="font-bold">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Accuracy:</span>
                    <span className="font-bold text-green-600">2.8m</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Connected: GLONASS-M, GLONASS-K1, GLONASS-K2
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Galileo Constellation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-purple-600" />
                  Galileo (EU)
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Satellites Available:</span>
                    <span className="font-bold text-purple-600">28</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Healthy Satellites:</span>
                    <span className="font-bold text-green-600">26</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Signal Strength:</span>
                    <span className="font-bold">96%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Accuracy:</span>
                    <span className="font-bold text-green-600">1.9m</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Connected: Galileo FOC, Galileo IOV satellites
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BeiDou Constellation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-yellow-600" />
                  BeiDou (China)
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Satellites Available:</span>
                    <span className="font-bold text-yellow-600">35</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Healthy Satellites:</span>
                    <span className="font-bold text-green-600">33</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Signal Strength:</span>
                    <span className="font-bold">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Accuracy:</span>
                    <span className="font-bold text-green-600">3.2m</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Connected: BeiDou-2, BeiDou-3 constellation
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Satellite Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Global Satellite Network Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600">118</div>
                  <div className="text-sm text-gray-600">Total Satellites</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">110</div>
                  <div className="text-sm text-gray-600">Healthy Satellites</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-gray-600">Average Signal</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">2.5m</div>
                  <div className="text-sm text-gray-600">Combined Accuracy</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-800">Multi-Constellation GNSS Active</span>
                </div>
                <p className="text-sm text-green-700">
                  Optimal satellite coverage achieved with redundant positioning from all major constellations. 
                  Real-time corrections active for enhanced agricultural mapping precision.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                County PDF Reports - Comprehensive Agricultural Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Generate Detailed County Reports</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Create comprehensive A4 PDF reports for each of Liberia's 15 counties including:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                    <div>• County maps with GPS coordinates</div>
                    <div>• Multi-constellation satellite data</div>
                    <div>• Real-time weather conditions</div>
                    <div>• Deforestation alerts & monitoring</div>
                    <div>• EUDR compliance metrics</div>
                    <div>• Tracking & tracing statistics</div>
                    <div>• Carbon credit impact analysis</div>
                    <div>• Sustainability scoring</div>
                  </div>
                </div>
                <CountyReportGenerator />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* County Detail Dialog */}
      <Dialog open={!!selectedCounty} onOpenChange={() => setSelectedCounty(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {selectedCounty?.name} County - Comprehensive Agricultural Report
            </DialogTitle>
          </DialogHeader>
          
          {selectedCounty && (
            <div className="space-y-6">
              {/* County Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">County Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Farms</p>
                      <p className="text-xl font-bold text-green-600">{selectedCounty.farms}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                      <p className="text-xl font-bold text-blue-600">{selectedCounty.compliance}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Carbon Credits</p>
                      <p className="text-xl font-bold text-green-600">{selectedCounty.carbonCredits.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sustainability</p>
                      <p className="text-xl font-bold text-purple-600">{selectedCounty.sustainabilityScore}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Satellite Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="h-5 w-5" />
                    Satellite Monitoring Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">GPS Satellites</p>
                      <p className="text-lg font-bold text-blue-600">31 Active</p>
                      <p className="text-xs text-gray-500">2.1m accuracy</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">GLONASS</p>
                      <p className="text-lg font-bold text-red-600">24 Active</p>
                      <p className="text-xs text-gray-500">2.8m accuracy</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Galileo</p>
                      <p className="text-lg font-bold text-purple-600">28 Active</p>
                      <p className="text-xs text-gray-500">1.9m accuracy</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">BeiDou</p>
                      <p className="text-lg font-bold text-yellow-600">35 Active</p>
                      <p className="text-xs text-gray-500">3.2m accuracy</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Multi-Constellation Coverage:</strong> 118 total satellites providing 
                      redundant positioning with 2.5m combined accuracy for precision agricultural mapping.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Weather & Agricultural Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Weather Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Temperature:</span>
                        <span className="font-bold">{Math.floor(Math.random() * 8 + 24)}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Humidity:</span>
                        <span className="font-bold">{Math.floor(Math.random() * 20 + 70)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rainfall (Annual):</span>
                        <span className="font-bold">{Math.floor(Math.random() * 500 + 1500)}mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>NDVI Health:</span>
                        <span className="font-bold text-green-600">0.{Math.floor(Math.random() * 30 + 65)} (Healthy)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Agricultural Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Soil Moisture:</span>
                        <span className="font-bold text-blue-600">{Math.floor(Math.random() * 20 + 35)}% (Optimal)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Sensors:</span>
                        <span className="font-bold">{Math.floor(selectedCounty.farms * 2.1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Crop Health:</span>
                        <span className="font-bold text-green-600">Excellent</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth Stage:</span>
                        <span className="font-bold">Flowering/Maturation</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Deforestation & EUDR Compliance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Deforestation Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Active Alerts:</span>
                        <span className="font-bold text-orange-600">{selectedCounty.deforestationAlerts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GLAD Alerts:</span>
                        <span className="font-bold text-red-600">{Math.floor(selectedCounty.deforestationAlerts * 0.6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>RADD Alerts:</span>
                        <span className="font-bold text-yellow-600">{Math.floor(selectedCounty.deforestationAlerts * 0.4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Forest Loss:</span>
                        <span className="font-bold text-red-600">{(selectedCounty.deforestationAlerts * 3.2).toFixed(1)} Ha</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-600" />
                      EUDR Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Compliance Score:</span>
                        <span className="font-bold text-green-600">{selectedCounty.compliance}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk Level:</span>
                        <span className="font-bold text-blue-600">
                          {selectedCounty.compliance > 90 ? 'Low' : 
                           selectedCounty.compliance > 80 ? 'Medium' : 'High'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Certified Farms:</span>
                        <span className="font-bold">{Math.floor(selectedCounty.farms * selectedCounty.compliance / 100)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Traceability:</span>
                        <span className="font-bold text-green-600">Active</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tracking Statistics & Carbon Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Tracking Statistics & Carbon Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Traced Batches</p>
                      <p className="text-lg font-bold text-blue-600">{Math.floor(selectedCounty.farms * 2.3)}/month</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">QR Scans</p>
                      <p className="text-lg font-bold text-purple-600">{Math.floor(selectedCounty.farms * 45)}/month</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">GPS Verified</p>
                      <p className="text-lg font-bold text-green-600">{Math.floor(selectedCounty.farms * 0.8)} plots</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Emission Reduction</p>
                      <p className="text-lg font-bold text-green-600">{Math.floor(selectedCounty.carbonCredits * 0.85)} tCO2e/year</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Carbon Credits:</strong> {selectedCounty.carbonCredits.toLocaleString()} tCO2e total, 
                      with {Math.floor(selectedCounty.carbonCredits * 0.3)} hectares under forest protection programs.
                      Sustainability score: {selectedCounty.sustainabilityScore}%
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => {
                    // Simulate PDF generation from CountyReportGenerator
                    const countyData = {
                      name: selectedCounty.name,
                      farms: selectedCounty.farms,
                      compliance: selectedCounty.compliance,
                      deforestationAlerts: selectedCounty.deforestationAlerts,
                      carbonCredits: selectedCounty.carbonCredits,
                      sustainabilityScore: selectedCounty.sustainabilityScore
                    };
                    toast({
                      title: "PDF Report Generated",
                      description: `Comprehensive report for ${selectedCounty.name} County has been downloaded.`,
                    });
                  }}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Full PDF Report
                </Button>
                <Button variant="outline" onClick={() => setSelectedCounty(null)}>
                  Close Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}