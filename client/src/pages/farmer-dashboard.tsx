import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  Leaf, 
  MapPin, 
  TrendingUp, 
  Package, 
  Calendar,
  Users,
  Truck,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Plus
} from "lucide-react";
import { Link } from "wouter";

export default function FarmerDashboard() {
  // Get farmer ID from localStorage
  const farmerId = localStorage.getItem("farmerId") || "FRM-2024-001";
  const farmerName = localStorage.getItem("farmerFirstName") || "Moses";
  
  // Fetch farmer-specific data
  const { data: farmPlots } = useQuery({ queryKey: ["/api/farm-plots"] });
  const { data: cropPlans } = useQuery({ queryKey: ["/api/crop-plans"] });
  const { data: trackingRecords } = useQuery({ queryKey: ["/api/tracking-records"] });
  const { data: alerts } = useQuery({ queryKey: ["/api/alerts", "unreadOnly=true"] });

  // Calculate farmer statistics
  const totalPlots = farmPlots?.length || 0;
  const activeCropPlans = cropPlans?.filter((plan: any) => plan.status === 'active')?.length || 0;
  const totalHarvested = farmPlots?.reduce((sum: number, plot: any) => {
    return sum + (parseFloat(plot.harvestedQuantity?.replace(/[^\d.]/g, '') || '0'));
  }, 0) || 0;
  const pendingInspections = trackingRecords?.filter((record: any) => 
    record.status === 'pending_inspection'
  )?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {farmerName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Farmer ID: {farmerId} | Your farm management dashboard
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/crop-planning">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Plan New Crop
            </Button>
          </Link>
          <Link href="/batch-code-generator">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Generate Batch Code
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Farm Plots</p>
                <p className="text-3xl font-bold text-green-900">{totalPlots}</p>
                <p className="text-xs text-green-600 mt-1">Registered plots</p>
              </div>
              <MapPin className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Crop Plans</p>
                <p className="text-3xl font-bold text-blue-900">{activeCropPlans}</p>
                <p className="text-xs text-blue-600 mt-1">Current season</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Harvested</p>
                <p className="text-3xl font-bold text-orange-900">{totalHarvested.toFixed(1)}</p>
                <p className="text-xs text-orange-600 mt-1">Metric tons</p>
              </div>
              <Package className="h-12 w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Pending Inspections</p>
                <p className="text-3xl font-bold text-purple-900">{pendingInspections}</p>
                <p className="text-xs text-purple-600 mt-1">Awaiting review</p>
              </div>
              <Clock className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Farm Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Recent Farm Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Coffee Harvest Completed</p>
                  <p className="text-xs text-gray-600">Plot PLT-001 - 2.5 tons harvested</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Batch Code Generated</p>
                  <p className="text-xs text-gray-600">COF-2024-001 for coffee export</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Crop Planning Updated</p>
                  <p className="text-xs text-gray-600">Next season cocoa planning</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Farm Management Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/farm-plots">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                  <MapPin className="h-6 w-6 text-green-600" />
                  <span className="text-sm">View Farm Plots</span>
                </Button>
              </Link>

              <Link href="/gps-mapping">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <span className="text-sm">GPS Mapping</span>
                </Button>
              </Link>

              <Link href="/crop-planning">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                  <Calendar className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">Crop Planning</span>
                </Button>
              </Link>

              <Link href="/batch-code-generator">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                  <Package className="h-6 w-6 text-purple-600" />
                  <span className="text-sm">Batch Codes</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Farm Plot Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Your Farm Plots Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmPlots?.slice(0, 6).map((plot: any) => (
              <div key={plot.id} className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-green-900">{plot.plotName}</h4>
                  <Badge variant={plot.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {plot.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Size:</strong> {plot.plotSize}</p>
                  <p><strong>Crop:</strong> {plot.cropType}</p>
                  <p><strong>County:</strong> {plot.county}</p>
                  {plot.harvestedQuantity && (
                    <p><strong>Last Harvest:</strong> {plot.harvestedQuantity}</p>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href="/farm-plots">
                    <Button size="sm" variant="outline" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            )) || (
              <div className="col-span-full text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No farm plots registered yet</p>
                <Link href="/farm-plots">
                  <Button className="mt-3 bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Register Your First Plot
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      {alerts && alerts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Farm Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}