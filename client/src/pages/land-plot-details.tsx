import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Globe, TreePine, Target, Users } from "lucide-react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function LandPlotDetails() {
  const { id } = useParams();

  // Get specific land plot details
  const { data: plot, isLoading } = useQuery({
    queryKey: [`/api/farm-plots/${id}`],
    retry: false
  });

  const plotData = plot as any;

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
                  <label className="text-sm font-medium text-gray-500">GPS Coordinates</label>
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {plotData.gpsCoordinates || plotData.coordinates || 'N/A'}
                  </p>
                </div>

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
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <Button className="w-full" variant="outline">
                    Edit Plot Details
                  </Button>
                  <Button className="w-full" variant="outline">
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}