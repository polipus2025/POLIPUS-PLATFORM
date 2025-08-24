import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Map, Crop, TreePine, BarChart3, Eye, Edit, MapPin, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { farmPlots, farmers } from "@shared/schema";

type FarmPlot = typeof farmPlots.$inferSelect;
type Farmer = typeof farmers.$inferSelect;

export default function FarmPlotsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<FarmPlot | null>(null);
  const [isViewMapOpen, setIsViewMapOpen] = useState(false);

  const { data: farmPlots = [], isLoading } = useQuery<FarmPlot[]>({
    queryKey: ["/api/farm-plots"],
  });

  const { data: farmers = [] } = useQuery<Farmer[]>({
    queryKey: ["/api/farmers"],
  });

  const filteredPlots = farmPlots.filter((plot) =>
    plot.plotName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plot.plotId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plot.cropType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalArea = farmPlots.reduce((sum, plot) => sum + parseFloat(plot.plotSize || "0"), 0);
  const activePlots = farmPlots.filter((p) => p.status === 'active').length;
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

        {/* Plot Management Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Existing Farm Plots</h2>
              <p className="text-sm text-gray-600 mt-1">View and manage your mapped farm plots</p>
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
                <TreePine className="h-8 w-8 text-lacra-green" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-lacra-green">{activePlots}</div>
                  <p className="text-sm text-gray-500">Active Plots</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Crop className="h-8 w-8 text-warning" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-warning">{cropTypes}</div>
                  <p className="text-sm text-gray-500">Crop Types</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search plots by name, ID, or crop type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm Plots Table */}
        <Card>
          <CardHeader>
            <CardTitle>Mapped Farm Plots</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading farm plots...</div>
            ) : filteredPlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {farmPlots.length === 0 ? "No farm plots mapped yet." : "No plots match your search."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Plot ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Plot Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Farmer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Crop Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Plot Size</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Soil Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlots.map((plot: any) => {
                      const farmer = farmers.find((f: any) => f.id === plot.farmerId);
                      return (
                        <tr key={plot.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{plot.plotId}</td>
                          <td className="py-3 px-4 font-medium">{plot.plotName}</td>
                          <td className="py-3 px-4">
                            {farmer ? `${farmer.firstName} ${farmer.lastName}` : "Unknown"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">
                              {plot.cropType ? plot.cropType.replace('_', ' ').toUpperCase() : 'Unknown'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{plot.plotSize} {plot.plotSizeUnit}</td>
                          <td className="py-3 px-4">{plot.soilType || "Not specified"}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={
                                plot.status === 'active' ? "default" : 
                                plot.status === 'fallow' ? "secondary" : "destructive"
                              }
                            >
                              {plot.status ? plot.status.charAt(0).toUpperCase() + plot.status.slice(1) : 'Unknown'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedPlot(plot);
                                setIsViewMapOpen(true);
                              }}
                            >
                              <Map className="h-4 w-4 mr-1" />
                              View Map
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Map Dialog */}
        <Dialog open={isViewMapOpen} onOpenChange={setIsViewMapOpen}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>
                {selectedPlot ? `${selectedPlot.plotName} - GPS Map View` : 'Plot Map View'}
              </DialogTitle>
              <DialogDescription>
                Interactive map showing plot boundaries and GPS coordinates
              </DialogDescription>
            </DialogHeader>
            {selectedPlot && (
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Map Area */}
                <div className="lg:col-span-2 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Interactive Map</h3>
                    <p className="text-gray-500 mb-4">GPS boundary visualization would appear here</p>
                    {selectedPlot.gpsCoordinates && (
                      <div className="bg-white p-4 rounded border text-left">
                        <h4 className="font-medium mb-2">GPS Boundary Points:</h4>
                        <code className="text-xs text-gray-600 block whitespace-pre">
                          {JSON.stringify(JSON.parse(selectedPlot.gpsCoordinates), null, 2)}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Plot Information */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Plot Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Plot ID</label>
                        <p className="font-mono text-sm">{selectedPlot.plotId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Plot Name</label>
                        <p>{selectedPlot.plotName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Farmer</label>
                        <p>{(() => {
                          const farmer = farmers.find(f => f.id === selectedPlot.farmerId);
                          return farmer ? `${farmer.firstName} ${farmer.lastName}` : "Unknown";
                        })()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Crop Type</label>
                        <Badge variant="outline" className="mt-1">
                          {selectedPlot.cropType}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Plot Size</label>
                        <p>{selectedPlot.plotSize} {selectedPlot.plotSizeUnit}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Soil Type</label>
                        <p>{selectedPlot.soilType || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <Badge 
                          variant={
                            selectedPlot.status === 'active' ? "default" : 
                            selectedPlot.status === 'fallow' ? "secondary" : "destructive"
                          }
                          className="mt-1"
                        >
                          {selectedPlot.status ? selectedPlot.status.charAt(0).toUpperCase() + selectedPlot.status.slice(1) : 'Unknown'}
                        </Badge>
                      </div>
                      {selectedPlot.plantingDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Planting Date</label>
                          <p>{new Date(selectedPlot.plantingDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {selectedPlot.expectedHarvestDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Expected Harvest</label>
                          <p>{new Date(selectedPlot.expectedHarvestDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Plot
                    </Button>
                    <Button variant="outline" onClick={() => setIsViewMapOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}