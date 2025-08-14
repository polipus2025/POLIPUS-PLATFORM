import React, { useEffect, useRef } from 'react';

export default function EmbeddedTestMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create the HTML content directly in the component
    mapRef.current.innerHTML = `
      <style>
        .embedded-map { 
          height: 400px; 
          width: 100%;
          border: 2px solid #333;
          border-radius: 8px;
        }
        .embedded-status {
          margin: 10px 0;
          padding: 10px;
          border-radius: 4px;
          font-family: Arial, sans-serif;
        }
        .loading { background-color: #fef3cd; border: 1px solid #fecba1; }
        .success { background-color: #d1edff; border: 1px solid #bee5eb; }
        .error { background-color: #f8d7da; border: 1px solid #f5c6cb; }
      </style>
      <div id="embedded-status" class="embedded-status loading">Loading map...</div>
      <div id="embedded-map" class="embedded-map"></div>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    `;

    // Load Leaflet script and initialize map
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const L = (window as any).L;
      const statusDiv = mapRef.current?.querySelector('#embedded-status') as HTMLElement;
      const mapDiv = mapRef.current?.querySelector('#embedded-map') as HTMLElement;
      
      if (!L || !statusDiv || !mapDiv) {
        if (statusDiv) {
          statusDiv.className = 'embedded-status error';
          statusDiv.textContent = 'Failed to initialize map components';
        }
        return;
      }

      try {
        
        // Create map
        const map = L.map(mapDiv).setView([6.4281, -9.4295], 13);
        
        // Add tile layer
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        });
        
        tileLayer.on('load', () => {
          statusDiv.className = 'embedded-status success';
          statusDiv.textContent = 'Embedded map loaded successfully! ✓';
        });
        
        tileLayer.on('tileerror', (e: any) => {
          statusDiv.className = 'embedded-status error';
          statusDiv.textContent = 'Network error: Could not load map tiles';
        });
        
        tileLayer.addTo(map);
        
        // Add marker
        L.marker([6.4281, -9.4295])
          .addTo(map)
          .bindPopup('Embedded Test - Monrovia, Liberia')
          .openPopup();
          
        
      } catch (error) {
        statusDiv.className = 'embedded-status error';
        statusDiv.textContent = 'Failed to create map: ' + error;
      }
    };
    
    script.onerror = () => {
      const statusDiv = mapRef.current?.querySelector('#embedded-status') as HTMLElement;
      if (statusDiv) {
        statusDiv.className = 'embedded-status error';
        statusDiv.textContent = 'Failed to load Leaflet library from CDN';
      }
    };
    
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Embedded HTML Map Test</h4>
        <p className="text-sm text-green-800">
          This map is created using raw HTML and JavaScript embedded directly in the React component.
          It bypasses file serving issues and tests basic Leaflet functionality.
        </p>
      </div>
      <div ref={mapRef} />
    </div>
  );
}