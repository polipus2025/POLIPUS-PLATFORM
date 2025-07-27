import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, ExternalLink, Globe, Image } from 'lucide-react';

export default function AlternativeMapDisplay() {
  const [activeSource, setActiveSource] = useState('google');

  const mapSources = {
    google: {
      name: 'Google Maps',
      url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2027726.3895134765!2d-11.492187999999998!3d6.428054700000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf0963d86d78b35d%3A0x95a408d681c9e21a!2sLiberia!5e0!3m2!1sen!2s!4v1643723200000!5m2!1sen!2s',
      description: 'Satellite and road view'
    },
    bing: {
      name: 'Bing Maps',
      url: 'https://www.bing.com/maps/embed?h=400&w=100%&cp=6.428~-9.430&lvl=7&typ=d&sty=r&src=SHELL&FORM=MBEDV8',
      description: 'Microsoft mapping service'
    },
    osm: {
      name: 'OpenStreetMap',
      url: 'https://www.openstreetmap.org/export/embed.html?bbox=-11.5,4.0,-7.5,8.5&layer=mapnik',
      description: 'Open source mapping'
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Liberia Map - Multiple Sources
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="default">Real Data</Badge>
          <Badge variant="secondary">Multiple Options</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSource} onValueChange={setActiveSource}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="google">Google Maps</TabsTrigger>
            <TabsTrigger value="bing">Bing Maps</TabsTrigger>
            <TabsTrigger value="osm">OpenStreetMap</TabsTrigger>
          </TabsList>
          
          {Object.entries(mapSources).map(([key, source]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-2">
                  <strong>{source.name}:</strong> {source.description}
                </div>
                
                <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={source.url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title={`Liberia - ${source.name}`}
                  ></iframe>
                  
                  {/* Overlay */}
                  <div className="absolute top-4 left-4 bg-white bg-opacity-95 p-2 rounded shadow-lg">
                    <div className="text-sm font-bold">🇱🇷 Republic of Liberia</div>
                    <div className="text-xs text-gray-600">{source.name}</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => window.open(
                      key === 'google' ? 'https://www.google.com/maps/place/Liberia/@6.3106,-10.8047,7z' :
                      key === 'bing' ? 'https://www.bing.com/maps?q=Liberia' :
                      'https://www.openstreetmap.org/#map=7/6.428/-9.430',
                      '_blank'
                    )}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open Full Map
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Geographic Information */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Geographic Information
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Coordinates</div>
              <div className="text-gray-600">6.428°N, 9.430°W</div>
            </div>
            <div>
              <div className="font-medium">Capital</div>
              <div className="text-gray-600">Monrovia</div>
            </div>
            <div>
              <div className="font-medium">Area</div>
              <div className="text-gray-600">111,369 km²</div>
            </div>
            <div>
              <div className="font-medium">Population</div>
              <div className="text-gray-600">5.2 million</div>
            </div>
          </div>
          
          <div className="mt-4 text-sm">
            <div className="font-medium mb-2">Major Cities:</div>
            <div className="text-gray-600">
              Monrovia (capital), Gbarnga, Buchanan, Harper, Zwedru, Voinjama, Kakata, Robertsport
            </div>
          </div>
          
          <div className="mt-4 text-sm">
            <div className="font-medium mb-2">Neighboring Countries:</div>
            <div className="text-gray-600">
              Sierra Leone (northwest), Guinea (north), Côte d'Ivoire (east), Atlantic Ocean (southwest)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}