import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  Package, 
  MapPin, 
  Download,
  PieChart,
  BarChart3,
  Activity,
  Briefcase,
  Factory,
  ShoppingCart,
  Globe,
  Calendar,
  FileText,
  Eye
} from "lucide-react";

export default function EconomicReporting() {
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2025-01");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Liberian counties for dropdown
  const liberianCounties = [
    "All Counties", "Montserrado", "Lofa", "Nimba", "Bong", "Grand Bassa",
    "Sinoe", "Margibi", "Grand Cape Mount", "Gbarpolu", "Bomi", 
    "Grand Gedeh", "River Cess", "Maryland", "Grand Kru", "River Gee"
  ];

  // Mock economic data - in production, this would come from APIs
  const economicOverview = {
    totalGdpContribution: 245600000, // $245.6M USD
    monthlyGrowthRate: 3.2,
    totalEmployment: 125400,
    activeBusinesses: 8750,
    totalTaxRevenue: 12400000,
    exportValue: 189300000,
    topCommodities: ["Cocoa", "Coffee", "Rubber", "Palm Oil", "Rice"]
  };

  const countyData = [
    {
      county: "Montserrado",
      production: 89200000,
      trading: 156800000,
      exports: 134500000,
      businesses: 2850,
      farmers: 15600,
      employment: 35200,
      growthRate: 4.1,
      complianceRate: 94.5
    },
    {
      county: "Lofa",
      production: 45600000,
      trading: 78900000,
      exports: 67200000,
      businesses: 1250,
      farmers: 8900,
      employment: 18700,
      growthRate: 2.8,
      complianceRate: 91.2
    },
    {
      county: "Nimba",
      production: 38900000,
      trading: 62400000,
      exports: 54800000,
      businesses: 980,
      farmers: 7200,
      employment: 15400,
      growthRate: 3.5,
      complianceRate: 88.9
    },
    {
      county: "Bong",
      production: 32100000,
      trading: 48700000,
      exports: 41200000,
      businesses: 760,
      farmers: 6100,
      employment: 12800,
      growthRate: 2.1,
      complianceRate: 92.7
    },
    {
      county: "Grand Bassa",
      production: 28500000,
      trading: 43200000,
      exports: 36900000,
      businesses: 650,
      farmers: 5300,
      employment: 11200,
      growthRate: 1.9,
      complianceRate: 90.4
    }
  ];

  const economicActivities = [
    {
      id: 1,
      type: "Production",
      commodity: "Cocoa",
      actor: "Lofa Farmers Cooperative",
      county: "Lofa",
      value: 2400000,
      quantity: 850,
      unit: "MT",
      date: "2025-01-15",
      status: "Verified",
      employment: 450
    },
    {
      id: 2,
      type: "Export",
      commodity: "Coffee",
      actor: "Liberian Coffee Export Ltd",
      county: "Nimba",
      value: 1800000,
      quantity: 320,
      unit: "MT",
      date: "2025-01-18",
      status: "Pending",
      employment: 180
    },
    {
      id: 3,
      type: "Processing",
      commodity: "Palm Oil",
      actor: "Grand Bassa Processing Co",
      county: "Grand Bassa",
      value: 950000,
      quantity: 280,
      unit: "MT",
      date: "2025-01-20",
      status: "Verified",
      employment: 85
    },
    {
      id: 4,
      type: "Trading",
      commodity: "Rubber",
      actor: "Montserrado Traders Union",
      county: "Montserrado",
      value: 3200000,
      quantity: 1200,
      unit: "MT",
      date: "2025-01-22",
      status: "Verified",
      employment: 320
    }
  ];

  const economicIndicators = [
    { name: "GDP Contribution", value: "$245.6M", change: "+3.2%", trend: "up" },
    { name: "Export Revenue", value: "$189.3M", change: "+2.8%", trend: "up" },
    { name: "Employment Created", value: "125,400", change: "+1,240", trend: "up" },
    { name: "Tax Revenue", value: "$12.4M", change: "+4.5%", trend: "up" },
    { name: "Active Businesses", value: "8,750", change: "+85", trend: "up" },
    { name: "Compliance Rate", value: "91.5%", change: "+0.8%", trend: "up" }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const generateEconomicReport = () => {
    const reportData = {
      period: selectedPeriod,
      county: selectedCounty === "all" ? "All Counties" : selectedCounty,
      totalActivities: economicActivities.length,
      totalValue: economicActivities.reduce((sum, activity) => sum + activity.value, 0),
      totalEmployment: economicActivities.reduce((sum, activity) => sum + activity.employment, 0),
      complianceRate: 91.5,
      generatedAt: new Date().toISOString()
    };

    // Create downloadable report
    const reportBlob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(reportBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LACRA_Economic_Report_${selectedPeriod}_${selectedCounty}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Economic Activity Reporting</h2>
          <p className="text-gray-600 mt-1">Comprehensive economic data across all Liberian counties</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedCounty} onValueChange={setSelectedCounty}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select County" />
            </SelectTrigger>
            <SelectContent>
              {liberianCounties.map((county) => (
                <SelectItem key={county} value={county.toLowerCase().replace(" ", "_")}>
                  {county}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-01">Jan 2025</SelectItem>
              <SelectItem value="2024-Q4">Q4 2024</SelectItem>
              <SelectItem value="2024">2024 Annual</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateEconomicReport} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Economic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">GDP Contribution</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(economicOverview.totalGdpContribution)}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+{economicOverview.monthlyGrowthRate}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Employment</p>
                <p className="text-2xl font-bold text-blue-900">
                  {economicOverview.totalEmployment.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">Total jobs</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Businesses</p>
                <p className="text-2xl font-bold text-purple-900">
                  {economicOverview.activeBusinesses.toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 mt-1">Registered</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Tax Revenue</p>
                <p className="text-2xl font-bold text-orange-900">
                  {formatCurrency(economicOverview.totalTaxRevenue)}
                </p>
                <p className="text-xs text-orange-600 mt-1">Monthly</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Export Value</p>
                <p className="text-2xl font-bold text-indigo-900">
                  {formatCurrency(economicOverview.exportValue)}
                </p>
                <p className="text-xs text-indigo-600 mt-1">Monthly</p>
              </div>
              <Globe className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-50 to-green-50 border-teal-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-600">Top Commodities</p>
                <p className="text-xs font-bold text-teal-900 leading-tight">
                  {economicOverview.topCommodities.slice(0, 3).join(", ")}
                </p>
                <p className="text-xs text-teal-600 mt-1">Leading exports</p>
              </div>
              <Package className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* County Economic Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            County Economic Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">County</th>
                  <th className="text-right p-3 font-medium">Production Value</th>
                  <th className="text-right p-3 font-medium">Trading Value</th>
                  <th className="text-right p-3 font-medium">Export Value</th>
                  <th className="text-right p-3 font-medium">Businesses</th>
                  <th className="text-right p-3 font-medium">Farmers</th>
                  <th className="text-right p-3 font-medium">Employment</th>
                  <th className="text-right p-3 font-medium">Growth Rate</th>
                  <th className="text-right p-3 font-medium">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {countyData.map((county) => (
                  <tr key={county.county} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{county.county}</td>
                    <td className="p-3 text-right">{formatCurrency(county.production)}</td>
                    <td className="p-3 text-right">{formatCurrency(county.trading)}</td>
                    <td className="p-3 text-right">{formatCurrency(county.exports)}</td>
                    <td className="p-3 text-right">{county.businesses.toLocaleString()}</td>
                    <td className="p-3 text-right">{county.farmers.toLocaleString()}</td>
                    <td className="p-3 text-right">{county.employment.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">+{county.growthRate}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <Badge variant={county.complianceRate > 90 ? "default" : "secondary"}>
                        {county.complianceRate}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Economic Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Economic Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {economicActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {activity.type === "Production" && <Factory className="h-5 w-5 text-blue-600" />}
                    {activity.type === "Export" && <Globe className="h-5 w-5 text-blue-600" />}
                    {activity.type === "Processing" && <Package className="h-5 w-5 text-blue-600" />}
                    {activity.type === "Trading" && <ShoppingCart className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div>
                    <h4 className="font-medium">{activity.type} - {activity.commodity}</h4>
                    <p className="text-sm text-gray-600">{activity.actor} • {activity.county} County</p>
                    <p className="text-xs text-gray-500">{activity.quantity} {activity.unit} • {activity.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatCurrency(activity.value)}</p>
                  <p className="text-sm text-gray-600">{activity.employment} jobs</p>
                  <Badge variant={activity.status === "Verified" ? "default" : "secondary"}>
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Economic Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Key Economic Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {economicIndicators.map((indicator, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{indicator.name}</h4>
                  {indicator.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <p className="text-2xl font-bold">{indicator.value}</p>
                <p className={`text-sm ${indicator.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {indicator.change} from last period
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}