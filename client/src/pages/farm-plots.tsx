import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Map, 
  MapPin, 
  BarChart3, 
  Calendar,
  AlertCircle,
  Leaf
} from 'lucide-react';

export default function FarmPlots() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sample data
  const farmPlots = [
    {
      id: 1,
      plotName: "North Field - Cocoa Grove",
      farmerId: "FMR-001",
      farmerName: "John Kollie",
      cropType: "Cocoa",
      plotSize: 2.5,
      soilType: "Forest soil",
      plantingDate: "2024-01-15",
      gpsCoordinates: { lat: 8.0050, lng: -9.5200 },
      status: "Active"
    },
    {
      id: 2,
      plotName: "South Field - Coffee Grove",
      farmerId: "FMR-002", 
      farmerName: "Mary Pewee",
      cropType: "Coffee",
      plotSize: 1.8,
      soilType: "Volcanic soil",
      plantingDate: "2024-02-10",
      gpsCoordinates: { lat: 8.0100, lng: -9.5150 },
      status: "Active"
    }
  ];

  const farmers = [
    { id: 1, farmerId: "FMR-001", firstName: "John", lastName: "Kollie" },
    { id: 2, farmerId: "FMR-002", firstName: "Mary", lastName: "Pewee" }
  ];

  const totalArea = farmPlots.reduce((sum, plot) => sum + plot.plotSize, 0);
  const cropTypes = new Set(farmPlots.map((p) => p.cropType)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Farm Plot Mapping - AgriTrace360™</title>
        <meta name="description" content="Digital farm plot mapping and management for agricultural land tracking and crop planning." />
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral">Farm Plot Mapping</h1>
            <p className="text-gray-600 mt-2">Digital mapping and management of agricultural land plots</p>
          </div>
          {/* Map New Plot functionality removed - Only Land Inspectors can map new plots */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center text-blue-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p className="text-sm font-medium">
                New plot mapping is handled by Land Inspectors through the official land mapping system.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Map className="h-8 w-8 text-lacra-blue" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-neutral">{farmPlots.length}</div>
                  <p className="text-sm text-gray-500">Total Plots</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-success" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-success">{totalArea.toFixed(1)}</div>
                  <p className="text-sm text-gray-500">Total Hectares</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Leaf className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-green-600">{cropTypes}</div>
                  <p className="text-sm text-gray-500">Crop Types</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <p className="text-sm text-gray-500">EUDR Compliance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farm Plots Table */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Mapped Farm Plots</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-medium text-gray-700">Plot Name</th>
                    <th className="text-left p-4 font-medium text-gray-700">Crop Type</th>
                    <th className="text-left p-4 font-medium text-gray-700">Size (ha)</th>
                    <th className="text-left p-4 font-medium text-gray-700">Soil Type</th>
                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {farmPlots.map((plot) => (
                    <tr key={plot.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{plot.plotName}</p>
                          <p className="text-sm text-gray-500">GPS: {plot.gpsCoordinates.lat}, {plot.gpsCoordinates.lng}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-900">{plot.cropType}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-900">{plot.plotSize}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-600">{plot.soilType}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {plot.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MapPin className="h-4 w-4 mr-1" />
                            View Map
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}