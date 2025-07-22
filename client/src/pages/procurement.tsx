import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, ShoppingCart, DollarSign, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ProcurementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: procurements = [], isLoading } = useQuery({
    queryKey: ["/api/procurements"],
  });

  const { data: farmers = [] } = useQuery({
    queryKey: ["/api/farmers"],
  });

  const filteredProcurements = procurements.filter((proc: any) =>
    proc.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proc.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proc.procurementId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = procurements.reduce((sum: number, proc: any) => sum + parseFloat(proc.totalAmount || 0), 0);
  const pendingSettlements = procurements.filter((p: any) => p.paymentStatus === 'pending').length;
  const completedProcurements = procurements.filter((p: any) => p.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Procurement & Transparent Settlements - AgriTrace360™</title>
        <meta name="description" content="Manage crop procurement, transparent pricing, and farmer settlements with full traceability and fair payment tracking." />
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral">Procurement & Transparent Settlements</h1>
            <p className="text-gray-600 mt-2">Manage crop procurement and transparent farmer settlements</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lacra-green hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Record Procurement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record New Procurement</DialogTitle>
              </DialogHeader>
              <div className="p-4 text-center text-gray-600">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-lacra-green" />
                <p>Procurement recording form will be implemented here</p>
                <p className="text-sm mt-2">Transparent pricing, quality assessment, and settlement tracking</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-lacra-blue" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-neutral">{procurements.length}</div>
                  <p className="text-sm text-gray-500">Total Procurements</p>
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
                <CheckCircle className="h-8 w-8 text-lacra-green" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-lacra-green">{completedProcurements}</div>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-warning" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-warning">{pendingSettlements}</div>
                  <p className="text-sm text-gray-500">Pending Settlements</p>
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
                  placeholder="Search by procurement ID, crop type, or buyer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Procurement Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Procurement & Settlement Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading procurement records...</div>
            ) : filteredProcurements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {procurements.length === 0 ? "No procurement records yet." : "No procurements match your search."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Procurement ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Farmer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Crop Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Price/Unit</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Total Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Buyer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProcurements.map((procurement: any) => {
                      const farmer = farmers.find((f: any) => f.id === procurement.farmerId);
                      return (
                        <tr key={procurement.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{procurement.procurementId}</td>
                          <td className="py-3 px-4">
                            {farmer ? `${farmer.firstName} ${farmer.lastName}` : "Unknown"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">
                              {procurement.cropType.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{procurement.quantityProcured} {procurement.unit}</td>
                          <td className="py-3 px-4">${procurement.pricePerUnit}</td>
                          <td className="py-3 px-4 font-medium">${procurement.totalAmount}</td>
                          <td className="py-3 px-4">{procurement.buyer}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={
                                procurement.paymentStatus === 'paid' ? "default" : 
                                procurement.paymentStatus === 'partial' ? "secondary" : "destructive"
                              }
                            >
                              {procurement.paymentStatus?.charAt(0).toUpperCase() + procurement.paymentStatus?.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={
                                procurement.status === 'completed' ? "default" : 
                                procurement.status === 'pending' ? "secondary" : "destructive"
                              }
                            >
                              {procurement.status?.charAt(0).toUpperCase() + procurement.status?.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">
                              View Settlement
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