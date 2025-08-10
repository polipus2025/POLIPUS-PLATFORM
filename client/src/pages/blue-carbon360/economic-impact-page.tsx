import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Calculator,
  DollarSign,
  TrendingUp,
  Users,
  MapPin,
  Building2,
  Briefcase,
  PiggyBank,
  BarChart3,
  FileText,
  Globe,
  Award,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import EconomicImpactTracker from "@/components/blue-carbon360/economic-impact-tracker";

export default function EconomicImpactPage() {
  // Fetch economic impact data
  const { data: economicData = [], isLoading: economicLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/economic-impact"],
  });

  // Economic impact metrics
  const economicMetrics = [
    {
      title: 'Total Economic Value Generated',
      value: 2840000,
      unit: 'USD',
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+28%',
      period: 'This year'
    },
    {
      title: 'Direct Jobs Created',
      value: 1450,
      unit: 'positions',
      icon: Briefcase,
      color: 'bg-blue-500',
      change: '+35%',
      period: 'Full-time equivalent'
    },
    {
      title: 'Community Income Impact',
      value: 680000,
      unit: 'USD',
      icon: Users,
      color: 'bg-emerald-500',
      change: '+42%',
      period: 'Annual community income'
    },
    {
      title: 'Carbon Revenue Generated',
      value: 156000,
      unit: 'USD',
      icon: Calculator,
      color: 'bg-cyan-500',
      change: '+67%',
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
      mainActivities: ['Mangrove Restoration', 'Eco-Tourism', 'Aquaculture']
    },
    {
      county: 'Grand Bassa',
      projects: 6,
      economicValue: 650000,
      jobs: 310,
      communities: 18,
      carbonRevenue: 38000,
      mainActivities: ['Seagrass Protection', 'Sustainable Fishing', 'Research']
    },
    {
      county: 'Sinoe',
      projects: 4,
      economicValue: 420000,
      jobs: 180,
      communities: 12,
      carbonRevenue: 28000,
      mainActivities: ['Salt Marsh Restoration', 'Community Programs']
    },
    {
      county: 'River Cess',
      projects: 5,
      economicValue: 580000,
      jobs: 265,
      communities: 16,
      carbonRevenue: 31000,
      mainActivities: ['Mixed Ecosystem', 'Training Programs', 'Equipment']
    },
    {
      county: 'Grand Gedeh',
      projects: 3,
      economicValue: 300000,
      jobs: 275,
      communities: 14,
      carbonRevenue: 14000,
      mainActivities: ['Coastal Protection', 'Small Business Development']
    }
  ];

  // Economic sectors
  const economicSectors = [
    {
      sector: 'Conservation & Restoration',
      impact: 1200000,
      percentage: 42,
      jobs: 580,
      description: 'Direct conservation work, restoration activities, and ecosystem management'
    },
    {
      sector: 'Sustainable Tourism',
      impact: 720000,
      percentage: 25,
      jobs: 340,
      description: 'Eco-tourism, community-based tourism, and educational programs'
    },
    {
      sector: 'Sustainable Fisheries',
      impact: 560000,
      percentage: 20,
      jobs: 280,
      description: 'Sustainable fishing practices, aquaculture, and marine product processing'
    },
    {
      sector: 'Carbon Trading',
      impact: 220000,
      percentage: 8,
      jobs: 120,
      description: 'Carbon credit development, trading, and verification services'
    },
    {
      sector: 'Research & Education',
      impact: 140000,
      percentage: 5,
      jobs: 130,
      description: 'Research institutions, educational programs, and capacity building'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Economic Impact - Blue Carbon 360</title>
        <meta name="description" content="Economic impact analysis and community benefits from blue carbon initiatives" />
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
                      <Calculator className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">Economic Impact</h1>
                      <p className="text-slate-600">Quantifying economic benefits from blue carbon conservation initiatives</p>
                    </div>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  Live Economic Tracking • 26 Active Projects
                </Badge>
              </div>

              {/* Key Economic Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {economicMetrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  const isPositive = metric.change.startsWith('+');
                  return (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span className="ml-1">{metric.change}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                          <p className="text-3xl font-bold text-slate-900">
                            {metric.unit === 'USD' ? '$' : ''}{metric.value.toLocaleString()}{metric.unit === 'USD' ? '' : ` ${metric.unit}`}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">{metric.period}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* County-Level Impact */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">County-Level Economic Impact</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {countyImpact.map((county, index) => (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{county.county} County</CardTitle>
                          <Badge variant="outline">
                            {county.projects} Projects
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-xl font-bold text-green-600">${(county.economicValue / 1000).toFixed(0)}k</p>
                            <p className="text-xs text-slate-600">Economic Value</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-xl font-bold text-blue-600">{county.jobs}</p>
                            <p className="text-xs text-slate-600">Jobs Created</p>
                          </div>
                          <div className="text-center p-3 bg-emerald-50 rounded-lg">
                            <p className="text-xl font-bold text-emerald-600">{county.communities}</p>
                            <p className="text-xs text-slate-600">Communities</p>
                          </div>
                          <div className="text-center p-3 bg-cyan-50 rounded-lg">
                            <p className="text-xl font-bold text-cyan-600">${(county.carbonRevenue / 1000).toFixed(0)}k</p>
                            <p className="text-xs text-slate-600">Carbon Revenue</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2">Main Activities:</p>
                          <div className="flex flex-wrap gap-1">
                            {county.mainActivities.map((activity, actIndex) => (
                              <Badge key={actIndex} variant="secondary" className="text-xs">
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

              {/* Economic Sectors Analysis */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Economic Impact by Sector</h2>
                <div className="space-y-4">
                  {economicSectors.map((sector, index) => (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">{sector.sector}</h3>
                            <p className="text-sm text-slate-600">{sector.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">${(sector.impact / 1000).toFixed(0)}k</p>
                            <p className="text-sm text-slate-500">{sector.jobs} jobs</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                          <span>Sector Contribution</span>
                          <span>{sector.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${sector.percentage}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Analysis Tools */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span>Impact Trends</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">Fastest Growing Sector</p>
                          <p className="text-sm text-slate-600">Carbon Trading</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">+67%</p>
                          <p className="text-xs text-slate-500">YoY growth</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">Largest Job Creator</p>
                          <p className="text-sm text-slate-600">Conservation & Restoration</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">580</p>
                          <p className="text-xs text-slate-500">jobs created</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">Highest Revenue</p>
                          <p className="text-sm text-slate-600">Montserrado County</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">$890k</p>
                          <p className="text-xs text-slate-500">economic value</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span>Impact Tools</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate Project ROI
                      </Button>
                      <Button variant="outline" className="w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Impact Projections
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Detailed Reports
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Globe className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Economic Impact Component */}
              <div className="mb-8">
                <EconomicImpactTracker />
              </div>
              
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}