import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink } from 'lucide-react';

export default function DirectLiberiaMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Republic of Liberia - Direct Map View
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="default">Real Geographic Data</Badge>
          <Badge variant="secondary">Direct Display</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {/* Direct Google Maps Embed with Liberia focus */}
          <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2027726.3895134765!2d-11.492187999999998!3d6.428054700000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf0963d86d78b35d%3A0x95a408d681c9e21a!2sLiberia!5e0!3m2!1sen!2s!4v1643723200000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Liberia Map"
            ></iframe>
          </div>
          
          {/* Overlay with country info */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg z-10">
            <div className="text-lg font-bold text-green-700">🇱🇷 LIBERIA</div>
            <div className="text-sm text-gray-600">West Africa</div>
            <div className="text-xs text-gray-500">6.428°N, 9.430°W</div>
          </div>
        </div>
        
        {/* Bottom info panel */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold">Capital</div>
              <div className="text-gray-600">Monrovia</div>
            </div>
            <div>
              <div className="font-semibold">Population</div>
              <div className="text-gray-600">5.2 million</div>
            </div>
            <div>
              <div className="font-semibold">Area</div>
              <div className="text-gray-600">111,369 km²</div>
            </div>
            <div>
              <div className="font-semibold">Independence</div>
              <div className="text-gray-600">July 26, 1847</div>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              size="sm" 
              onClick={() => window.open('https://www.google.com/maps/place/Liberia/@6.3106,-10.8047,7z', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Full Map
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open('https://www.openstreetmap.org/#map=7/6.428/-9.430', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              OpenStreetMap
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}