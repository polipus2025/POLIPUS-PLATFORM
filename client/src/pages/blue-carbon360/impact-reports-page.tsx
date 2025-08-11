import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText,
  Download,
  Eye,
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  Leaf,
  Waves,
  Target,
  Award,
  Clock,
  MapPin,
  DollarSign,
  Calculator,
  PieChart,
  LineChart,
  Plus,
  Filter,
  Search,
  Share,
  Printer,
  Mail,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  TreePine,
  Fish,
  Anchor,
  Compass
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export default function ImpactReportsPage() {
  // Fetch impact reports data
  const { data: reportsData = [], isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/impact-reports"],
  });

  // Report categories and metrics
  const reportCategories = [
    {
      category: 'Conservation Impact',
      icon: Leaf,
      color: 'bg-green-500',
      reportCount: 12,
      lastUpdated: '2 hours ago'
    },
    {
      category: 'Economic Analysis',
      icon: DollarSign,
      color: 'bg-blue-500',
      reportCount: 8,
      lastUpdated: '4 hours ago'
    },
    {
      category: 'Carbon Assessment',
      icon: Calculator,
      color: 'bg-emerald-500',
      reportCount: 15,
      lastUpdated: '1 hour ago'
    },
    {
      category: 'Community Impact',
      icon: Users,
      color: 'bg-purple-500',
      reportCount: 9,
      lastUpdated: '6 hours ago'
    },
    {
      category: 'Marine Monitoring',
      icon: Waves,
      color: 'bg-cyan-500',
      reportCount: 11,
      lastUpdated: '3 hours ago'
    },
    {
      category: 'Policy Analysis',
      icon: Globe,
      color: 'bg-orange-500',
      reportCount: 6,
      lastUpdated: '8 hours ago'
    }
  ];

  // Featured impact reports
  const featuredReports = [
    {
      title: 'Liberian Blue Carbon Ecosystem Assessment 2024',
      description: 'Comprehensive analysis of coastal carbon sequestration across all Liberian marine protected areas',
      category: 'Conservation Impact',
      date: '2024-12-15',
      status: 'Published',
      author: 'Dr. Marina Conserve',
      pages: 148,
      downloads: 2340,
      rating: 4.9,
      tags: ['Mangroves', 'Seagrass', 'Carbon Credits', 'EUDR Compliance'],
      priority: 'high'
    },
    {
      title: 'Economic Valuation of Marine Conservation Programs',
      description: 'Economic impact analysis of blue carbon initiatives and sustainable fisheries management',
      category: 'Economic Analysis',
      date: '2024-12-10',
      status: 'Published',
      author: 'Economic Research Team',
      pages: 95,
      downloads: 1850,
      rating: 4.7,
      tags: ['ROI Analysis', 'Job Creation', 'Investment Returns', 'Market Trends'],
      priority: 'high'
    },
    {
      title: 'Community Engagement and Livelihood Assessment',
      description: 'Analysis of community participation in conservation programs and livelihood improvements',
      category: 'Community Impact',
      date: '2024-12-08',
      status: 'Published',
      author: 'Community Relations Team',
      pages: 72,
      downloads: 1560,
      rating: 4.8,
      tags: ['Community Development', 'Stakeholder Engagement', 'Social Impact'],
      priority: 'medium'
    },
    {
      title: 'Carbon Credit Market Performance Report',
      description: 'Analysis of blue carbon credit sales, pricing trends, and market opportunities',
      category: 'Carbon Assessment',
      date: '2024-12-05',
      status: 'Published',
      author: 'Carbon Markets Team',
      pages: 64,
      downloads: 2180,
      rating: 4.9,
      tags: ['Carbon Trading', 'Market Analysis', 'Price Trends', 'Verification'],
      priority: 'high'
    },
    {
      title: 'Marine Biodiversity Monitoring Report Q4 2024',
      description: 'Quarterly assessment of marine species recovery and ecosystem health indicators',
      category: 'Marine Monitoring',
      date: '2024-12-01',
      status: 'Published',
      author: 'Marine Biology Team',
      pages: 112,
      downloads: 1420,
      rating: 4.6,
      tags: ['Biodiversity', 'Species Recovery', 'Ecosystem Health', 'Monitoring'],
      priority: 'medium'
    },
    {
      title: 'Policy Impact Assessment - EUDR Compliance',
      description: 'Analysis of EU Deforestation Regulation compliance and policy recommendations',
      category: 'Policy Analysis',
      date: '2024-11-28',
      status: 'Published',
      author: 'Policy Research Team',
      pages: 88,
      downloads: 1650,
      rating: 4.7,
      tags: ['EUDR', 'Policy Compliance', 'Regulatory Impact', 'Recommendations'],
      priority: 'high'
    }
  ];

  // Recent reports and drafts
  const recentReports = [
    {
      title: 'Monthly Carbon Sequestration Analysis - December 2024',
      category: 'Carbon Assessment',
      date: '2024-12-20',
      status: 'Draft',
      progress: 85,
      author: 'Carbon Monitoring Team'
    },
    {
      title: 'Mangrove Restoration Impact Assessment',
      category: 'Conservation Impact',
      date: '2024-12-18',
      status: 'Review',
      progress: 95,
      author: 'Restoration Team'
    },
    {
      title: 'Quarterly Economic Performance Report',
      category: 'Economic Analysis',
      date: '2024-12-16',
      status: 'Draft',
      progress: 60,
      author: 'Economics Team'
    },
    {
      title: 'Community Training Program Results',
      category: 'Community Impact',
      date: '2024-12-14',
      status: 'Published',
      progress: 100,
      author: 'Training Coordinator'
    },
    {
      title: 'Marine Species Population Survey',
      category: 'Marine Monitoring',
      date: '2024-12-12',
      status: 'Review',
      progress: 88,
      author: 'Marine Biologists'
    }
  ];

  // Report statistics
  const reportStats = [
    {
      metric: 'Total Reports',
      value: 147,
      change: '+23',
      period: 'This quarter',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      metric: 'Downloads',
      value: 15420,
      change: '+2,340',
      period: 'This month',
      icon: Download,
      color: 'bg-green-500'
    },
    {
      metric: 'Average Rating',
      value: 4.7,
      change: '+0.2',
      period: 'User feedback',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      metric: 'Active Researchers',
      value: 28,
      change: '+6',
      period: 'Contributing authors',
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Conservation Impact': return Leaf;
      case 'Economic Analysis': return DollarSign;
      case 'Carbon Assessment': return Calculator;
      case 'Community Impact': return Users;
      case 'Marine Monitoring': return Waves;
      case 'Policy Analysis': return Globe;
      default: return FileText;
    }
  };

  return (
    <div className="blue-carbon-360-layout">
      <Helmet>
        <title>Impact Reports - Blue Carbon 360</title>
        <meta name="description" content="Comprehensive impact reports and research analysis for marine conservation" />
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
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900">Impact Reports</h1>
                        <p className="text-slate-600">Comprehensive research and analysis of conservation impact</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter Reports
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        New Report
                      </Button>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                    147 Total Reports • 15,420 Downloads • 4.7★ Average Rating
                  </Badge>
                </div>

                {/* Search and Filters */}
                <div className="mb-8">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search reports by title, author, or keywords..." className="pl-10" />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date Range
                    </Button>
                    <Button variant="outline">
                      <Target className="h-4 w-4 mr-2" />
                      Category
                    </Button>
                  </div>
                </div>

                {/* Report Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {reportStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-sm text-green-600 font-medium">
                              {stat.change}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">{stat.metric}</p>
                            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{stat.period}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Report Categories */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Report Categories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportCategories.map((category, index) => {
                      const IconComponent = category.icon;
                      return (
                        <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200 cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                              <Badge variant="secondary">{category.reportCount}</Badge>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 mb-2">{category.category}</h3>
                              <p className="text-sm text-slate-500">Updated {category.lastUpdated}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Featured Reports */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Impact Reports</h2>
                  <div className="space-y-6">
                    {featuredReports.map((report, index) => {
                      const CategoryIcon = getCategoryIcon(report.category);
                      return (
                        <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                                  <CategoryIcon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CardTitle className="text-xl">{report.title}</CardTitle>
                                    <Badge className={getPriorityColor(report.priority)}>
                                      {report.priority}
                                    </Badge>
                                  </div>
                                  <p className="text-slate-600 mb-3">{report.description}</p>
                                  <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      <span>{report.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      <span>{new Date(report.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-4 w-4" />
                                      <span>{report.pages} pages</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Download className="h-4 w-4" />
                                      <span>{report.downloads.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                      <span>{report.rating}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(report.status)}>
                                  {report.status}
                                </Badge>
                                <Badge variant="secondary">{report.category}</Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-2">
                                {report.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Share className="h-4 w-4 mr-2" />
                                  Share
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Reports and Drafts */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Reports & Drafts</h2>
                  <Card className="bg-white shadow-sm border-0">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b border-slate-200">
                            <tr>
                              <th className="text-left p-4 font-semibold text-slate-900">Report Title</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Category</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Author</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Date</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Status</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Progress</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentReports.map((report, index) => (
                              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-4 font-medium text-slate-900">{report.title}</td>
                                <td className="p-4 text-slate-600">{report.category}</td>
                                <td className="p-4 text-slate-600">{report.author}</td>
                                <td className="p-4 text-slate-600">{new Date(report.date).toLocaleDateString()}</td>
                                <td className="p-4">
                                  <Badge className={getStatusColor(report.status)}>
                                    {report.status}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-slate-200 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${report.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-slate-600">{report.progress}%</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex gap-1">
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Mail className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Report Tools and Actions */}
                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Report Management Tools</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white">
                        <PieChart className="h-5 w-5 mr-2" />
                        Analytics Dashboard
                      </Button>
                      <Button variant="outline" className="h-16">
                        <LineChart className="h-5 w-5 mr-2" />
                        Impact Metrics
                      </Button>
                      <Button variant="outline" className="h-16">
                        <Printer className="h-5 w-5 mr-2" />
                        Batch Export
                      </Button>
                      <Button variant="outline" className="h-16">
                        <Share className="h-5 w-5 mr-2" />
                        Share Portal
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