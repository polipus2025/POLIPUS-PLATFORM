import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Navigation2,
  Square,
  Ruler,
  Camera,
  Upload
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface FarmPlot {
  id?: number;
  farmerId: string;
  plotName: string;
  coordinates: Array<[number, number]>;
  area: number;
  cropType: string;
  soilType: string;
  elevation: number;
  slope: number;
  waterSource: string;
  accessRoad: boolean;
  notes: string;
  plantingDate?: Date;
  harvestDate?: Date;
}

interface FarmPlotMapperProps {
  farmerId?: string;
  readOnly?: boolean;
}

export default function FarmPlotMapper({ farmerId, readOnly = false }: FarmPlotMapperProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedPlot, setSelectedPlot] = useState<FarmPlot | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [coordinates, setCoordinates] = useState<Array<[number, number]>>([]);

  const { data: farmPlots = [] } = useQuery<FarmPlot[]>({
    queryKey: ['/api/farm-plots', farmerId],
  });

  const savePlotMutation = useMutation({
    mutationFn: async (plot: FarmPlot) => {
      const endpoint = plot.id ? `/api/farm-plots/${plot.id}` : '/api/farm-plots';
      const method = plot.id ? 'PATCH' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plot),
      });
      if (!response.ok) {
        throw new Error(`Failed to save plot: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/farm-plots'] });
      toast({
        title: "Success",
        description: "Farm plot saved successfully",
      });
      setIsEditing(false);
      setSelectedPlot(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save farm plot",
        variant: "destructive",
      });
    },
  });

  const deletePlotMutation = useMutation({
    mutationFn: async (plotId: number) => {
      const response = await fetch(`/api/farm-plots/${plotId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete plot: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/farm-plots'] });
      toast({
        title: "Success",
        description: "Farm plot deleted successfully",
      });
      setSelectedPlot(null);
    },
  });

  const handlePlotClick = (plot: FarmPlot) => {
    setSelectedPlot(plot);
    setCoordinates(plot.coordinates);
    setIsEditing(false);
  };

  const handleSavePlot = () => {
    if (!selectedPlot) return;
    
    const plotData = {
      ...selectedPlot,
      coordinates,
      area: calculateArea(coordinates),
    };
    
    savePlotMutation.mutate(plotData);
  };

  const calculateArea = (coords: Array<[number, number]>): number => {
    // Simple area calculation using Shoelace formula
    if (coords.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      area += coords[i][0] * coords[j][1];
      area -= coords[j][0] * coords[i][1];
    }
    return Math.abs(area) / 2 * 111319.9; // Convert to hectares approximation
  };

  const addCoordinate = (lat: number, lng: number) => {
    if (drawingMode) {
      setCoordinates(prev => [...prev, [lat, lng]]);
    }
  };

  const cropTypes = [
    'Coffee', 'Cocoa', 'Rice', 'Cassava', 'Oil Palm', 'Rubber', 
    'Sugarcane', 'Plantain', 'Sweet Potato', 'Yam', 'Maize', 'Beans'
  ];

  const soilTypes = [
    'Clay', 'Sandy', 'Loamy', 'Silty', 'Rocky', 'Peaty', 'Laterite'
  ];

  const waterSources = [
    'River', 'Stream', 'Well', 'Borehole', 'Rain-fed', 'Irrigation', 'Spring'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Farm Plot Mapper</h2>
          <p className="text-gray-600">GPS-based farm plot mapping and management</p>
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <Button
              variant={drawingMode ? "default" : "outline"}
              onClick={() => setDrawingMode(!drawingMode)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Draw Plot
            </Button>
            <Button onClick={() => {
              setSelectedPlot({
                farmerId: farmerId || '',
                plotName: '',
                coordinates: [],
                area: 0,
                cropType: '',
                soilType: '',
                elevation: 0,
                slope: 0,
                waterSource: '',
                accessRoad: false,
                notes: ''
              });
              setIsEditing(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              New Plot
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Plot List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Farm Plots ({farmPlots.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {farmPlots.map((plot, index) => (
                  <div
                    key={plot.id || index}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlot?.id === plot.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePlotClick(plot)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{plot.plotName}</h4>
                        <p className="text-sm text-gray-600">{plot.cropType}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            <Square className="h-3 w-3 mr-1" />
                            {plot.area.toFixed(1)} ha
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {plot.coordinates.length} points
                          </Badge>
                        </div>
                      </div>
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (plot.id) deletePlotMutation.mutate(plot.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {farmPlots.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No farm plots mapped yet</p>
                    {!readOnly && (
                      <p className="text-sm">Click "New Plot" to start mapping</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map and Plot Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation2 className="h-5 w-5" />
                Plot Mapping
                {drawingMode && (
                  <Badge variant="default" className="ml-2">Drawing Mode Active</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-green-100 to-brown-100 rounded-lg relative overflow-hidden border-2 border-dashed border-gray-300">
                {/* Simulated GPS Map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 500 400">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Farm plots visualization */}
                    {farmPlots.map((plot, index) => (
                      <g key={plot.id || index}>
                        {plot.coordinates.length > 2 && (
                          <polygon
                            points={plot.coordinates.map(coord => 
                              `${(coord[1] + 9.5) * 50},${(6.5 - coord[0]) * 60}`
                            ).join(' ')}
                            fill={selectedPlot?.id === plot.id ? "#10B981" : "#84CC16"}
                            fillOpacity="0.3"
                            stroke={selectedPlot?.id === plot.id ? "#059669" : "#65A30D"}
                            strokeWidth="2"
                          />
                        )}
                        
                        {/* Plot center marker */}
                        {plot.coordinates.length > 0 && (
                          <g>
                            <circle
                              cx={(plot.coordinates[0][1] + 9.5) * 50}
                              cy={(6.5 - plot.coordinates[0][0]) * 60}
                              r="4"
                              fill="#DC2626"
                            />
                            <text
                              x={(plot.coordinates[0][1] + 9.5) * 50 + 8}
                              y={(6.5 - plot.coordinates[0][0]) * 60 + 4}
                              fontSize="10"
                              fill="#374151"
                              fontWeight="bold"
                            >
                              {plot.plotName}
                            </text>
                          </g>
                        )}
                      </g>
                    ))}
                    
                    {/* Current drawing coordinates */}
                    {coordinates.map((coord, index) => (
                      <circle
                        key={index}
                        cx={(coord[1] + 9.5) * 50}
                        cy={(6.5 - coord[0]) * 60}
                        r="3"
                        fill="#EF4444"
                      />
                    ))}
                    
                    {/* Connect drawing points */}
                    {coordinates.length > 1 && (
                      <polyline
                        points={coordinates.map(coord => 
                          `${(coord[1] + 9.5) * 50},${(6.5 - coord[0]) * 60}`
                        ).join(' ')}
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    )}
                  </svg>
                </div>
                
                {/* Click handler for drawing */}
                {drawingMode && (
                  <div 
                    className="absolute inset-0 cursor-crosshair"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const lng = (x / rect.width) * 2 - 9.5;
                      const lat = 6.5 - (y / rect.height) * 1;
                      addCoordinate(lat, lng);
                    }}
                  />
                )}
                
                {/* Coordinates display */}
                <div className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 rounded text-xs">
                  {coordinates.length > 0 && (
                    <div>
                      Points: {coordinates.length} | Area: {calculateArea(coordinates).toFixed(2)} ha
                    </div>
                  )}
                </div>
                
                {/* Drawing instructions */}
                {drawingMode && (
                  <div className="absolute top-4 left-4 bg-blue-50 border border-blue-200 px-3 py-2 rounded text-sm">
                    <p className="font-medium text-blue-800">Drawing Mode</p>
                    <p className="text-blue-600">Click on map to add plot boundary points</p>
                  </div>
                )}
              </div>
              
              {drawingMode && (
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCoordinates([])}
                  >
                    Clear Points
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (coordinates.length > 2) {
                        setCoordinates([...coordinates, coordinates[0]]); // Close polygon
                      }
                    }}
                  >
                    Close Polygon
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setDrawingMode(false)}
                  >
                    Finish Drawing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plot Details Form */}
          {selectedPlot && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Plot Details
                  {!readOnly && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plotName">Plot Name</Label>
                    <Input
                      id="plotName"
                      value={selectedPlot.plotName}
                      onChange={(e) => setSelectedPlot({...selectedPlot, plotName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Select
                      value={selectedPlot.cropType}
                      onValueChange={(value) => setSelectedPlot({...selectedPlot, cropType: value})}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropTypes.map(crop => (
                          <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select
                      value={selectedPlot.soilType}
                      onValueChange={(value) => setSelectedPlot({...selectedPlot, soilType: value})}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        {soilTypes.map(soil => (
                          <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="waterSource">Water Source</Label>
                    <Select
                      value={selectedPlot.waterSource}
                      onValueChange={(value) => setSelectedPlot({...selectedPlot, waterSource: value})}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select water source" />
                      </SelectTrigger>
                      <SelectContent>
                        {waterSources.map(source => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="elevation">Elevation (m)</Label>
                    <Input
                      id="elevation"
                      type="number"
                      value={selectedPlot.elevation}
                      onChange={(e) => setSelectedPlot({...selectedPlot, elevation: Number(e.target.value)})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slope">Slope (%)</Label>
                    <Input
                      id="slope"
                      type="number"
                      value={selectedPlot.slope}
                      onChange={(e) => setSelectedPlot({...selectedPlot, slope: Number(e.target.value)})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={selectedPlot.notes}
                    onChange={(e) => setSelectedPlot({...selectedPlot, notes: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Additional notes about this plot..."
                  />
                </div>
                
                {/* Plot Statistics */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Plot Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Area</p>
                      <p className="font-medium">{selectedPlot.area.toFixed(2)} hectares</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Perimeter</p>
                      <p className="font-medium">{(selectedPlot.area * 4).toFixed(0)} meters</p>
                    </div>
                    <div>
                      <p className="text-gray-600">GPS Points</p>
                      <p className="font-medium">{selectedPlot.coordinates.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Access Road</p>
                      <p className="font-medium">{selectedPlot.accessRoad ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
                
                {isEditing && !readOnly && (
                  <div className="mt-6 flex gap-2">
                    <Button onClick={handleSavePlot} disabled={savePlotMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {savePlotMutation.isPending ? 'Saving...' : 'Save Plot'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}