import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
  Plus
} from "lucide-react";
import { Link } from "wouter";

export default function FarmerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get farmer ID from localStorage
  const farmerId = localStorage.getItem("farmerId") || "FRM-2024-001";
  const farmerName = localStorage.getItem("farmerFirstName") || "Moses";
  const farmerCounty = localStorage.getItem("farmerCounty") || "Monrovia";
  
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

  // Handle product offer submission
  const handleSubmitOffer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const offerData = {
      farmerId: farmerId.replace('FRM-', ''),
      commodityType: formData.get('commodityType'),
      quantityAvailable: formData.get('quantityAvailable'),
      unit: formData.get('unit'),
      pricePerUnit: formData.get('pricePerUnit'),
      qualityGrade: formData.get('qualityGrade'),
      harvestDate: formData.get('harvestDate'),
      paymentTerms: formData.get('paymentTerms'),
      deliveryTerms: formData.get('deliveryTerms'),
      description: formData.get('description'),
      farmLocation: `${farmerName}'s Farm, ${farmerCounty} County`,
      farmerName: farmerName,
      farmerCounty: farmerCounty
    };

    try {
      const response = await apiRequest('/api/farmer/submit-product-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData),
      });

      toast({
        title: "Product Offer Submitted Successfully!",
        description: `${response.notificationsSent} buyers in ${farmerCounty} County have been notified. Buyers notified: ${response.buyersNotified.join(', ')}`
      });

      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit product offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Product Offer Submission Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Submit Product Offer to Buyers
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Submit your product offer and automatically notify all buyers in your county. First buyer to accept wins!
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmitOffer}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commodity Type <span className="text-red-500">*</span>
                </label>
                <select 
                  name="commodityType"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                  data-testid="select-commodity"
                >
                  <option value="">Select commodity...</option>
                  <option value="Cocoa">Cocoa</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Palm Oil">Palm Oil</option>
                  <option value="Rubber">Rubber</option>
                  <option value="Cassava">Cassava</option>
                  <option value="Coconut Oil">Coconut Oil</option>
                  <option value="Tobacco">Tobacco</option>
                  <option value="Robusta Coffee">Robusta Coffee</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Available <span className="text-red-500">*</span>
                </label>
                <input
                  name="quantityAvailable"
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter quantity"
                  required
                  data-testid="input-quantity"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select 
                  name="unit"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                  data-testid="select-unit"
                >
                  <option value="">Select unit...</option>
                  <option value="tons">Tons</option>
                  <option value="kg">Kilograms</option>
                  <option value="bags">Bags</option>
                  <option value="lbs">Pounds</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Unit (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  name="pricePerUnit"
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="0.00"
                  required
                  data-testid="input-price"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Grade <span className="text-red-500">*</span>
                </label>
                <select 
                  name="qualityGrade"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                  data-testid="select-quality"
                >
                  <option value="">Select quality...</option>
                  <option value="Grade A">Grade A (Premium)</option>
                  <option value="Grade B">Grade B (Standard)</option>
                  <option value="Grade C">Grade C (Commercial)</option>
                  <option value="Organic">Organic Certified</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harvest Date <span className="text-red-500">*</span>
                </label>
                <input
                  name="harvestDate"
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                  data-testid="input-harvest-date"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms <span className="text-red-500">*</span>
                </label>
                <select 
                  name="paymentTerms"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                  data-testid="select-payment-terms"
                >
                  <option value="">Select payment terms...</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="30 Days Net">30 Days Net</option>
                  <option value="50% Advance, 50% on Delivery">50% Advance, 50% on Delivery</option>
                  <option value="Letter of Credit">Letter of Credit</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Terms <span className="text-red-500">*</span>
                </label>
                <select 
                  name="deliveryTerms"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                  data-testid="select-delivery-terms"
                >
                  <option value="">Select delivery terms...</option>
                  <option value="FOB Farm Gate">FOB Farm Gate</option>
                  <option value="Delivered to Warehouse">Delivered to Warehouse</option>
                  <option value="Ex-Works">Ex-Works</option>
                  <option value="CIF Port">CIF Port</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details
              </label>
              <textarea
                name="description"
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Any additional information about your product..."
                data-testid="textarea-description"
              ></textarea>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">How It Works:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Submit your product offer above</li>
                <li>2. All buyers in your county get notified instantly</li>
                <li>3. First buyer to confirm gets the transaction</li>
                <li>4. You receive a unique verification code</li>
                <li>5. Complete the transaction with the winning buyer</li>
              </ol>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              data-testid="button-submit-offer"
            >
              {isSubmitting ? "Submitting..." : "Submit Product Offer & Notify Buyers"}
            </button>
          </form>
        </CardContent>
      </Card>

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
    </div>
  );
}