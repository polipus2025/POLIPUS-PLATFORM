import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Package, Leaf, DollarSign, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function InputManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: inputDistributions = [], isLoading } = useQuery({
    queryKey: ["/api/input-distributions"],
  });

  const { data: farmers = [] } = useQuery({
    queryKey: ["/api/farmers"],
  });

  const filteredDistributions = inputDistributions.filter((dist: any) =>
    dist.inputName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dist.inputType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dist.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = inputDistributions.reduce((sum: number, dist: any) => sum + parseFloat(dist.totalCost || 0), 0);
  const pendingPayments = inputDistributions.filter((d: any) => d.repaymentStatus === 'pending').length;
  const sustainableInputs = inputDistributions.filter((d: any) => d.sustainabilityRating === 'organic').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Input Management & Sustainable Distribution - AgriTrace360™</title>
        <meta name="description" content="Manage agricultural input distribution, track sustainability ratings, and monitor farmer repayments." />
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral">Input Management & Sustainable Distribution</h1>
            <p className="text-gray-600 mt-2">Track agricultural inputs and sustainable distribution programs</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lacra-green hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Record Distribution
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record Input Distribution</DialogTitle>
              </DialogHeader>
              <div className="p-4 text-center text-gray-600">
                <Package className="h-12 w-12 mx-auto mb-4 text-lacra-green" />
                <p>Input distribution form will be implemented here</p>
                <p className="text-sm mt-2">Seeds, fertilizers, tools, and sustainability tracking</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-lacra-blue" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-neutral">{inputDistributions.length}</div>
                  <p className="text-sm text-gray-500">Total Distributions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-success" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-success">${totalValue.toFixed(0)}</div>
                  <p className="text-sm text-gray-500">Total Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Leaf className="h-8 w-8 text-lacra-green" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-lacra-green">{sustainableInputs}</div>
                  <p className="text-sm text-gray-500">Sustainable Inputs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-warning" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-warning">{pendingPayments}</div>
                  <p className="text-sm text-gray-500">Pending Payments</p>
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
                  placeholder="Search by input name, type, or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Distributions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Input Distribution Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading input distributions...</div>
            ) : filteredDistributions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {inputDistributions.length === 0 ? "No input distributions recorded yet." : "No distributions match your search."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Farmer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Input Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Input Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Total Cost</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Supplier</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Sustainability</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDistributions.map((distribution: any) => {
                      const farmer = farmers.find((f: any) => f.id === distribution.farmerId);
                      return (
                        <tr key={distribution.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {farmer ? `${farmer.firstName} ${farmer.lastName}` : "Unknown"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">
                              {distribution.inputType.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-medium">{distribution.inputName}</td>
                          <td className="py-3 px-4">{distribution.quantityDistributed} {distribution.unit}</td>
                          <td className="py-3 px-4">${distribution.totalCost}</td>
                          <td className="py-3 px-4">{distribution.supplier}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={
                                distribution.sustainabilityRating === 'organic' ? "default" : 
                                distribution.sustainabilityRating === 'low_impact' ? "secondary" : "outline"
                              }
                            >
                              {distribution.sustainabilityRating?.replace('_', ' ').toUpperCase() || "N/A"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={
                                distribution.repaymentStatus === 'paid' ? "default" : 
                                distribution.repaymentStatus === 'partial' ? "secondary" : "destructive"
                              }
                            >
                              {distribution.repaymentStatus?.charAt(0).toUpperCase() + distribution.repaymentStatus?.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">
                              View Details
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