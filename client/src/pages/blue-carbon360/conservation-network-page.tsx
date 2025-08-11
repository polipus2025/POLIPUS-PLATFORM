import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Users,
  MapPin,
  Globe,
  Network,
  Building2,
  UserPlus,
  MessageSquare,
  Calendar,
  Award,
  Target,
  TrendingUp,
  Handshake,
  BookOpen,
  Star,
  Phone,
  Mail,
  ExternalLink,
  Search,
  Filter,
  Plus,
  Share,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Waves,
  TreePine,
  Fish,
  Leaf,
  Shield,
  Lightbulb,
  Briefcase,
  GraduationCap,
  Heart,
  Zap,
  Compass,
  Anchor,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Info
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ConservationNetworkPage() {
  // Fetch conservation network data
  const { data: networkData = [], isLoading: networkLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/conservation-network"],
  });

  // Network overview metrics
  const networkMetrics = [
    {
      title: 'Active Partners',
      value: 127,
      unit: 'organizations',
      icon: Users,
      color: 'bg-blue-500',
      change: '+18',
      period: 'This quarter'
    },
    {
      title: 'Conservation Projects',
      value: 64,
      unit: 'initiatives',
      icon: TreePine,
      color: 'bg-green-500',
      change: '+12',
      period: 'Active projects'
    },
    {
      title: 'Network Coverage',
      value: 85,
      unit: '%',
      icon: Globe,
      color: 'bg-cyan-500',
      change: '+7%',
      period: 'Geographic reach'
    },
    {
      title: 'Collaborative Impact',
      value: 2840000,
      unit: 'USD',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+42%',
      period: 'Combined value'
    }
  ];

  // Partner organizations by category
  const partnerCategories = [
    {
      category: 'Government Agencies',
      count: 23,
      icon: Building2,
      color: 'bg-blue-500',
      description: 'National and local government partners',
      partners: ['LACRA', 'Ministry of Agriculture', 'EPA Liberia', 'Forestry Development Authority']
    },
    {
      category: 'International NGOs',
      count: 18,
      icon: Globe,
      color: 'bg-green-500',
      description: 'Global conservation organizations',
      partners: ['Conservation International', 'WWF Liberia', 'USAID', 'EU Environment']
    },
    {
      category: 'Research Institutions',
      count: 15,
      icon: GraduationCap,
      color: 'bg-purple-500',
      description: 'Universities and research centers',
      partners: ['University of Liberia', 'CARI', 'Marine Biology Institute', 'Climate Research Center']
    },
    {
      category: 'Community Organizations',
      count: 34,
      icon: Heart,
      color: 'bg-orange-500',
      description: 'Local community groups and cooperatives',
      partners: ['Coastal Communities Alliance', 'Fishers Union', 'Women in Conservation', 'Youth Environmental Network']
    },
    {
      category: 'Private Sector',
      count: 28,
      icon: Briefcase,
      color: 'bg-indigo-500',
      description: 'Business and industry partners',
      partners: ['Sustainable Fisheries Co.', 'EcoTourism Liberia', 'Blue Economy Holdings', 'Carbon Credit Traders']
    },
    {
      category: 'Technology Partners',
      count: 9,
      icon: Zap,
      color: 'bg-yellow-500',
      description: 'Technology and innovation providers',
      partners: ['Satellite Monitoring Systems', 'Marine Tech Solutions', 'Conservation Apps', 'Data Analytics Corp']
    }
  ];

  // Featured network partners
  const featuredPartners = [
    {
      name: 'Conservation International Liberia',
      type: 'International NGO',
      logo: 'CI',
      status: 'Lead Partner',
      since: '2019',
      projects: 12,
      funding: 850000,
      expertise: ['Marine Protected Areas', 'Blue Carbon', 'Community Engagement'],
      contact: {
        name: 'Dr. Sarah Marine',
        title: 'Country Director',
        email: 'sarah.marine@ci.org',
        phone: '+231-555-0123'
      },
      description: 'Leading international conservation organization focusing on marine ecosystem protection',
      impact: 'Restored 2,400 hectares of mangrove ecosystems'
    },
    {
      name: 'University of Liberia Marine Research',
      type: 'Research Institution',
      logo: 'UL',
      status: 'Research Partner',
      since: '2020',
      projects: 8,
      funding: 420000,
      expertise: ['Marine Biology', 'Carbon Research', 'Data Analysis'],
      contact: {
        name: 'Prof. James Ocean',
        title: 'Marine Research Director',
        email: 'j.ocean@ul.edu.lr',
        phone: '+231-555-0156'
      },
      description: 'Premier research institution conducting marine conservation studies',
      impact: 'Published 24 peer-reviewed research papers'
    },
    {
      name: 'Coastal Communities Alliance',
      type: 'Community Organization',
      logo: 'CCA',
      status: 'Community Partner',
      since: '2018',
      projects: 15,
      funding: 280000,
      expertise: ['Community Mobilization', 'Traditional Knowledge', 'Livelihood Development'],
      contact: {
        name: 'Mary Coastal',
        title: 'Community Coordinator',
        email: 'mary@coastalalliance.lr',
        phone: '+231-555-0189'
      },
      description: 'Network of coastal communities working together for conservation',
      impact: 'Engaged 3,200 community members in conservation activities'
    },
    {
      name: 'LACRA Marine Division',
      type: 'Government Agency',
      logo: 'LACRA',
      status: 'Government Partner',
      since: '2017',
      projects: 20,
      funding: 1200000,
      expertise: ['Regulatory Compliance', 'Policy Development', 'Enforcement'],
      contact: {
        name: 'Director Marine Affairs',
        title: 'Marine Division Head',
        email: 'marine@lacra.gov.lr',
        phone: '+231-555-0134'
      },
      description: 'Government regulatory authority for agricultural and marine commodities',
      impact: 'Implemented 12 new conservation policies'
    },
    {
      name: 'Blue Economy Holdings',
      type: 'Private Sector',
      logo: 'BEH',
      status: 'Industry Partner',
      since: '2021',
      projects: 6,
      funding: 650000,
      expertise: ['Sustainable Business', 'Investment', 'Market Development'],
      contact: {
        name: 'Alex Business',
        title: 'Sustainability Director',
        email: 'alex@blueeconomy.lr',
        phone: '+231-555-0167'
      },
      description: 'Private sector leader in sustainable marine business development',
      impact: 'Created 450 sustainable employment opportunities'
    },
    {
      name: 'Marine Tech Solutions',
      type: 'Technology Partner',
      logo: 'MTS',
      status: 'Tech Partner',
      since: '2022',
      projects: 4,
      funding: 320000,
      expertise: ['Satellite Monitoring', 'Data Systems', 'Mobile Technology'],
      contact: {
        name: 'Dr. Tech Marine',
        title: 'CTO',
        email: 'tech@marinetech.lr',
        phone: '+231-555-0145'
      },
      description: 'Technology solutions for marine conservation monitoring',
      impact: 'Deployed monitoring systems across 8,500 km² of marine areas'
    }
  ];

  // Active collaborative projects
  const collaborativeProjects = [
    {
      project: 'Liberian Blue Carbon Initiative',
      partners: ['Conservation International', 'University of Liberia', 'LACRA', 'Coastal Communities Alliance'],
      status: 'Active',
      progress: 78,
      funding: 1250000,
      timeline: '2023-2026',
      objective: 'Restore and protect coastal ecosystems for carbon sequestration',
      impact: '3,200 hectares of mangrove restoration'
    },
    {
      project: 'Marine Protected Area Network',
      partners: ['LACRA', 'Conservation International', 'Blue Economy Holdings', 'Marine Tech Solutions'],
      status: 'Planning',
      progress: 45,
      funding: 890000,
      timeline: '2024-2027',
      objective: 'Establish network of marine protected areas',
      impact: '15,000 km² of marine protection'
    },
    {
      project: 'Community-Based Conservation Training',
      partners: ['Coastal Communities Alliance', 'University of Liberia', 'Conservation International'],
      status: 'Active',
      progress: 92,
      funding: 420000,
      timeline: '2023-2024',
      objective: 'Build local capacity for conservation management',
      impact: '580 community members trained'
    },
    {
      project: 'Carbon Credit Marketplace Development',
      partners: ['Blue Economy Holdings', 'Marine Tech Solutions', 'LACRA', 'Conservation International'],
      status: 'Development',
      progress: 35,
      funding: 750000,
      timeline: '2024-2025',
      objective: 'Create sustainable carbon credit trading platform',
      impact: 'Expected $2.4M in carbon credit sales'
    }
  ];

  // Network events and activities
  const networkEvents = [
    {
      event: 'Annual Blue Carbon Conference 2024',
      date: '2024-12-28',
      type: 'Conference',
      attendees: 340,
      location: 'Monrovia, Liberia',
      organizer: 'Conservation International',
      status: 'Upcoming'
    },
    {
      event: 'Coastal Communities Workshop',
      date: '2024-12-15',
      type: 'Workshop',
      attendees: 85,
      location: 'Buchanan, Grand Bassa',
      organizer: 'Coastal Communities Alliance',
      status: 'Completed'
    },
    {
      event: 'Marine Research Symposium',
      date: '2025-01-15',
      type: 'Symposium',
      attendees: 150,
      location: 'University of Liberia',
      organizer: 'UL Marine Research',
      status: 'Planning'
    },
    {
      event: 'Technology Innovation Forum',
      date: '2025-02-08',
      type: 'Forum',
      attendees: 120,
      location: 'Monrovia Tech Hub',
      organizer: 'Marine Tech Solutions',
      status: 'Announced'
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
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'lead partner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'development': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'upcoming': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'announced': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPartnerTypeIcon = (type: string) => {
    switch (type) {
      case 'International NGO': return Globe;
      case 'Government Agency': return Building2;
      case 'Research Institution': return GraduationCap;
      case 'Community Organization': return Heart;
      case 'Private Sector': return Briefcase;
      case 'Technology Partner': return Zap;
      default: return Users;
    }
  };

  return (
    <div className="blue-carbon-360-layout">
      <Helmet>
        <title>Conservation Network - Blue Carbon 360</title>
        <meta name="description" content="Conservation partnership network and collaborative initiatives" />
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
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900">Conservation Network</h1>
                        <p className="text-slate-600">Partnership ecosystem for marine conservation collaboration</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Search className="h-4 w-4 mr-2" />
                        Find Partners
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Partner
                      </Button>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                    127 Active Partners • 64 Projects • 85% Network Coverage • $2.84M Impact Value
                  </Badge>
                </div>

                {/* Network Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {networkMetrics.map((metric, index) => {
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
                              {metric.unit === 'USD' ? formatCurrency(metric.value) : metric.value}
                              {metric.unit !== 'USD' && metric.unit ? ` ${metric.unit}` : ''}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">{metric.period}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Partner Categories */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Partner Categories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partnerCategories.map((category, index) => {
                      const IconComponent = category.icon;
                      return (
                        <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200 cursor-pointer">
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
                              <Badge variant="secondary">{category.count}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {category.partners.slice(0, 3).map((partner, partnerIndex) => (
                                <div key={partnerIndex} className="text-sm text-slate-600 flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                  {partner}
                                </div>
                              ))}
                              {category.partners.length > 3 && (
                                <div className="text-sm text-blue-600 font-medium">
                                  +{category.partners.length - 3} more partners
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Featured Partners */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Network Partners</h2>
                  <div className="space-y-6">
                    {featuredPartners.map((partner, index) => {
                      const TypeIcon = getPartnerTypeIcon(partner.type);
                      return (
                        <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarFallback className="bg-blue-500 text-white text-lg font-bold">
                                    {partner.logo}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CardTitle className="text-xl">{partner.name}</CardTitle>
                                    <Badge className={getStatusColor(partner.status)}>
                                      {partner.status}
                                    </Badge>
                                  </div>
                                  <p className="text-slate-600 mb-3">{partner.description}</p>
                                  <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                      <TypeIcon className="h-4 w-4" />
                                      <span>{partner.type}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      <span>Partner since {partner.since}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Target className="h-4 w-4" />
                                      <span>{partner.projects} projects</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <TrendingUp className="h-4 w-4" />
                                      <span>{formatCurrency(partner.funding)} funding</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Expertise Areas</h4>
                                <div className="flex flex-wrap gap-2">
                                  {partner.expertise.map((area, areaIndex) => (
                                    <Badge key={areaIndex} variant="outline" className="text-xs">
                                      {area}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Primary Contact</h4>
                                <div className="space-y-1 text-sm text-slate-600">
                                  <p className="font-medium">{partner.contact.name}</p>
                                  <p>{partner.contact.title}</p>
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    <span>{partner.contact.email}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    <span>{partner.contact.phone}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Key Impact</h4>
                                <p className="text-sm text-slate-600">{partner.impact}</p>
                                <div className="flex gap-2 mt-3">
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Contact
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Share className="h-3 w-3 mr-1" />
                                    Share
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Collaborative Projects */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Active Collaborative Projects</h2>
                  <div className="space-y-4">
                    {collaborativeProjects.map((project, index) => (
                      <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg mb-2">{project.project}</CardTitle>
                              <p className="text-slate-600 mb-3">{project.objective}</p>
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{project.timeline}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  <span>{formatCurrency(project.funding)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="h-4 w-4" />
                                  <span>{project.impact}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                              <div className="mt-2">
                                <div className="text-sm text-slate-600 mb-1">Progress</div>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-slate-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${project.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium text-slate-700">{project.progress}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">Partner Organizations</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.partners.map((partner, partnerIndex) => (
                                <Badge key={partnerIndex} variant="outline" className="text-xs">
                                  {partner}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Network Events */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Network Events & Activities</h2>
                  <Card className="bg-white shadow-sm border-0">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b border-slate-200">
                            <tr>
                              <th className="text-left p-4 font-semibold text-slate-900">Event</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Date</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Type</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Location</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Attendees</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Organizer</th>
                              <th className="text-left p-4 font-semibold text-slate-900">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {networkEvents.map((event, index) => (
                              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-4 font-medium text-slate-900">{event.event}</td>
                                <td className="p-4 text-slate-600">{new Date(event.date).toLocaleDateString()}</td>
                                <td className="p-4 text-slate-600">{event.type}</td>
                                <td className="p-4 text-slate-600">{event.location}</td>
                                <td className="p-4 text-slate-600">{event.attendees} people</td>
                                <td className="p-4 text-slate-600">{event.organizer}</td>
                                <td className="p-4">
                                  <Badge className={getStatusColor(event.status)}>
                                    {event.status}
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

                {/* Network Management Tools */}
                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Network className="h-5 w-5 text-blue-600" />
                      <span>Network Management Tools</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white">
                        <Users className="h-5 w-5 mr-2" />
                        Partner Directory
                      </Button>
                      <Button variant="outline" className="h-16">
                        <Calendar className="h-5 w-5 mr-2" />
                        Event Calendar
                      </Button>
                      <Button variant="outline" className="h-16">
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Collaboration Hub
                      </Button>
                      <Button variant="outline" className="h-16">
                        <Download className="h-5 w-5 mr-2" />
                        Network Reports
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