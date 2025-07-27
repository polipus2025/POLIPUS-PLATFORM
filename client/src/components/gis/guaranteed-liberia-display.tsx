import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, CheckCircle } from 'lucide-react';

export default function GuaranteedLiberiaDisplay() {
  const openGoogleMaps = () => {
    window.open('https://www.google.com/maps/place/Liberia/@6.428055,-9.429499,7z', '_blank');
  };

  const openStreetView = () => {
    window.open('https://www.google.com/maps/@6.3106,-10.8047,3a,75y,90t/data=!3m7!1e1!3m5!1s-', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header with Success Indicator */}
      <Card className="border-green-500 border-2">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-3 text-green-800">
            <CheckCircle className="h-6 w-6" />
            🇱🇷 REPUBLIC OF LIBERIA - GUARANTEED DISPLAY
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-green-600">✓ Always Visible</Badge>
            <Badge variant="secondary">✓ No Loading Required</Badge>
            <Badge variant="outline">✓ Complete Information</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Visual Country Representation */}
      <Card>
        <CardHeader>
          <CardTitle>Liberia Country Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-blue-100 to-green-100 p-8 rounded-lg" style={{ minHeight: '400px' }}>
            
            {/* Ocean Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg"></div>
            
            {/* Liberia Country Shape - More Accurate */}
            <div 
              className="absolute bg-green-500 shadow-lg border-2 border-green-700"
              style={{
                width: '200px',
                height: '120px',
                left: '50px',
                top: '50px',
                clipPath: 'polygon(0% 30%, 15% 20%, 35% 15%, 60% 20%, 80% 30%, 90% 45%, 85% 65%, 75% 80%, 60% 90%, 40% 95%, 20% 90%, 5% 75%, 0% 55%)',
                transform: 'rotate(-5deg)'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg drop-shadow-lg">LIBERIA</span>
              </div>
            </div>
            
            {/* Monrovia - Capital */}
            <div className="absolute" style={{ left: '80px', top: '90px' }}>
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute -top-8 -left-4 bg-white px-2 py-1 rounded shadow text-xs font-bold whitespace-nowrap">
                Monrovia ⭐
              </div>
            </div>
            
            {/* Other Major Cities */}
            <div className="absolute" style={{ left: '140px', top: '110px' }}>
              <div className="w-3 h-3 bg-blue-600 rounded-full border border-white"></div>
              <div className="absolute -top-6 -left-2 bg-white px-1 py-1 rounded shadow text-xs">Gbarnga</div>
            </div>
            
            <div className="absolute" style={{ left: '110px', top: '140px' }}>
              <div className="w-3 h-3 bg-blue-600 rounded-full border border-white"></div>
              <div className="absolute -top-6 -left-2 bg-white px-1 py-1 rounded shadow text-xs">Buchanan</div>
            </div>
            
            <div className="absolute" style={{ left: '180px', top: '150px' }}>
              <div className="w-3 h-3 bg-blue-600 rounded-full border border-white"></div>
              <div className="absolute -top-6 -left-2 bg-white px-1 py-1 rounded shadow text-xs">Harper</div>
            </div>
            
            {/* Neighboring Countries */}
            <div className="absolute top-4 left-4 text-purple-700 font-semibold text-sm">SIERRA LEONE</div>
            <div className="absolute top-4 right-16 text-purple-700 font-semibold text-sm">GUINEA</div>
            <div className="absolute bottom-4 right-4 text-purple-700 font-semibold text-sm">CÔTE D'IVOIRE</div>
            
            {/* Atlantic Ocean Label */}
            <div className="absolute bottom-8 left-8 text-blue-700 font-bold text-sm">ATLANTIC OCEAN</div>
            
            {/* Coordinates Display */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow">
              <div className="text-center text-sm">
                <div className="font-bold">CENTER: 6.428°N, 9.430°W</div>
                <div className="text-xs text-gray-600">West Africa</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Geographic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><strong>Total Area:</strong> 111,369 km² (43,000 sq mi)</div>
            <div><strong>Coastline:</strong> 680 km along Atlantic Ocean</div>
            <div><strong>Highest Point:</strong> Mount Wuteve (1,440m)</div>
            <div><strong>Climate:</strong> Tropical - hot and humid</div>
            <div><strong>Terrain:</strong> Mostly flat to rolling coastal plains</div>
            <div><strong>Natural Resources:</strong> Iron ore, rubber, diamonds, gold</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-800">Administrative Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><strong>Total Counties:</strong> 15</div>
            <div><strong>Government:</strong> Presidential republic</div>
            <div><strong>Currency:</strong> Liberian Dollar (LRD)</div>
            <div><strong>Official Language:</strong> English</div>
            <div><strong>Time Zone:</strong> GMT (UTC+0)</div>
            <div><strong>Calling Code:</strong> +231</div>
          </CardContent>
        </Card>
      </div>

      {/* External Map Access */}
      <Card className="bg-yellow-50 border-yellow-300">
        <CardHeader>
          <CardTitle className="text-yellow-800">Access Full Interactive Maps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Click these buttons to open full interactive maps of Liberia in new windows:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button onClick={openGoogleMaps} className="w-full h-12">
                <ExternalLink className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Google Maps</div>
                  <div className="text-xs opacity-90">Full interactive view</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => window.open('https://www.openstreetmap.org/#map=7/6.428/-9.430', '_blank')} 
                variant="outline" 
                className="w-full h-12"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">OpenStreetMap</div>
                  <div className="text-xs opacity-70">Open source maps</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => window.open('https://www.bing.com/maps?q=Liberia&cp=6.428~-9.430&lvl=7', '_blank')} 
                variant="secondary" 
                className="w-full h-12"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Bing Maps</div>
                  <div className="text-xs opacity-70">Microsoft mapping</div>
                </div>
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 text-center mt-4">
              These links open in new tabs and show the real Republic of Liberia with satellite imagery and detailed geography
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}