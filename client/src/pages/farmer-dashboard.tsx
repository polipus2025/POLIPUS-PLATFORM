import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import ModernBackground from "@/components/ui/modern-background";
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
  const { data: farmPlots = [] } = useQuery({ queryKey: ["/api/farm-plots"] });
  const { data: cropPlans = [] } = useQuery({ queryKey: ["/api/crop-plans"] });
  const { data: trackingRecords = [] } = useQuery({ queryKey: ["/api/tracking-records"] });
  const { data: alerts = [] } = useQuery({ queryKey: ["/api/alerts", "unreadOnly=true"] });

  // Calculate farmer statistics
  const totalPlots = Array.isArray(farmPlots) ? farmPlots.length : 0;
  const activeCropPlans = Array.isArray(cropPlans) ? cropPlans.filter((plan: any) => plan.status === 'active').length : 0;
  const totalHarvested = Array.isArray(farmPlots) ? farmPlots.reduce((sum: number, plot: any) => {
    return sum + (parseFloat(plot.harvestedQuantity?.replace(/[^\d.]/g, '') || '0'));
  }, 0) : 0;
  const pendingInspections = Array.isArray(trackingRecords) ? trackingRecords.filter((record: any) => 
    record.status === 'pending_inspection'
  ).length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <ModernBackground>{null}</ModernBackground>
      <div className="relative space-y-6 p-6">
        {/* Header - ISMS Style */}
        <div className="isms-card">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl isms-icon-bg-green flex items-center justify-center">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Welcome back, {farmerName}!
                </h1>
                <p className="text-slate-600 mt-1">
                  Farmer ID: {farmerId} | Your farm management dashboard
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/batch-code-generator">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">
                  <Package className="h-4 w-4 mr-2" />
                  Generate Batch Code
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards - ISMS Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="isms-card text-center">
            <div className="w-16 h-16 rounded-xl isms-icon-bg-green flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">Total Farm</p>
            <p className="text-4xl font-bold text-slate-900 mb-2">{totalPlots}</p>
            <p className="text-slate-600 text-sm">Registered Plots</p>
          </div>

          <div className="isms-card text-center">
            <div className="w-16 h-16 rounded-xl isms-icon-bg-blue flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">Active Crop</p>
            <p className="text-4xl font-bold text-slate-900 mb-2">{activeCropPlans}</p>
            <p className="text-slate-600 text-sm">Planning Sessions</p>
          </div>

          <div className="isms-card text-center">
            <div className="w-16 h-16 rounded-xl isms-icon-bg-orange flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">Total Harvested</p>
            <p className="text-4xl font-bold text-slate-900 mb-2">{totalHarvested.toFixed(1)}</p>
            <p className="text-slate-600 text-sm">Metric Tons</p>
          </div>

          <div className="isms-card text-center">
            <div className="w-16 h-16 rounded-xl isms-icon-bg-purple flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">Pending</p>
            <p className="text-4xl font-bold text-slate-900 mb-2">{pendingInspections}</p>
            <p className="text-slate-600 text-sm">Inspections</p>
          </div>
        </div>

        {/* Recent Activities and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Farm Activities - ISMS Style */}
          <div className="isms-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Farm Activities</h2>
                <p className="text-slate-600 text-sm">Latest updates from your farm operations</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Coffee Harvest Completed</p>
                  <p className="text-xs text-slate-600">Plot PLT-001 - 2.5 tons harvested</p>
                  <p className="text-xs text-slate-500">2 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Batch Code Generated</p>
                  <p className="text-xs text-slate-600">COF-2024-001 for coffee export</p>
                  <p className="text-xs text-slate-500">3 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Crop Planning Updated</p>
                  <p className="text-xs text-slate-600">Next season cocoa planning</p>
                  <p className="text-xs text-slate-500">1 week ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - ISMS Style */}
          <div className="isms-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Farm Management Tools</h2>
                <p className="text-slate-600 text-sm">Access key farming features and tools</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Link href="/farm-plots">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg isms-icon-bg-green flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">View Farm Plots</p>
                </div>
              </Link>

              <Link href="/gps-mapping">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg isms-icon-bg-blue flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">GPS Mapping</p>
                </div>
              </Link>

              <Link href="/crop-planning">
                <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg isms-icon-bg-orange flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Crop Planning</p>
                </div>
              </Link>

              <Link href="/batch-code-generator">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg isms-icon-bg-purple flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Batch Codes</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Farm Plot Overview - ISMS Style */}
        <div className="isms-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Farm Plots Overview</h2>
              <p className="text-slate-600 text-sm">Comprehensive view of all registered farm plots</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(farmPlots) && farmPlots.length > 0 ? farmPlots.slice(0, 6).map((plot: any) => (
              <div key={plot.id} className="border border-slate-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-slate-900">{plot.plotName}</h4>
                  <Badge variant={plot.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {plot.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><strong className="text-slate-900">Size:</strong> {plot.plotSize}</p>
                  <p><strong className="text-slate-900">Crop:</strong> {plot.cropType}</p>
                  <p><strong className="text-slate-900">County:</strong> {plot.county}</p>
                  {plot.harvestedQuantity && (
                    <p><strong className="text-slate-900">Last Harvest:</strong> {plot.harvestedQuantity}</p>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href="/farm-plots">
                    <Button size="sm" variant="outline" className="text-xs hover:bg-green-50">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 rounded-xl isms-icon-bg-slate flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <p className="text-slate-600 mb-4">No farm plots registered yet</p>
                <Link href="/farm-plots">
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Register Your First Plot
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* System Alerts - ISMS Style */}
        {Array.isArray(alerts) && alerts.length > 0 && (
          <div className="isms-card border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Farm Alerts & Notifications</h2>
                <p className="text-slate-600 text-sm">Important updates requiring your attention</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-orange-100 shadow-sm">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-600">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}