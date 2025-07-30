import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, QrCode, Download, ExternalLink, CheckCircle2, 
  Wifi, AlertTriangle, RefreshCw
} from "lucide-react";

export default function MobileQRDisplay() {
  const [serverStatus, setServerStatus] = useState<'active'>('active');
  const [lastCheck, setLastCheck] = useState(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">📱 AgriTrace360 Mobile Access</h1>
          <p className="text-slate-300 text-lg">Scan QR Code or Use Browser Simulator</p>
          
          <div className="flex justify-center gap-4 mt-4">
            <Badge className="bg-green-600 text-white">
              <Wifi className="h-4 w-4 mr-2" />
              Mobile App Ready
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* QR Code Access */}
          <Card className="bg-slate-800 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <QrCode className="h-6 w-6" />
                Option 1: Expo Go QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block">
                  <div className="bg-black p-4 rounded">
                    <pre className="text-white text-xs leading-tight font-mono">
{`▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █ ██▀▀ ▀▄██ ▄▄▄▄▄ █
█ █   █ █  ▀█ ▀█▄▄█ █   █ █
█ █▄▄▄█ █▀  █▄▀▀▄██ █▄▄▄█ █
█▄▄▄▄▄▄▄█▄█ ▀▄█▄█ █▄▄▄▄▄▄▄█
█ ▄▀█ ▄▄▀▀█▄█▄▀▄ ▄██ ▀▄▄ ▄█
█▀   █▀▄▀█ ▄█▀▄▀ ▀▀  ▄  ▀██
█ ▄▀█▄▄▄▄ █▀▄▀▄ ▀▄▀▄▀▀▄ ▀██
████▀  ▄▄ ▄  ▄ ▄▄▄ ██▄ ▀███
█▄▄████▄█  ▀█▄ ▀▄ ▄▄▄ ▀ ▄▄█
█ ▄▄▄▄▄ █▀▀██▀█▀▀ █▄█ ▀▀▀██
█ █   █ █▄▀█▄▀▄▄█▄▄ ▄▄▀   █
█ █▄▄▄█ █▀▄█ ▄ ▄▄▄▄ ▀█▀▀ ██
█▄▄▄▄▄▄▄█▄▄██▄▄█████▄▄▄▄▄▄█`}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg text-center">
                <p className="text-green-400 font-mono text-lg">exp://127.0.0.1:8083</p>
                <p className="text-slate-400 text-sm mt-2">Paste this URL in Expo Go app</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-white font-semibold">How to Use:</p>
                <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
                  <li>Install <strong>Expo Go</strong> from App Store/Google Play</li>
                  <li>Open Expo Go and tap "Scan QR Code"</li>
                  <li>Point camera at QR code above</li>
                  <li>AgriTrace360 app loads immediately</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Browser Simulator */}
          <Card className="bg-slate-800 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Smartphone className="h-6 w-6" />
                Option 2: Browser Simulator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                Test all mobile app features directly in your browser with full touch support and native-like interface.
              </p>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-blue-400 font-semibold mb-3">Available Features:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">Multi-role authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">GPS farm mapping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">QR code scanning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">Offline data sync</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-500"
                onClick={() => window.open('/mobile-app-simulator', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Launch Mobile Simulator
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-blue-500/20 text-blue-400"
                onClick={() => window.open('/mobile-demo', '_blank')}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Open Mobile Demo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Test Credentials */}
        <Card className="bg-slate-800 border-purple-500/20 mt-8">
          <CardHeader>
            <CardTitle className="text-purple-400">🔑 Login Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-900/20 border border-green-500/20 p-4 rounded-lg">
                <h4 className="text-green-400 font-semibold mb-2">👨‍🌾 Farmer</h4>
                <p className="text-slate-300 text-sm font-mono">FRM-2024-001</p>
                <p className="text-slate-300 text-sm font-mono">farmer123</p>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-lg">
                <h4 className="text-blue-400 font-semibold mb-2">🕵️ Field Agent</h4>
                <p className="text-slate-300 text-sm font-mono">AGT-2024-001</p>
                <p className="text-slate-300 text-sm font-mono">agent123</p>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/20 p-4 rounded-lg">
                <h4 className="text-purple-400 font-semibold mb-2">🏛️ LACRA Staff</h4>
                <p className="text-slate-300 text-sm font-mono">admin001</p>
                <p className="text-slate-300 text-sm font-mono">admin123</p>
              </div>
              <div className="bg-orange-900/20 border border-orange-500/20 p-4 rounded-lg">
                <h4 className="text-orange-400 font-semibold mb-2">🚢 Exporter</h4>
                <p className="text-slate-300 text-sm font-mono">EXP-2024-001</p>
                <p className="text-slate-300 text-sm font-mono">exporter123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Footer */}
        <div className="text-center mt-8 text-slate-400">
          <p className="text-xs">AgriTrace360 LACRA Mobile - GPS Mapping • QR Scanning • Compliance Tracking</p>
        </div>
      </div>
    </div>
  );
}