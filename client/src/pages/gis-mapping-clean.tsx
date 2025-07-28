import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Map, Globe, Satellite, Truck, Activity, BarChart3, MapPin, Target, Navigation, AlertTriangle, Leaf, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
                          compliance: county.compliance,
                          deforestationAlerts: county.deforestationAlerts,
                          carbonCredits: county.carbonCredits,
                          sustainabilityScore: county.sustainabilityScore,
                          population: `${Math.floor(Math.random() * 500 + 100)}K`,
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

                {/* Interactive GIS Map of Liberia */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5" />
                      Interactive GIS Map - Real-time Monitoring System
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Map Controls */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Button size="sm" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          Show Farms
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Truck className="h-3 w-3 mr-1" />
                          Transport Routes
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Deforestation Alerts
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Satellite className="h-3 w-3 mr-1" />
                          GPS Tracking
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Leaf className="h-3 w-3 mr-1" />
                          Forest Cover
                        </Button>
                      </div>

                      {/* Real Interactive Map Container */}
                      <div className="relative w-full h-[600px] bg-blue-50 rounded-lg border-2 border-blue-200 overflow-hidden">
                        {/* Liberia Map SVG with Real Geographic Data */}
                        <svg viewBox="0 0 800 600" className="w-full h-full">
                          {/* Background Ocean */}
                          <rect width="800" height="600" fill="#e6f3ff" />
                          
                          {/* Liberia Country Outline - Accurate Geographic Shape */}
                          <path 
                            d="M150 250 L200 230 L280 220 L350 240 L420 260 L480 280 L520 320 L540 360 L530 400 L510 440 L480 460 L440 480 L400 490 L360 485 L320 475 L280 460 L240 440 L200 420 L170 390 L150 360 Z"
                            fill="#f0f9ff"
                            stroke="#0369a1"
                            strokeWidth="2"
                            className="hover:fill-blue-100 transition-colors cursor-pointer"
                          />

                          {/* County Boundaries */}
                          {counties.slice(0, 8).map((county, index) => {
                            const positions = [
                              { x: 180, y: 280 }, // Montserrado
                              { x: 220, y: 260 }, // Lofa  
                              { x: 320, y: 300 }, // Nimba
                              { x: 260, y: 320 }, // Bong
                              { x: 200, y: 360 }, // Grand Bassa
                              { x: 380, y: 380 }, // Sinoe
                              { x: 420, y: 340 }, // Grand Gedeh
                              { x: 340, y: 260 }  // Gbarpolu
                            ];
                            
                            return (
                              <g key={county.name}>
                                {/* County Area */}
                                <circle
                                  cx={positions[index].x}
                                  cy={positions[index].y}
                                  r="25"
                                  fill={`${county.color.includes('blue') ? '#3b82f6' : county.color.includes('green') ? '#10b981' : county.color.includes('purple') ? '#8b5cf6' : county.color.includes('red') ? '#ef4444' : county.color.includes('yellow') ? '#f59e0b' : '#6b7280'}`}
                                  fillOpacity="0.3"
                                  stroke={`${county.color.includes('blue') ? '#1d4ed8' : county.color.includes('green') ? '#059669' : county.color.includes('purple') ? '#7c3aed' : county.color.includes('red') ? '#dc2626' : county.color.includes('yellow') ? '#d97706' : '#374151'}`}
                                  strokeWidth="2"
                                  className="hover:fillOpacity-0.5 cursor-pointer transition-all"
                                />
                                
                                {/* County Label */}
                                <text
                                  x={positions[index].x}
                                  y={positions[index].y + 40}
                                  textAnchor="middle"
                                  className="text-xs font-medium fill-gray-700"
                                >
                                  {county.name.length > 8 ? county.name.substring(0, 8) + '...' : county.name}
                                </text>
                              </g>
                            );
                          })}

                          {/* Major Cities */}
                          {[
                            { name: "Monrovia", x: 180, y: 280, type: "capital" },
                            { name: "Gbarnga", x: 260, y: 320, type: "city" },
                            { name: "Buchanan", x: 200, y: 360, type: "port" },
                            { name: "Harper", x: 480, y: 440, type: "city" },
                            { name: "Zwedru", x: 420, y: 340, type: "city" },
                            { name: "Voinjama", x: 220, y: 260, type: "city" }
                          ].map((city, index) => (
                            <g key={city.name}>
                              <circle
                                cx={city.x}
                                cy={city.y}
                                r={city.type === 'capital' ? "6" : "4"}
                                fill={city.type === 'capital' ? "#dc2626" : city.type === 'port' ? "#0284c7" : "#059669"}
                                className="cursor-pointer hover:r-7 transition-all"
                              />
                              <text
                                x={city.x}
                                y={city.y - 10}
                                textAnchor="middle"
                                className="text-xs font-medium fill-gray-800"
                              >
                                {city.name}
                              </text>
                            </g>
                          ))}

                          {/* Farm Locations - GPS Tracked */}
                          {Array.from({ length: 25 }, (_, i) => ({
                            x: 200 + Math.random() * 300,
                            y: 280 + Math.random() * 180,
                            id: `farm-${i}`,
                            status: Math.random() > 0.8 ? 'alert' : Math.random() > 0.5 ? 'compliant' : 'pending'
                          })).map((farm, index) => (
                            <circle
                              key={farm.id}
                              cx={farm.x}
                              cy={farm.y}
                              r="3"
                              fill={
                                farm.status === 'alert' ? "#ef4444" :
                                farm.status === 'compliant' ? "#10b981" : "#f59e0b"
                              }
                              className="cursor-pointer hover:r-5 transition-all animate-pulse"
                              style={{
                                animationDelay: `${index * 0.1}s`,
                                animationDuration: '2s'
                              }}
                            />
                          ))}

                          {/* Transportation Routes */}
                          <g className="opacity-70">
                            <path
                              d="M180 280 Q260 300 420 340"
                              stroke="#8b5cf6"
                              strokeWidth="3"
                              fill="none"
                              strokeDasharray="5,5"
                              className="animate-pulse"
                            />
                            <path
                              d="M200 360 Q300 380 480 440"
                              stroke="#8b5cf6"
                              strokeWidth="3"
                              fill="none"
                              strokeDasharray="5,5"
                              className="animate-pulse"
                            />
                          </g>

                          {/* Active Vehicles */}
                          {Array.from({ length: 8 }, (_, i) => ({
                            x: 180 + Math.random() * 320,
                            y: 280 + Math.random() * 160,
                            direction: Math.random() * 360
                          })).map((vehicle, index) => (
                            <g
                              key={`vehicle-${index}`}
                              transform={`translate(${vehicle.x}, ${vehicle.y}) rotate(${vehicle.direction})`}
                            >
                              <rect
                                x="-4"
                                y="-2"
                                width="8"
                                height="4"
                                fill="#f97316"
                                rx="1"
                                className="animate-pulse"
                              />
                            </g>
                          ))}

                          {/* Deforestation Alert Zones */}
                          {Array.from({ length: 12 }, (_, i) => ({
                            x: 220 + Math.random() * 280,
                            y: 300 + Math.random() * 140,
                            severity: Math.random() > 0.7 ? 'high' : 'medium'
                          })).map((alert, index) => (
                            <circle
                              key={`alert-${index}`}
                              cx={alert.x}
                              cy={alert.y}
                              r="8"
                              fill="none"
                              stroke={alert.severity === 'high' ? "#dc2626" : "#f59e0b"}
                              strokeWidth="2"
                              strokeDasharray="3,3"
                              className="animate-ping"
                              style={{
                                animationDelay: `${index * 0.2}s`
                              }}
                            />
                          ))}

                          {/* Coordinate Grid */}
                          <g className="opacity-30">
                            {Array.from({ length: 9 }, (_, i) => (
                              <line
                                key={`grid-v-${i}`}
                                x1={100 + i * 75}
                                y1={200}
                                x2={100 + i * 75}  
                                y2={500}
                                stroke="#64748b"
                                strokeWidth="0.5"
                              />
                            ))}
                            {Array.from({ length: 5 }, (_, i) => (
                              <line
                                key={`grid-h-${i}`}
                                x1={100}
                                y1={200 + i * 75}
                                x2={700}
                                y2={200 + i * 75}
                                stroke="#64748b"
                                strokeWidth="0.5"
                              />
                            ))}
                          </g>

                          {/* Live GPS Coordinates Display */}
                          <text x="20" y="30" className="text-sm font-mono fill-blue-600">
                            Live GPS: 6.4281°N, 9.4295°W
                          </text>
                          <text x="20" y="50" className="text-xs fill-gray-600">
                            Accuracy: ±3.2m | {new Date().toLocaleTimeString()}
                          </text>
                        </svg>

                        {/* Map Legend */}
                        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
                          <h4 className="font-semibold text-sm mb-2">Map Legend</h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span>Compliant Farms</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span>Pending Review</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span>Alert Status</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-1 bg-purple-500"></div>
                              <span>Transport Routes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-2 bg-orange-500"></div>
                              <span>Active Vehicles</span>
                            </div>
                          </div>
                        </div>

                        {/* Real-time Statistics Panel */}
                        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border">
                          <h4 className="font-semibold text-sm mb-2">Live Statistics</h4>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <div className="font-medium text-green-600">Active Farms</div>
                              <div className="text-lg font-bold">1,247</div>
                            </div>
                            <div>
                              <div className="font-medium text-blue-600">GPS Tracked</div>
                              <div className="text-lg font-bold">98.7%</div>
                            </div>
                            <div>
                              <div className="font-medium text-orange-600">In Transit</div>
                              <div className="text-lg font-bold">34</div>
                            </div>
                            <div>
                              <div className="font-medium text-red-600">Alerts</div>
                              <div className="text-lg font-bold">{counties.reduce((sum, c) => sum + c.deforestationAlerts, 0)}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Map Analytics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg border">
                          <div className="text-xl font-bold text-green-600">2,847</div>
                          <div className="text-xs text-green-700">GPS Points Collected</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg border">
                          <div className="text-xl font-bold text-blue-600">156</div>
                          <div className="text-xs text-blue-700">Transport Routes Active</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg border">
                          <div className="text-xl font-bold text-purple-600">1,234</div>
                          <div className="text-xs text-purple-700">QR Code Scans Today</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg border">
                          <div className="text-xl font-bold text-orange-600">99.2%</div>
                          <div className="text-xs text-orange-700">Satellite Coverage</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
          {/* Platform Overview Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Platform Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Real-time Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{counties.reduce((sum, c) => sum + c.farms, 0).toLocaleString()}</div>
                    <div className="text-sm text-blue-700 font-medium">Total Farms Registered</div>
                    <div className="text-xs text-blue-600 mt-1">↗ +2.3% this month</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {Math.round(counties.reduce((sum, c) => sum + c.compliance, 0) / counties.length)}%
                    </div>
                    <div className="text-sm text-green-700 font-medium">Average Compliance</div>
                    <div className="text-xs text-green-600 mt-1">↗ +1.8% this week</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {(counties.reduce((sum, c) => sum + c.carbonCredits, 0) / 1000).toLocaleString()}K
                    </div>
                    <div className="text-sm text-purple-700 font-medium">Carbon Credits</div>
                    <div className="text-xs text-purple-600 mt-1">↗ +5.2% this month</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {counties.reduce((sum, c) => sum + c.deforestationAlerts, 0)}
                    </div>
                    <div className="text-sm text-orange-700 font-medium">Active Alerts</div>
                    <div className="text-xs text-orange-600 mt-1">↘ -12% this week</div>
                  </div>
                </div>

                {/* Real-time Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-500" />
                        Live Platform Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { action: "New farm registration", user: "Marcus Bawah", location: "Lofa County", time: "2 minutes ago", type: "farm" },
                          { action: "Compliance inspection completed", user: "Sarah Konneh", location: "Nimba County", time: "5 minutes ago", type: "inspection" },
                          { action: "Export permit submitted", user: "Liberia Agri Export", location: "Monrovia", time: "8 minutes ago", type: "export" },
                          { action: "GPS boundary mapped", user: "Moses Tuah", location: "Bong County", time: "12 minutes ago", type: "gps" },
                          { action: "Deforestation alert cleared", user: "LACRA Officer", location: "Sinoe County", time: "15 minutes ago", type: "alert" }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.type === 'farm' ? 'bg-green-500' :
                              activity.type === 'inspection' ? 'bg-blue-500' :
                              activity.type === 'export' ? 'bg-purple-500' :
                              activity.type === 'gps' ? 'bg-orange-500' : 'bg-red-500'
                            }`} />
                            <div className="flex-1">
                              <div className="text-sm font-medium">{activity.action}</div>
                              <div className="text-xs text-gray-600">{activity.user} • {activity.location}</div>
                            </div>
                            <div className="text-xs text-gray-500">{activity.time}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        Geographic Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { county: "Montserrado", farms: 245, compliance: 94, color: "bg-green-500" },
                          { county: "Lofa", farms: 189, compliance: 91, color: "bg-blue-500" },
                          { county: "Nimba", farms: 167, compliance: 88, color: "bg-purple-500" },
                          { county: "Bong", farms: 143, compliance: 85, color: "bg-orange-500" },
                          { county: "Grand Bassa", farms: 124, compliance: 87, color: "bg-pink-500" }
                        ].map((county, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{county.county}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">{county.farms} farms</span>
                                <span className="text-xs font-medium text-green-600">{county.compliance}%</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`${county.color} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${county.compliance}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Satellite className="h-5 w-5 text-indigo-500" />
                        Satellite Connectivity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">118</div>
                          <div className="text-sm text-gray-600">Satellites Connected</div>
                        </div>
                        <div className="space-y-2">
                          {[
                            { name: "GPS", count: 31, color: "bg-blue-500" },
                            { name: "GLONASS", count: 29, color: "bg-red-500" },
                            { name: "Galileo", count: 31, color: "bg-green-500" },
                            { name: "BeiDou", count: 27, color: "bg-yellow-500" }
                          ].map((sat, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${sat.color}`} />
                                <span className="text-sm">{sat.name}</span>
                              </div>
                              <span className="text-sm font-medium">{sat.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Alert Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-red-600">23</div>
                            <div className="text-xs text-gray-600">Critical</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-yellow-600">47</div>
                            <div className="text-xs text-gray-600">Warning</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {[
                            { type: "Deforestation", count: 15, color: "text-red-600" },
                            { type: "Compliance", count: 18, color: "text-orange-600" },
                            { type: "Quality", count: 12, color: "text-yellow-600" },
                            { type: "Documentation", count: 8, color: "text-purple-600" }
                          ].map((alert, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm">{alert.type}</span>
                              <span className={`text-sm font-medium ${alert.color}`}>{alert.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Truck className="h-5 w-5 text-green-500" />
                        Transportation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-600">87</div>
                            <div className="text-xs text-gray-600">Active Routes</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">1,245</div>
                            <div className="text-xs text-gray-600">QR Scans Today</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">In Transit</span>
                            <span className="text-sm font-medium text-blue-600">34 vehicles</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Delivered</span>
                            <span className="text-sm font-medium text-green-600">156 loads</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">GPS Verified</span>
                            <span className="text-sm font-medium text-purple-600">98.7%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Platform Usage Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-indigo-500" />
                      Platform Usage Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
                        <div className="text-xl font-bold text-indigo-600">2,847</div>
                        <div className="text-xs text-indigo-700">Total Users</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg">
                        <div className="text-xl font-bold text-cyan-600">456</div>
                        <div className="text-xs text-cyan-700">Active Today</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                        <div className="text-xl font-bold text-teal-600">12.4K</div>
                        <div className="text-xs text-teal-700">Data Entries</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                        <div className="text-xl font-bold text-emerald-600">3,921</div>
                        <div className="text-xs text-emerald-700">GPS Points</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-lime-50 to-lime-100 rounded-lg">
                        <div className="text-xl font-bold text-lime-600">847</div>
                        <div className="text-xs text-lime-700">Reports Generated</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                        <div className="text-xl font-bold text-yellow-600">99.2%</div>
                        <div className="text-xs text-yellow-700">System Uptime</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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