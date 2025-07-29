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
    <div className="space-y-8">
      {/* Modern ISMS Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Economic Activity Reporting
            </h1>
            <p className="text-slate-600 text-lg mt-1">
              Comprehensive economic data across all Liberian counties
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-8">
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

      {/* Economic Overview Cards - ISMS Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="isms-card h-36">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-lg isms-icon-bg-green flex items-center justify-center mr-2">
                  <TrendingUp className="h-3 w-3" />
                </div>
                <span className="text-xs font-medium text-green-600">+{economicOverview.monthlyGrowthRate}%</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-600 mb-2">GDP Contribution</p>
              <p className="text-3xl font-bold text-slate-900 text-center">
                ${(economicOverview.totalGdpContribution / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>

        <div className="isms-card h-36">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-600 mb-2">Employment</p>
              <p className="text-3xl font-bold text-slate-900 text-center">
                {(economicOverview.totalEmployment / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </div>

        <div className="isms-card h-36">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-purple flex items-center justify-center">
                <Building2 className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-600 mb-2">Active Businesses</p>
              <p className="text-3xl font-bold text-slate-900 text-center">
                {(economicOverview.activeBusinesses / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </div>

        <div className="isms-card h-36">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-600 mb-2">Tax Revenue</p>
              <p className="text-3xl font-bold text-slate-900 text-center">
                ${(economicOverview.totalTaxRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>

        <div className="isms-card h-36">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                <Globe className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-600 mb-2">Export Value</p>
              <p className="text-3xl font-bold text-slate-900 text-center">
                ${(economicOverview.exportValue / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>

        <div className="isms-card h-36">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
                <Package className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-600 mb-2">Top Commodities</p>
              <p className="text-2xl font-bold text-slate-900 text-center">
                Cocoa, Coffee
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* County Economic Performance - ISMS Style */}
      <div className="isms-card">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center">
              <MapPin className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold isms-gradient-text">
              County Economic Performance
            </h2>
          </div>
        </div>
        <div>
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
        </div>
      </div>

      {/* Recent Economic Activities - ISMS Style */}
      <div className="isms-card">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold isms-gradient-text">
              Recent Economic Activities
            </h2>
          </div>
        </div>
        <div>
          <div className="space-y-4">
            {economicActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all duration-300">
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
        </div>
      </div>

      {/* Economic Indicators - ISMS Style */}
      <div className="isms-card">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold isms-gradient-text">
              Key Economic Indicators
            </h2>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {economicIndicators.map((indicator, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-slate-600">{indicator.name}</h4>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    indicator.trend === "up" ? "isms-icon-bg-green" : "isms-icon-bg-orange"
                  }`}>
                    {indicator.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-2">{indicator.value}</p>
                <p className={`text-sm font-medium ${indicator.trend === "up" ? "text-green-600" : "text-orange-600"}`}>
                  {indicator.change} from last period
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}