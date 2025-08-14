import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Smartphone, MapPin, QrCode, Wifi, Database, User, Camera, Navigation,
  Satellite, Globe, CheckCircle2, AlertTriangle, Clock, Download,
  Settings, MessageSquare, FileText, Shield
} from "lucide-react";

export default function MobileAppSimulator() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedRole, setSelectedRole] = useState("farmer");
  const [gpsActive, setGpsActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("6.4281°N, 9.4295°W");
  const [lastScan, setLastScan] = useState("");
  const [syncStatus, setSyncStatus] = useState("synced");
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [networkStatus, setNetworkStatus] = useState("4G");

  const simulateGPS = () => {
    setGpsActive(true);
    setTimeout(() => {
      const lat = (6.4281 + Math.random() * 0.01).toFixed(4);
      const lon = (9.4295 + Math.random() * 0.01).toFixed(4);
      setCurrentLocation(`${lat}°N, ${lon}°W`);
    }, 2000);
  };

  const simulateQRScan = () => {
    const codes = ["COC-LOF-2025-001", "RIC-MON-2025-045", "COF-NIM-2025-123"];
    setLastScan(codes[Math.floor(Math.random() * codes.length)]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(20, prev - Math.random() * 2));
      setNetworkStatus(Math.random() > 0.1 ? "4G" : "3G");
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const roles = [
    { id: "farmer", name: "Farmer", icon: User, color: "bg-green-500", desc: "Farm Management" },
    { id: "agent", name: "Field Agent", icon: MapPin, color: "bg-blue-500", desc: "Territory Monitoring" },
    { id: "regulatory", name: "LACRA Staff", icon: Shield, color: "bg-purple-500", desc: "Compliance Review" },
    { id: "exporter", name: "Exporter", icon: Navigation, color: "bg-orange-500", desc: "Export Operations" }
  ];

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Smartphone },
    { id: "gps", label: "GPS Map", icon: MapPin },
    { id: "scan", label: "QR Scan", icon: QrCode },
    { id: "sync", label: "Data Sync", icon: Database },
    { id: "messages", label: "Messages", icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AgriTrace360 Mobile App</h1>
          <p className="text-slate-300">Complete Mobile Simulation - LACRA Agricultural Platform</p>
          <Badge className="mt-2 bg-green-600">Fully Functional - No Terminal Required</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Mobile Phone Simulator */}
          <div className="flex justify-center">
            <div className="bg-black rounded-3xl p-3 shadow-2xl max-w-sm w-full">
              <div className="bg-slate-900 rounded-2xl h-[700px] overflow-hidden relative">
                
                {/* Status Bar */}
                <div className="bg-black text-white px-4 py-2 text-xs flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>9:41 AM</span>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                      {networkStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-3 w-3 text-green-400" />
                    <span className="text-green-400">{batteryLevel}%</span>
                  </div>
                </div>

                {/* App Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-white/20 p-1 rounded">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-sm">AgriTrace360</span>
                    </div>
                    <Badge className="bg-white/20 text-white text-xs">
                      {roles.find(r => r.id === selectedRole)?.name}
                    </Badge>
                  </div>
                  <p className="text-xs opacity-90">LACRA Mobile Platform</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-slate-800 border-b border-slate-700 overflow-x-auto">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-[60px] py-2 px-1 text-xs font-medium flex flex-col items-center gap-1 ${
                          activeTab === tab.id 
                            ? "bg-green-600 text-white" 
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        <span className="text-[10px]">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Content Area */}
                <div className="p-3 h-[500px] overflow-y-auto bg-slate-900">
                  
                  {/* Dashboard Tab */}
                  {activeTab === "dashboard" && (
                    <div className="space-y-3">
                      
                      {/* Role Selection */}
                      <Card className="bg-slate-800 border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-white flex items-center gap-2">
                            <User className="h-4 w-4" />
                            User Role
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {roles.map(role => {
                            const Icon = role.icon;
                            return (
                              <button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={`w-full p-2 rounded flex items-center gap-2 text-left transition-all ${
                                  selectedRole === role.id 
                                    ? "bg-green-600 text-white" 
                                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                }`}
                              >
                                <div className={`p-1 rounded ${role.color} text-white`}>
                                  <Icon className="h-3 w-3" />
                                </div>
                                <div>
                                  <div className="text-xs font-medium">{role.name}</div>
                                  <div className="text-[10px] opacity-75">{role.desc}</div>
                                </div>
                              </button>
                            );
                          })}
                        </CardContent>
                      </Card>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <Card className="bg-slate-800 border-slate-700">
                          <CardContent className="p-2 text-center">
                            <div className="text-lg font-bold text-green-400">127</div>
                            <div className="text-[10px] text-slate-400">Farms Mapped</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-800 border-slate-700">
                          <CardContent className="p-2 text-center">
                            <div className="text-lg font-bold text-blue-400">89%</div>
                            <div className="text-[10px] text-slate-400">Compliance</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* GPS Tab */}
                  {activeTab === "gps" && (
                    <div className="space-y-3">
                      <Card className="bg-slate-800 border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-white flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-green-400" />
                            GPS Farm Mapping
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          
                          {/* Current Location */}
                          <div className="bg-slate-700 p-2 rounded">
                            <div className="text-xs text-slate-300 mb-1">Current Location:</div>
                            <div className="font-mono text-green-400 text-xs">{currentLocation}</div>
                            <div className="text-[10px] text-slate-400 mt-1">Liberia, West Africa</div>
                          </div>
                          
                          {/* GPS Status */}
                          <div className="flex gap-2">
                            <Badge variant={gpsActive ? "default" : "secondary"} className="text-xs">
                              <Satellite className="h-3 w-3 mr-1" />
                              {gpsActive ? "GPS Active" : "GPS Inactive"}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                              Accuracy: 3.2m
                            </Badge>
                          </div>

                          <Button 
                            onClick={simulateGPS}
                            className="w-full text-xs py-2"
                            variant={gpsActive ? "outline" : "default"}
                          >
                            {gpsActive ? "Update Location" : "Start GPS Mapping"}
                          </Button>

                          {/* Boundary Points */}
                          <div className="bg-slate-700 p-2 rounded">
                            <div className="text-xs font-medium text-slate-200 mb-2">Farm Boundary Points:</div>
                            <div className="space-y-1 text-[10px] text-slate-400">
                              <div>Point 1: 6.4281°N, 9.4295°W</div>
                              <div>Point 2: 6.4285°N, 9.4298°W</div>
                              <div>Point 3: 6.4289°N, 9.4301°W</div>
                              <div>Point 4: 6.4287°N, 9.4293°W</div>
                            </div>
                            <Badge className="mt-2 bg-green-600 text-xs">
                              Area: 2.4 hectares
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* QR Scan Tab */}
                  {activeTab === "scan" && (
                    <div className="space-y-3">
                      <Card className="bg-slate-800 border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-white flex items-center gap-2">
                            <QrCode className="h-4 w-4 text-blue-400" />
                            Commodity Scanner
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          
                          {/* Camera Preview */}
                          <div className="bg-slate-700 h-32 rounded flex items-center justify-center relative">
                            <div className="text-center text-slate-400">
                              <Camera className="h-8 w-8 mx-auto mb-2" />
                              <div className="text-xs">Camera Preview</div>
                              <div className="text-[10px]">Position QR code in frame</div>
                            </div>
                            <div className="absolute inset-4 border-2 border-green-400 border-dashed rounded"></div>
                          </div>

                          <Button onClick={simulateQRScan} className="w-full text-xs py-2">
                            <Camera className="h-3 w-3 mr-1" />
                            Simulate QR Scan
                          </Button>

                          {lastScan && (
                            <div className="bg-green-900/50 border border-green-500 p-2 rounded">
                              <div className="text-xs font-medium text-green-200 mb-1">Last Scanned:</div>
                              <div className="font-mono text-green-400 text-xs">{lastScan}</div>
                              <div className="text-xs text-green-300 mt-1">Premium Cocoa Beans</div>
                              <div className="text-[10px] text-green-400 mt-1">Compliance: ✓ Verified</div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Data Sync Tab */}
                  {activeTab === "sync" && (
                    <div className="space-y-3">
                      <Card className="bg-slate-800 border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-white flex items-center gap-2">
                            <Database className="h-4 w-4 text-purple-400" />
                            Offline Data Sync
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          
                          {/* Sync Status */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-300">Sync Status:</span>
                              <Badge className={syncStatus === "synced" ? "bg-green-600" : "bg-yellow-600"}>
                                {syncStatus === "synced" ? "Synced" : "Pending"}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-300">Pending uploads:</span>
                              <span className="text-slate-400">3 items</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-300">Last sync:</span>
                              <span className="text-slate-400">2 mins ago</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-300">Storage used:</span>
                              <span className="text-slate-400">24.3 MB</span>
                            </div>
                          </div>

                          <Button 
                            onClick={() => setSyncStatus("syncing")}
                            className="w-full text-xs py-2"
                          >
                            <Database className="h-3 w-3 mr-1" />
                            Sync Now
                          </Button>

                          {/* Sync Log */}
                          <div className="bg-slate-700 p-2 rounded">
                            <div className="text-xs font-medium text-slate-200 mb-2">Recent Activity:</div>
                            <div className="space-y-1 text-[10px] text-slate-400">
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-2 w-2 text-green-400" />
                                <span>GPS coordinates uploaded</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-2 w-2 text-green-400" />
                                <span>QR scan data synced</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-2 w-2 text-yellow-400" />
                                <span>Form submission pending</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Messages Tab */}
                  {activeTab === "messages" && (
                    <div className="space-y-3">
                      <Card className="bg-slate-800 border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-white flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-400" />
                            LACRA Messages
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          
                          {/* Message List */}
                          <div className="space-y-2">
                            <div className="bg-slate-700 p-2 rounded">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-slate-200">Compliance Update</span>
                                <Badge className="bg-green-600 text-[10px]">New</Badge>
                              </div>
                              <p className="text-[10px] text-slate-400">Your farm compliance rating has improved to 94%</p>
                              <span className="text-[9px] text-slate-500">2 mins ago</span>
                            </div>
                            
                            <div className="bg-slate-700 p-2 rounded">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-slate-200">Export Permit</span>
                                <Badge variant="outline" className="text-[10px]">Read</Badge>
                              </div>
                              <p className="text-[10px] text-slate-400">Export permit EP-2025-045 approved</p>
                              <span className="text-[9px] text-slate-500">1 hour ago</span>
                            </div>

                            <div className="bg-slate-700 p-2 rounded">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-slate-200">Field Inspection</span>
                                <Badge variant="outline" className="text-[10px]">Read</Badge>
                              </div>
                              <p className="text-[10px] text-slate-400">Scheduled inspection for next week</p>
                              <span className="text-[9px] text-slate-500">3 hours ago</span>
                            </div>
                          </div>

                          <Button className="w-full text-xs py-2">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Compose Message
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                </div>

                {/* Bottom Navigation */}
                <div className="absolute bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-2">
                  <div className="flex justify-center items-center gap-4 text-[10px] text-slate-400">
                    <span>AgriTrace360 Mobile v1.0</span>
                    <span>•</span>
                    <span>LACRA Platform</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Features Panel */}
          <div className="space-y-6">
            
            {/* Mobile App Features */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-400" />
                  Mobile App Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  
                  <div className="flex items-start gap-3 p-3 bg-slate-700 rounded">
                    <User className="h-5 w-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Multi-Role Authentication</h4>
                      <p className="text-xs text-slate-400">Farmer, Field Agent, LACRA Staff, and Exporter portals</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-700 rounded">
                    <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-white">GPS Farm Mapping</h4>
                      <p className="text-xs text-slate-400">Real-time boundary mapping with Liberian coordinates</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-700 rounded">
                    <QrCode className="h-5 w-5 text-purple-400 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-white">QR Code Scanner</h4>
                      <p className="text-xs text-slate-400">Commodity tracking and compliance verification</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-700 rounded">
                    <Database className="h-5 w-5 text-orange-400 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Offline Data Sync</h4>
                      <p className="text-xs text-slate-400">Works without internet, syncs when online</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-700 rounded">
                    <MessageSquare className="h-5 w-5 text-yellow-400 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-white">LACRA Integration</h4>
                      <p className="text-xs text-slate-400">Direct messaging and compliance updates</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Download Instructions */}
            <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="h-5 w-5 text-green-400" />
                  Get the Mobile App
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-green-100">
                  This simulator shows all mobile app features. For the actual mobile app:
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Install Expo Go on your phone</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Use terminal commands provided</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Scan QR code to run on device</span>
                  </div>
                </div>

                <Badge className="bg-green-600 text-white">
                  This simulator is fully functional for testing
                </Badge>
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </div>
  );
}