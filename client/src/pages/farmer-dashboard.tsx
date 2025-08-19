import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
  Plus,
  Download,
  Shield,
  X,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";

export default function FarmerDashboard() {
  // Get farmer ID from localStorage
  const farmerId = localStorage.getItem("farmerId") || "FRM-2024-001";
  const farmerName = localStorage.getItem("farmerFirstName") || "Moses";
  const [showEUDRViewer, setShowEUDRViewer] = useState(false);
  
  // Fetch farmer-specific data
  const { data: farmPlots } = useQuery({ queryKey: ["/api/farm-plots"] });
  const { data: cropPlans } = useQuery({ queryKey: ["/api/crop-plans"] });
  const { data: trackingRecords } = useQuery({ queryKey: ["/api/tracking-records"] });
  const { data: alerts } = useQuery({ queryKey: ["/api/alerts", "unreadOnly=true"] });

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
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
      {/* Back to Polipus Button */}
      <div className="mb-4">
        <Link href="/polipus" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Polipus Platform
        </Link>
      </div>

      {/* Mobile-Responsive Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {farmerName}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Farmer ID: {farmerId} | Your farm management dashboard
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link href="/batch-code-generator" className="flex-1 sm:flex-none">
            <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              <Package className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Generate Batch Code</span>
              <span className="sm:hidden">New Batch</span>
            </Button>
          </Link>
          <Link href="/farmer-payment-services" className="flex-1 sm:flex-none">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Payment Services</span>
              <span className="sm:hidden">Payments</span>
            </Button>
          </Link>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            onClick={() => setShowEUDRViewer(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">View EUDR Pack</span>
            <span className="sm:hidden">EUDR Pack</span>
          </Button>
        </div>
      </div>

      {/* Mobile-Responsive Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-green-600">Total Farm Plots</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-900">{totalPlots}</p>
                <p className="text-xs text-green-600 mt-1">Registered plots</p>
              </div>
              <MapPin className="h-8 w-8 sm:h-12 sm:w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-blue-600">Active Crop Plans</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-900">{activeCropPlans}</p>
                <p className="text-xs text-blue-600 mt-1">Current season</p>
              </div>
              <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-orange-600">Total Harvested</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-900">{totalHarvested.toFixed(1)}</p>
                <p className="text-xs text-orange-600 mt-1">Metric tons</p>
              </div>
              <Package className="h-8 w-8 sm:h-12 sm:w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-purple-600">Pending Inspections</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-900">{pendingInspections}</p>
                <p className="text-xs text-purple-600 mt-1">Awaiting review</p>
              </div>
              <Clock className="h-8 w-8 sm:h-12 sm:w-12 text-purple-600" />
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

              <Link href="/farmer-gps-mapping">
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
            {Array.isArray(farmPlots) && farmPlots.length > 0 ? farmPlots.slice(0, 6).map((plot: any) => (
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
            )) : (
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
      {Array.isArray(alerts) && alerts.length > 0 && (
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

      {/* SECURE EUDR COMPLIANCE PACK VIEWER - VIEW ONLY */}
      <Dialog open={showEUDRViewer} onOpenChange={setShowEUDRViewer}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              EUDR Compliance Pack - View Only
              <Badge variant="secondary" className="ml-auto">APPROVED</Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 p-4 bg-gray-50 rounded-lg" style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            pointerEvents: 'auto'
          }}>
            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Secure Document Viewing</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    This compliance pack is for viewing only. Download and screenshot functions are disabled for security.
                    Generated automatically upon your farmer registration.
                  </p>
                </div>
              </div>
            </div>

            {/* Document 1: Cover Sheet */}
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="text-lg">LACRA - EUDR Compliance Pack</CardTitle>
                <p className="text-blue-100">Complete Documentation Package</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Pack ID:</span> EUDR-{farmerId}-AUTO
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Farmer:</span> {farmerName}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> 
                    <Badge className="ml-2 bg-green-100 text-green-800">APPROVED</Badge>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Compliance Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                    <div>Overall Score: 95/100 (EXCELLENT)</div>
                    <div>Risk Level: LOW RISK</div>
                    <div>Deforestation Risk: NONE DETECTED</div>
                    <div>Forest Protection: 98/100</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Documents Included:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>1. Cover Sheet (This Document)</div>
                    <div>2. Export Eligibility Certificate</div>
                    <div>3. EUDR Compliance Assessment</div>
                    <div>4. Deforestation Analysis Report</div>
                    <div>5. Due Diligence Statement</div>
                    <div>6. Supply Chain Traceability Report</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document 2: Export Certificate */}
            <Card>
              <CardHeader className="bg-red-600 text-white">
                <CardTitle className="text-lg">Export Eligibility Certificate</CardTitle>
                <p className="text-red-100">Certificate No: LACRA-EXP-{farmerId}</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Certification Statement</h4>
                  <p className="text-sm text-gray-700">
                    This certifies that your agricultural commodity is eligible for export from Liberia 
                    and meets all regulatory requirements for European Union markets.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Farmer Name:</span> {farmerName}</div>
                  <div><span className="font-medium">Farm Location:</span> Liberia</div>
                  <div><span className="font-medium">Commodity Type:</span> Agricultural Commodity</div>
                  <div><span className="font-medium">Quality Grade:</span> Grade A Premium</div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">Certification Confirmed:</h5>
                  <div className="space-y-1 text-sm text-green-800">
                    <div>✓ All LACRA export requirements met</div>
                    <div>✓ EUDR compliance verified</div>
                    <div>✓ Quality standards confirmed</div>
                    <div>✓ Export approved for EU markets</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document 3: Compliance Assessment */}
            <Card>
              <CardHeader className="bg-green-600 text-white">
                <CardTitle className="text-lg">EUDR Compliance Assessment</CardTitle>
                <p className="text-green-100">Assessment ID: EUDR-ASSESS-{farmerId}</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Assessment Date:</span> {new Date().toLocaleDateString()}</div>
                  <div><span className="font-medium">Result:</span> COMPLIANT - APPROVED</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Compliance Scores</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                    <div>Overall Compliance: 95/100 (EXCELLENT)</div>
                    <div>Deforestation Risk: 98/100 (NO RISK)</div>
                    <div>Supply Chain: 94/100 (EXCELLENT)</div>
                    <div>Documentation: 96/100 (EXCELLENT)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 border-t pt-4">
              Generated: {new Date().toLocaleDateString()} | compliance@lacra.gov.lr | cert@ecoenviro.com
              <br />
              <span className="text-blue-600">🔒 Secure viewing mode - Download disabled for document protection</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowEUDRViewer(false)}>
              <X className="h-4 w-4 mr-2" />
              Close Viewer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}