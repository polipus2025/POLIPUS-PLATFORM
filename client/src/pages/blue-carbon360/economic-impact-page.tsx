import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  DollarSign,
  TrendingUp,
  PiggyBank,
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
  Briefcase
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EconomicImpactPage() {
  // Fetch economic impact data
  const { data: economicData = [], isLoading: economicLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/economic-impact"],
  });

  // Economic impact overview metrics
  const economicMetrics = [
    {
      title: 'Total Economic Value Generated',
      value: 2840000,
      unit: 'USD',
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+28%',
      changeType: 'positive',
      period: 'This year'
    },
    {
      title: 'Direct Jobs Created',
      value: 1450,
      unit: 'positions',
      icon: Briefcase,
      color: 'bg-blue-500',
      change: '+35%',
      changeType: 'positive',
      period: 'Full-time equivalent'
    },
    {
      title: 'Community Income Impact',
      value: 680000,
      unit: 'USD',
      icon: Users,
      color: 'bg-emerald-500',
      change: '+42%',
      changeType: 'positive',
      period: 'Annual community income'
    },
    {
      title: 'Carbon Revenue Generated',
      value: 156000,
      unit: 'USD',
      icon: Calculator,
      color: 'bg-cyan-500',
      change: '+67%',
      changeType: 'positive',
      period: 'From carbon credits'
    }
  ];

  // County-level economic impact
  const countyImpact = [
    {
      county: 'Montserrado',
      projects: 8,
      economicValue: 890000,
      jobs: 420,
      communities: 25,
      carbonRevenue: 45000,
      mainActivities: ['Mangrove Restoration', 'Eco-Tourism', 'Aquaculture'],
      growth: '+32%',
      status: 'expanding'
    },
    {
      county: 'Grand Bassa',
      projects: 6,
      economicValue: 650000,
      jobs: 310,
      communities: 18,
      carbonRevenue: 38000,
      mainActivities: ['Seagrass Protection', 'Sustainable Fishing', 'Research'],
      growth: '+28%',
      status: 'stable'
    },
    {
      county: 'Sinoe',
      projects: 4,
      economicValue: 420000,
      jobs: 180,
      communities: 12,
      carbonRevenue: 28000,
      mainActivities: ['Salt Marsh Restoration', 'Community Programs'],
      growth: '+15%',
      status: 'growing'
    },
    {
      county: 'River Cess',
      projects: 5,
      economicValue: 580000,
      jobs: 265,
      communities: 16,
      carbonRevenue: 31000,
      mainActivities: ['Mixed Ecosystem', 'Training Programs', 'Equipment'],
      growth: '+22%',
      status: 'stable'
    },
    {
      county: 'Grand Gedeh',
      projects: 3,
      economicValue: 300000,
      jobs: 275,
      communities: 14,
      carbonRevenue: 14000,
      mainActivities: ['Coastal Protection', 'Small Business Development'],
      growth: '+38%',
      status: 'emerging'
    }
  ];

  // Economic sectors breakdown
  const economicSectors = [
    {
      sector: 'Blue Carbon Credits',
      value: 456000,
      percentage: 16,
      jobs: 180,
      growth: '+87%',
      description: 'Carbon sequestration monetization through international markets'
    },
    {
      sector: 'Sustainable Aquaculture',
      value: 768000,
      percentage: 27,
      jobs: 320,
      growth: '+45%',
      description: 'Environmentally sustainable fish and shellfish farming'
    },
    {
      sector: 'Eco-Tourism',
      value: 542000,
      percentage: 19,
      jobs: 285,
      growth: '+62%',
      description: 'Marine conservation tourism and educational programs'
    },
    {
      sector: 'Sustainable Fishing',
      value: 634000,
      percentage: 22,
      jobs: 410,
      growth: '+18%',
      description: 'Community-based sustainable fishing practices'
    },
    {
      sector: 'Research & Education',
      value: 298000,
      percentage: 11,
      jobs: 125,
      growth: '+52%',
      description: 'Marine research programs and conservation education'
    },
    {
      sector: 'Equipment & Infrastructure',
      value: 142000,
      percentage: 5,
      jobs: 130,
      growth: '+28%',
      description: 'Conservation equipment and infrastructure development'
    }
  ];

  // Investment sources
  const investmentSources = [
    {
      source: 'International Climate Funds',
      amount: 1240000,
      percentage: 44,
      projects: 12,
      status: 'active'
    },
    {
      source: 'Private Sector Investment',
      amount: 890000,
      percentage: 31,
      projects: 8,
      status: 'growing'
    },
    {
      source: 'Government Funding',
      amount: 456000,
      percentage: 16,
      projects: 15,
      status: 'stable'
    },
    {
      source: 'Community Contributions',
      amount: 254000,
      percentage: 9,
      projects: 21,
      status: 'expanding'
    }
  ];

  // Economic indicators
  const economicIndicators = [
    {
      indicator: 'Community Welfare Index',
      value: 78,
      target: 85,
      unit: 'points',
      trend: 'increasing',
      improvement: '+12 points'
    },
    {
      indicator: 'Local Income Multiplier',
      value: 2.4,
      target: 3.0,
      unit: 'ratio',
      trend: 'increasing',
      improvement: '+0.6'
    },
    {
      indicator: 'Economic Diversification',
      value: 68,
      target: 75,
      unit: 'sectors',
      trend: 'stable',
      improvement: '+3 sectors'
    },
    {
      indicator: 'Employment Rate',
      value: 84,
      target: 90,
      unit: 'percentage',
      trend: 'increasing',
      improvement: '+8%'
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
    switch (status) {
      case 'expanding': return 'bg-green-100 text-green-800 border-green-200';
      case 'stable': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'growing': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'emerging': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'active': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return ArrowUpRight;
      case 'decreasing': return ArrowDownRight;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Economic Impact - Blue Carbon 360</title>
        <meta name="description" content="Comprehensive economic impact analysis for marine conservation initiatives" />
      </Helmet>

      <BlueCarbon360Header />
      <div className="flex">
        <BlueCarbon360Sidebar />
        
        <main className="flex-1 lg:ml-64">
          <ScrollArea className="h-screen">
            <div className="p-6 pb-20">
              
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">Economic Impact Analysis</h1>
                      <p className="text-slate-600">Comprehensive economic assessment of marine conservation initiatives</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      New Analysis
                    </Button>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  $2.84M Total Economic Value • 1,450 Jobs Created • 5 Counties
                </Badge>
              </div>

              {/* Economic Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {economicMetrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex items-center text-sm text-green-600 font-medium">
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

              {/* County Economic Impact */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">County-Level Economic Impact</h2>
                <div className="space-y-4">
                  {countyImpact.map((county, index) => (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg mb-2">{county.county} County</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                <span>{county.projects} projects</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{county.communities} communities</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{county.growth} growth</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(county.status)}>
                            {county.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        
                        {/* County Metrics Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-xl font-bold text-green-600">{formatCurrency(county.economicValue)}</p>
                            <p className="text-xs text-slate-600">Economic Value</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-xl font-bold text-blue-600">{county.jobs}</p>
                            <p className="text-xs text-slate-600">Jobs Created</p>
                          </div>
                          <div className="text-center p-3 bg-emerald-50 rounded-lg">
                            <p className="text-xl font-bold text-emerald-600">{formatCurrency(county.carbonRevenue)}</p>
                            <p className="text-xs text-slate-600">Carbon Revenue</p>
                          </div>
                          <div className="text-center p-3 bg-cyan-50 rounded-lg">
                            <p className="text-xl font-bold text-cyan-600">{county.communities}</p>
                            <p className="text-xs text-slate-600">Communities</p>
                          </div>
                        </div>

                        {/* Main Activities */}
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2">Main Economic Activities:</p>
                          <div className="flex flex-wrap gap-1">
                            {county.mainActivities.map((activity, activityIndex) => (
                              <Badge key={activityIndex} variant="secondary" className="text-xs">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Economic Sectors Breakdown */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Economic Sectors Analysis</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {economicSectors.map((sector, index) => (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{sector.sector}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{sector.percentage}%</Badge>
                            <span className="text-sm font-medium text-green-600">{sector.growth}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-xl font-bold text-green-600">{formatCurrency(sector.value)}</p>
                            <p className="text-xs text-slate-600">Economic Value</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-xl font-bold text-blue-600">{sector.jobs}</p>
                            <p className="text-xs text-slate-600">Jobs</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">{sector.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Investment Sources */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Investment Sources & Funding</h2>
                <Card className="bg-white shadow-sm border-0">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-slate-200">
                          <tr>
                            <th className="text-left p-4 font-semibold text-slate-900">Investment Source</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Amount</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Percentage</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Projects</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {investmentSources.map((source, index) => (
                            <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-4 font-medium text-slate-900">{source.source}</td>
                              <td className="p-4 text-slate-900 font-semibold">{formatCurrency(source.amount)}</td>
                              <td className="p-4 text-slate-600">{source.percentage}%</td>
                              <td className="p-4 text-slate-600">{source.projects} projects</td>
                              <td className="p-4">
                                <Badge className={getStatusColor(source.status)}>
                                  {source.status}
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

              {/* Economic Indicators */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Economic Indicators</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {economicIndicators.map((indicator, index) => {
                    const TrendIcon = getTrendIcon(indicator.trend);
                    const progressPercentage = (indicator.value / indicator.target) * 100;
                    
                    return (
                      <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <TrendIcon className={`h-5 w-5 ${getTrendColor(indicator.trend)}`} />
                              <span className={`text-sm font-medium ${getTrendColor(indicator.trend)}`}>
                                {indicator.trend}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">{indicator.improvement}</span>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm font-medium text-slate-600 mb-1">{indicator.indicator}</p>
                            <p className="text-2xl font-bold text-slate-900">
                              {indicator.value}{indicator.unit === 'percentage' ? '%' : ` ${indicator.unit}`}
                            </p>
                            <p className="text-xs text-slate-500">Target: {indicator.target}{indicator.unit === 'percentage' ? '%' : ` ${indicator.unit}`}</p>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Economic Tools and Actions */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span>Economic Analysis Tools</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button className="h-16 bg-green-600 hover:bg-green-700 text-white">
                      <PieChart className="h-5 w-5 mr-2" />
                      Economic Dashboard
                    </Button>
                    <Button variant="outline" className="h-16">
                      <LineChart className="h-5 w-5 mr-2" />
                      Trend Analysis
                    </Button>
                    <Button variant="outline" className="h-16">
                      <FileText className="h-5 w-5 mr-2" />
                      Impact Report
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
        </main>
      </div>
    </div>
  );
}