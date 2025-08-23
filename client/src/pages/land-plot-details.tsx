import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Globe, TreePine, Target, Users, Map, FileText, Eye, Download } from "lucide-react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function LandPlotDetails() {
  const { id } = useParams();
  const [showMap, setShowMap] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Get specific land plot details
  const { data: plot, isLoading } = useQuery({
    queryKey: [`/api/farm-plots/${id}`],
    retry: false
  });

  // Get farmer details to access boundary points
  const { data: farmerData } = useQuery({
    queryKey: [`/api/farmers/${plot?.farmerId}`],
    enabled: !!plot?.farmerId,
    retry: false
  });

  const plotData = plot as any;
  const boundaryPoints = (farmerData as any)?.farmBoundaries?.points || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      </div>
    );
  }

  if (!plotData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Land Plot Not Found</h3>
          <p className="text-gray-600 mb-4">The requested land plot could not be found.</p>
          <Link href="/land-plots-list">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Land Plots
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Link href="/land-plots-list">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Land Plots
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Land Plot Details</h1>
            <p className="text-gray-600">Detailed information for {plotData.plotName}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Plot Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Plot Name</label>
                    <p className="text-lg font-medium">{plotData.plotName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Plot ID</label>
                    <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{plotData.plotId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Farmer ID</label>
                    <p className="text-sm font-mono bg-blue-50 px-2 py-1 rounded text-blue-800">{plotData.farmerId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Farmer Name</label>
                    <p className="text-lg">{plotData.farmerName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Farmer</label>
                    <p className="text-lg">{plotData.farmerName || plotData.farmerId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Plot Size</label>
                    <p className="text-lg">
                      {plotData.plotSize || plotData.area ? `${plotData.plotSize || plotData.area} hectares` : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Crop Type</label>
                    <Badge variant="outline" className="capitalize">
                      {plotData.cropType?.replace('_', ' ') || plotData.primaryCrop?.replace('_', ' ') || 'N/A'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge className={plotData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {plotData.status || 'Unknown'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-600" />
                  Location & Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">County</label>
                    <p className="text-lg">{plotData.county || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">District</label>
                    <p className="text-lg">{plotData.district || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">GPS Coordinates (Primary)</label>
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {plotData.gpsCoordinates || plotData.coordinates || 'N/A'}
                  </p>
                </div>

                {boundaryPoints.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Boundary Coordinates ({boundaryPoints.length} points)</label>
                    <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 rounded p-3">
                      {boundaryPoints.map((point: any, index: number) => (
                        <div key={index} className="text-xs font-mono mb-1">
                          <span className="text-blue-600">Point {index + 1}:</span> {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Total boundary area: {(farmerData as any)?.farmBoundaries?.area?.toFixed(4)} hectares</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Soil Type</label>
                    <p className="text-lg capitalize">{plotData.soilType?.replace('_', ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Irrigation</label>
                    <p className="text-lg">{plotData.irrigationAccess ? 'Available' : 'None'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TreePine className="w-5 h-5 mr-2 text-green-600" />
                  Land Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Land Ownership</label>
                    <p className="text-lg capitalize">{plotData.landOwnership || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-lg">
                      {plotData.registrationDate ? new Date(plotData.registrationDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {plotData.landMapData && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Additional Data</label>
                    <div className="mt-2 p-3 bg-gray-50 rounded">
                      <pre className="text-xs">{JSON.stringify(plotData.landMapData, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="view" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="view">View</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="view" className="space-y-2 mt-4">
                    <Dialog open={showMap} onOpenChange={setShowMap}>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="outline">
                          <Map className="w-4 h-4 mr-2" />
                          Interactive Map View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Interactive Map - {plotData.plotName}</DialogTitle>
                        </DialogHeader>
                        <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
                          <div className="text-center">
                            <Map className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600">Interactive Map Loading...</p>
                            <p className="text-sm text-gray-500 mt-2">Boundary: {boundaryPoints.length} GPS points mapped</p>
                            {boundaryPoints.length > 0 && (
                              <div className="mt-3 text-xs bg-blue-50 p-2 rounded">
                                <strong>Coordinates:</strong><br/>
                                {boundaryPoints.slice(0, 3).map((point: any, i: number) => (
                                  <div key={i}>{point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}</div>
                                ))}
                                {boundaryPoints.length > 3 && <div>... and {boundaryPoints.length - 3} more points</div>}
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button className="w-full" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Satellite View
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="edit" className="space-y-2 mt-4">
                    <Button className="w-full" variant="outline">
                      <TreePine className="w-4 h-4 mr-2" />
                      Edit Plot Details
                    </Button>
                    <Button className="w-full" variant="outline">
                      <MapPin className="w-4 h-4 mr-2" />
                      Update GPS Boundaries
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="reports" className="space-y-2 mt-4">
                    <Dialog open={showReport} onOpenChange={setShowReport}>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Compliance Report
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>EUDR Compliance Report - {plotData.plotName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {(farmerData as any)?.complianceReports ? (
                            <div className="space-y-3">
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <h4 className="font-semibold text-green-800 mb-2">EUDR Compliance Status</h4>
                                <p><strong>Risk Level:</strong> <span className="capitalize">{(farmerData as any).complianceReports.eudrCompliance.riskLevel}</span></p>
                                <p><strong>Compliance Score:</strong> {(farmerData as any).complianceReports.eudrCompliance.complianceScore}/100</p>
                                <p><strong>Last Forest Date:</strong> {(farmerData as any).complianceReports.eudrCompliance.lastForestDate}</p>
                                <p><strong>Deforestation Risk:</strong> {(farmerData as any).complianceReports.eudrCompliance.deforestationRisk}%</p>
                              </div>
                              
                              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {(farmerData as any).complianceReports.eudrCompliance.recommendations.map((rec: string, i: number) => (
                                    <li key={i}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                <h4 className="font-semibold text-yellow-800 mb-2">Required Documentation</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {(farmerData as any).complianceReports.eudrCompliance.documentationRequired.map((doc: string, i: number) => (
                                    <li key={i}>{doc}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                              <p className="text-gray-600">No compliance data available</p>
                            </div>
                          )}
                          
                          <Button className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF Report
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button className="w-full" variant="outline">
                      <Target className="w-4 h-4 mr-2" />
                      Inspection Report
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}