import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  MessageSquare,
  Send,
  Inbox,
  Users,
  Clock,
  Pin,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Reply,
  Forward,
  Archive,
  Trash2,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Bell,
  Settings,
  Eye,
  EyeOff,
  Download,
  Share,
  Paperclip,
  Calendar,
  MapPin,
  Building2,
  Globe,
  Phone,
  Mail,
  User,
  Crown,
  Shield,
  Briefcase,
  GraduationCap,
  Heart,
  Zap,
  Target,
  Waves,
  TreePine,
  Leaf,
  Fish,
  Anchor,
  FileText
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ConservationMessagingPage() {
  // Fetch messaging data
  const { data: messagesData = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/messages"],
  });

  // Message overview metrics
  const messagingMetrics = [
    {
      title: 'Total Messages',
      value: 1847,
      unit: 'messages',
      icon: MessageSquare,
      color: 'bg-blue-500',
      change: '+234',
      period: 'This month'
    },
    {
      title: 'Active Conversations',
      value: 68,
      unit: 'threads',
      icon: Users,
      color: 'bg-green-500',
      change: '+12',
      period: 'Currently active'
    },
    {
      title: 'Unread Messages',
      value: 23,
      unit: 'new',
      icon: Bell,
      color: 'bg-orange-500',
      change: '+8',
      period: 'Needs attention'
    },
    {
      title: 'Response Time',
      value: 2.4,
      unit: 'hours',
      icon: Clock,
      color: 'bg-purple-500',
      change: '-0.6',
      period: 'Average response'
    }
  ];

  // Message categories and filters
  const messageCategories = [
    { category: 'All Messages', count: 1847, icon: MessageSquare, active: true },
    { category: 'Unread', count: 23, icon: Bell, active: false },
    { category: 'Starred', count: 156, icon: Star, active: false },
    { category: 'Sent', count: 892, icon: Send, active: false },
    { category: 'Drafts', count: 12, icon: Clock, active: false },
    { category: 'Archived', count: 340, icon: Archive, active: false }
  ];

  // Conservation team contacts
  const teamContacts = [
    {
      name: 'Dr. Marina Conserve',
      role: 'Marine Conservation Director',
      organization: 'Blue Carbon 360',
      avatar: 'MC',
      status: 'online',
      lastSeen: 'Active now',
      expertise: 'Marine Protected Areas',
      location: 'Monrovia, Liberia'
    },
    {
      name: 'Prof. James Ocean',
      role: 'Marine Research Lead',
      organization: 'University of Liberia',
      avatar: 'JO',
      status: 'online',
      lastSeen: '5 minutes ago',
      expertise: 'Carbon Research',
      location: 'Monrovia, Liberia'
    },
    {
      name: 'Sarah Coastal',
      role: 'Community Coordinator',
      organization: 'Coastal Communities Alliance',
      avatar: 'SC',
      status: 'away',
      lastSeen: '2 hours ago',
      expertise: 'Community Engagement',
      location: 'Buchanan, Grand Bassa'
    },
    {
      name: 'Alex Fisherman',
      role: 'Fisheries Manager',
      organization: 'Sustainable Fisheries Co.',
      avatar: 'AF',
      status: 'offline',
      lastSeen: '1 day ago',
      expertise: 'Sustainable Fishing',
      location: 'Greenville, Sinoe'
    },
    {
      name: 'Director LACRA Marine',
      role: 'Marine Division Head',
      organization: 'LACRA',
      avatar: 'LM',
      status: 'online',
      lastSeen: '15 minutes ago',
      expertise: 'Regulatory Compliance',
      location: 'Monrovia, Liberia'
    },
    {
      name: 'Tech Support Team',
      role: 'Technical Support',
      organization: 'Marine Tech Solutions',
      avatar: 'TS',
      status: 'online',
      lastSeen: 'Active now',
      expertise: 'System Support',
      location: 'Remote'
    }
  ];

  // Recent conversations
  const conversations = [
    {
      id: 1,
      sender: 'Dr. Marina Conserve',
      senderAvatar: 'MC',
      subject: 'Mangrove Restoration Project Update',
      preview: 'The restoration progress in Montserrado coastal zone is exceeding expectations. We have successfully planted 2,400 seedlings...',
      timestamp: '2 minutes ago',
      unread: true,
      priority: 'high',
      category: 'Project Updates',
      hasAttachments: true,
      participants: 3
    },
    {
      id: 2,
      sender: 'Prof. James Ocean',
      senderAvatar: 'JO',
      subject: 'Carbon Sequestration Research Results',
      preview: 'Latest research data shows significant carbon storage increases in protected seagrass meadows. The data analysis reveals...',
      timestamp: '1 hour ago',
      unread: true,
      priority: 'medium',
      category: 'Research',
      hasAttachments: true,
      participants: 5
    },
    {
      id: 3,
      sender: 'Sarah Coastal',
      senderAvatar: 'SC',
      subject: 'Community Training Schedule - December',
      preview: 'Community training sessions for sustainable fishing practices are scheduled for next week. We expect 85 participants...',
      timestamp: '3 hours ago',
      unread: false,
      priority: 'medium',
      category: 'Community',
      hasAttachments: false,
      participants: 2
    },
    {
      id: 4,
      sender: 'Director LACRA Marine',
      senderAvatar: 'LM',
      subject: 'EUDR Compliance Documentation Review',
      preview: 'Please review the attached compliance documentation for the upcoming EU audit. All traceability records need to be...',
      timestamp: '5 hours ago',
      unread: false,
      priority: 'high',
      category: 'Compliance',
      hasAttachments: true,
      participants: 4
    },
    {
      id: 5,
      sender: 'Alex Fisherman',
      senderAvatar: 'AF',
      subject: 'Fishing Quota Updates for Q1 2025',
      preview: 'Sustainable fishing quotas have been updated based on latest stock assessments. The new limits ensure long-term...',
      timestamp: '1 day ago',
      unread: false,
      priority: 'medium',
      category: 'Operations',
      hasAttachments: false,
      participants: 6
    },
    {
      id: 6,
      sender: 'Tech Support Team',
      senderAvatar: 'TS',
      subject: 'System Maintenance Notification',
      preview: 'Scheduled maintenance for the marine monitoring systems will occur this weekend. Expected downtime is 2-4 hours...',
      timestamp: '2 days ago',
      unread: false,
      priority: 'low',
      category: 'Technical',
      hasAttachments: false,
      participants: 1
    }
  ];

  // Message templates for common conservation topics
  const messageTemplates = [
    {
      title: 'Project Status Update',
      category: 'Project Management',
      template: 'Conservation project status update for [PROJECT_NAME]. Current progress: [PERCENTAGE]%. Key achievements this period include [ACHIEVEMENTS]. Upcoming milestones: [MILESTONES]. Any challenges: [CHALLENGES].'
    },
    {
      title: 'Community Meeting Invitation',
      category: 'Community Engagement',
      template: 'You are invited to participate in a community meeting on [DATE] at [TIME] in [LOCATION]. We will discuss [TOPICS]. Your input on [SPECIFIC_AREA] is particularly valuable. Please confirm your attendance.'
    },
    {
      title: 'Research Data Request',
      category: 'Research Collaboration',
      template: 'Request for research data on [RESEARCH_TOPIC]. We need data covering [TIME_PERIOD] for [GEOGRAPHIC_AREA]. This will support [PURPOSE]. Please share if available: [SPECIFIC_DATA_TYPES].'
    },
    {
      title: 'Compliance Reminder',
      category: 'Regulatory',
      template: 'Reminder: [COMPLIANCE_REQUIREMENT] deadline is [DATE]. Required documentation: [DOCUMENTS]. Current status: [STATUS]. Please ensure all requirements are met before the deadline.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
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
      case 'Project Updates': return TreePine;
      case 'Research': return GraduationCap;
      case 'Community': return Heart;
      case 'Compliance': return Shield;
      case 'Operations': return Briefcase;
      case 'Technical': return Zap;
      default: return MessageSquare;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Conservation Messaging - Blue Carbon 360</title>
        <meta name="description" content="Conservation team communication and collaboration platform" />
      </Helmet>

      <BlueCarbon360Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <BlueCarbon360Sidebar />
        
        <main className="flex-1 lg:ml-64 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 pb-20">
                
                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                        <MessageSquare className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900">Conservation Messaging</h1>
                        <p className="text-slate-600">Team communication and collaboration platform</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Search className="h-4 w-4 mr-2" />
                        Search Messages
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        New Message
                      </Button>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                    1,847 Total Messages • 68 Active Conversations • 23 Unread • 2.4h Response Time
                  </Badge>
                </div>

                {/* Messaging Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {messagingMetrics.map((metric, index) => {
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
                              {metric.value} {metric.unit}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">{metric.period}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Messages Panel */}
                  <div className="lg:col-span-2">
                    
                    {/* Message Categories */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {messageCategories.map((category, index) => {
                          const IconComponent = category.icon;
                          return (
                            <Button
                              key={index}
                              variant={category.active ? "default" : "outline"}
                              size="sm"
                              className="whitespace-nowrap"
                            >
                              <IconComponent className="h-4 w-4 mr-2" />
                              {category.category}
                              {category.count > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  {category.count}
                                </Badge>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-6">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search conversations..." className="pl-10" />
                          </div>
                        </div>
                        <Button variant="outline">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </div>
                    </div>

                    {/* Conversations List */}
                    <div className="space-y-4">
                      {conversations.map((conversation) => {
                        const CategoryIcon = getCategoryIcon(conversation.category);
                        return (
                          <Card 
                            key={conversation.id} 
                            className={`bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                              conversation.unread ? 'border-l-4 border-l-blue-500' : ''
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarFallback className="bg-blue-500 text-white font-bold">
                                    {conversation.senderAvatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <h3 className={`font-semibold ${conversation.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                                        {conversation.sender}
                                      </h3>
                                      {conversation.unread && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className={getPriorityColor(conversation.priority)}>
                                        {conversation.priority}
                                      </Badge>
                                      <span className="text-xs text-slate-500">{conversation.timestamp}</span>
                                    </div>
                                  </div>
                                  <h4 className={`font-medium mb-2 ${conversation.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {conversation.subject}
                                  </h4>
                                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                                    {conversation.preview}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                      <div className="flex items-center gap-1">
                                        <CategoryIcon className="h-3 w-3" />
                                        <span>{conversation.category}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        <span>{conversation.participants} participants</span>
                                      </div>
                                      {conversation.hasAttachments && (
                                        <div className="flex items-center gap-1">
                                          <Paperclip className="h-3 w-3" />
                                          <span>Attachments</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex gap-1">
                                      <Button variant="outline" size="sm">
                                        <Reply className="h-3 w-3" />
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Star className="h-3 w-3" />
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    
                    {/* Team Contacts */}
                    <Card className="bg-white shadow-sm border-0">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-600" />
                          Conservation Team
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {teamContacts.map((contact, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-blue-500 text-white font-bold text-sm">
                                  {contact.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-slate-900 truncate">{contact.name}</p>
                              <p className="text-xs text-slate-600 truncate">{contact.role}</p>
                              <p className="text-xs text-slate-500">{contact.lastSeen}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Message Templates */}
                    <Card className="bg-white shadow-sm border-0">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Message Templates
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {messageTemplates.map((template, index) => (
                          <div key={index} className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer">
                            <h4 className="font-medium text-sm text-slate-900 mb-1">{template.title}</h4>
                            <p className="text-xs text-slate-600 mb-2">{template.category}</p>
                            <p className="text-xs text-slate-500 line-clamp-2">{template.template}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="bg-white shadow-sm border-0">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Zap className="h-5 w-5 text-blue-600" />
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Meeting
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Share className="h-4 w-4 mr-2" />
                          Share Document
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Bell className="h-4 w-4 mr-2" />
                          Send Announcement
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Target className="h-4 w-4 mr-2" />
                          Project Update
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Message Composer */}
                <Card className="bg-white shadow-sm border-0 mt-8">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Send className="h-5 w-5 text-blue-600" />
                      Compose New Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">To:</label>
                        <Input placeholder="Select recipients..." />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Category:</label>
                        <Input placeholder="Select category..." />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Subject:</label>
                      <Input placeholder="Enter message subject..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Message:</label>
                      <Textarea placeholder="Type your message..." rows={6} />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="h-4 w-4 mr-2" />
                          Attach File
                        </Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Archive className="h-4 w-4 mr-2" />
                          Save Draft
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
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