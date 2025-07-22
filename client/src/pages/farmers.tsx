import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Users, TrendingUp, MapPin, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function FarmersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: farmers = [], isLoading } = useQuery({
    queryKey: ["/api/farmers"],
  });

  const filteredFarmers = farmers.filter((farmer: any) =>
    farmer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.county.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCanidates = farmers.filter((f: any) => f.status === 'active').length;
  const signedAgreements = farmers.filter((f: any) => f.agreementSigned).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Farmer Management - AgriTrace360™</title>
        <meta name="description" content="Manage farmer onboarding, agreements, and profile information in the LACRA agricultural compliance system." />
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral">Farmer Management</h1>
            <p className="text-gray-600 mt-2">Manage farmer onboarding, agreements, and profile information</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lacra-green hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Onboard New Farmer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Farmer Onboarding</DialogTitle>
              </DialogHeader>
              <div className="p-4 text-center text-gray-600">
                <Users className="h-12 w-12 mx-auto mb-4 text-lacra-green" />
                <p>Farmer onboarding form will be implemented here</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-lacra-blue" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-neutral">{farmers.length}</div>
                  <p className="text-sm text-gray-500">Total Farmers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-success" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-success">{activeCanidates}</div>
                  <p className="text-sm text-gray-500">Active Farmers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-lacra-green" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-lacra-green">{signedAgreements}</div>
                  <p className="text-sm text-gray-500">Signed Agreements</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-warning" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-warning">
                    {new Set(farmers.map((f: any) => f.county)).size}
                  </div>
                  <p className="text-sm text-gray-500">Counties Covered</p>
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
                  placeholder="Search farmers by name, ID, or county..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farmers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading farmers...</div>
            ) : filteredFarmers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {farmers.length === 0 ? "No farmers registered yet." : "No farmers match your search."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Farmer ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">County</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Farm Size</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Agreement</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFarmers.map((farmer: any) => (
                      <tr key={farmer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">{farmer.farmerId}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{farmer.firstName} {farmer.lastName}</div>
                            {farmer.phoneNumber && (
                              <div className="text-sm text-gray-500">{farmer.phoneNumber}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{farmer.county}</td>
                        <td className="py-3 px-4">
                          {farmer.farmSize ? `${farmer.farmSize} ${farmer.farmSizeUnit}` : "Not specified"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={farmer.agreementSigned ? "default" : "secondary"}>
                            {farmer.agreementSigned ? "Signed" : "Pending"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={
                              farmer.status === 'active' ? "default" : 
                              farmer.status === 'inactive' ? "secondary" : "destructive"
                            }
                          >
                            {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
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