import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Smartphone, MapPin, QrCode, Wifi, Database, User, Camera, Navigation } from "lucide-react";

export default function MobileDemo() {
  const [activeTab, setActiveTab] = useState("login");
  const [selectedRole, setSelectedRole] = useState("");
  const [gpsActive, setGpsActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("6.4281°N, 9.4295°W");

  const simulateGPS = () => {
    setGpsActive(true);
    setTimeout(() => {
      setCurrentLocation(`${(6.4281 + Math.random() * 0.01).toFixed(4)}°N, ${(9.4295 + Math.random() * 0.01).toFixed(4)}°W`);
    }, 2000);
  };

  const roles = [
    { id: "farmer", name: "Farmer Portal", icon: User, color: "bg-green-500" },
    { id: "agent", name: "Field Agent", icon: MapPin, color: "bg-blue-500" },
    { id: "regulatory", name: "LACRA Staff", icon: Database, color: "bg-purple-500" },
    { id: "exporter", name: "Exporter", icon: Navigation, color: "bg-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-md mx-auto">
        {/* Mobile Phone Frame */}
        <div className="bg-black rounded-3xl p-2 shadow-2xl">
          <div className="bg-white rounded-2xl h-[600px] overflow-hidden">
            
            {/* Mobile Status Bar */}
            <div className="bg-slate-900 text-white px-4 py-2 text-xs flex justify-between items-center">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1">
                <Wifi className="h-3 w-3" />
                <span>100%</span>
              </div>
            </div>

            {/* App Header */}
            <div className="bg-green-600 text-white p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Smartphone className="h-6 w-6" />
                <span className="font-bold">AgriTrace360 Mobile</span>
              </div>
              <p className="text-sm opacity-90">LACRA Agricultural Platform</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b bg-gray-50">
              {[
                { id: "login", label: "Login" },
                { id: "gps", label: "GPS" },
                { id: "scan", label: "QR Scan" },
                { id: "sync", label: "Sync" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-2 text-xs font-medium ${
                    activeTab === tab.id 
                      ? "border-b-2 border-green-500 text-green-600 bg-white" 
                      : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-4 h-96 overflow-y-auto">
              
              {/* Login Tab */}
              {activeTab === "login" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-center mb-4">Select Your Role</h3>
                  
                  {roles.map(role => {
                    const Icon = role.icon;
                    return (
                      <Card 
                        key={role.id}
                        className={`cursor-pointer transition-all ${
                          selectedRole === role.id ? "ring-2 ring-green-500" : ""
                        }`}
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${role.color} text-white`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-sm">{role.name}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {selectedRole && (
                    <div className="space-y-3 mt-4">
                      <Input placeholder="Username" className="text-sm" />
                      <Input type="password" placeholder="Password" className="text-sm" />
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-sm">
                        Login to {roles.find(r => r.id === selectedRole)?.name}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* GPS Tab */}
              {activeTab === "gps" && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        GPS Farm Mapping
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xs">
                        <span className="font-medium">Current Location:</span>
                        <div className="font-mono text-green-600">{currentLocation}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Badge variant={gpsActive ? "default" : "secondary"} className="text-xs">
                          {gpsActive ? "GPS Active" : "GPS Inactive"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Accuracy: 3.2m
                        </Badge>
                      </div>

                      <Button 
                        onClick={simulateGPS}
                        className="w-full text-sm"
                        variant={gpsActive ? "outline" : "default"}
                      >
                        {gpsActive ? "Update Location" : "Start GPS Mapping"}
                      </Button>

                      <div className="bg-gray-100 p-3 rounded text-xs">
                        <div className="font-medium mb-1">Farm Boundary Points:</div>
                        <div className="space-y-1 text-gray-600">
                          <div>Point 1: 6.4281°N, 9.4295°W</div>
                          <div>Point 2: 6.4285°N, 9.4298°W</div>
                          <div>Point 3: 6.4289°N, 9.4301°W</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* QR Scan Tab */}
              {activeTab === "scan" && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        Commodity QR Scanner
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-gray-200 h-32 rounded flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Camera className="h-8 w-8 mx-auto mb-2" />
                          <div className="text-xs">Camera Preview</div>
                          <div className="text-xs">Scan QR Code</div>
                        </div>
                      </div>

                      <Button className="w-full text-sm">
                        Open Camera Scanner
                      </Button>

                      <div className="bg-green-50 p-3 rounded text-xs">
                        <div className="font-medium text-green-800 mb-1">Last Scanned:</div>
                        <div className="text-green-700">COC-LOF-2025-001</div>
                        <div className="text-green-600">Premium Cocoa Beans</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Sync Tab */}
              {activeTab === "sync" && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Offline Data Sync
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Pending uploads:</span>
                          <Badge variant="outline">3 items</Badge>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Last sync:</span>
                          <span className="text-gray-600">2 mins ago</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Network status:</span>
                          <Badge className="bg-green-500">Online</Badge>
                        </div>
                      </div>

                      <Button className="w-full text-sm">
                        Sync Now
                      </Button>

                      <div className="bg-blue-50 p-3 rounded text-xs">
                        <div className="font-medium text-blue-800 mb-1">Sync Log:</div>
                        <div className="space-y-1 text-blue-700">
                          <div>✓ GPS coordinates uploaded</div>
                          <div>✓ QR scan data synced</div>
                          <div>✓ Form submissions sent</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

            </div>

            {/* Bottom Status */}
            <div className="bg-gray-100 p-2 text-center">
              <div className="text-xs text-gray-600">
                AgriTrace360 Mobile v1.0 | LACRA Platform
              </div>
            </div>

          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-4 bg-white/90">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Mobile App Features</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Multi-role authentication (Farmer, Agent, Regulatory, Exporter)</li>
              <li>• GPS farm boundary mapping with real coordinates</li>
              <li>• QR code scanning for commodity tracking</li>
              <li>• Offline data storage and synchronization</li>
              <li>• Real-time connection to LACRA platform</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}