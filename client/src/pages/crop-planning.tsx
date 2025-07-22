import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Calendar, Sprout, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function CropPlanningPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: cropPlans = [], isLoading } = useQuery({
    queryKey: ["/api/crop-plans"],
  });

  const { data: farmers = [] } = useQuery({
    queryKey: ["/api/farmers"],
  });

  const currentYear = new Date().getFullYear();
  const filteredPlans = cropPlans.filter((plan: any) =>
    plan.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.season.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePlans = cropPlans.filter((p: any) => p.status === 'planned').length;
  const totalTargetYield = cropPlans.reduce((sum: number, plan: any) => sum + parseFloat(plan.targetYield || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Crop Planning & Harvest Management - AgriTrace360™</title>
        <meta name="description" content="Plan crop seasons, manage planting schedules, and track harvest expectations for optimal agricultural productivity." />
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral">Crop Planning & Harvest Management</h1>
            <p className="text-gray-600 mt-2">Plan crop seasons and manage harvest schedules</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lacra-green hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Crop Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Crop Planning Schedule</DialogTitle>
              </DialogHeader>
              <div className="p-4 text-center text-gray-600">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-lacra-green" />
                <p>Crop planning form will be implemented here</p>
                <p className="text-sm mt-2">Season planning, planting dates, and yield targets</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-lacra-blue" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-neutral">{cropPlans.length}</div>
                  <p className="text-sm text-gray-500">Total Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Sprout className="h-8 w-8 text-success" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-success">{activePlans}</div>
                  <p className="text-sm text-gray-500">Active Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-lacra-green" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-lacra-green">{totalTargetYield.toFixed(0)}</div>
                  <p className="text-sm text-gray-500">Target Yield (kg)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-warning" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-warning">{currentYear}</div>
                  <p className="text-sm text-gray-500">Current Season</p>
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
                  placeholder="Search by crop type or season..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crop Plans Table */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Planning Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading crop plans...</div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {cropPlans.length === 0 ? "No crop plans created yet." : "No plans match your search."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Farmer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Crop Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Season</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Year</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Planned Area</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Target Yield</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Planting Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlans.map((plan: any) => {
                      const farmer = farmers.find((f: any) => f.id === plan.farmerId);
                      return (
                        <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {farmer ? `${farmer.firstName} ${farmer.lastName}` : "Unknown"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">
                              {plan.cropType.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 capitalize">{plan.season}</td>
                          <td className="py-3 px-4">{plan.year}</td>
                          <td className="py-3 px-4">{plan.plannedArea} hectares</td>
                          <td className="py-3 px-4">{plan.targetYield} {plan.yieldUnit}</td>
                          <td className="py-3 px-4">
                            {plan.plantingStartDate ? 
                              new Date(plan.plantingStartDate).toLocaleDateString() : 
                              "Not set"
                            }
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={
                                plan.status === 'planned' ? "default" : 
                                plan.status === 'planted' ? "secondary" : "outline"
                              }
                            >
                              {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">
                              Edit Plan
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