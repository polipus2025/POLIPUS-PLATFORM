import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Globe,
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Shield,
  FileText,
  Download,
  ExternalLink,
  Star,
  Bookmark,
  Calendar,
  Users,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Share,
  Printer,
  Mail,
  Phone,
  MapPin,
  Building2,
  Leaf,
  Waves,
  TreePine,
  Fish,
  Factory,
  Recycle,
  Zap,
  Compass,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Scale,
  Flag,
  Home,
  Briefcase
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export default function GlobalStandardsPage() {
  // Fetch global standards data
  const { data: standardsData = [], isLoading: standardsLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/global-standards"],
  });

  // Standards compliance overview
  const complianceMetrics = [
    {
      title: 'Standards Compliance',
      value: 92,
      unit: '%',
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%',
      period: 'Overall compliance rate'
    },
    {
      title: 'Active Standards',
      value: 18,
      unit: 'frameworks',
      icon: Globe,
      color: 'bg-blue-500',
      change: '+3',
      period: 'Implemented standards'
    },
    {
      title: 'Certifications',
      value: 12,
      unit: 'certificates',
      icon: Award,
      color: 'bg-purple-500',
      change: '+4',
      period: 'Valid certifications'
    },
    {
      title: 'Audit Score',
      value: 94.5,
      unit: '/100',
      icon: Target,
      color: 'bg-emerald-500',
      change: '+2.1',
      period: 'Latest audit rating'
    }
  ];

  // International standards categories
  const standardsCategories = [
    {
      category: 'Climate & Carbon Standards',
      count: 6,
      icon: Leaf,
      color: 'bg-green-500',
      description: 'Carbon accounting and climate action frameworks',
      compliance: 96,
      standards: ['IPCC Guidelines', 'ISO 14064', 'GHG Protocol', 'VERRA VCS', 'Gold Standard', 'Plan Vivo']
    },
    {
      category: 'Marine Conservation Standards',
      count: 4,
      icon: Waves,
      color: 'bg-blue-500',
      description: 'Ocean and marine ecosystem protection standards',
      compliance: 89,
      standards: ['MSC Standards', 'IUCN Guidelines', 'CITES Regulations', 'CBD Aichi Targets']
    },
    {
      category: 'Sustainability Reporting',
      count: 5,
      icon: FileText,
      color: 'bg-purple-500',
      description: 'Environmental and social reporting frameworks',
      compliance: 94,
      standards: ['GRI Standards', 'SASB Standards', 'TCFD', 'UN SDGs', 'IIRC Framework']
    },
    {
      category: 'Quality Management',
      count: 3,
      icon: Award,
      color: 'bg-orange-500',
      description: 'Quality assurance and management systems',
      compliance: 91,
      standards: ['ISO 9001', 'ISO 14001', 'OHSAS 18001']
    }
  ];

  // Key international standards with detailed information
  const keyStandards = [
    {
      name: 'EU Deforestation Regulation (EUDR)',
      organization: 'European Union',
      type: 'Regulatory Framework',
      status: 'Compliant',
      compliance: 95,
      lastAudit: '2024-11-15',
      nextReview: '2025-02-15',
      description: 'Regulation requiring due diligence to ensure products are deforestation-free',
      requirements: [
        'Supply chain traceability',
        'Geolocation coordinates',
        'Risk assessment procedures',
        'Due diligence statements'
      ],
      impact: 'Critical for EU market access',
      documentation: 'EUDR Compliance Certificate #EU2024-BC-0847',
      responsible: 'EU Compliance Team',
      priority: 'Critical'
    },
    {
      name: 'IPCC Guidelines for National GHG Inventories',
      organization: 'Intergovernmental Panel on Climate Change',
      type: 'Methodological Standard',
      status: 'Compliant',
      compliance: 98,
      lastAudit: '2024-10-20',
      nextReview: '2025-01-20',
      description: 'International standard for greenhouse gas accounting and reporting',
      requirements: [
        'Emission factor methodology',
        'Activity data collection',
        'Uncertainty assessment',
        'Quality assurance protocols'
      ],
      impact: 'Essential for carbon credit verification',
      documentation: 'IPCC Compliance Report #IPCC-2024-LR-392',
      responsible: 'Carbon Accounting Team',
      priority: 'High'
    },
    {
      name: 'VERRA Verified Carbon Standard (VCS)',
      organization: 'VERRA',
      type: 'Carbon Credit Standard',
      status: 'Certified',
      compliance: 97,
      lastAudit: '2024-09-30',
      nextReview: '2024-12-30',
      description: 'Leading voluntary carbon credit standard for project validation',
      requirements: [
        'Project validation',
        'Baseline methodology',
        'Monitoring protocols',
        'Third-party verification'
      ],
      impact: 'Enables carbon credit sales',
      documentation: 'VCS Certificate #VCS-2024-BC360-1247',
      responsible: 'Carbon Projects Team',
      priority: 'High'
    },
    {
      name: 'Marine Stewardship Council (MSC)',
      organization: 'Marine Stewardship Council',
      type: 'Fisheries Standard',
      status: 'Certified',
      compliance: 91,
      lastAudit: '2024-08-15',
      nextReview: '2025-08-15',
      description: 'International standard for sustainable fisheries management',
      requirements: [
        'Stock assessment',
        'Ecosystem impact evaluation',
        'Management effectiveness',
        'Chain of custody certification'
      ],
      impact: 'Market access for sustainable fisheries',
      documentation: 'MSC Certificate #MSC-C-54879',
      responsible: 'Marine Resources Team',
      priority: 'Medium'
    },
    {
      name: 'Global Reporting Initiative (GRI)',
      organization: 'Global Reporting Initiative',
      type: 'Sustainability Reporting',
      status: 'Implementing',
      compliance: 87,
      lastAudit: '2024-07-10',
      nextReview: '2025-01-10',
      description: 'International framework for sustainability reporting',
      requirements: [
        'Materiality assessment',
        'Stakeholder engagement',
        'Impact disclosure',
        'Performance indicators'
      ],
      impact: 'Transparent sustainability communication',
      documentation: 'GRI Implementation Plan #GRI-BP-2024-078',
      responsible: 'Sustainability Team',
      priority: 'Medium'
    },
    {
      name: 'ISO 14001 Environmental Management',
      organization: 'International Organization for Standardization',
      type: 'Management System',
      status: 'Certified',
      compliance: 93,
      lastAudit: '2024-06-20',
      nextReview: '2025-06-20',
      description: 'International standard for environmental management systems',
      requirements: [
        'Environmental policy',
        'Legal compliance',
        'Continuous improvement',
        'Competence and awareness'
      ],
      impact: 'Systematic environmental management',
      documentation: 'ISO 14001 Certificate #ISO-14001-2024-BC360',
      responsible: 'Quality Management Team',
      priority: 'Medium'
    }
  ];

  // Compliance timeline and upcoming requirements
  const complianceTimeline = [
    {
      date: '2024-12-30',
      standard: 'VERRA VCS',
      event: 'Annual Verification',
      type: 'Review',
      status: 'Scheduled',
      importance: 'High'
    },
    {
      date: '2025-01-10',
      standard: 'GRI Standards',
      event: 'Sustainability Report Review',
      type: 'Assessment',
      status: 'Upcoming',
      importance: 'Medium'
    },
    {
      date: '2025-01-20',
      standard: 'IPCC Guidelines',
      event: 'Methodology Update',
      type: 'Review',
      status: 'Upcoming',
      importance: 'High'
    },
    {
      date: '2025-02-15',
      standard: 'EU Deforestation Regulation',
      event: 'Compliance Audit',
      type: 'Audit',
      status: 'Critical',
      importance: 'Critical'
    },
    {
      date: '2025-06-20',
      standard: 'ISO 14001',
      event: 'Certification Renewal',
      type: 'Certification',
      status: 'Planning',
      importance: 'Medium'
    },
    {
      date: '2025-08-15',
      standard: 'MSC Standards',
      event: 'Fisheries Assessment',
      type: 'Audit',
      status: 'Planning',
      importance: 'Medium'
    }
  ];

  // Regional and international partnerships
  const partnerships = [
    {
      organization: 'European Union',
      partnership: 'EUDR Compliance Partnership',
      type: 'Regulatory',
      since: '2023',
      status: 'Active',
      focus: 'Deforestation regulation compliance'
    },
    {
      organization: 'UNFCCC',
      partnership: 'Climate Action Network',
      type: 'Climate',
      since: '2022',
      status: 'Active',
      focus: 'Paris Agreement implementation'
    },
    {
      organization: 'IUCN',
      partnership: 'Marine Protected Areas Network',
      type: 'Conservation',
      since: '2021',
      status: 'Active',
      focus: 'Biodiversity conservation'
    },
    {
      organization: 'ECOWAS',
      partnership: 'West Africa Blue Economy Initiative',
      type: 'Regional',
      since: '2023',
      status: 'Active',
      focus: 'Regional coordination'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
      case 'certified':
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'implementing':
      case 'scheduled':
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return 'text-green-600';
    if (compliance >= 90) return 'text-yellow-600';
    if (compliance >= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="blue-carbon-360-layout">
      <Helmet>
        <title>Global Standards - Blue Carbon 360</title>
        <meta name="description" content="International standards compliance and certification management" />
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
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Globe className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900">Global Standards</h1>
                        <p className="text-slate-600">International compliance and certification management</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Compliance Report
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Standard
                      </Button>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                    92% Compliance Rate • 18 Active Standards • 12 Valid Certifications • 94.5/100 Audit Score
                  </Badge>
                </div>

                {/* Compliance Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {complianceMetrics.map((metric, index) => {
                    const IconComponent = metric.icon;
                    return (
                      <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-sm text-green-600 font-medium">
                              {metric.change}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                            <p className="text-3xl font-bold text-slate-900">
                              {metric.value}{metric.unit}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">{metric.period}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Standards Categories */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Standards Categories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {standardsCategories.map((category, index) => {
                      const IconComponent = category.icon;
                      return (
                        <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
                                  <IconComponent className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{category.category}</CardTitle>
                                  <p className="text-sm text-slate-600">{category.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="secondary">{category.count}</Badge>
                                <div className="mt-2">
                                  <div className="text-sm text-slate-600">Compliance</div>
                                  <div className={`text-lg font-bold ${getComplianceColor(category.compliance)}`}>
                                    {category.compliance}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {category.standards.slice(0, 4).map((standard, standardIndex) => (
                                <div key={standardIndex} className="text-sm text-slate-600 flex items-center gap-2">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  {standard}
                                </div>
                              ))}
                              {category.standards.length > 4 && (
                                <div className="text-sm text-blue-600 font-medium">
                                  +{category.standards.length - 4} more standards
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Key International Standards */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Key International Standards</h2>
                  <div className="space-y-6">
                    {keyStandards.map((standard, index) => (
                      <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-xl">{standard.name}</CardTitle>
                                <Badge className={getStatusColor(standard.status)}>
                                  {standard.status}
                                </Badge>
                                <Badge className={getPriorityColor(standard.priority)}>
                                  {standard.priority}
                                </Badge>
                              </div>
                              <p className="text-slate-600 mb-3">{standard.description}</p>
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-4 w-4" />
                                  <span>{standard.organization}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  <span>{standard.type}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Last audit: {new Date(standard.lastAudit).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Next review: {new Date(standard.nextReview).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-6">
                              <div className="text-sm text-slate-600 mb-1">Compliance</div>
                              <div className={`text-2xl font-bold ${getComplianceColor(standard.compliance)}`}>
                                {standard.compliance}%
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">Key Requirements</h4>
                              <div className="space-y-1">
                                {standard.requirements.map((req, reqIndex) => (
                                  <div key={reqIndex} className="text-sm text-slate-600 flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    {req}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">Business Impact</h4>
                              <p className="text-sm text-slate-600 mb-3">{standard.impact}</p>
                              <div className="text-sm text-slate-600">
                                <p className="font-medium">Responsible Team:</p>
                                <p>{standard.responsible}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">Documentation</h4>
                              <p className="text-sm text-slate-600 mb-3">{standard.documentation}</p>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Portal
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Compliance Timeline */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Compliance Timeline</h2>
                  <Card className="bg-white shadow-sm border-0">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b border-slate-200">
                            <tr>
                              <th className="text-left p-4 font-semibold text-slate-900">Date</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Standard</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Event</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Type</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Status</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Importance</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {complianceTimeline.map((item, index) => (
                              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-4 font-medium text-slate-900">{new Date(item.date).toLocaleDateString()}</td>
                                <td className="p-4 text-slate-600">{item.standard}</td>
                                <td className="p-4 text-slate-600">{item.event}</td>
                                <td className="p-4 text-slate-600">{item.type}</td>
                                <td className="p-4">
                                  <Badge className={getStatusColor(item.status)}>
                                    {item.status}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <Badge className={getPriorityColor(item.importance)}>
                                    {item.importance}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex gap-1">
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Calendar className="h-3 w-3" />
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

                {/* International Partnerships */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">International Partnerships</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {partnerships.map((partnership, index) => (
                      <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg mb-1">{partnership.organization}</CardTitle>
                              <p className="text-slate-600 text-sm">{partnership.partnership}</p>
                            </div>
                            <Badge className={getStatusColor(partnership.status)}>
                              {partnership.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Type:</span>
                              <span className="font-medium text-slate-900">{partnership.type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Since:</span>
                              <span className="font-medium text-slate-900">{partnership.since}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Focus:</span>
                              <span className="font-medium text-slate-900">{partnership.focus}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Standards Management Tools */}
                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span>Standards Management Tools</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Compliance Dashboard
                      </Button>
                      <Button variant="outline" className="h-16">
                        <Calendar className="h-5 w-5 mr-2" />
                        Audit Calendar
                      </Button>
                      <Button variant="outline" className="h-16">
                        <FileText className="h-5 w-5 mr-2" />
                        Document Portal
                      </Button>
                      <Button variant="outline" className="h-16">
                        <Award className="h-5 w-5 mr-2" />
                        Certification Hub
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