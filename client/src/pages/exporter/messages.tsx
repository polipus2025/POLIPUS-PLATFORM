import { memo, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare, Send, Search, Users, Clock } from 'lucide-react';
import { Link } from 'wouter';

const ExporterMessages = memo(() => {
  const [selectedConversation, setSelectedConversation] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const conversations = useMemo(() => [
    {
      id: 'conv-001',
      participant: 'LACRA Compliance Office',
      lastMessage: 'Your EUDR certificate has been approved',
      timestamp: '2025-08-22 10:30',
      unread: 2,
      type: 'official'
    },
    {
      id: 'conv-002',
      participant: 'European Chocolate Ltd.',
      lastMessage: 'Shipment EXP-001 received successfully',
      timestamp: '2025-08-22 09:15',
      unread: 0,
      type: 'buyer'
    },
    {
      id: 'conv-003',
      participant: 'Port Authority Monrovia',
      lastMessage: 'Container loading scheduled for tomorrow',
      timestamp: '2025-08-21 16:45',
      unread: 1,
      type: 'logistics'
    }
  ], []);

  const messages = useMemo(() => [
    {
      id: 'msg-001',
      sender: 'LACRA Compliance Office',
      content: 'Your EUDR compliance certificate for cocoa beans has been approved and is ready for download.',
      timestamp: '2025-08-22 10:30',
      type: 'received'
    },
    {
      id: 'msg-002',
      sender: 'You',
      content: 'Thank you for the quick approval. I will download the certificate now.',
      timestamp: '2025-08-22 10:35',
      type: 'sent'
    }
  ], []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'official': return 'bg-blue-100 text-blue-800';
      case 'buyer': return 'bg-green-100 text-green-800';
      case 'logistics': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Messages - Exporter Portal</title>
        <meta name="description" content="Secure messaging with buyers, officials, and logistics partners" />
      </Helmet>

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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
                <p className="text-sm text-slate-600">Secure communication portal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 ${
                      selectedConversation === conv.id ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{conv.participant}</h4>
                      {conv.unread > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">{conv.unread}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge className={getTypeColor(conv.type)} variant="secondary">
                        {conv.type}
                      </Badge>
                      <span className="text-xs text-gray-500">{conv.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {selectedConversation ? 'LACRA Compliance Office' : 'Select a conversation'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[450px]">
              {selectedConversation ? (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            message.type === 'sent'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 opacity-70" />
                            <span className="text-xs opacity-70">{message.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 min-h-[40px] max-h-[100px]"
                    />
                    <Button>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

ExporterMessages.displayName = 'ExporterMessages';
export default ExporterMessages;