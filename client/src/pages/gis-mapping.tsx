import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import InteractiveMap from '@/components/gis/interactive-map';
import FarmPlotMapper from '@/components/gis/farm-plot-mapper';
import TransportationTracker from '@/components/gis/transportation-tracker';
import { 
  Map, 
  Navigation, 
  Truck, 
  Satellite, 
  Activity,
  BarChart3,
  Download
} from 'lucide-react';
import { SatelliteImageryService, CropMonitoringService, SATELLITE_PROVIDERS, GPS_SERVICES } from "@/lib/satellite-services";

export default function GISMapping() {
  const [activeTab, setActiveTab] = useState('overview');
  const [satelliteStatus, setSatelliteStatus] = useState<any>(null);
  const [realTimePosition, setRealTimePosition] = useState<any>(null);
  const [isConnectingSatellites, setIsConnectingSatellites] = useState(false);

  // Connect to real satellites on component mount
  useEffect(() => {
    connectToSatellites();
    const interval = setInterval(updateSatelliteData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const connectToSatellites = async () => {
    setIsConnectingSatellites(true);
    try {
      // Get real satellite constellation status
      const status = await SatelliteImageryService.getSatelliteStatus();
      setSatelliteStatus(status);
      
      // Get current GPS position
      const position = await SatelliteImageryService.getCurrentPosition();
      setRealTimePosition(position);
      
      console.log('Successfully connected to satellite networks:', status);
    } catch (error) {
      console.error('Satellite connection error:', error);
    } finally {
      setIsConnectingSatellites(false);
    }
  };

  const updateSatelliteData = async () => {
    if (satelliteStatus) {
      const updatedStatus = await SatelliteImageryService.getSatelliteStatus();
      setSatelliteStatus(updatedStatus);
    }
  };

  const gisStats = {
    totalPlots: 1247,
    mappedArea: '15847 hectares',
    activeVehicles: 45,
    trackingAccuracy: '98.7%',
    satellitesConnected: satelliteStatus?.totalSatellites || 0,
    gpsAccuracy: satelliteStatus?.gps?.accuracy || 'Connecting...',
    lastUpdate: new Date().toLocaleTimeString()
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>GIS Mapping System - AgriTrace360™ LACRA</title>
        <meta name="description" content="Comprehensive geospatial mapping and tracking system for agricultural operations" />
      </Helmet>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GIS Mapping System</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive geospatial mapping and tracking for agricultural operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            System Status
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Map className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mapped Plots</p>
                <p className="text-xl font-bold">{gisStats.totalPlots.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Satellite className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Area</p>
                <p className="text-xl font-bold">{gisStats.mappedArea}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Truck className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Vehicles</p>
                <p className="text-xl font-bold">{gisStats.activeVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">GPS Accuracy</p>
                <p className="text-xl font-bold">{gisStats.trackingAccuracy}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Activity className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Update</p>
                <p className="text-sm font-medium">{gisStats.lastUpdate}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                  Live
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Interactive Map
          </TabsTrigger>
          <TabsTrigger value="farm-plots" className="flex items-center gap-2">
            <Satellite className="h-4 w-4" />
            Farm Mapping
          </TabsTrigger>
          <TabsTrigger value="transportation" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Vehicle Tracking
          </TabsTrigger>
          <TabsTrigger value="satellites" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Satellites
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-0">
          <InteractiveMap />
        </TabsContent>

        <TabsContent value="farm-plots" className="space-y-0">
          <FarmPlotMapper />
        </TabsContent>

        <TabsContent value="transportation" className="space-y-0">
          <TransportationTracker />
        </TabsContent>

        <TabsContent value="satellites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Satellite className="h-5 w-5" />
                Real-Time Satellite Network Status
                {isConnectingSatellites && (
                  <Badge variant="outline" className="ml-2">Connecting...</Badge>
                )}
                {satelliteStatus?.optimalCoverage && (
                  <Badge variant="default" className="ml-2 bg-green-500">Connected</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {satelliteStatus ? (
                <div className="space-y-6">
                  {/* Global Navigation Satellite Systems */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Global Navigation Satellite Systems (GNSS)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 border rounded-lg bg-blue-50">
                        <div className="text-3xl font-bold text-blue-600">{satelliteStatus.gps.available}</div>
                        <div className="text-lg font-medium">GPS (USA)</div>
                        <div className="text-sm text-gray-600">Healthy: {satelliteStatus.gps.healthy}</div>
                        <div className="text-sm text-green-600">Accuracy: {satelliteStatus.gps.accuracy}</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg bg-green-50">
                        <div className="text-3xl font-bold text-green-600">{satelliteStatus.glonass.available}</div>
                        <div className="text-lg font-medium">GLONASS (Russia)</div>
                        <div className="text-sm text-gray-600">Healthy: {satelliteStatus.glonass.healthy}</div>
                        <div className="text-sm text-green-600">Accuracy: {satelliteStatus.glonass.accuracy}</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg bg-purple-50">
                        <div className="text-3xl font-bold text-purple-600">{satelliteStatus.galileo.available}</div>
                        <div className="text-lg font-medium">Galileo (EU)</div>
                        <div className="text-sm text-gray-600">Healthy: {satelliteStatus.galileo.healthy}</div>
                        <div className="text-sm text-green-600">Accuracy: {satelliteStatus.galileo.accuracy}</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg bg-red-50">
                        <div className="text-3xl font-bold text-red-600">{satelliteStatus.beidou.available}</div>
                        <div className="text-lg font-medium">BeiDou (China)</div>
                        <div className="text-sm text-gray-600">Healthy: {satelliteStatus.beidou.healthy}</div>
                        <div className="text-sm text-green-600">Accuracy: {satelliteStatus.beidou.accuracy}</div>
                      </div>
                    </div>
                  </div>

                  {/* Satellite Imagery Providers */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Satellite Imagery Providers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(SATELLITE_PROVIDERS).map(([key, provider]) => (
                        <Card key={key} className="p-4">
                          <h4 className="font-semibold text-sm">{provider.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {provider.resolution} • {provider.revisitTime}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {provider.capabilities.map(cap => (
                              <Badge key={cap} variant="outline" className="text-xs">
                                {cap.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Current GPS Position */}
                  {realTimePosition && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Current GPS Position</h3>
                      <Card className="p-4 bg-gray-50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Latitude</div>
                            <div className="font-mono text-lg">{realTimePosition.coords.latitude.toFixed(6)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Longitude</div>
                            <div className="font-mono text-lg">{realTimePosition.coords.longitude.toFixed(6)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Accuracy</div>
                            <div className="font-mono text-lg">{realTimePosition.coords.accuracy.toFixed(1)}m</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Altitude</div>
                            <div className="font-mono text-lg">{realTimePosition.coords.altitude?.toFixed(1) || 'N/A'}m</div>
                          </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500">
                          Last updated: {new Date(realTimePosition.timestamp).toLocaleString()}
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* Connection Controls */}
                  <div className="flex gap-2">
                    <Button onClick={connectToSatellites} disabled={isConnectingSatellites} variant="outline">
                      <Satellite className="h-4 w-4 mr-2" />
                      {isConnectingSatellites ? 'Reconnecting...' : 'Refresh Connection'}
                    </Button>
                    <Button onClick={updateSatelliteData} variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      Update Data
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Satellite className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Connect to Satellite Networks</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Establish real-time connections to GPS, GLONASS, Galileo, and BeiDou satellite constellations 
                    for precise positioning and agricultural imagery services.
                  </p>
                  <Button onClick={connectToSatellites} disabled={isConnectingSatellites} size="lg">
                    <Satellite className="h-5 w-5 mr-2" />
                    {isConnectingSatellites ? 'Connecting to Satellites...' : 'Connect to Satellite Networks'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spatial Analysis Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Advanced Spatial Analytics</h3>
                    <p className="text-sm max-w-md mx-auto">
                      Comprehensive geospatial analysis tools for crop yield prediction, 
                      soil mapping, climate impact assessment, and resource optimization.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="font-medium text-green-800">Yield Prediction</p>
                      <p className="text-green-600">ML-based crop analysis</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-800">Soil Mapping</p>
                      <p className="text-blue-600">Multi-spectral analysis</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="font-medium text-orange-800">Climate Impact</p>
                      <p className="text-orange-600">Weather correlation</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="font-medium text-purple-800">Resource Optimization</p>
                      <p className="text-purple-600">Efficiency analysis</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geospatial Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'County Land Use Analysis', date: '2025-01-23', type: 'PDF' },
                    { name: 'Farm Plot Efficiency Report', date: '2025-01-22', type: 'Excel' },
                    { name: 'Transportation Route Optimization', date: '2025-01-21', type: 'PDF' },
                    { name: 'Soil Quality Mapping', date: '2025-01-20', type: 'GeoJSON' },
                    { name: 'Crop Yield Predictions', date: '2025-01-19', type: 'PDF' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{report.name}</p>
                        <p className="text-xs text-gray-500">{report.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{report.type}</Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}