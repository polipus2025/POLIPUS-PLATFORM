import React, { useEffect, useRef, useState } from 'react';

export default function MinimalLeafletTest() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testLeaflet = async () => {
      try {
        setStatus('Loading Leaflet library...');
        
        // Add CSS via link tag instead of import
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          cssLink.crossOrigin = '';
          document.head.appendChild(cssLink);
          
          await new Promise((resolve, reject) => {
            cssLink.onload = resolve;
            cssLink.onerror = () => reject(new Error('Failed to load Leaflet CSS'));
            setTimeout(() => reject(new Error('CSS load timeout')), 10000);
          });
        }
        
        setStatus('Loading Leaflet JavaScript...');
        
        // Load Leaflet script
        if (typeof window.L === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.crossOrigin = '';
          document.head.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Leaflet JS'));
            setTimeout(() => reject(new Error('JS load timeout')), 10000);
          });
        }
        
        setStatus('Initializing map...');
        
        if (!mapRef.current) {
          throw new Error('Map container not found');
        }
        
        // Test if L is available
        if (typeof window.L === 'undefined') {
          throw new Error('Leaflet library not loaded');
        }
        
        const L = window.L;
        
        // Create map
        const map = L.map(mapRef.current, {
          center: [6.4281, -9.4295], // Monrovia, Liberia
          zoom: 13,
          zoomControl: true
        });
        
        setStatus('Adding map tiles...');
        
        // Add tile layer with error handling
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        });
        
        let tilesLoaded = false;
        
        tileLayer.on('load', () => {
          tilesLoaded = true;
          setStatus('Map loaded successfully! ✓');
        });
        
        tileLayer.on('tileerror', (e: any) => {
          console.error('Tile error:', e);
          setError('Failed to load map tiles. Check network connection.');
        });
        
        tileLayer.addTo(map);
        
        // Add marker
        const marker = L.marker([6.4281, -9.4295])
          .addTo(map)
          .bindPopup('Test Location - Monrovia, Liberia');
        
        // Timeout check for tiles
        setTimeout(() => {
          if (!tilesLoaded) {
            setError('Map tiles are taking too long to load. This may be a network connectivity issue.');
          }
        }, 15000);
        
        console.log('Minimal Leaflet test completed successfully');
        
      } catch (err) {
        console.error('Minimal Leaflet test failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStatus('Failed to initialize');
      }
    };
    
    testLeaflet();
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Minimal Leaflet Test</h4>
        <div className="text-sm">
          <div className={`font-medium ${error ? 'text-red-600' : status.includes('✓') ? 'text-green-600' : 'text-blue-600'}`}>
            Status: {status}
          </div>
          {error && (
            <div className="text-red-600 mt-2">
              Error: {error}
            </div>
          )}
        </div>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-96 border border-gray-300 rounded-lg bg-gray-100"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}

// Add type declaration for window.L
declare global {
  interface Window {
    L: any;
  }
}