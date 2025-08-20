import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, Users, MapPin, Phone, Mail, Plus } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function FarmersList() {
  const [searchTerm, setSearchTerm] = useState("");

  // Get farmers list
  const { data: farmers, isLoading } = useQuery({
    queryKey: ["/api/farmers"],
    retry: false
  });

  const farmersList = (farmers as any[]) || [];
  const filteredFarmers = farmersList.filter(farmer => 
    `${farmer.firstName} ${farmer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.county?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.primaryCrop?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl font-bold text-gray-900">All Farmers</h1>
            <p className="text-gray-600">View and manage registered farmers</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search farmers by name, county, or crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Badge variant="secondary">
              {filteredFarmers.length} farmers found
            </Badge>
          </div>
          <Link href="/onboard-farmer">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Onboard New Farmer
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Registered Farmers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
          ) : filteredFarmers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Farmers Found</h3>
              <p className="text-gray-600">Start by onboarding your first farmer</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Primary Crop</TableHead>
                  <TableHead>Farm Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarmers.map((farmer: any) => (
                  <TableRow key={farmer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{farmer.firstName} {farmer.lastName}</div>
                        <div className="text-sm text-gray-500">ID: {farmer.farmerId || farmer.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {farmer.phone}
                        </div>
                        {farmer.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {farmer.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        <span className="text-sm">{farmer.county}</span>
                      </div>
                      {farmer.district && (
                        <div className="text-xs text-gray-500">{farmer.district}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {farmer.primaryCrop?.replace('_', ' ') || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{farmer.farmSize ? `${farmer.farmSize} ha` : 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={farmer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {farmer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
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