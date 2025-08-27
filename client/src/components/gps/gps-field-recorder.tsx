import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Camera, 
  Mic,
  FileText,
  Save,
  Clock,
  MapIcon,
  TreePine,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  CloudRain,
  Ruler,
  CheckCircle,
  AlertTriangle,
  Recording,
  StopCircle
} from 'lucide-react';

interface FieldRecord {
  id: string;
  timestamp: Date;
  position: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude?: number;
  };
  farmerId?: string;
  plotId?: string;
  recordType: 'inspection' | 'boundary' | 'crop_condition' | 'environmental' | 'compliance';
  title: string;
  description: string;
  weather?: {
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    conditions?: string;
  };
  measurements?: {
    plotSize?: number;
    cropHeight?: number;
    plantSpacing?: number;
    soilMoisture?: string;
  };
  photos?: string[];
  audioNotes?: string;
  compliance?: {
    eudrCompliant?: boolean;
    certifications?: string[];
    issues?: string[];
  };
  tags?: string[];
}

interface GPSFieldRecorderProps {
  onRecordSaved?: (record: FieldRecord) => void;
  farmerId?: string;
  plotId?: string;
}

export default function GPSFieldRecorder({ onRecordSaved, farmerId, plotId }: GPSFieldRecorderProps) {
  const [currentPosition, setCurrentPosition] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Partial<FieldRecord>>({
    recordType: 'inspection',
    title: '',
    description: '',
    weather: {},
    measurements: {},
    tags: []
  });
  
  const [weatherData, setWeatherData] = useState<any>(null);
  
  const watchIdRef = React.useRef<number | null>(null);

  useEffect(() => {
    // Start GPS tracking when component mounts
    startGPSTracking();
    // Get weather data
    fetchWeatherData();
    
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const startGPSTracking = () => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            timestamp: position.timestamp
          });
        },
        (error) => {
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );
    }
  };

  const fetchWeatherData = async () => {
    // Simulate weather data fetch - in real app, use weather API
    const mockWeather = {
      temperature: 28 + Math.random() * 8, // 28-36°C typical for Liberia
      humidity: 70 + Math.random() * 25,   // 70-95% humidity
      windSpeed: 5 + Math.random() * 10,   // 5-15 km/h
      conditions: ['Partly Cloudy', 'Sunny', 'Overcast', 'Light Rain'][Math.floor(Math.random() * 4)]
    };
    setWeatherData(mockWeather);
    setCurrentRecord(prev => ({
      ...prev,
      weather: mockWeather
    }));
  };

  const startFieldRecord = () => {
    if (!currentPosition) {
      alert('GPS position not available. Please wait for GPS lock.');
      return;
    }

    const newRecord: Partial<FieldRecord> = {
      id: `field-record-${Date.now()}`,
      timestamp: new Date(),
      position: currentPosition,
      farmerId,
      plotId,
      recordType: 'inspection',
      title: '',
      description: '',
      weather: weatherData,
      measurements: {},
      photos: [],
      tags: []
    };

    setCurrentRecord(newRecord);
    setIsRecording(true);
    
    console.log('Field recording started:', {
      position: `${currentPosition.latitude.toFixed(6)}, ${currentPosition.longitude.toFixed(6)}`,
      accuracy: `${currentPosition.accuracy.toFixed(1)}m`
    });
  };

  const saveFieldRecord = () => {
    if (!currentRecord.title?.trim()) {
      alert('Please enter a record title');
      return;
    }

    const completeRecord: FieldRecord = {
      ...currentRecord,
      id: currentRecord.id || `field-record-${Date.now()}`,
      timestamp: currentRecord.timestamp || new Date(),
      position: currentPosition,
      title: currentRecord.title || '',
      description: currentRecord.description || '',
      recordType: currentRecord.recordType || 'inspection'
    } as FieldRecord;

    onRecordSaved?.(completeRecord);
    
    // Reset form
    setIsRecording(false);
    setCurrentRecord({
      recordType: 'inspection',
      title: '',
      description: '',
      weather: weatherData,
      measurements: {},
      tags: []
    });
  };

  const cancelRecord = () => {
    setIsRecording(false);
    setCurrentRecord({
      recordType: 'inspection',
      title: '',
      description: '',
      weather: weatherData,
      measurements: {},
      tags: []
    });
  };

  const addTag = (tag: string) => {
    if (tag && !currentRecord.tags?.includes(tag)) {
      setCurrentRecord(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentRecord(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const commonTags = [
    'Good Condition', 'Needs Attention', 'Pest Issues', 'Disease Detected',
    'Irrigation Needed', 'Ready for Harvest', 'Newly Planted', 'Boundary Issue',
    'Compliance Check', 'Environmental Concern', 'Equipment Needed'
  ];

  return (
    <div className="space-y-6">
      {/* GPS Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            GPS Field Recorder Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPosition ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Latitude</Label>
                <p className="font-mono text-lg">{currentPosition.latitude.toFixed(6)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Longitude</Label>
                <p className="font-mono text-lg">{currentPosition.longitude.toFixed(6)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">GPS Accuracy</Label>
                <p className={`text-lg font-bold ${currentPosition.accuracy <= 5 ? 'text-green-600' : 'text-yellow-600'}`}>
                  ±{currentPosition.accuracy.toFixed(1)}m
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Status</Label>
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Waiting for GPS position... Please ensure location services are enabled.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Weather Information */}
      {weatherData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Current Weather Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <div>
                  <Label className="text-sm text-gray-600">Temperature</Label>
                  <p className="text-lg font-bold">{weatherData.temperature.toFixed(1)}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <Label className="text-sm text-gray-600">Humidity</Label>
                  <p className="text-lg font-bold">{weatherData.humidity.toFixed(0)}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <div>
                  <Label className="text-sm text-gray-600">Wind Speed</Label>
                  <p className="text-lg font-bold">{weatherData.windSpeed.toFixed(1)} km/h</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-gray-600" />
                <div>
                  <Label className="text-sm text-gray-600">Conditions</Label>
                  <p className="text-sm font-bold">{weatherData.conditions}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Field Record Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isRecording ? (
            <div className="text-center">
              <Button 
                onClick={startFieldRecord} 
                disabled={!currentPosition}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                <Recording className="mr-2 h-5 w-5" />
                Start Field Recording
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Start recording field observations with GPS coordinates
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <Recording className="h-5 w-5 animate-pulse" />
                <span className="font-medium">Recording in progress...</span>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date().toLocaleTimeString()}
                </Badge>
              </div>

              {/* Record Type Selection */}
              <div>
                <Label htmlFor="record-type">Record Type</Label>
                <Select 
                  value={currentRecord.recordType} 
                  onValueChange={(value) => setCurrentRecord(prev => ({ ...prev, recordType: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inspection">Farm Inspection</SelectItem>
                    <SelectItem value="boundary">Boundary Verification</SelectItem>
                    <SelectItem value="crop_condition">Crop Condition Assessment</SelectItem>
                    <SelectItem value="environmental">Environmental Monitoring</SelectItem>
                    <SelectItem value="compliance">Compliance Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title and Description */}
              <div>
                <Label htmlFor="record-title">Record Title *</Label>
                <Input
                  id="record-title"
                  value={currentRecord.title || ''}
                  onChange={(e) => setCurrentRecord(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Coffee plot boundary inspection"
                />
              </div>

              <div>
                <Label htmlFor="record-description">Description</Label>
                <Textarea
                  id="record-description"
                  value={currentRecord.description || ''}
                  onChange={(e) => setCurrentRecord(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed observations and notes..."
                  rows={3}
                />
              </div>

              {/* Measurements (if applicable) */}
              {(currentRecord.recordType === 'crop_condition' || currentRecord.recordType === 'inspection') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plot-size">Plot Size (hectares)</Label>
                    <Input
                      id="plot-size"
                      type="number"
                      step="0.1"
                      value={currentRecord.measurements?.plotSize || ''}
                      onChange={(e) => setCurrentRecord(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, plotSize: parseFloat(e.target.value) }
                      }))}
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crop-height">Crop Height (cm)</Label>
                    <Input
                      id="crop-height"
                      type="number"
                      value={currentRecord.measurements?.cropHeight || ''}
                      onChange={(e) => setCurrentRecord(prev => ({
                        ...prev,
                        measurements: { ...prev.measurements, cropHeight: parseFloat(e.target.value) }
                      }))}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentRecord.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addTag(tag)}
                      disabled={currentRecord.tags?.includes(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={saveFieldRecord} className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Record
                </Button>
                <Button onClick={cancelRecord} variant="outline">
                  <StopCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}