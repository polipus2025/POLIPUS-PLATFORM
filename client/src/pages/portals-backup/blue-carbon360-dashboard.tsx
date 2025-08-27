import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  DollarSign,
  TrendingUp,
  Leaf,
  Calculator,
  BarChart3,
  Plus,
  Eye,
  Target,
  Award,
  PiggyBank,
  Briefcase,
  Users,
  Waves,
  TreePine,
  Building2,
  FileText,
  MapPin,
  ClipboardCheck,
  Globe,
  MessageSquare
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import EcosystemMonitoring from "@/components/blue-carbon360/ecosystem-monitoring";
import CarbonMarketplace from "@/components/blue-carbon360/carbon-marketplace";
import EconomicImpactTracker from "@/components/blue-carbon360/economic-impact-tracker";

export default function BlueCarbon360Dashboard() {
  // Fetch dashboard statistics
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/stats"],
  });

  // Fetch recent conservation projects
  const { data: projects = { data: [] }, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/conservation-projects"],
  });

  // Fetch marketplace listings
  const { data: marketplace = { data: [] }, isLoading: marketplaceLoading } = useQuery({
    queryKey: ["/api/carbon-marketplace"],
  });

  const dashboardStats = [
    {
      title: 'Total Projects',
      value: (stats as any)?.totalProjects || 156,
      icon: Target,
      color: 'bg-cyan-500',
      change: '+25%'
    },
    {
      title: 'Active Projects',
      value: (stats as any)?.activeProjects || 89,
      icon: Briefcase,
      color: 'bg-green-500',
      change: '+18%'
    },
    {
      title: 'Marketplace Listings',
      value: (stats as any)?.marketplaceListings || 234,
      icon: DollarSign,
      color: 'bg-blue-500',
      change: '+45%'
    },
    {
      title: 'Economic Records',
      value: (stats as any)?.economicImpactRecords || 412,
      icon: Calculator,
      color: 'bg-emerald-500',
      change: '+32%'
    }
  ];

  const economicsFeatures = [
    {
      title: 'Carbon Economics',
      description: 'Turn conservation into economic benefits',
      icon: DollarSign,
      color: 'bg-cyan-500',
      action: 'Calculate Benefits'
    },
    {
      title: 'Market Trading',
      description: 'Carbon credit trading and marketplace',
      icon: TrendingUp,
      color: 'bg-green-500',
      action: 'Trade Credits'
    },
    {
      title: 'Conservation Metrics',
      description: 'Real conservation impact measurement',
      icon: Leaf,
      color: 'bg-emerald-500',
      action: 'Measure Impact'
    },
    {
      title: 'ROI Calculator',
      description: 'Conservation return on investment tracking',
      icon: Calculator,
      color: 'bg-blue-500',
      action: 'Calculate ROI'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Blue Carbon 360 Dashboard - Conservation Economics</title>
        <meta name="description" content="Conservation economics and real economic benefits dashboard" />
      </Helmet>

      <BlueCarbon360Header />
      <div className="flex">
        <BlueCarbon360Sidebar />
        
        <main className="flex-1 lg:ml-64">
          <ScrollArea className="h-screen">
            <div className="p-6 pb-20">
              
              {/* Blue Carbon 360 Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Waves className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">Blue Carbon 360</h1>
                    <p className="text-slate-600">Conservation Economics & Marine Management</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  Conservation Platform Active
                </Badge>
              </div>

              {/* Dashboard Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                            <p className="text-3xl font-bold text-slate-900">{statsLoading ? '...' : stat.value.toLocaleString()}</p>
                            <p className="text-sm text-green-600 font-medium">{stat.change} vs last month</p>
                          </div>
                          <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Button className="h-16 bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Create Project</span>
                </Button>
                <Button className="h-16 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Trade Credits</span>
                </Button>
                <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Calculate ROI</span>
                </Button>
                <Button className="h-16 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Track Impact</span>
                </Button>
              </div>

              {/* Economics Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {economicsFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-slate-600 mb-4">{feature.description}</p>
                        <Button variant="outline" className="w-full">
                          {feature.action}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Recent Conservation Projects */}
                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-cyan-600" />
                      <span>Recent Conservation Projects</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {projectsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                        <p className="text-slate-600 mt-2">Loading projects...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(projects as any)?.data?.slice(0, 5).map((project: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                            <div>
                              <p className="font-medium text-slate-900">{project.projectName || `Conservation Project ${index + 1}`}</p>
                              <p className="text-sm text-slate-600">{project.projectType || 'Mangrove Restoration'} - {project.location || 'Grand Bassa County'}</p>
                            </div>
                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                              {project.status || 'Active'}
                            </Badge>
                          </div>
                        )) || (
                          <div className="text-center py-8">
                            <TreePine className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-600">No recent projects</p>
                            <p className="text-sm text-slate-500">Start your first conservation project</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Carbon Marketplace Activity */}
                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span>Carbon Marketplace Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {marketplaceLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-slate-600 mt-2">Loading marketplace data...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(marketplace as any)?.data?.slice(0, 5).map((listing: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                            <div>
                              <p className="font-medium text-slate-900">{listing.listingTitle || `Carbon Credit Listing ${index + 1}`}</p>
                              <p className="text-sm text-slate-600">{listing.creditType || 'Blue Carbon'} - {listing.creditsAvailable || (50 + index * 10)} tonnes CO2</p>
                            </div>
                            <Badge variant={listing.listingStatus === 'active' ? 'default' : 'secondary'}>
                              ${listing.pricePerCredit || (15 + index * 2)}
                            </Badge>
                          </div>
                        )) || (
                          <div className="text-center py-8">
                            <PiggyBank className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-600">No marketplace listings</p>
                            <p className="text-sm text-slate-500">Start trading carbon credits for economic benefits</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Specialized Components */}
              <div className="space-y-8">
                <EcosystemMonitoring />
                <CarbonMarketplace />
                <EconomicImpactTracker />
              </div>
              
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}