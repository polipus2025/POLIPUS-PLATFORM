import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Download,
  TreePine,
  AlertCircle,
  Shield,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  MapPin,
  Globe,
  Zap,
  Eye
} from 'lucide-react';
import { SatelliteImageryService, CropMonitoringService, NASASatelliteService, SATELLITE_PROVIDERS, GPS_SERVICES, NASA_SATELLITES } from "@/lib/satellite-services";

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
      
      // Get current GPS position with error handling
      let position;
      try {
        position = await SatelliteImageryService.getCurrentPosition();
        setRealTimePosition(position);
      } catch (posError) {
        console.warn('GPS position unavailable, using default coordinates');
        position = { coords: { latitude: 6.4281, longitude: -9.4295 } };
        setRealTimePosition(position);
      }
      
      // Connect to NASA satellites specifically
      const nasaImagery = await NASASatelliteService.getNASAImagery({ 
        lat: position.coords?.latitude || 6.4281, 
        lng: position.coords?.longitude || -9.4295 
      });
      
      const modisData = await NASASatelliteService.getMODISAgriculturalData({ 
        lat: position.coords?.latitude || 6.4281, 
        lng: position.coords?.longitude || -9.4295 
      });

      // Get NASA Landsat field analysis
      const landsatData = await NASASatelliteService.getLandsatFieldAnalysis({
        lat: position.coords?.latitude || 6.4281, 
        lng: position.coords?.longitude || -9.4295 
      });

      // Get NASA SMAP soil moisture data
      const smapData = await NASASatelliteService.getSMAPSoilMoisture({
        lat: position.coords?.latitude || 6.4281, 
        lng: position.coords?.longitude || -9.4295 
      });

      // Get Global Forest Watch data using separate service
      const { GlobalForestWatchService } = await import('@/lib/forest-watch-service');
      
      const gladAlerts = await GlobalForestWatchService.getGLADAlerts({
        lat: position.coords?.latitude || 6.4281, 
        lng: position.coords?.longitude || -9.4295 
      });

      const gfwIntegratedAlerts = await GlobalForestWatchService.getIntegratedAlerts({
        lat: position.coords?.latitude || 6.4281, 
        lng: position.coords?.longitude || -9.4295 
      });

      const treeCoverAnalysis = await GlobalForestWatchService.getTreeCoverAnalysis({
        lat: position.coords?.latitude || 6.4281, 
        lng: position.coords?.longitude || -9.4295 
      });

      const fireAlerts = await GlobalForestWatchService.getFireAlerts({
        lat: position.coords?.latitude || 6.4281, 
        lng: position.coords?.longitude || -9.4295 
      });

      const biodiversityData = await GlobalForestWatchService.getBiodiversityData({
        lat: position.coords?.latitude || 6.4281, 
        lng: position.coords?.longitude || -9.4295 
      });
      
      console.log('✅ Successfully connected to satellite networks:', status);
      console.log('🛰️ NASA GIBS imagery connected:', nasaImagery);
      console.log('🌱 NASA MODIS agricultural data:', modisData);
      console.log('🗺️ NASA Landsat field analysis:', landsatData);
      console.log('💧 NASA SMAP soil moisture:', smapData);
      console.log('🌲 GFW GLAD deforestation alerts:', gladAlerts);
      console.log('🔍 GFW integrated alerts:', gfwIntegratedAlerts);
      console.log('📊 GFW tree cover analysis:', treeCoverAnalysis);
      console.log('🔥 GFW fire alerts:', fireAlerts);
      console.log('🦋 GFW biodiversity data:', biodiversityData);
      
      // Store NASA data and GFW data for display
      setSatelliteStatus((prev: any) => ({
        ...status,
        ...prev,
        nasaData: { nasaImagery, modisData, landsatData, smapData },
        gfwData: { gladAlerts, gfwIntegratedAlerts, treeCoverAnalysis, fireAlerts, biodiversityData }
      }));
      
    } catch (error) {
      console.error('❌ Satellite connection error:', error);
      
      // Set default satellite status even if connection fails to show UI
      setSatelliteStatus({
        totalSatellites: 0,
        connectedSatellites: 0,
        gps: { accuracy: 'Connecting...', signal: 'weak' },
        constellations: {
          gps: { active: 0, signal: 'connecting' },
          glonass: { active: 0, signal: 'connecting' },
          galileo: { active: 0, signal: 'connecting' },
          beidou: { active: 0, signal: 'connecting' }
        },
        optimalCoverage: false
      });
      
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

                  {/* NASA Satellite Missions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">NASA Earth Observation Satellites</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {Object.entries(NASA_SATELLITES.ACTIVE_MISSIONS).slice(0, 6).map(([key, mission]) => (
                        <Card key={key} className="p-4 bg-blue-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{key.replace('_', ' ')}</h4>
                            <Badge variant="default" className="bg-blue-600 text-xs">NASA</Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
                            Launched: {mission.launch_year} • Status: {mission.status}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {mission.instruments.map(instrument => (
                              <Badge key={instrument} variant="outline" className="text-xs">
                                {instrument}
                              </Badge>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">NASA Earth Observing System</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{NASA_SATELLITES.TOTAL_EARTH_OBSERVING}</div>
                          <div className="text-xs text-gray-600">Total Satellites</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{NASA_SATELLITES.AGRICULTURAL_FOCUSED}</div>
                          <div className="text-xs text-gray-600">Agricultural Focus</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">24/7</div>
                          <div className="text-xs text-gray-600">Global Coverage</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* All Satellite Imagery Providers */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">All Satellite Imagery Providers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(SATELLITE_PROVIDERS).map(([key, provider]) => (
                        <Card key={key} className={`p-4 ${key.startsWith('NASA') ? 'bg-blue-50 border-blue-200' : ''}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{provider.name}</h4>
                            {key.startsWith('NASA') && (
                              <Badge variant="default" className="bg-blue-600 text-xs">NASA</Badge>
                            )}
                          </div>
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

                  {/* NASA Satellite Data Display */}
                  {satelliteStatus?.nasaData && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">NASA Satellite Data (Live)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* NASA GIBS Imagery */}
                        <Card className="p-4 bg-blue-50">
                          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Badge variant="default" className="bg-blue-600">NASA GIBS</Badge>
                            Real-Time Imagery
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Vegetation Health:</span>
                              <span className="font-mono text-green-600">
                                {(satelliteStatus.nasaData.nasaImagery.agricultural_analysis.vegetation_health * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Temperature Stress:</span>
                              <span className="font-mono text-orange-600">
                                {(satelliteStatus.nasaData.nasaImagery.agricultural_analysis.temperature_stress * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Fire Risk:</span>
                              <span className="font-mono text-red-600">
                                {(satelliteStatus.nasaData.nasaImagery.agricultural_analysis.fire_risk * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </Card>

                        {/* NASA MODIS Agricultural */}
                        <Card className="p-4 bg-green-50">
                          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Badge variant="default" className="bg-green-600">MODIS Terra/Aqua</Badge>
                            Agricultural Analysis
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>NDVI:</span>
                              <span className="font-mono text-green-600">
                                {satelliteStatus.nasaData.modisData.products.vegetation_indices.ndvi.toFixed(3)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Day Temperature:</span>
                              <span className="font-mono text-blue-600">
                                {satelliteStatus.nasaData.modisData.products.land_surface_temperature.day_temp.toFixed(1)}°C
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Crop Stress:</span>
                              <span className="font-mono text-orange-600">
                                {(satelliteStatus.nasaData.modisData.agricultural_insights.crop_stress_level * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </Card>

                        {/* NASA Landsat Analysis */}
                        {satelliteStatus.nasaData?.landsatData && (
                          <Card className="p-4 bg-purple-50">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Badge variant="default" className="bg-purple-600">Landsat 8/9</Badge>
                              High-Resolution Analysis
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>NDVI:</span>
                                <span className="font-mono text-green-600">
                                  {satelliteStatus.nasaData.landsatData.agricultural_indices.ndvi.toFixed(3)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>NDWI (Water):</span>
                                <span className="font-mono text-blue-600">
                                  {satelliteStatus.nasaData.landsatData.agricultural_indices.ndwi.toFixed(3)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Cloud Cover:</span>
                                <span className="font-mono text-gray-600">
                                  {satelliteStatus.nasaData.landsatData.scene_metadata.cloud_cover.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </Card>
                        )}

                        {/* NASA SMAP Soil Moisture */}
                        {satelliteStatus.nasaData?.smapData && (
                          <Card className="p-4 bg-yellow-50">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Badge variant="default" className="bg-yellow-600">NASA SMAP</Badge>
                              Soil Moisture Analysis
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Surface Moisture:</span>
                                <span className="font-mono text-blue-600">
                                  {(satelliteStatus.nasaData.smapData.soil_moisture.surface_soil_moisture * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Root Zone:</span>
                                <span className="font-mono text-green-600">
                                  {(satelliteStatus.nasaData.smapData.soil_moisture.root_zone_moisture * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Irrigation Status:</span>
                                <span className={`font-mono ${
                                  satelliteStatus.nasaData.smapData.irrigation_guidance.current_status === 'adequate' 
                                    ? 'text-green-600' : 'text-orange-600'
                                }`}>
                                  {satelliteStatus.nasaData.smapData.irrigation_guidance.current_status}
                                </span>
                              </div>
                            </div>
                          </Card>
                        )}

                        {/* Global Forest Watch Deforestation Alerts */}
                        {satelliteStatus.gfwData?.gladAlerts && (
                          <Card className="p-4 bg-red-50">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Badge variant="default" className="bg-red-600">GFW GLAD</Badge>
                              Deforestation Alerts
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Total Alerts (30d):</span>
                                <span className="font-mono text-red-600">
                                  {satelliteStatus.gfwData.gladAlerts.total_alerts}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>High Confidence:</span>
                                <span className="font-mono text-orange-600">
                                  {satelliteStatus.gfwData.gladAlerts.high_confidence_alerts}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Area Affected:</span>
                                <span className="font-mono text-red-600">
                                  {satelliteStatus.gfwData.gladAlerts.total_area_affected.toFixed(2)} ha
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Last 7 Days:</span>
                                <span className="font-mono text-red-600">
                                  {satelliteStatus.gfwData.gladAlerts.summary.last_7_days}
                                </span>
                              </div>
                            </div>
                          </Card>
                        )}

                        {/* GFW Integrated Alerts */}
                        {satelliteStatus.gfwData?.gfwIntegratedAlerts && (
                          <Card className="p-4 bg-orange-50">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Badge variant="default" className="bg-orange-600">GFW Integrated</Badge>
                              Forest Monitoring
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Risk Level:</span>
                                <span className={`font-mono ${
                                  satelliteStatus.gfwData.gfwIntegratedAlerts.risk_assessment.deforestation_risk === 'high' 
                                    ? 'text-red-600' : 
                                  satelliteStatus.gfwData.gfwIntegratedAlerts.risk_assessment.deforestation_risk === 'medium' 
                                    ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                  {satelliteStatus.gfwData.gfwIntegratedAlerts.risk_assessment.deforestation_risk}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>EUDR Compliance:</span>
                                <span className={`font-mono ${
                                  satelliteStatus.gfwData.gfwIntegratedAlerts.risk_assessment.eudr_risk_level === 'high_risk' 
                                    ? 'text-red-600' : 
                                  satelliteStatus.gfwData.gfwIntegratedAlerts.risk_assessment.eudr_risk_level === 'medium_risk' 
                                    ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                  {satelliteStatus.gfwData.gfwIntegratedAlerts.risk_assessment.eudr_risk_level.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tree Cover Loss 2024:</span>
                                <span className="font-mono text-red-600">
                                  {satelliteStatus.gfwData.gfwIntegratedAlerts.forest_monitoring.tree_cover_loss_2024.toFixed(1)} ha
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Primary Forest Alerts:</span>
                                <span className="font-mono text-red-600">
                                  {satelliteStatus.gfwData.gfwIntegratedAlerts.forest_monitoring.primary_forest_alerts}
                                </span>
                              </div>
                            </div>
                          </Card>
                        )}

                        {/* Tree Cover Analysis */}
                        {satelliteStatus.gfwData?.treeCoverAnalysis && (
                          <Card className="p-4 bg-green-50">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Badge variant="default" className="bg-green-600">GFW Analysis</Badge>
                              Tree Cover Status
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Current Tree Cover:</span>
                                <span className="font-mono text-green-600">
                                  {satelliteStatus.gfwData.treeCoverAnalysis.tree_cover_stats.current_tree_cover_percent.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Loss Since 2001:</span>
                                <span className="font-mono text-red-600">
                                  {satelliteStatus.gfwData.treeCoverAnalysis.tree_cover_stats.tree_cover_loss_2001_2023.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Annual Loss Rate:</span>
                                <span className="font-mono text-orange-600">
                                  {satelliteStatus.gfwData.treeCoverAnalysis.forest_change_analysis.annual_loss_rate.toFixed(2)}%/year
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Carbon Loss:</span>
                                <span className="font-mono text-red-600">
                                  {(satelliteStatus.gfwData.treeCoverAnalysis.carbon_implications.estimated_carbon_loss_tons / 1000).toFixed(1)}k tons
                                </span>
                              </div>
                            </div>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Connection Controls */}
                  <div className="flex gap-2">
                    <Button onClick={connectToSatellites} disabled={isConnectingSatellites} variant="outline">
                      <Satellite className="h-4 w-4 mr-2" />
                      {isConnectingSatellites ? 'Connecting to NASA & GFW...' : 'Connect to All Satellites & Forest Watch'}
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

        <TabsContent value="forestwatch" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-green-600" />
                  Global Forest Watch - GLAD Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {satelliteStatus?.gfwData?.gladAlerts ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600 font-medium">Total Alerts (30d)</p>
                        <p className="text-2xl font-bold text-red-700">
                          {satelliteStatus.gfwData.gladAlerts.total_alerts}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-600 font-medium">High Confidence</p>
                        <p className="text-2xl font-bold text-orange-700">
                          {satelliteStatus.gfwData.gladAlerts.high_confidence_alerts}
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-600 font-medium">Area Affected</p>
                        <p className="text-xl font-bold text-yellow-700">
                          {satelliteStatus.gfwData.gladAlerts.total_area_affected.toFixed(1)} ha
                        </p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600 font-medium">Last 7 Days</p>
                        <p className="text-2xl font-bold text-red-700">
                          {satelliteStatus.gfwData.gladAlerts.summary.last_7_days}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Recent Deforestation Alerts</h4>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {satelliteStatus.gfwData.gladAlerts.alerts.slice(0, 5).map((alert: any, idx: number) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg border">
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant={alert.confidence === 'high' ? 'destructive' : 'secondary'}>
                                {alert.confidence.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-gray-500">{alert.alert_date}</span>
                            </div>
                            <div className="text-sm space-y-1">
                              <p><strong>Area:</strong> {alert.area_ha.toFixed(2)} hectares</p>
                              <p><strong>Forest Type:</strong> {alert.forest_type.replace('_', ' ')}</p>
                              <p><strong>Severity:</strong> {alert.severity}</p>
                              <p><strong>Location:</strong> {alert.coordinates.lat.toFixed(4)}, {alert.coordinates.lng.toFixed(4)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TreePine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Connect to satellites to view forest monitoring data</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  Integrated Forest Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                {satelliteStatus?.gfwData?.gfwIntegratedAlerts ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-blue-600">Deforestation Risk</span>
                          <Badge variant={
                            satelliteStatus.gfwData.gfwIntegratedAlerts.risk_assessment.deforestation_risk === 'high' 
                              ? 'destructive' : 
                            satelliteStatus.gfwData.gfwIntegratedAlerts.risk_assessment.deforestation_risk === 'medium' 
                              ? 'default' : 'secondary'
                          }>
                            {satelliteStatus.gfwData.gfwIntegratedAlerts.risk_assessment.deforestation_risk.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-purple-600">EUDR Compliance</span>
                          <Badge variant={
                            satelliteStatus.gfwData.gfwIntegratedAlerts.risk_assessment.eudr_risk_level === 'high_risk' 
                              ? 'destructive' : 
                            satelliteStatus.gfwData.gfwIntegratedAlerts.risk_assessment.eudr_risk_level === 'medium_risk' 
                              ? 'default' : 'secondary'
                          }>
                            {satelliteStatus.gfwData.gfwIntegratedAlerts.risk_assessment.eudr_risk_level.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Forest Monitoring Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Tree Cover Loss 2024:</span>
                          <span className="font-mono text-red-600">
                            {satelliteStatus.gfwData.gfwIntegratedAlerts.forest_monitoring.tree_cover_loss_2024.toFixed(1)} ha
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Primary Forest Alerts:</span>
                          <span className="font-mono text-red-600">
                            {satelliteStatus.gfwData.gfwIntegratedAlerts.forest_monitoring.primary_forest_alerts}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protected Area Alerts:</span>
                          <span className="font-mono text-orange-600">
                            {satelliteStatus.gfwData.gfwIntegratedAlerts.forest_monitoring.protected_area_alerts}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Alerts (30d):</span>
                          <span className="font-mono text-blue-600">
                            {satelliteStatus.gfwData.gfwIntegratedAlerts.alert_summary.total_alerts_30days}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Monitoring Recommendations</h4>
                      <div className="space-y-1">
                        {satelliteStatus.gfwData.gfwIntegratedAlerts.recommendations.map((rec: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Connect to satellites to view integrated monitoring data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-green-600" />
                  Tree Cover Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {satelliteStatus?.gfwData?.treeCoverAnalysis ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-600 font-medium">Current Tree Cover</p>
                        <p className="text-2xl font-bold text-green-700">
                          {satelliteStatus.gfwData.treeCoverAnalysis.tree_cover_stats.current_tree_cover_percent.toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600 font-medium">Loss Since 2001</p>
                        <p className="text-2xl font-bold text-red-700">
                          {satelliteStatus.gfwData.treeCoverAnalysis.tree_cover_stats.tree_cover_loss_2001_2023.toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-600 font-medium">Annual Loss Rate</p>
                        <p className="text-xl font-bold text-orange-700">
                          {satelliteStatus.gfwData.treeCoverAnalysis.forest_change_analysis.annual_loss_rate.toFixed(2)}%/year
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-600 font-medium">Species Risk</p>
                        <p className="text-xl font-bold text-purple-700">
                          {satelliteStatus.gfwData.treeCoverAnalysis.biodiversity_impact.species_risk_level.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Forest Extent Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Primary Forest:</span>
                          <span className="font-mono text-green-600">
                            {satelliteStatus.gfwData.treeCoverAnalysis.forest_change_analysis.primary_forest_extent_ha.toFixed(0)} ha
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Secondary Forest:</span>
                          <span className="font-mono text-blue-600">
                            {satelliteStatus.gfwData.treeCoverAnalysis.forest_change_analysis.secondary_forest_extent_ha.toFixed(0)} ha
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Plantations:</span>
                          <span className="font-mono text-orange-600">
                            {satelliteStatus.gfwData.treeCoverAnalysis.forest_change_analysis.plantation_extent_ha.toFixed(0)} ha
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Carbon Impact Assessment</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Estimated Carbon Loss:</span>
                          <span className="font-mono text-red-600">
                            {(satelliteStatus.gfwData.treeCoverAnalysis.carbon_implications.estimated_carbon_loss_tons / 1000).toFixed(1)}k tons
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>CO2 Emissions:</span>
                          <span className="font-mono text-red-600">
                            {(satelliteStatus.gfwData.treeCoverAnalysis.carbon_implications.co2_emissions_tons / 1000).toFixed(1)}k tons
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbon Density:</span>
                          <span className="font-mono text-gray-600">
                            {satelliteStatus.gfwData.treeCoverAnalysis.carbon_implications.carbon_density_tons_per_ha.toFixed(0)} t/ha
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TreePine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Connect to satellites to view tree cover analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Fire Alerts & Biodiversity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {satelliteStatus?.gfwData?.fireAlerts && satelliteStatus?.gfwData?.biodiversityData ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Fire Alert Summary</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm text-red-600 font-medium">Total Fire Alerts</p>
                          <p className="text-2xl font-bold text-red-700">
                            {satelliteStatus.gfwData.fireAlerts.total_fire_alerts}
                          </p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-600 font-medium">High Confidence</p>
                          <p className="text-2xl font-bold text-orange-700">
                            {satelliteStatus.gfwData.fireAlerts.high_confidence_fires}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Last 7 Days:</span>
                          <span className="font-mono text-red-600">
                            {satelliteStatus.gfwData.fireAlerts.fire_summary.last_7_days}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Forest Fires:</span>
                          <span className="font-mono text-red-600">
                            {satelliteStatus.gfwData.fireAlerts.fire_summary.forest_fires}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Biodiversity Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Protected Area:</span>
                          <Badge variant={satelliteStatus.gfwData.biodiversityData.protected_areas.within_protected_area ? 'default' : 'secondary'}>
                            {satelliteStatus.gfwData.biodiversityData.protected_areas.within_protected_area ? 'YES' : 'NO'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Endemic Species:</span>
                          <span className="font-mono text-green-600">
                            {satelliteStatus.gfwData.biodiversityData.biodiversity_indicators.endemic_species_count}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Threatened Species:</span>
                          <span className="font-mono text-red-600">
                            {satelliteStatus.gfwData.biodiversityData.biodiversity_indicators.threatened_species_count}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Habitat Integrity:</span>
                          <span className="font-mono text-blue-600">
                            {satelliteStatus.gfwData.biodiversityData.biodiversity_indicators.habitat_integrity_score.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conservation Priority:</span>
                          <Badge variant={
                            satelliteStatus.gfwData.biodiversityData.conservation_status.priority_level === 'high' 
                              ? 'destructive' : 
                            satelliteStatus.gfwData.biodiversityData.conservation_status.priority_level === 'medium' 
                              ? 'default' : 'secondary'
                          }>
                            {satelliteStatus.gfwData.biodiversityData.conservation_status.priority_level.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Connect to satellites to view fire alerts and biodiversity data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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