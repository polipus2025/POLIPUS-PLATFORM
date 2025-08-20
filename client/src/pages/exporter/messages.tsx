import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare, Send, Search, User, Clock } from 'lucide-react';
import { Link } from 'wouter';

export default function ExporterMessages() {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const mockConversations = [
    {
      id: 1,
      participant: 'LACRA Inspector - Land',
      lastMessage: 'Inspection scheduled for tomorrow at 9:00 AM',
      timestamp: '2025-08-20 10:30 AM',
      unread: 2,
      status: 'official'
    },
    {
      id: 2,
      participant: 'European Chocolate Ltd.',
      lastMessage: 'Please confirm the shipment details for order ORD-2025-001',
      timestamp: '2025-08-20 09:15 AM',
      unread: 1,
      status: 'buyer'
    },
    {
      id: 3,
      participant: 'LACRA Compliance Office',
      lastMessage: 'Your EUDR documentation has been approved',
      timestamp: '2025-08-19 04:45 PM',
      unread: 0,
      status: 'official'
    },
    {
      id: 4,
      participant: 'Global Coffee Corp',
      lastMessage: 'Thank you for the quality samples. We are interested in placing a larger order',
      timestamp: '2025-08-19 02:20 PM',
      unread: 0,
      status: 'buyer'
    }
  ];

  const mockMessages = [
    {
      id: 1,
      sender: 'LACRA Inspector - Land',
      message: 'Good morning! I hope this message finds you well. I wanted to inform you that we have scheduled your routine inspection for tomorrow morning at 9:00 AM. Please ensure that all documentation is ready and accessible.',
      timestamp: '2025-08-20 10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      message: 'Good morning! Thank you for the notification. All documentation will be ready. Should I prepare anything specific for the inspection?',
      timestamp: '2025-08-20 10:35 AM',
      isOwn: true
    },
    {
      id: 3,
      sender: 'LACRA Inspector - Land',
      message: 'Please have your export permits, quality certificates, and batch tracking records available. Also, ensure that the storage areas are accessible for physical inspection.',
      timestamp: '2025-08-20 10:40 AM',
      isOwn: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'official': return 'bg-blue-100 text-blue-800';
      case 'buyer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.participant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Messages - Exporter Portal</title>
        <meta name="description" content="Communicate with LACRA officials, inspectors, and buyers" />
      </Helmet>

      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/exporter-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
                <p className="text-sm text-slate-600">Communicate with LACRA officials and buyers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  Conversations ({filteredConversations.length})
                </CardTitle>
                <Button size="sm">
                  New Message
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <h4 className="font-medium text-sm">{conversation.participant}</h4>
                        <Badge className={getStatusColor(conversation.status)} variant="secondary">
                          {conversation.status}
                        </Badge>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {conversation.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Message View */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 p-2 bg-gray-100 rounded-full" />
                      <div>
                        <CardTitle className="text-lg">{selectedConversation.participant}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.status === 'official' ? 'LACRA Official' : 'Verified Buyer'}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(selectedConversation.status)}>
                      {selectedConversation.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto h-96 p-4">
                  <div className="space-y-4">
                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md p-3 rounded-lg ${
                            message.isOwn
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="h-3 w-3 opacity-70" />
                            <span className="text-xs opacity-70">{message.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      rows={2}
                    />
                    <Button className="self-end">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}