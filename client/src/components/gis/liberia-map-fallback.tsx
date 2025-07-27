import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Navigation, Globe } from 'lucide-react';

export default function LiberiaMapFallback() {
  return (
    <Card className="border-2 border-green-500">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Globe className="h-6 w-6" />
          🇱🇷 REPUBLIC OF LIBERIA - Geographic Information
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="default" className="bg-green-600">Official Data</Badge>
          <Badge variant="secondary">Always Visible</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Country Overview */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Country Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold">Official Name:</div>
              <div className="text-gray-700">Republic of Liberia</div>
            </div>
            <div>
              <div className="font-semibold">Capital:</div>
              <div className="text-gray-700">Monrovia</div>
            </div>
            <div>
              <div className="font-semibold">Location:</div>
              <div className="text-gray-700">West Africa</div>
            </div>
            <div>
              <div className="font-semibold">Independence:</div>
              <div className="text-gray-700">July 26, 1847</div>
            </div>
            <div>
              <div className="font-semibold">Area:</div>
              <div className="text-gray-700">111,369 km² (43,000 sq mi)</div>
            </div>
            <div>
              <div className="font-semibold">Population:</div>
              <div className="text-gray-700">5.2 million (2023)</div>
            </div>
          </div>
        </div>

        {/* Geographic Coordinates */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Geographic Coordinates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold">Center Point:</div>
              <div className="text-gray-700">6.428°N, 9.430°W</div>
            </div>
            <div>
              <div className="font-semibold">Capital Coordinates:</div>
              <div className="text-gray-700">6.3106°N, 10.8047°W</div>
            </div>
            <div>
              <div className="font-semibold">Northernmost Point:</div>
              <div className="text-gray-700">8.34°N (Guinea border)</div>
            </div>
            <div>
              <div className="font-semibold">Southernmost Point:</div>
              <div className="text-gray-700">4.21°N (Harper area)</div>
            </div>
            <div>
              <div className="font-semibold">Westernmost Point:</div>
              <div className="text-gray-700">11.31°W (Atlantic coast)</div>
            </div>
            <div>
              <div className="font-semibold">Easternmost Point:</div>
              <div className="text-gray-700">7.27°W (Côte d'Ivoire border)</div>
            </div>
          </div>
        </div>

        {/* Major Cities */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-orange-800 mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Major Cities & Locations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-red-600">🏛️ Monrovia (Capital)</div>
              <div className="text-gray-700">Population: ~1.4 million</div>
              <div className="text-gray-700">Coordinates: 6.3106°N, 10.8047°W</div>
              <div className="text-gray-700">Features: Government seat, main port</div>
            </div>
            <div>
              <div className="font-semibold text-blue-600">🏙️ Gbarnga</div>
              <div className="text-gray-700">Population: ~56,000</div>
              <div className="text-gray-700">Coordinates: 7.0°N, 9.47°W</div>
              <div className="text-gray-700">Features: Central location, university</div>
            </div>
            <div>
              <div className="font-semibold text-green-600">🚢 Buchanan</div>
              <div className="text-gray-700">Population: ~50,000</div>
              <div className="text-gray-700">Coordinates: 5.88°N, 10.05°W</div>
              <div className="text-gray-700">Features: Major port, iron ore</div>
            </div>
            <div>
              <div className="font-semibold text-purple-600">🏘️ Harper</div>
              <div className="text-gray-700">Population: ~17,000</div>
              <div className="text-gray-700">Coordinates: 4.375°N, 7.72°W</div>
              <div className="text-gray-700">Features: Southeast regional center</div>
            </div>
          </div>
        </div>

        {/* Borders & Neighbors */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Borders & Neighboring Countries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold">🌊 Atlantic Ocean (Southwest):</div>
              <div className="text-gray-700">680 km coastline</div>
            </div>
            <div>
              <div className="font-semibold">🇸🇱 Sierra Leone (Northwest):</div>
              <div className="text-gray-700">310 km border</div>
            </div>
            <div>
              <div className="font-semibold">🇬🇳 Guinea (North):</div>
              <div className="text-gray-700">560 km border</div>
            </div>
            <div>
              <div className="font-semibold">🇨🇮 Côte d'Ivoire (East):</div>
              <div className="text-gray-700">716 km border</div>
            </div>
          </div>
        </div>

        {/* External Map Links */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-800 mb-3">View Interactive Maps</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              onClick={() => window.open('https://www.google.com/maps/place/Liberia/@6.3106,-10.8047,7z', '_blank')}
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Google Maps
            </Button>
            <Button 
              onClick={() => window.open('https://www.openstreetmap.org/#map=7/6.428/-9.430', '_blank')}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              OpenStreetMap
            </Button>
            <Button 
              onClick={() => window.open('https://www.bing.com/maps?q=Liberia', '_blank')}
              variant="secondary"
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Bing Maps
            </Button>
          </div>
          <div className="mt-3 text-xs text-gray-600 text-center">
            Click any button above to open full interactive maps in a new window
          </div>
        </div>

        {/* Administrative Information */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-indigo-800 mb-3">Administrative Divisions</h3>
          <div className="text-sm space-y-2">
            <div><strong>Total Counties:</strong> 15</div>
            <div><strong>Largest County:</strong> Nimba County (11,551 km²)</div>
            <div><strong>Most Populous:</strong> Montserrado County (~1.7 million)</div>
            <div><strong>Counties List:</strong> Bomi, Bong, Gbarpolu, Grand Bassa, Grand Cape Mount, Grand Gedeh, Grand Kru, Lofa, Margibi, Maryland, Montserrado, Nimba, River Cess, River Gee, Sinoe</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}