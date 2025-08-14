import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Satellite, 
  Globe, 
  Activity, 
  Zap, 
  MapPin, 
  Clock, 
  Signal, 
  Eye,
  Camera,
  Radar,
  Wifi,
  Battery,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
  Download,
  Share2
} from 'lucide-react';
import { Link } from 'wouter';

export default function SatelliteMonitoring() {
  const [selectedSatellite, setSelectedSatellite] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [realTimeData, setRealTimeData] = useState<any>({});

  // Comprehensive satellite data for the Polipus platform - Maximum efficiency constellation
  const satellites = [
    // Earth Observation Satellites
    {
      id: 'SAT-001',
      name: 'Sentinel-2A',
      type: 'Earth Observation',
      status: 'active',
      provider: 'ESA Copernicus',
      purpose: 'Agricultural Monitoring',
      altitude: '786 km',
      coverage: 'Global',
      resolution: '10m - 60m',
      frequency: 'Every 5 days',
      lastUpdate: '2025-01-11 18:45:32',
      dataTypes: ['Optical Imagery', 'Vegetation Index', 'Land Cover'],
      modules: ['AgriTrace LACRA', 'Forest Guard', 'Land Map360'],
      coordinates: { lat: 14.0000, lng: -9.0000 },
      signal: 95,
      battery: 87,
      dataTransmitted: '2.4 TB',
      orbitalVelocity: '7.4 km/s'
    },
    {
      id: 'SAT-002',
      name: 'Sentinel-2B',
      type: 'Earth Observation',
      status: 'active',
      provider: 'ESA Copernicus',
      purpose: 'Agricultural Monitoring',
      altitude: '786 km',
      coverage: 'Global',
      resolution: '10m - 60m',
      frequency: 'Every 5 days',
      lastUpdate: '2025-01-11 18:42:18',
      dataTypes: ['Optical Imagery', 'Vegetation Index', 'Land Cover'],
      modules: ['AgriTrace LACRA', 'Forest Guard', 'Land Map360'],
      coordinates: { lat: 12.0000, lng: -10.5000 },
      signal: 93,
      battery: 89,
      dataTransmitted: '2.2 TB',
      orbitalVelocity: '7.4 km/s'
    },
    {
      id: 'SAT-003', 
      name: 'Landsat-9',
      type: 'Earth Observation',
      status: 'active',
      provider: 'NASA/USGS',
      purpose: 'Land Use Monitoring',
      altitude: '705 km',
      coverage: 'Global',
      resolution: '15m - 100m',
      frequency: 'Every 16 days',
      lastUpdate: '2025-01-11 17:22:15',
      dataTypes: ['Thermal Infrared', 'Multispectral', 'Panchromatic'],
      modules: ['Mine Watch', 'Forest Guard', 'Carbon Trace'],
      coordinates: { lat: 6.5000, lng: -9.5000 },
      signal: 92,
      battery: 91,
      dataTransmitted: '1.8 TB',
      orbitalVelocity: '7.5 km/s'
    },
    {
      id: 'SAT-004',
      name: 'Landsat-8',
      type: 'Earth Observation',
      status: 'active',
      provider: 'NASA/USGS',
      purpose: 'Land Use Monitoring',
      altitude: '705 km',
      coverage: 'Global',
      resolution: '15m - 100m',
      frequency: 'Every 16 days',
      lastUpdate: '2025-01-11 17:18:42',
      dataTypes: ['Thermal Infrared', 'Multispectral', 'Panchromatic'],
      modules: ['Mine Watch', 'Forest Guard', 'Carbon Trace'],
      coordinates: { lat: 8.0000, lng: -11.2000 },
      signal: 90,
      battery: 88,
      dataTransmitted: '1.6 TB',
      orbitalVelocity: '7.5 km/s'
    },
    // Ocean & Climate Satellites
    {
      id: 'SAT-005',
      name: 'MODIS-Aqua',
      type: 'Ocean/Atmosphere',
      status: 'active',
      provider: 'NASA',
      purpose: 'Ocean & Climate Monitoring',
      altitude: '705 km',
      coverage: 'Global',
      resolution: '250m - 1km',
      frequency: 'Daily',
      lastUpdate: '2025-01-11 19:12:08',
      dataTypes: ['Ocean Color', 'Sea Surface Temperature', 'Atmospheric Data'],
      modules: ['Blue Carbon 360', 'Aqua Trace', 'Carbon Trace'],
      coordinates: { lat: 4.0000, lng: -7.5000 },
      signal: 89,
      battery: 85,
      dataTransmitted: '3.1 TB',
      orbitalVelocity: '7.5 km/s'
    },
    {
      id: 'SAT-006',
      name: 'MODIS-Terra',
      type: 'Ocean/Atmosphere',
      status: 'active',
      provider: 'NASA',
      purpose: 'Land & Climate Monitoring',
      altitude: '705 km',
      coverage: 'Global',
      resolution: '250m - 1km',
      frequency: 'Daily',
      lastUpdate: '2025-01-11 19:08:33',
      dataTypes: ['Land Surface Temperature', 'Vegetation', 'Fire Detection'],
      modules: ['Forest Guard', 'Carbon Trace', 'AgriTrace LACRA'],
      coordinates: { lat: 5.5000, lng: -8.8000 },
      signal: 87,
      battery: 83,
      dataTransmitted: '2.9 TB',
      orbitalVelocity: '7.5 km/s'
    },
    // High-Resolution Commercial Satellites
    {
      id: 'SAT-007',
      name: 'Planet Labs-1',
      type: 'High-Resolution Imaging',
      status: 'active',
      provider: 'Planet Labs',
      purpose: 'Daily Monitoring',
      altitude: '475 km',
      coverage: 'Targeted Regions',
      resolution: '3m - 5m',
      frequency: 'Daily',
      lastUpdate: '2025-01-11 18:58:41',
      dataTypes: ['RGB Imagery', 'Near-Infrared', 'Analytics Ready Data'],
      modules: ['Live Trace', 'AgriTrace LACRA', 'Mine Watch'],
      coordinates: { lat: 8.5000, lng: -11.0000 },
      signal: 94,
      battery: 93,
      dataTransmitted: '1.2 TB',
      orbitalVelocity: '7.6 km/s'
    },
    {
      id: 'SAT-008',
      name: 'Planet Labs-2',
      type: 'High-Resolution Imaging',
      status: 'active',
      provider: 'Planet Labs',
      purpose: 'Daily Monitoring',
      altitude: '475 km',
      coverage: 'Targeted Regions',
      resolution: '3m - 5m',
      frequency: 'Daily',
      lastUpdate: '2025-01-11 18:55:17',
      dataTypes: ['RGB Imagery', 'Near-Infrared', 'Analytics Ready Data'],
      modules: ['Live Trace', 'Forest Guard', 'Aqua Trace'],
      coordinates: { lat: 7.2000, lng: -10.3000 },
      signal: 92,
      battery: 91,
      dataTransmitted: '1.1 TB',
      orbitalVelocity: '7.6 km/s'
    },
    {
      id: 'SAT-009',
      name: 'WorldView-3',
      type: 'High-Resolution Imaging',
      status: 'active',
      provider: 'Maxar Technologies',
      purpose: 'Ultra-High Resolution Monitoring',
      altitude: '617 km',
      coverage: 'On-Demand',
      resolution: '0.31m - 3.7m',
      frequency: 'On-Demand',
      lastUpdate: '2025-01-11 18:52:09',
      dataTypes: ['Panchromatic', 'Multispectral', 'SWIR'],
      modules: ['Mine Watch', 'Land Map360', 'Forest Guard'],
      coordinates: { lat: 9.8000, lng: -12.1000 },
      signal: 96,
      battery: 94,
      dataTransmitted: '0.8 TB',
      orbitalVelocity: '7.4 km/s'
    },
    {
      id: 'SAT-010',
      name: 'WorldView-4',
      type: 'High-Resolution Imaging',
      status: 'active',
      provider: 'Maxar Technologies',
      purpose: 'Ultra-High Resolution Monitoring',
      altitude: '617 km',
      coverage: 'On-Demand',
      resolution: '0.31m - 3.7m',
      frequency: 'On-Demand',
      lastUpdate: '2025-01-11 18:49:25',
      dataTypes: ['Panchromatic', 'Multispectral', 'SWIR'],
      modules: ['Mine Watch', 'Land Map360', 'Live Trace'],
      coordinates: { lat: 11.2000, lng: -13.5000 },
      signal: 95,
      battery: 92,
      dataTransmitted: '0.7 TB',
      orbitalVelocity: '7.4 km/s'
    },
    // Weather & Climate Satellites
    {
      id: 'SAT-011',
      name: 'GOES-16',
      type: 'Geostationary Weather',
      status: 'active',
      provider: 'NOAA',
      purpose: 'Weather & Climate',
      altitude: '35,786 km',
      coverage: 'Western Atlantic',
      resolution: '0.5km - 2km',
      frequency: 'Every 15 minutes',
      lastUpdate: '2025-01-11 19:00:00',
      dataTypes: ['Weather Imagery', 'Lightning Detection', 'Solar Monitoring'],
      modules: ['Forest Guard', 'Aqua Trace', 'Carbon Trace'],
      coordinates: { lat: 0.0000, lng: -75.0000 },
      signal: 98,
      battery: 96,
      dataTransmitted: '4.7 TB',
      orbitalVelocity: 'Geostationary'
    },
    {
      id: 'SAT-012',
      name: 'GOES-17',
      type: 'Geostationary Weather',
      status: 'active',
      provider: 'NOAA',
      purpose: 'Weather & Climate',
      altitude: '35,786 km',
      coverage: 'Eastern Pacific',
      resolution: '0.5km - 2km',
      frequency: 'Every 15 minutes',
      lastUpdate: '2025-01-11 18:57:30',
      dataTypes: ['Weather Imagery', 'Lightning Detection', 'Solar Monitoring'],
      modules: ['Aqua Trace', 'Carbon Trace', 'Forest Guard'],
      coordinates: { lat: 0.0000, lng: -137.0000 },
      signal: 97,
      battery: 95,
      dataTransmitted: '4.5 TB',
      orbitalVelocity: 'Geostationary'
    },
    // Radar Satellites
    {
      id: 'SAT-013',
      name: 'TerraSAR-X',
      type: 'Radar Imaging',
      status: 'maintenance',
      provider: 'DLR (Germany)',
      purpose: 'All-Weather Monitoring',
      altitude: '514 km',
      coverage: 'Global',
      resolution: '1m - 16m',
      frequency: 'Every 11 days',
      lastUpdate: '2025-01-11 14:30:22',
      dataTypes: ['SAR Imagery', 'Interferometry', 'Polarimetry'],
      modules: ['Mine Watch', 'Forest Guard', 'Land Map360'],
      coordinates: { lat: 12.0000, lng: -8.0000 },
      signal: 78,
      battery: 82,
      dataTransmitted: '0.9 TB',
      orbitalVelocity: '7.6 km/s'
    },
    {
      id: 'SAT-014',
      name: 'TanDEM-X',
      type: 'Radar Imaging',
      status: 'active',
      provider: 'DLR (Germany)',
      purpose: 'Digital Elevation Mapping',
      altitude: '514 km',
      coverage: 'Global',
      resolution: '1m - 16m',
      frequency: 'Every 11 days',
      lastUpdate: '2025-01-11 18:33:45',
      dataTypes: ['SAR Imagery', 'DEM Generation', 'Interferometry'],
      modules: ['Land Map360', 'Mine Watch', 'Forest Guard'],
      coordinates: { lat: 13.5000, lng: -7.2000 },
      signal: 85,
      battery: 86,
      dataTransmitted: '1.3 TB',
      orbitalVelocity: '7.6 km/s'
    },
    {
      id: 'SAT-015',
      name: 'COSMO-SkyMed-1',
      type: 'Radar Imaging',
      status: 'active',
      provider: 'ASI (Italy)',
      purpose: 'Multi-Purpose SAR',
      altitude: '619 km',
      coverage: 'Global',
      resolution: '1m - 100m',
      frequency: 'Every 16 days',
      lastUpdate: '2025-01-11 18:41:12',
      dataTypes: ['X-band SAR', 'Interferometry', 'Emergency Response'],
      modules: ['Mine Watch', 'Forest Guard', 'Aqua Trace'],
      coordinates: { lat: 10.1000, lng: -9.8000 },
      signal: 88,
      battery: 84,
      dataTransmitted: '1.0 TB',
      orbitalVelocity: '7.4 km/s'
    },
    // Environmental & Scientific Satellites
    {
      id: 'SAT-016',
      name: 'Sentinel-3A',
      type: 'Ocean/Land Monitoring',
      status: 'active',
      provider: 'ESA Copernicus',
      purpose: 'Ocean & Land Monitoring',
      altitude: '814 km',
      coverage: 'Global',
      resolution: '300m - 1.2km',
      frequency: 'Every 27 days',
      lastUpdate: '2025-01-11 18:47:55',
      dataTypes: ['Ocean Color', 'Land Surface Temperature', 'Altimetry'],
      modules: ['Blue Carbon 360', 'Aqua Trace', 'Carbon Trace'],
      coordinates: { lat: 3.8000, lng: -6.9000 },
      signal: 91,
      battery: 87,
      dataTransmitted: '2.8 TB',
      orbitalVelocity: '7.3 km/s'
    },
    {
      id: 'SAT-017',
      name: 'Sentinel-3B',
      type: 'Ocean/Land Monitoring',
      status: 'active',
      provider: 'ESA Copernicus',
      purpose: 'Ocean & Land Monitoring',
      altitude: '814 km',
      coverage: 'Global',
      resolution: '300m - 1.2km',
      frequency: 'Every 27 days',
      lastUpdate: '2025-01-11 18:44:21',
      dataTypes: ['Ocean Color', 'Land Surface Temperature', 'Altimetry'],
      modules: ['Blue Carbon 360', 'Aqua Trace', 'Carbon Trace'],
      coordinates: { lat: 2.5000, lng: -8.1000 },
      signal: 89,
      battery: 85,
      dataTransmitted: '2.6 TB',
      orbitalVelocity: '7.3 km/s'
    },
    {
      id: 'SAT-018',
      name: 'Sentinel-5P',
      type: 'Atmospheric Monitoring',
      status: 'active',
      provider: 'ESA Copernicus',
      purpose: 'Air Quality Monitoring',
      altitude: '824 km',
      coverage: 'Global',
      resolution: '3.5km x 7km',
      frequency: 'Daily',
      lastUpdate: '2025-01-11 18:51:33',
      dataTypes: ['Atmospheric Composition', 'Air Pollution', 'Greenhouse Gases'],
      modules: ['Carbon Trace', 'Forest Guard', 'Mine Watch'],
      coordinates: { lat: 15.2000, lng: -5.7000 },
      signal: 93,
      battery: 90,
      dataTransmitted: '1.9 TB',
      orbitalVelocity: '7.3 km/s'
    },
    // Hyperspectral & Advanced Imaging
    {
      id: 'SAT-019',
      name: 'PRISMA',
      type: 'Hyperspectral Imaging',
      status: 'active',
      provider: 'ASI (Italy)',
      purpose: 'Environmental Monitoring',
      altitude: '615 km',
      coverage: 'Global',
      resolution: '5m - 30m',
      frequency: 'Every 29 days',
      lastUpdate: '2025-01-11 18:39:17',
      dataTypes: ['Hyperspectral', 'Panchromatic', 'Environmental Analysis'],
      modules: ['Forest Guard', 'AgriTrace LACRA', 'Mine Watch'],
      coordinates: { lat: 16.8000, lng: -4.2000 },
      signal: 86,
      battery: 81,
      dataTransmitted: '0.6 TB',
      orbitalVelocity: '7.4 km/s'
    },
    {
      id: 'SAT-020',
      name: 'EnMAP',
      type: 'Hyperspectral Imaging',
      status: 'active',
      provider: 'DLR (Germany)',
      purpose: 'Environmental Mapping',
      altitude: '653 km',
      coverage: 'Global',
      resolution: '30m',
      frequency: 'Every 27 days',
      lastUpdate: '2025-01-11 18:36:44',
      dataTypes: ['Hyperspectral', 'Environmental Monitoring', 'Mineral Detection'],
      modules: ['Mine Watch', 'Forest Guard', 'Carbon Trace'],
      coordinates: { lat: 18.1000, lng: -3.5000 },
      signal: 84,
      battery: 79,
      dataTransmitted: '0.5 TB',
      orbitalVelocity: '7.4 km/s'
    },
    // Oceanographic Satellites
    {
      id: 'SAT-021',
      name: 'Jason-3',
      type: 'Ocean Altimetry',
      status: 'active',
      provider: 'NASA/NOAA/EUMETSAT',
      purpose: 'Sea Level Monitoring',
      altitude: '1,336 km',
      coverage: 'Global Oceans',
      resolution: 'Altimetry',
      frequency: 'Every 10 days',
      lastUpdate: '2025-01-11 18:43:28',
      dataTypes: ['Sea Surface Height', 'Ocean Circulation', 'Climate Data'],
      modules: ['Blue Carbon 360', 'Aqua Trace', 'Carbon Trace'],
      coordinates: { lat: 1.2000, lng: -9.7000 },
      signal: 92,
      battery: 88,
      dataTransmitted: '1.4 TB',
      orbitalVelocity: '7.2 km/s'
    },
    {
      id: 'SAT-022',
      name: 'Sentinel-6A',
      type: 'Ocean Altimetry',
      status: 'active',
      provider: 'ESA/NASA/NOAA',
      purpose: 'Sea Level Monitoring',
      altitude: '1,336 km',
      coverage: 'Global Oceans',
      resolution: 'Altimetry',
      frequency: 'Every 10 days',
      lastUpdate: '2025-01-11 18:40:15',
      dataTypes: ['Sea Surface Height', 'Ocean Topography', 'Climate Monitoring'],
      modules: ['Blue Carbon 360', 'Aqua Trace', 'Carbon Trace'],
      coordinates: { lat: 0.5000, lng: -11.3000 },
      signal: 90,
      battery: 86,
      dataTransmitted: '1.3 TB',
      orbitalVelocity: '7.2 km/s'
    },
    // Next-Generation Satellites
    {
      id: 'SAT-023',
      name: 'Capella-1',
      type: 'Commercial SAR',
      status: 'active',
      provider: 'Capella Space',
      purpose: 'All-Weather Monitoring',
      altitude: '525 km',
      coverage: 'On-Demand',
      resolution: '0.5m - 5m',
      frequency: 'On-Demand',
      lastUpdate: '2025-01-11 18:54:02',
      dataTypes: ['X-band SAR', 'Change Detection', 'Monitoring'],
      modules: ['Mine Watch', 'Forest Guard', 'Live Trace'],
      coordinates: { lat: 19.5000, lng: -2.1000 },
      signal: 87,
      battery: 83,
      dataTransmitted: '0.4 TB',
      orbitalVelocity: '7.6 km/s'
    },
    {
      id: 'SAT-024',
      name: 'ICEYE-X2',
      type: 'Commercial SAR',
      status: 'active',
      provider: 'ICEYE',
      purpose: 'Disaster Monitoring',
      altitude: '570 km',
      coverage: 'Global',
      resolution: '1m - 15m',
      frequency: 'Daily',
      lastUpdate: '2025-01-11 18:48:37',
      dataTypes: ['X-band SAR', 'Flood Monitoring', 'Emergency Response'],
      modules: ['Forest Guard', 'Aqua Trace', 'Mine Watch'],
      coordinates: { lat: 20.8000, lng: -1.4000 },
      signal: 85,
      battery: 80,
      dataTransmitted: '0.7 TB',
      orbitalVelocity: '7.5 km/s'
    }
  ];

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        totalDataToday: (Math.random() * 10 + 15).toFixed(1) + ' TB',
        activePasses: Math.floor(Math.random() * 8 + 12),
        coverageLiberia: (Math.random() * 5 + 92).toFixed(1) + '%',
        lastDataSync: new Date().toLocaleTimeString()
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
      case 'offline':
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getSignalStrength = (signal: number) => {
    if (signal >= 90) return { color: 'text-green-600', bars: 4 };
    if (signal >= 75) return { color: 'text-yellow-600', bars: 3 };
    if (signal >= 60) return { color: 'text-orange-600', bars: 2 };
    return { color: 'text-red-600', bars: 1 };
  };

  // Satellite Card Component
  const SatelliteCard = ({ satellite, onSelect, setIsDetailModalOpen }: any) => {
    const signalInfo = getSignalStrength(satellite.signal);
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" 
            onClick={() => {onSelect(satellite); setIsDetailModalOpen(true);}}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Satellite className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-lg">{satellite.name}</CardTitle>
                <p className="text-sm text-gray-600">{satellite.provider}</p>
              </div>
            </div>
            {getStatusBadge(satellite.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Type:</span>
              <span className="text-sm font-medium">{satellite.type}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Purpose:</span>
              <span className="text-sm font-medium">{satellite.purpose}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Altitude:</span>
              <span className="text-sm font-medium">{satellite.altitude}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Resolution:</span>
              <span className="text-sm font-medium">{satellite.resolution}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Signal Strength:</span>
              <div className="flex items-center gap-2">
                <Signal className={`h-4 w-4 ${signalInfo.color}`} />
                <span className="text-sm font-medium">{satellite.signal}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Battery:</span>
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{satellite.battery}%</span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500 mb-2">Connected Modules:</p>
              <div className="flex flex-wrap gap-1">
                {satellite.modules.map((module: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {module}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Last Update:</span>
              <span>{new Date(satellite.lastUpdate).toLocaleTimeString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <Helmet>
        <title>Satellite Monitoring System - Polipus Platform</title>
        <meta name="description" content="Real-time satellite monitoring and data management for all Polipus platform modules" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back to Blue Carbon 360 Button */}
        <div className="mb-6">
          <Link href="/blue-carbon360-portal" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blue Carbon 360
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Satellite className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Satellite Monitoring System</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive real-time monitoring of {satellites.length} satellites connected to the Polipus platform across 8 specialized modules for maximum efficiency coverage
          </p>
        </div>

        {/* Real-time Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Satellites</p>
                  <p className="text-2xl font-bold text-blue-900">{satellites.filter(s => s.status === 'active').length}</p>
                  <p className="text-xs text-blue-500">of {satellites.length} total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-600">Data Today</p>
                  <p className="text-2xl font-bold text-green-900">{realTimeData.totalDataToday || '17.2 TB'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-600">Active Passes</p>
                  <p className="text-2xl font-bold text-purple-900">{realTimeData.activePasses || 18}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-600">Liberia Coverage</p>
                  <p className="text-2xl font-bold text-orange-900">{realTimeData.coverageLiberia || '94.8%'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Satellite Categories */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All ({satellites.length})</TabsTrigger>
            <TabsTrigger value="earth">Earth Obs ({satellites.filter(s => s.type === 'Earth Observation').length})</TabsTrigger>
            <TabsTrigger value="ocean">Ocean ({satellites.filter(s => s.type.includes('Ocean')).length})</TabsTrigger>
            <TabsTrigger value="weather">Weather ({satellites.filter(s => s.type.includes('Weather')).length})</TabsTrigger>
            <TabsTrigger value="radar">Radar ({satellites.filter(s => s.type.includes('Radar')).length})</TabsTrigger>
            <TabsTrigger value="commercial">Commercial ({satellites.filter(s => s.provider.includes('Planet') || s.provider.includes('Maxar') || s.provider.includes('Capella') || s.provider.includes('ICEYE')).length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {satellites.map((satellite) => (
                <SatelliteCard key={satellite.id} satellite={satellite} onSelect={setSelectedSatellite} setIsDetailModalOpen={setIsDetailModalOpen} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="earth">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {satellites.filter(s => s.type === 'Earth Observation').map((satellite) => (
                <SatelliteCard key={satellite.id} satellite={satellite} onSelect={setSelectedSatellite} setIsDetailModalOpen={setIsDetailModalOpen} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ocean">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {satellites.filter(s => s.type.includes('Ocean')).map((satellite) => (
                <SatelliteCard key={satellite.id} satellite={satellite} onSelect={setSelectedSatellite} setIsDetailModalOpen={setIsDetailModalOpen} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="weather">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {satellites.filter(s => s.type.includes('Weather')).map((satellite) => (
                <SatelliteCard key={satellite.id} satellite={satellite} onSelect={setSelectedSatellite} setIsDetailModalOpen={setIsDetailModalOpen} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="radar">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {satellites.filter(s => s.type.includes('Radar')).map((satellite) => (
                <SatelliteCard key={satellite.id} satellite={satellite} onSelect={setSelectedSatellite} setIsDetailModalOpen={setIsDetailModalOpen} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="commercial">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {satellites.filter(s => s.provider.includes('Planet') || s.provider.includes('Maxar') || s.provider.includes('Capella') || s.provider.includes('ICEYE')).map((satellite) => (
                <SatelliteCard key={satellite.id} satellite={satellite} onSelect={setSelectedSatellite} setIsDetailModalOpen={setIsDetailModalOpen} />
              ))}
            </div>
          </TabsContent>
        </Tabs>



        {/* Satellite Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Satellite className="h-6 w-6 text-blue-600" />
                {selectedSatellite?.name} - Detailed Information
              </DialogTitle>
            </DialogHeader>
            
            {selectedSatellite && (
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-6 pr-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Satellite Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>ID:</span>
                          <span className="font-mono">{selectedSatellite.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Provider:</span>
                          <span>{selectedSatellite.provider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span>{selectedSatellite.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Altitude:</span>
                          <span>{selectedSatellite.altitude}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Coverage:</span>
                          <span>{selectedSatellite.coverage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Orbital Velocity:</span>
                          <span>{selectedSatellite.orbitalVelocity}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Signal Strength:</span>
                          <span className="font-medium">{selectedSatellite.signal}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Battery Level:</span>
                          <span className="font-medium">{selectedSatellite.battery}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data Transmitted:</span>
                          <span className="font-medium">{selectedSatellite.dataTransmitted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Update Frequency:</span>
                          <span>{selectedSatellite.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resolution:</span>
                          <span>{selectedSatellite.resolution}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          {getStatusBadge(selectedSatellite.status)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Data Types */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Data Types & Capabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedSatellite.dataTypes.map((type: string, idx: number) => (
                          <Badge key={idx} className="justify-center p-2">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Connected Modules */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Connected Platform Modules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedSatellite.modules.map((module: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">{module}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location & Coverage */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Current Position & Coverage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Coordinates:</p>
                          <p className="font-mono text-lg">
                            {selectedSatellite.coordinates.lat}°, {selectedSatellite.coordinates.lng}°
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Last Update:</p>
                          <p className="text-sm">
                            {new Date(selectedSatellite.lastUpdate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>

        {/* System Status Footer */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">System Status: Operational</p>
                  <p className="text-sm text-gray-600">
                    Last sync: {realTimeData.lastDataSync || new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}