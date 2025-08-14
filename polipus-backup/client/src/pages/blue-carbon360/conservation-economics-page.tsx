import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  PiggyBank,
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  Globe,
  Calculator,
  BarChart3,
  FileText,
  Target,
  Award,
  Leaf,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  CreditCard,
  Wallet,
  Activity,
  HandCoins,
  CircleDollarSign,
  LineChart,
  PieChart,
  Plus,
  Download,
  Calendar,
  MapPin,
  Factory,
  Ship,
  Truck,
  Briefcase,
  TreePine,
  Waves,
  Fish,
  Anchor,
  Compass,
  Shield,
  Star,
  Crown,
  Gem,
  Lightbulb,
  Zap,
  Rocket
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConservationEconomicsPage() {
  // Fetch conservation economics data
  const { data: economicsData = [], isLoading: economicsLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/conservation-economics"],
  });

  // Conservation economics overview metrics
  const conservationMetrics = [
    {
      title: 'Total Conservation Value',
      value: 4250000,
      unit: 'USD',
      icon: PiggyBank,
      color: 'bg-emerald-500',
      change: '+38%',
      changeType: 'positive',
      period: 'Annual conservation value'
    },
    {
      title: 'Blue Economy Jobs',
      value: 2340,
      unit: 'positions',
      icon: Briefcase,
      color: 'bg-blue-500',
      change: '+45%',
      changeType: 'positive',
      period: 'Conservation-related employment'
    },
    {
      title: 'Ecosystem Services Value',
      value: 1850000,
      unit: 'USD',
      icon: Leaf,
      color: 'bg-green-500',
      change: '+52%',
      changeType: 'positive',
      period: 'Natural capital valuation'
    },
    {
      title: 'Carbon Market Revenue',
      value: 680000,
      unit: 'USD',
      icon: Calculator,
      color: 'bg-cyan-500',
      change: '+73%',
      changeType: 'positive',
      period: 'Blue carbon credits sold'
    }
  ];

  // Economic value streams
  const valueStreams = [
    {
      stream: 'Blue Carbon Credits',
      value: 680000,
      percentage: 28,
      growth: '+73%',
      description: 'Coastal ecosystem carbon sequestration',
      icon: Leaf,
      color: 'bg-green-500'
    },
    {
      stream: 'Sustainable Fisheries',
      value: 950000,
      percentage: 39,
      growth: '+35%',
      description: 'Marine protected area fishing rights',
      icon: Fish,
      color: 'bg-blue-500'
    },
    {
      stream: 'Eco-Tourism Revenue',
      value: 520000,
      percentage: 21,
      growth: '+68%',
      description: 'Conservation tourism and education',
      icon: Compass,
      color: 'bg-purple-500'
    },
    {
      stream: 'Research & Innovation',
      value: 190000,
      percentage: 8,
      growth: '+42%',
      description: 'Marine technology and research',
      icon: Lightbulb,
      color: 'bg-orange-500'
    },
    {
      stream: 'Coastal Protection',
      value: 110000,
      percentage: 4,
      growth: '+28%',
      description: 'Natural coastal defense systems',
      icon: Shield,
      color: 'bg-slate-500'
    }
  ];

  // Conservation investment opportunities
  const investmentOpportunities = [
    {
      opportunity: 'Mangrove Restoration Bonds',
      investmentRequired: 850000,
      expectedReturn: '12-18%',
      timeline: '5-7 years',
      riskLevel: 'Medium',
      carbonOffset: '24,500 tons CO2/year',
      jobsCreated: 185,
      status: 'Active'
    },
    {
      opportunity: 'Seagrass Protection Fund',
      investmentRequired: 620000,
      expectedReturn: '15-22%',
      timeline: '3-5 years',
      riskLevel: 'Low',
      carbonOffset: '18,200 tons CO2/year',
      jobsCreated: 140,
      status: 'Planning'
    },
    {
      opportunity: 'Coastal Aquaculture Initiative',
      investmentRequired: 1200000,
      expectedReturn: '20-28%',
      timeline: '4-6 years',
      riskLevel: 'Medium-High',
      carbonOffset: '8,500 tons CO2/year',
      jobsCreated: 320,
      status: 'Active'
    },
    {
      opportunity: 'Marine Research Hub',
      investmentRequired: 450000,
      expectedReturn: '8-12%',
      timeline: '7-10 years',
      riskLevel: 'Low',
      carbonOffset: '12,800 tons CO2/year',
      jobsCreated: 95,
      status: 'Development'
    }
  ];

  // Economic impact by region
  const regionalImpact = [
    {
      region: 'Montserrado Coastal Zone',
      conservationValue: 1250000,
      jobs: 580,
      projects: 12,
      carbonRevenue: 185000,
      ecosystemServices: 450000,
      status: 'Leading'
    },
    {
      region: 'Grand Bassa Marine Area',
      conservationValue: 890000,
      jobs: 420,
      projects: 8,
      carbonRevenue: 142000,
      ecosystemServices: 320000,
      status: 'Growing'
    },
    {
      region: 'Sinoe Conservation Zone',
      conservationValue: 650000,
      jobs: 285,
      projects: 6,
      carbonRevenue: 98000,
      ecosystemServices: 235000,
      status: 'Emerging'
    },
    {
      region: 'River Cess Delta',
      conservationValue: 720000,
      jobs: 340,
      projects: 7,
      carbonRevenue: 115000,
      ecosystemServices: 280000,
      status: 'Stable'
    },
    {
      region: 'Grand Gedeh Coastal',
      conservationValue: 480000,
      jobs: 215,
      projects: 4,
      carbonRevenue: 75000,
      ecosystemServices: 185000,
      status: 'Developing'
    }
  ];

  // Market trends and forecasts
  const marketTrends = [
    {
      trend: 'Blue Carbon Credit Demand',
      currentValue: 680000,
      projectedValue: 1250000,
      growth: '+84%',
      timeframe: '2025-2027',
      confidence: 'High'
    },
    {
      trend: 'Sustainable Tourism Growth',
      currentValue: 520000,
      projectedValue: 890000,
      growth: '+71%',
      timeframe: '2025-2026',
      confidence: 'High'
    },
    {
      trend: 'Marine Tech Innovation',
      currentValue: 190000,
      projectedValue: 450000,
      growth: '+137%',
      timeframe: '2025-2028',
      confidence: 'Medium-High'
    },
    {
      trend: 'Ecosystem Services Recognition',
      currentValue: 1850000,
      projectedValue: 3200000,
      growth: '+73%',
      timeframe: '2025-2030',
      confidence: 'Medium'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'leading': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'growing': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'stable': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'emerging': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'developing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'development': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'medium-high': return 'text-orange-600 bg-orange-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high': return 'text-green-600';
      case 'medium-high': return 'text-blue-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="blue-carbon-360-layout">
      <Helmet>
        <title>Conservation Economics - Blue Carbon 360</title>
        <meta name="description" content="Comprehensive conservation economics analysis and investment opportunities" />
      </Helmet>

      <BlueCarbon360Header />
      <div className="flex">
        <BlueCarbon360Sidebar />
        
        <main className="flex-1 lg:ml-64 flex justify-center">
          <div className="w-full max-w-7xl">
            <ScrollArea className="h-screen">
              <div className="p-6 pb-20">
                
                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                        <PiggyBank className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900">Conservation Economics</h1>
                        <p className="text-slate-600">Economic valuation and investment analysis for marine conservation</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Economics Report
                      </Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        New Investment
                      </Button>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1">
                    $4.25M Conservation Value • 2,340 Blue Economy Jobs • 5 Investment Opportunities
                  </Badge>
                </div>

                {/* Conservation Economics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {conservationMetrics.map((metric, index) => {
                    const IconComponent = metric.icon;
                    return (
                      <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex items-center text-sm text-emerald-600 font-medium">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              {metric.change}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                            <p className="text-3xl font-bold text-slate-900">
                              {metric.unit === 'USD' ? formatCurrency(metric.value) : metric.value.toLocaleString()}
                              {metric.unit !== 'USD' && metric.unit ? ` ${metric.unit}` : ''}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">{metric.period}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Economic Value Streams */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Conservation Value Streams</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {valueStreams.map((stream, index) => {
                      const IconComponent = stream.icon;
                      return (
                        <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl ${stream.color} flex items-center justify-center`}>
                                  <IconComponent className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{stream.stream}</CardTitle>
                                  <p className="text-sm text-slate-600">{stream.description}</p>
                                </div>
                              </div>
                              <Badge variant="secondary">{stream.percentage}%</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-2xl font-bold text-slate-900">{formatCurrency(stream.value)}</p>
                                <p className="text-sm text-slate-500">Annual value</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-emerald-600">{stream.growth}</p>
                                <p className="text-xs text-slate-500">Growth rate</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Investment Opportunities */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Conservation Investment Opportunities</h2>
                  <div className="space-y-4">
                    {investmentOpportunities.map((opportunity, index) => (
                      <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg mb-2">{opportunity.opportunity}</CardTitle>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>Required: {formatCurrency(opportunity.investmentRequired)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  <span>Return: {opportunity.expectedReturn}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{opportunity.timeline}</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={getStatusColor(opportunity.status)}>
                              {opportunity.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-emerald-50 rounded-lg">
                              <p className="text-lg font-bold text-emerald-600">{opportunity.carbonOffset}</p>
                              <p className="text-xs text-slate-600">Carbon Offset</p>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <p className="text-lg font-bold text-blue-600">{opportunity.jobsCreated}</p>
                              <p className="text-xs text-slate-600">Jobs Created</p>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                              <p className="text-lg font-bold text-orange-600">{opportunity.timeline}</p>
                              <p className="text-xs text-slate-600">Timeline</p>
                            </div>
                            <div className={`text-center p-3 rounded-lg ${getRiskColor(opportunity.riskLevel)}`}>
                              <p className="text-lg font-bold">{opportunity.riskLevel}</p>
                              <p className="text-xs">Risk Level</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Regional Economic Impact */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Regional Conservation Economics</h2>
                  <Card className="bg-white shadow-sm border-0">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b border-slate-200">
                            <tr>
                              <th className="text-left p-4 font-semibold text-slate-900">Region</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Conservation Value</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Jobs</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Projects</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Carbon Revenue</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {regionalImpact.map((region, index) => (
                              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-4 font-medium text-slate-900">{region.region}</td>
                                <td className="p-4 text-slate-900 font-semibold">{formatCurrency(region.conservationValue)}</td>
                                <td className="p-4 text-slate-600">{region.jobs} positions</td>
                                <td className="p-4 text-slate-600">{region.projects} projects</td>
                                <td className="p-4 text-slate-600">{formatCurrency(region.carbonRevenue)}</td>
                                <td className="p-4">
                                  <Badge className={getStatusColor(region.status)}>
                                    {region.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Market Trends and Forecasts */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Market Trends & Economic Forecasts</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {marketTrends.map((trend, index) => (
                      <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{trend.trend}</CardTitle>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-emerald-600">{trend.growth}</span>
                              <Badge variant="secondary" className={getConfidenceColor(trend.confidence)}>
                                {trend.confidence}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Current Value:</span>
                              <span className="font-semibold text-slate-900">{formatCurrency(trend.currentValue)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Projected Value:</span>
                              <span className="font-semibold text-emerald-600">{formatCurrency(trend.projectedValue)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Timeframe:</span>
                              <span className="text-sm font-medium text-slate-700">{trend.timeframe}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Economic Tools and Actions */}
                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-emerald-600" />
                      <span>Conservation Economics Tools</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Button className="h-16 bg-emerald-600 hover:bg-emerald-700 text-white">
                        <PieChart className="h-5 w-5 mr-2" />
                        Economics Dashboard
                      </Button>
                      <Button variant="outline" className="h-16">
                        <LineChart className="h-5 w-5 mr-2" />
                        Value Analysis
                      </Button>
                      <Button variant="outline" className="h-16">
                        <Rocket className="h-5 w-5 mr-2" />
                        Investment Portal
                      </Button>
                      <Button variant="outline" className="h-16">
                        <Calculator className="h-5 w-5 mr-2" />
                        ROI Calculator
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
              </div>
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
}