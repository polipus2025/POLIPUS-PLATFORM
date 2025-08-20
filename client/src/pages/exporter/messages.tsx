import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter,
  User,
  Clock,
  Star,
  PinIcon,
  Reply,
  Archive,
  Trash2,
  Plus,
  Shield,
  Package,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ExporterNavbar from '@/components/layout/exporter-navbar';

export default function ExporterMessages() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const { toast } = useToast();

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Mock messages data
  const messages = [
    {
      id: 'MSG-2025-001',
      from: 'DDGOTS Office',
      sender: 'Sarah Konneh',
      subject: 'Order ORD-2025-001 Compliance Approval',
      category: 'compliance',
      priority: 'high',
      isRead: false,
      isPinned: false,
      timestamp: '2025-01-22 14:30',
      preview: 'Your coffee export order has been approved for compliance. Ready for port inspection.',
      content: `Dear Demo Export Company Ltd.,

Your export order ORD-2025-001 for 500 MT of coffee has successfully passed DDGOTS compliance review.

Order Details:
- Commodity: Coffee
- Quantity: 500 MT  
- Buyer: Liberian Agricultural Trading Co.
- Value: $1,400,000

Next Steps:
1. Port inspection has been scheduled for January 25, 2025
2. Inspector: Michael Togba will conduct the quality assessment
3. Ensure all documentation is ready for inspection

Please contact our office if you have any questions.

Best regards,
Sarah Konneh
DDGOTS Compliance Officer`,
      attachments: ['Compliance_Certificate_ORD-2025-001.pdf']
    },
    {
      id: 'MSG-2025-002',
      from: 'Buyer Network',
      sender: 'John Pewee',
      subject: 'Payment Confirmation - Order ORD-2025-001',
      category: 'payment',
      priority: 'medium',
      isRead: false,
      isPinned: true,
      timestamp: '2025-01-22 11:15',
      preview: 'Deposit payment of $420,000 (30%) has been processed for your coffee order.',
      content: `Hello,

This is to confirm that the deposit payment for Order ORD-2025-001 has been successfully processed.

Payment Details:
- Amount: $420,000 USD (30% deposit)
- Method: International Wire Transfer
- Reference: PAY-2025-001-DEP
- Remaining Balance: $980,000 (due on delivery)

The funds have been released to your designated account. You should see the deposit within 2-3 business days.

Thank you for your business partnership.

Best regards,
John Pewee
Liberian Agricultural Trading Co.`,
      attachments: ['Payment_Receipt_PAY-2025-001.pdf']
    },
    {
      id: 'MSG-2025-003',
      from: 'Port Authority',
      sender: 'Michael Togba',
      subject: 'Inspection Schedule - January 25, 2025',
      category: 'inspection',
      priority: 'high',
      isRead: true,
      isPinned: false,
      timestamp: '2025-01-21 16:45',
      preview: 'Port inspection scheduled for coffee shipment. Please prepare all required documentation.',
      content: `Dear Exporter,

This is to inform you that a port inspection has been scheduled for your coffee shipment.

Inspection Details:
- Date: January 25, 2025
- Time: 9:00 AM - 12:00 PM
- Location: Port of Monrovia, Warehouse 7B
- Inspector: Michael Togba (License #PI-2024-015)

Required Documentation:
- Export License
- EUDR Compliance Certificate  
- Quality Assessment Reports
- Phytosanitary Certificate
- Bill of Lading

Please ensure all samples are properly prepared and labeled. Any discrepancies may result in shipment delays.

Contact: +231 77 654 3210

Best regards,
Michael Togba
Senior Port Inspector`,
      attachments: ['Inspection_Checklist.pdf']
    },
    {
      id: 'MSG-2025-004',
      from: 'System Notification',
      sender: 'AgriTrace360 System',
      subject: 'Certificate Expiry Alert - Phytosanitary Certificate',
      category: 'alert',
      priority: 'medium',
      isRead: true,
      isPinned: false,
      timestamp: '2025-01-20 09:00',
      preview: 'Your phytosanitary certificate PHY-COC-2024-015 will expire in 60 days.',
      content: `Certificate Expiry Notice

Your phytosanitary certificate is approaching expiry:

Certificate Details:
- Certificate Number: PHY-COC-2024-015
- Type: Phytosanitary Certificate - Cocoa Export
- Current Expiry: March 15, 2025
- Days Remaining: 60 days

Action Required:
Please contact LACRA Plant Protection Division to renew this certificate before expiry to avoid shipment delays.

Contact Information:
- Phone: +231 77 LACRA (52272)
- Email: plantprotection@lacra.gov.lr

This is an automated notification from AgriTrace360 System.`,
      attachments: []
    },
    {
      id: 'MSG-2025-005',
      from: 'Buyer Network',
      sender: 'Maria Santos',
      subject: 'New Order Inquiry - Cocoa 300 MT',
      category: 'inquiry',
      priority: 'low',
      isRead: true,
      isPinned: false,
      timestamp: '2025-01-19 14:20',
      preview: 'Interested in purchasing 300 MT of Grade 1 cocoa for North American markets.',
      content: `Dear Export Partner,

I hope this message finds you well. We are interested in sourcing high-quality cocoa from your company.

Requirements:
- Commodity: Cocoa Beans
- Grade: Grade 1 
- Quantity: 300 MT
- Target Price: $3,100 - $3,300 per MT
- Delivery: Port of Monrovia
- Timeline: February 2025

We require EUDR compliance and Rainforest Alliance certification. If you can meet these requirements, please send us your proposal with:
- Availability confirmation
- Price quotation
- Quality specifications
- Delivery timeline

Looking forward to your response.

Best regards,
Maria Santos
West African Commodities Ltd.`,
      attachments: []
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'compliance': return 'bg-green-100 text-green-800';
      case 'payment': return 'bg-blue-100 text-blue-800';
      case 'inspection': return 'bg-purple-100 text-purple-800';
      case 'alert': return 'bg-yellow-100 text-yellow-800';
      case 'inquiry': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'compliance': return <Shield className="h-4 w-4" />;
      case 'payment': return <Package className="h-4 w-4" />;
      case 'inspection': return <Search className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'inquiry': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || message.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSendMessage = (formData: FormData) => {
    toast({
      title: 'Message Sent',
      description: 'Your message has been sent successfully.',
    });
    setIsComposeOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Messages - Exporter Portal</title>
        <meta name="description" content="Communicate with DDGOTS, buyers, and port inspectors" />
      </Helmet>

      <ExporterNavbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                Messages
              </h1>
              <p className="text-gray-600 mt-2">
                Communicate with DDGOTS officers, buyers, and port inspectors
              </p>
            </div>
            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Compose Message
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Compose New Message</DialogTitle>
                </DialogHeader>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSendMessage(formData);
                  }} 
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recipient">Recipient *</Label>
                      <Select name="recipient" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ddgots">DDGOTS Office</SelectItem>
                          <SelectItem value="port_inspector">Port Inspector</SelectItem>
                          <SelectItem value="buyer">Buyer Network</SelectItem>
                          <SelectItem value="lacra_support">LACRA Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select name="category" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="inspection">Inspection</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="inquiry">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input 
                      id="subject" 
                      name="subject"
                      placeholder="Enter message subject"
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      placeholder="Type your message here..."
                      rows={6}
                      required 
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsComposeOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Message Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {messages.filter(m => !m.isRead).length}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-red-600">
                    {messages.filter(m => m.priority === 'high').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pinned</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {messages.filter(m => m.isPinned).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {messages.length}
                  </p>
                </div>
                <Archive className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
              <SelectItem value="alert">Alerts</SelectItem>
              <SelectItem value="inquiry">Inquiries</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>

        {/* Messages List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                !message.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${getCategoryColor(message.category)}`}>
                          {getCategoryIcon(message.category)}
                        </div>
                        <Badge className={getCategoryColor(message.category)}>
                          {message.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{message.from}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{message.sender}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{message.timestamp}</span>
                      </div>
                    </div>
                    
                    <h3 className={`text-lg font-semibold ${!message.isRead ? 'text-gray-900' : 'text-gray-700'} mb-2`}>
                      {message.subject}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">{message.preview}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {message.attachments.length} attachment(s)
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {message.isPinned && (
                      <PinIcon className="h-4 w-4 text-yellow-500" />
                    )}
                    <div className={`flex items-center gap-1 ${getPriorityColor(message.priority)}`}>
                      <Star className="h-4 w-4" />
                      <span className="text-sm font-medium">{message.priority}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Found</h3>
              <p className="text-gray-600">
                {searchTerm || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You don\'t have any messages yet. Messages from DDGOTS, buyers, and port inspectors will appear here.'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Message Detail Modal */}
        {selectedMessage && (
          <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded ${getCategoryColor(selectedMessage.category)}`}>
                    {getCategoryIcon(selectedMessage.category)}
                  </div>
                  {selectedMessage.subject}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{selectedMessage.sender}</p>
                    <p className="text-sm text-gray-600">{selectedMessage.from}</p>
                    <p className="text-sm text-gray-500">{selectedMessage.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(selectedMessage.category)}>
                      {selectedMessage.category}
                    </Badge>
                    <Badge className={`${getPriorityColor(selectedMessage.priority)} bg-transparent border`}>
                      {selectedMessage.priority} priority
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {selectedMessage.content}
                  </pre>
                </div>
                
                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Attachments</h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                          <span className="text-sm text-gray-700">{attachment}</span>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}