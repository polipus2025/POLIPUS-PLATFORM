import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Map, Crop, TreePine, BarChart3, Eye, Edit, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FarmPlot, Farmer } from "@shared/schema";

export default function FarmPlotsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lacra-green hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Map New Plot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Digital Farm Plot Mapping</DialogTitle>
                <DialogDescription>
                  Create a new farm plot with GPS coordinates and boundary mapping
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plot Name</label>
                    <Input placeholder="e.g., North Field - Cocoa Grove" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Farmer</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Select farmer...</option>
                      {farmers.map((farmer) => (
                        <option key={farmer.id} value={farmer.id}>
                          {farmer.firstName} {farmer.lastName} ({farmer.farmerId})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Select crop...</option>
                      <option value="Cocoa">Cocoa</option>
                      <option value="Coffee">Coffee</option>
                      <option value="Palm Oil">Palm Oil</option>
                      <option value="Rubber">Rubber</option>
                      <option value="Rice">Rice</option>
                      <option value="Cassava">Cassava</option>
                      <option value="Kola Nut">Kola Nut</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plot Size (hectares)</label>
                    <Input type="number" step="0.1" placeholder="e.g., 2.5" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GPS Coordinates</label>
                    <div className="space-y-2">
                      <Input placeholder="Latitude (e.g., 8.0050)" />
                      <Input placeholder="Longitude (e.g., -9.5200)" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Select soil type...</option>
                      <option value="Forest soil">Forest soil</option>
                      <option value="Volcanic soil">Volcanic soil</option>
                      <option value="Lateritic soil">Lateritic soil</option>
                      <option value="Alluvial soil">Alluvial soil</option>
                      <option value="Sandy soil">Sandy soil</option>
                      <option value="Clay soil">Clay soil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Planting Date</label>
                    <Input type="date" />
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button className="flex-1 bg-lacra-green hover:bg-green-700">
                      <MapPin className="h-4 w-4 mr-2" />
                      Save Plot
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                              {plot.cropType.replace('_', ' ').toUpperCase()}
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
                              {plot.status.charAt(0).toUpperCase() + plot.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">
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
      </div>
    </div>
  );
}