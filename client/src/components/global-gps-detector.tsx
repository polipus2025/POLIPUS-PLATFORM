import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

interface GPSPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export default function GlobalGPSDetector() {
  const [position, setPosition] = useState<GPSPosition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp
        });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 border border-slate-200 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-slate-800">GPS Location</span>
        </div>
        
        {position && (
          <div className="text-sm text-slate-600 mb-2">
            <p>Lat: {position.latitude.toFixed(6)}</p>
            <p>Lng: {position.longitude.toFixed(6)}</p>
            <p>Accuracy: ±{Math.round(position.accuracy)}m</p>
          </div>
        )}
        
        {error && (
          <p className="text-sm text-red-600 mb-2">{error}</p>
        )}
        
        <button
          onClick={detectLocation}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          {isLoading ? 'Detecting...' : 'Detect Location'}
        </button>
      </div>
    </div>
  );
}