import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import InteractiveBoundaryMapper from '@/components/maps/interactive-boundary-mapper';
import EnhancedSatelliteMapper from '@/components/maps/enhanced-satellite-mapper';
import { 
  ArrowLeft,
  Map, 
  MapPin, 
  Save,
  Download,
  Globe,
  Target,
  User,
  TreePine,
  Calculator,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface FarmCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface FarmBoundary {
  coordinates: FarmCoordinates[];
  area: number;
  perimeter: number;
  centerPoint: FarmCoordinates;
}

export default function FieldAgentFarmMapping() {
  const [activeTab, setActiveTab] = useState('manual');
  const [selectedFarmerId, setSelectedFarmerId] = useState('');
  const [farmBoundary, setFarmBoundary] = useState<FarmBoundary | null>(null);
  const [manualCoordinates, setManualCoordinates] = useState<FarmCoordinates[]>([]);
  const [newCoordinate, setNewCoordinate] = useState({ latitude: '', longitude: '' });
  const { toast } = useToast();

  // Get field agent info from localStorage
  const agentId = localStorage.getItem("agentId");
  const jurisdiction = localStorage.getItem("jurisdiction");

  // Sample farmers data for the current jurisdiction
  const farmers = [
    { id: 'FRM-001', name: 'John Doe', location: 'Village A', crop: 'Cocoa' },
    { id: 'FRM-002', name: 'Mary Johnson', location: 'Village B', crop: 'Coffee' },
    { id: 'FRM-003', name: 'James Wilson', location: 'Village C', crop: 'Palm Oil' },
  ];

  const addManualCoordinate = () => {
    if (!newCoordinate.latitude || !newCoordinate.longitude) {
      toast({
        title: "Invalid Coordinates",
        description: "Please enter both latitude and longitude values",
        variant: "destructive"
      });
      return;
    }

    const lat = parseFloat(newCoordinate.latitude);
    const lng = parseFloat(newCoordinate.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast({
        title: "Invalid Values",
        description: "Please enter valid numeric coordinates",
        variant: "destructive"
      });
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast({
        title: "Invalid Range",
        description: "Latitude must be between -90 and 90, longitude between -180 and 180",
        variant: "destructive"
      });
      return;
    }

    const coordinate: FarmCoordinates = {
      latitude: lat,
      longitude: lng,
      accuracy: 5.0 // Default accuracy for manual entry
    };

    setManualCoordinates([...manualCoordinates, coordinate]);
    setNewCoordinate({ latitude: '', longitude: '' });

    toast({
      title: "Coordinate Added",
      description: `Point added at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    });
  };

  const removeCoordinate = (index: number) => {
    const updated = manualCoordinates.filter((_, i) => i !== index);
    setManualCoordinates(updated);
    toast({
      title: "Coordinate Removed",
      description: "Boundary point removed successfully",
    });
  };

  const generateMapFromCoordinates = () => {
    if (manualCoordinates.length < 3) {
      toast({
        title: "Insufficient Points",
        description: "Need at least 3 coordinates to generate a farm boundary map",
        variant: "destructive"
      });
      return;
    }

    // Calculate area using shoelace formula
    let area = 0;
    const n = manualCoordinates.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += manualCoordinates[i].longitude * manualCoordinates[j].latitude;
      area -= manualCoordinates[j].longitude * manualCoordinates[i].latitude;
    }
    area = Math.abs(area) / 2;
    
    // Convert to hectares (approximate for Liberia's latitude ~7°N)
    area = area * 111319.9 * 111319.9 * Math.cos(7 * Math.PI / 180) / 10000;

    // Calculate perimeter
    let perimeter = 0;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      perimeter += calculateDistance(manualCoordinates[i], manualCoordinates[j]);
    }

    // Calculate center point
    const centerLat = manualCoordinates.reduce((sum, coord) => sum + coord.latitude, 0) / n;
    const centerLng = manualCoordinates.reduce((sum, coord) => sum + coord.longitude, 0) / n;

    const boundary: FarmBoundary = {
      coordinates: manualCoordinates,
      area,
      perimeter,
      centerPoint: { latitude: centerLat, longitude: centerLng }
    };

    setFarmBoundary(boundary);

    toast({
      title: "Farm Map Generated",
      description: `Farm boundary mapped with ${n} points covering ${area.toFixed(2)} hectares`,
    });
  };

  const calculateDistance = (coord1: FarmCoordinates, coord2: FarmCoordinates): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const saveFarmBoundary = () => {
    if (!selectedFarmerId) {
      toast({
        title: "No Farmer Selected",
        description: "Please select a farmer before saving the boundary",
        variant: "destructive"
      });
      return;
    }

    if (!farmBoundary) {
      toast({
        title: "No Boundary Data",
        description: "Please generate a farm boundary before saving",
        variant: "destructive"
      });
      return;
    }

    // Save boundary data (in real app, this would be an API call)
    const boundaryData = {
      farmerId: selectedFarmerId,
      agentId,
      jurisdiction,
      boundary: farmBoundary,
      timestamp: new Date().toISOString(),
      method: activeTab === 'manual' ? 'manual_coordinates' : 'interactive_mapping'
    };


    toast({
      title: "Farm Boundary Saved",
      description: `Boundary data saved for farmer ${selectedFarmerId}`,
    });
  };

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Field Agent Farm Mapping - AgriTrace360 LACRA</title>
        <meta name="description" content="Interactive farm boundary mapping for field agents" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/field-agent-dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="w-16 h-16 rounded-2xl isms-icon-bg-green flex items-center justify-center">
              <Map className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Farm Boundary Mapping</h1>
              <p className="text-slate-600 text-lg">Create precise farm boundaries for compliance tracking</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Field Agent: {agentId}</p>
            <p className="text-sm text-slate-600">Territory: {jurisdiction}</p>
          </div>
        </div>

        {/* Farmer Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Select Farmer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="farmer-select">Choose Farmer</Label>
                <Select value={selectedFarmerId} onValueChange={setSelectedFarmerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a farmer to map their land..." />
                  </SelectTrigger>
                  <SelectContent>
                    {farmers.map(farmer => (
                      <SelectItem key={farmer.id} value={farmer.id}>
                        {farmer.name} - {farmer.location} ({farmer.crop})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedFarmerId && (
                <div className="flex items-end">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      Selected: {farmers.find(f => f.id === selectedFarmerId)?.name}
                    </p>
                    <p className="text-xs text-green-600">
                      Ready to map farm boundaries
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mapping Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Farm Boundary Mapping Interface
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-xl">
                <TabsTrigger value="interactive" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Map className="h-4 w-4 mr-2" />
                  Interactive Mapping
                </TabsTrigger>
                <TabsTrigger value="manual" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Target className="h-4 w-4 mr-2" />
                  Manual Coordinates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interactive" className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-blue-800 mb-2">Interactive Farm Mapping</h3>
                  <p className="text-sm text-blue-700">
                    Use the interactive map below to click and create farm boundaries visually. 
                    Your GPS location will be shown, and you can click on the map to add boundary points.
                  </p>
                </div>
                
                <EnhancedSatelliteMapper 
                  onBoundaryComplete={(boundary) => {
                    setFarmBoundary({
                      coordinates: boundary.points.map(p => ({
                        latitude: p.latitude,
                        longitude: p.longitude,
                        accuracy: p.accuracy || 1.5
                      })),
                      area: boundary.area,
                      perimeter: boundary.perimeter,
                      centerPoint: boundary.centerPoint
                    });
                    
                    toast({
                      title: "Enhanced Satellite Boundary Created",
                      description: `Farm boundary mapped with ${boundary.points.length} points covering ${boundary.area.toFixed(2)} hectares using high-resolution satellite imagery`,
                    });
                  }}
                  minPoints={3}
                  maxPoints={20}
                  enableRealTimeGPS={true}
                  farmerId={farmerData.firstName ? `${farmerData.firstName}-${farmerData.lastName}` : 'new-farmer'}
                  farmerName={farmerData.firstName ? `${farmerData.firstName} ${farmerData.lastName}` : 'New Farmer'}
                />
              </TabsContent>

              <TabsContent value="manual" className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-amber-800 mb-2">Manual Coordinate Entry</h3>
                  <p className="text-sm text-amber-700">
                    Enter GPS coordinates manually to create farm boundaries. You need at least 3 points to generate a boundary map.
                  </p>
                </div>

                {/* Coordinate Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Add GPS Coordinates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="0.000001"
                          placeholder="e.g., 6.428100"
                          value={newCoordinate.latitude}
                          onChange={(e) => setNewCoordinate({...newCoordinate, latitude: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="0.000001"
                          placeholder="e.g., -9.429500"
                          value={newCoordinate.longitude}
                          onChange={(e) => setNewCoordinate({...newCoordinate, longitude: e.target.value})}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={addManualCoordinate} className="w-full">
                          <MapPin className="h-4 w-4 mr-2" />
                          Add Point
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Coordinates List */}
                {manualCoordinates.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Boundary Points ({manualCoordinates.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {manualCoordinates.map((coord, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                            <div className="text-sm">
                              <span className="font-medium">Point {index + 1}:</span> {coord.latitude.toFixed(6)}, {coord.longitude.toFixed(6)}
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeCoordinate(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button onClick={generateMapFromCoordinates} disabled={manualCoordinates.length < 3}>
                          <Calculator className="h-4 w-4 mr-2" />
                          Generate Map
                        </Button>
                        <Button variant="outline" onClick={() => setManualCoordinates([])}>
                          Clear All
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Farm Boundary Results */}
        {farmBoundary && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Farm Boundary Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">{farmBoundary.coordinates.length}</div>
                  <div className="text-sm text-slate-600">Boundary Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{farmBoundary.area.toFixed(2)}</div>
                  <div className="text-sm text-slate-600">Hectares</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{farmBoundary.perimeter.toFixed(1)}</div>
                  <div className="text-sm text-slate-600">Meters Perimeter</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-900">Center Point</div>
                  <div className="text-xs text-slate-600">
                    {farmBoundary.centerPoint.latitude.toFixed(6)}<br/>
                    {farmBoundary.centerPoint.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button onClick={saveFarmBoundary} disabled={!selectedFarmerId}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Farm Boundary
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}