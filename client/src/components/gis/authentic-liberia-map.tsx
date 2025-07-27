import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Download, ExternalLink, CheckCircle } from 'lucide-react';

export default function AuthenticLiberiaMap() {
  const [mapData, setMapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch real Liberia geographic data
    const fetchLiberiaData = async () => {
      try {
        // Use REST Countries API for authentic Liberia data
        const response = await fetch('https://restcountries.com/v3.1/name/liberia');
        const data = await response.json();
        
        if (data && data[0]) {
          setMapData(data[0]);
          setLoading(false);
        } else {
          throw new Error('No data received');
        }
      } catch (err) {
        console.error('Failed to fetch Liberia data:', err);
        setError('Unable to load authentic map data');
        setLoading(false);
      }
    };

    fetchLiberiaData();
  }, []);

  const openExternalMap = () => {
    // Open Google Maps focused on Liberia
    window.open('https://www.google.com/maps/place/Liberia/@6.3106,-10.8047,7z/data=!3m1!4b1!4m6!3m5!1s0xf0963d86d78b35d:0x95a408d681c9e21a!8m2!3d6.428055!4d-9.429499!16zL20vMDQ4Njc', '_blank');
  };

  const openOpenStreetMap = () => {
    // Open OpenStreetMap focused on Liberia
    window.open('https://www.openstreetmap.org/#map=7/6.428/-9.430', '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Loading Authentic Liberia Map Data...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div>Fetching real geographic data...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Liberia Map - External View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <div className="text-red-600 mb-4">{error}</div>
            <div className="space-y-3">
              <Button onClick={openExternalMap} className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Google Maps
              </Button>
              <Button onClick={openOpenStreetMap} variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in OpenStreetMap
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Authentic Liberia Geographic Data
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="default">Real Data Loaded</Badge>
          <Badge variant="secondary">Official Source</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Official Country Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">🇱🇷 {mapData.name.common}</h3>
                <div className="text-sm space-y-1">
                  <div><strong>Official Name:</strong> {mapData.name.official}</div>
                  <div><strong>Capital:</strong> {mapData.capital?.[0] || 'Monrovia'}</div>
                  <div><strong>Region:</strong> {mapData.region} - {mapData.subregion}</div>
                  <div><strong>Population:</strong> {mapData.population?.toLocaleString()}</div>
                  <div><strong>Area:</strong> {mapData.area?.toLocaleString()} km²</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Geographic Coordinates</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Center:</strong> {mapData.latlng?.[0]}°N, {Math.abs(mapData.latlng?.[1])}°W</div>
                  <div><strong>Capital Coords:</strong> {mapData.capitalInfo?.latlng?.[0]}°N, {Math.abs(mapData.capitalInfo?.latlng?.[1])}°W</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Neighboring Countries</h4>
                <div className="text-sm space-y-1">
                  {mapData.borders ? mapData.borders.map((border: string) => (
                    <div key={border}>• {border}</div>
                  )) : [
                    <div key="sie">• Sierra Leone</div>,
                    <div key="gui">• Guinea</div>,
                    <div key="civ">• Côte d'Ivoire</div>
                  ]}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Additional Information</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Currency:</strong> {mapData.currencies ? (Object.values(mapData.currencies)[0] as any)?.name : 'Liberian Dollar'}</div>
                  <div><strong>Language:</strong> {mapData.languages ? Object.values(mapData.languages)[0] as string : 'English'}</div>
                  <div><strong>Timezone:</strong> {mapData.timezones?.[0]}</div>
                  <div><strong>Calling Code:</strong> +{mapData.idd?.root}{mapData.idd?.suffixes?.[0]}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Links */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">View Real Liberia Maps</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button onClick={openExternalMap} className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Maps
              </Button>
              <Button onClick={openOpenStreetMap} variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                OpenStreetMap
              </Button>
              <Button 
                onClick={() => window.open(mapData.maps?.googleMaps, '_blank')} 
                variant="secondary" 
                className="w-full"
                disabled={!mapData.maps?.googleMaps}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Official Link
              </Button>
            </div>
          </div>

          {/* Flag Display */}
          {mapData.flags?.png && (
            <div className="border-t pt-4 text-center">
              <h4 className="font-semibold mb-3">Flag of Liberia</h4>
              <img 
                src={mapData.flags.png} 
                alt="Flag of Liberia" 
                className="mx-auto h-20 w-auto border shadow-sm rounded"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}