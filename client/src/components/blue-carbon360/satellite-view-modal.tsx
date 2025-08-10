import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Satellite, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Calendar,
  Download,
  Maximize2,
  TreePine,
  Waves,
  Fish,
  Activity,
  X
} from "lucide-react";
import { useState } from "react";

interface SatelliteViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSite?: string;
}

export default function SatelliteViewModal({ isOpen, onClose, selectedSite }: SatelliteViewModalProps) {
  const [selectedProvider, setSelectedProvider] = useState('esri');
  const [selectedDate, setSelectedDate] = useState('2024-08-01');
  const [zoomLevel, setZoomLevel] = useState(15);

  // Satellite imagery providers
  const satelliteProviders = [
    { 
      id: 'esri', 
      name: 'Esri World Imagery', 
      resolution: '0.5m',
      lastUpdate: '2024-07-28'
    },
    { 
      id: 'google', 
      name: 'Google Earth Satellite', 
      resolution: '0.6m',
      lastUpdate: '2024-07-25'
    },
    { 
      id: 'mapbox', 
      name: 'Mapbox Satellite Ultra HD', 
      resolution: '0.3m',
      lastUpdate: '2024-08-02'
    },
    { 
      id: 'sentinel', 
      name: 'Sentinel-2 Cloudless', 
      resolution: '10m',
      lastUpdate: '2024-07-30'
    }
  ];

  // Mangrove sites with coordinates
  const mangroveSites = [
    {
      id: 'MG-001',
      name: 'Montserrado Coastal Reserve',
      coordinates: { lat: 6.3156, lng: -10.8074 },
      area: 480,
      status: 'healthy',
      coverage: 'Dense canopy'
    },
    {
      id: 'MG-002',
      name: 'Grand Bassa Mangrove Sanctuary',
      coordinates: { lat: 5.8992, lng: -9.9731 },
      area: 620,
      status: 'healthy',
      coverage: 'Very dense'
    },
    {
      id: 'MG-003',
      name: 'Sinoe Delta Conservation Area',
      coordinates: { lat: 5.4985, lng: -9.6406 },
      area: 380,
      status: 'recovering',
      coverage: 'Medium density'
    },
    {
      id: 'MG-004',
      name: 'River Cess Mangrove Complex',
      coordinates: { lat: 5.9024, lng: -9.4562 },
      area: 720,
      status: 'healthy',
      coverage: 'Very dense'
    },
    {
      id: 'MG-005',
      name: 'Grand Gedeh Restoration Site',
      coordinates: { lat: 6.0726, lng: -8.2218 },
      area: 250,
      status: 'growing',
      coverage: 'Sparse - growing'
    }
  ];

  // Analysis layers
  const analysisLayers = [
    { id: 'vegetation', name: 'Vegetation Health', active: true, color: 'green' },
    { id: 'water', name: 'Water Boundaries', active: true, color: 'blue' },
    { id: 'carbon', name: 'Carbon Stock Density', active: false, color: 'purple' },
    { id: 'threats', name: 'Threat Assessment', active: false, color: 'red' },
    { id: 'growth', name: 'Growth Patterns', active: true, color: 'yellow' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'recovering': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'growing': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Satellite className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Satellite View - Mangrove Management</DialogTitle>
                <p className="text-sm text-slate-600">High-resolution satellite imagery and analysis</p>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Controls */}
          <div className="w-80 bg-slate-50 p-4 overflow-y-auto">
            
            {/* Satellite Provider Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Satellite Provider</h3>
              <div className="space-y-2">
                {satelliteProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedProvider === provider.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <p className="font-medium text-slate-900">{provider.name}</p>
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                      <span>Resolution: {provider.resolution}</span>
                      <span>Updated: {provider.lastUpdate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Layers */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Analysis Layers</h3>
              <div className="space-y-2">
                {analysisLayers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between p-2 rounded border hover:bg-white"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-3 h-3 rounded-full`}
                        style={{ backgroundColor: layer.color }}
                      ></div>
                      <span className="text-sm text-slate-900">{layer.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={layer.active}
                      className="rounded"
                      readOnly
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mangrove Sites */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Mangrove Sites</h3>
              <div className="space-y-2">
                {mangroveSites.map((site) => (
                  <div
                    key={site.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSite === site.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900 text-sm">{site.name}</p>
                      <Badge className={getStatusColor(site.status)} variant="outline">
                        {site.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600">
                      <p>Area: {site.area} hectares</p>
                      <p>Coverage: {site.coverage}</p>
                      <p className="font-mono">
                        {site.coordinates.lat.toFixed(4)}, {site.coordinates.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Controls */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">Map Controls</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ZoomIn className="h-4 w-4 mr-1" />
                  Zoom In
                </Button>
                <Button variant="outline" size="sm">
                  <ZoomOut className="h-4 w-4 mr-1" />
                  Zoom Out
                </Button>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Image
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Maximize2 className="h-4 w-4 mr-2" />
                Full Screen
              </Button>
            </div>
          </div>

          {/* Main Map Area */}
          <div className="flex-1 relative bg-slate-100">
            
            {/* Map Placeholder with Realistic Satellite View */}
            <div className="w-full h-full relative overflow-hidden">
              
              {/* Simulated Satellite Map Background */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-600 to-blue-400"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 75% 25%, rgba(6, 182, 212, 0.4) 0%, transparent 50%),
                    radial-gradient(circle at 25% 75%, rgba(34, 197, 94, 0.5) 0%, transparent 50%),
                    radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                    linear-gradient(45deg, rgba(21, 128, 61, 0.1) 25%, transparent 25%),
                    linear-gradient(-45deg, rgba(5, 150, 105, 0.1) 25%, transparent 25%)
                  `,
                  backgroundSize: '400px 400px, 300px 300px, 350px 350px, 250px 250px, 50px 50px, 50px 50px'
                }}
              ></div>

              {/* Mangrove Site Markers */}
              {mangroveSites.map((site, index) => (
                <div
                  key={site.id}
                  className="absolute"
                  style={{
                    left: `${20 + (index % 3) * 25}%`,
                    top: `${25 + Math.floor(index / 3) * 30}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="relative">
                    {/* Site Marker */}
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg cursor-pointer hover:bg-green-700 transition-colors">
                      <TreePine className="h-4 w-4 text-white" />
                    </div>
                    
                    {/* Site Info Popup */}
                    <Card className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-64 shadow-xl z-10 opacity-0 hover:opacity-100 transition-opacity">
                      <CardContent className="p-3">
                        <h4 className="font-semibold text-slate-900 text-sm mb-2">{site.name}</h4>
                        <div className="text-xs text-slate-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{site.coordinates.lat.toFixed(4)}, {site.coordinates.lng.toFixed(4)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TreePine className="h-3 w-3" />
                            <span>{site.area} hectares</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            <span>{site.coverage}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(site.status)} size="sm" variant="outline">
                          {site.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}

              {/* Water Bodies */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-blue-500 to-transparent opacity-30"></div>
              <div className="absolute top-1/4 right-1/4 w-32 h-20 bg-blue-400 opacity-40 rounded-full"></div>
              <div className="absolute bottom-1/3 left-1/5 w-40 h-16 bg-blue-500 opacity-35 rounded-lg transform rotate-12"></div>

              {/* Vegetation Patterns */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-green-700 rounded-full"></div>
                <div className="absolute top-1/2 right-1/3 w-32 h-20 bg-green-800 rounded-lg transform -rotate-12"></div>
                <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-green-600 rounded-full"></div>
              </div>

              {/* Overlay Information */}
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Healthy Mangroves</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Water Bodies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Growing Areas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Threat Areas</span>
                  </div>
                </div>
              </div>

              {/* Scale and Coordinates */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
                <div className="text-xs space-y-1">
                  <div>Zoom Level: {zoomLevel}</div>
                  <div>Provider: {satelliteProviders.find(p => p.id === selectedProvider)?.name}</div>
                  <div>Date: {selectedDate}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-slate-900"></div>
                    <span>1 km</span>
                  </div>
                </div>
              </div>

              {/* Loading Overlay (when switching providers) */}
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl p-4 flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-sm text-slate-600">Loading high-resolution satellite imagery...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="border-t bg-slate-50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div>Resolution: {satelliteProviders.find(p => p.id === selectedProvider)?.resolution}</div>
            <div>Last Updated: {satelliteProviders.find(p => p.id === selectedProvider)?.lastUpdate}</div>
            <div>Sites Visible: {mangroveSites.length}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Change Date
            </Button>
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4 mr-2" />
              Layer Options
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}