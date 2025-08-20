import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, MapPin, Globe, Plus, TreePine } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function LandPlotsList() {
  const [searchTerm, setSearchTerm] = useState("");

  // Get land plots list
  const { data: landPlots, isLoading } = useQuery({
    queryKey: ["/api/land-plots"],
    retry: false
  });

  const landPlotsList = (landPlots as any[]) || [];
  const filteredPlots = landPlotsList.filter(plot => 
    plot.plotName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plot.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plot.plotType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Link href="/unified-land-inspector-dashboard">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Land Plots</h1>
            <p className="text-gray-600">View and manage mapped land plots</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search plots by name, farmer, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Badge variant="secondary">
              {filteredPlots.length} plots found
            </Badge>
          </div>
          <Link href="/create-land-plot">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Land Plot
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Mapped Land Plots
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
          ) : filteredPlots.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Land Plots Found</h3>
              <p className="text-gray-600">Start by creating your first land plot mapping</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plot Name</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Plot Type</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Land Use</TableHead>
                  <TableHead>EUDR Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlots.map((plot: any) => (
                  <TableRow key={plot.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{plot.plotName}</div>
                        <div className="text-sm text-gray-500">ID: {plot.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{plot.farmerName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {plot.plotType?.replace('_', ' ') || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        <span className="text-sm">{plot.totalAreaHectares ? `${plot.totalAreaHectares} ha` : 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {plot.landUse?.replace('_', ' ') || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TreePine className="w-3 h-3 mr-1 text-green-500" />
                        <Badge className={plot.complianceStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {plot.complianceStatus === 'approved' ? 'EUDR Compliant' : 'Under Review'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}