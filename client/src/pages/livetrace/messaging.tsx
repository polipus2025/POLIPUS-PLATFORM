import { Helmet } from "react-helmet";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Search,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Reply,
  Forward,
  Archive,
  Star,
  Paperclip
} from "lucide-react";
import LiveTraceSidebar from "../../components/livetrace/live-trace-sidebar";
import LiveTraceHeader from "../../components/livetrace/live-trace-header";

export default function Messaging() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(1);
  const [newMessageText, setNewMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const messages = [
    {
      id: 1,
      from: "Dr. Sarah Johnson",
      fromAgency: "Ministry of Agriculture",
      subject: "Urgent: Disease Outbreak Alert - Montserrado County",
      preview: "We have confirmed cases of livestock disease in three farms in Montserrado County. Immediate quarantine measures are required...",
      timestamp: "2025-01-06 14:30:00",
      priority: "high",
      status: "unread",
      hasAttachment: true,
      thread: 3
    },
    {
      id: 2,
      from: "Michael Chen",
      fromAgency: "Transport Safety Division",
      subject: "Weekly Transport Safety Report",
      preview: "This week's transport safety report shows 98% compliance rate with new safety protocols. Two minor incidents reported...",
      timestamp: "2025-01-06 12:15:00", 
      priority: "normal",
      status: "read",
      hasAttachment: true,
      thread: 1
    },
    {
      id: 3,
      from: "Emma Rodriguez",
      fromAgency: "Farm Registration Office",
      subject: "RE: New Farm Registration Procedures",
      preview: "Thank you for the updated procedures. We have implemented the new digital registration system and seen a 40% improvement...",
      timestamp: "2025-01-06 10:45:00",
      priority: "normal", 
      status: "read",
      hasAttachment: false,
      thread: 2
    },
    {
      id: 4,
      from: "Dr. James Wilson",
      fromAgency: "Emergency Response Unit",
      subject: "Emergency Protocol Review Meeting",
      preview: "Scheduling emergency protocol review meeting for next week. Please confirm your availability for Tuesday, January 14th...",
      timestamp: "2025-01-05 16:20:00",
      priority: "normal",
      status: "read", 
      hasAttachment: false,
      thread: 1
    },
    {
      id: 5,
      from: "Lisa Park",
      fromAgency: "Data Security Office",
      subject: "Security Audit Completion Notice",
      preview: "The quarterly security audit has been completed. All systems passed security checks. Detailed report attached...",
      timestamp: "2025-01-05 11:30:00",
      priority: "low",
      status: "read",
      hasAttachment: true,
      thread: 1
    },
    {
      id: 6,
      from: "Robert Kim",
      fromAgency: "International Cooperation",
      subject: "WHO Collaboration Meeting Follow-up",
      preview: "Following up on yesterday's meeting with WHO representatives regarding livestock health monitoring standards...",
      timestamp: "2025-01-04 15:45:00",
      priority: "normal",
      status: "read",
      hasAttachment: false,
      thread: 1
    }
  ];

  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Priority</Badge>;
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusIndicator = (status: string) => {
    return status === "unread" ? (
      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Helmet>
        <title>Inter-agency Messaging - LiveTrace Livestock Monitoring System</title>
        <meta name="description" content="Inter-agency communication platform for LiveTrace livestock monitoring coordination" />
      </Helmet>

      <LiveTraceHeader />
      
      <div className="flex">
        <LiveTraceSidebar />
        
        <main className="flex-1 ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-center lg:text-left">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 justify-center lg:justify-start">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                  Inter-agency Messaging
                </h1>
                <p className="text-gray-600 mt-1">Coordinate with government agencies and partner organizations</p>
              </div>
              
              <div className="flex items-center justify-center lg:justify-end gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </div>
            </div>

            {/* Message Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Total Messages</CardTitle>
                  <MessageSquare className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{messages.length}</div>
                  <p className="text-xs opacity-80 mt-1">All conversations</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Unread Messages</CardTitle>
                  <AlertTriangle className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{messages.filter(m => m.status === 'unread').length}</div>
                  <p className="text-xs opacity-80 mt-1">Require attention</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">High Priority</CardTitle>
                  <AlertTriangle className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{messages.filter(m => m.priority === 'high').length}</div>
                  <p className="text-xs opacity-80 mt-1">Urgent items</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Active Threads</CardTitle>
                  <MessageSquare className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{new Set(messages.map(m => m.thread)).size}</div>
                  <p className="text-xs opacity-80 mt-1">Ongoing discussions</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Messaging Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Message List */}
              <div className="lg:col-span-1">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      Messages
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-0">
                    <div className="space-y-1">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          onClick={() => setSelectedMessage(message.id)}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedMessage === message.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIndicator(message.status)}
                              <span className="font-medium text-sm text-gray-900">{message.from}</span>
                              {message.hasAttachment && <Paperclip className="h-3 w-3 text-gray-400" />}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">{message.fromAgency}</p>
                            <h4 className="font-medium text-sm text-gray-900 truncate">{message.subject}</h4>
                          </div>
                          
                          <p className="text-xs text-gray-600 line-clamp-2">{message.preview}</p>
                          
                          <div className="flex items-center justify-between mt-3">
                            {getPriorityBadge(message.priority)}
                            {message.thread > 1 && (
                              <Badge variant="outline" className="text-xs">
                                {message.thread} replies
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Message Content */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  {selectedMessageData ? (
                    <>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{selectedMessageData.subject}</h3>
                            <p className="text-sm text-gray-600">
                              From: {selectedMessageData.from} ({selectedMessageData.fromAgency})
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(selectedMessageData.timestamp).toLocaleString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(selectedMessageData.priority)}
                            <Button variant="outline" size="sm">
                              <Reply className="h-4 w-4 mr-2" />
                              Reply
                            </Button>
                            <Button variant="outline" size="sm">
                              <Forward className="h-4 w-4 mr-2" />
                              Forward
                            </Button>
                            <Button variant="outline" size="sm">
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="flex-1 overflow-y-auto">
                        <div className="prose max-w-none">
                          <p className="text-gray-700 whitespace-pre-wrap">{selectedMessageData.preview}</p>
                          
                          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Message Details:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• This message requires urgent attention regarding livestock health monitoring</li>
                              <li>• Coordination needed with local veterinary services</li>
                              <li>• Follow-up expected within 24 hours</li>
                              <li>• Emergency contact: +231-XXX-XXXX</li>
                            </ul>
                          </div>
                          
                          {selectedMessageData.hasAttachment && (
                            <div className="mt-4 p-3 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Paperclip className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-700">Disease_Outbreak_Report_Jan2025.pdf</span>
                                <Button variant="outline" size="sm">Download</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      
                      <div className="border-t p-4">
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Type your reply..."
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                            className="flex-1"
                            rows={3}
                          />
                          <Button className="bg-blue-600 hover:bg-blue-700 self-end">
                            <Send className="h-4 w-4 mr-2" />
                            Send
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <CardContent className="flex-1 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium mb-2">Select a message</h3>
                        <p>Choose a message from the list to view its content</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}