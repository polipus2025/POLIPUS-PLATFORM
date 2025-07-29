import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle, Send, Reply, Trash2, Clock, CheckCircle, AlertCircle, Users, Calendar, Search, MessageSquare, Bell, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const messageFormSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Message content is required"),
  priority: z.string().default("normal"),
  messageType: z.string().default("general"),
  recipientType: z.string().min(1, "Recipient type is required"),
  recipientId: z.string().optional(),
  recipientName: z.string().optional(),
});

type MessageFormData = z.infer<typeof messageFormSchema>;

interface Message {
  id: number;
  messageId: string;
  subject: string;
  content: string;
  priority: string;
  messageType: string;
  senderId: string;
  senderName: string;
  senderType: string;
  senderPortal: string;
  recipientId?: string;
  recipientName?: string;
  recipientType?: string;
  recipientPortal?: string;
  status: string;
  isRead: boolean;
  readAt?: string;
  threadId?: string;
  parentMessageId?: string;
  hasReplies: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Messaging() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  // Get current user from localStorage
  const [currentUserId] = useState(() => 
    localStorage.getItem("username") || 
    localStorage.getItem("agentId") || 
    localStorage.getItem("farmerId") || 
    localStorage.getItem("exporterId") || 
    "admin001"
  );
  const [currentUserType] = useState(() => 
    localStorage.getItem("userType") || "regulatory"
  );
  const [currentUserName] = useState(() => 
    `${localStorage.getItem("firstName") || "System"} ${localStorage.getItem("lastName") || "User"}`
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      recipientType: "",
      priority: "normal",
      messageType: "general",
      subject: "",
      content: "",
      recipientId: "",
      recipientName: ""
    }
  });

  // Separate form for replies
  const replyForm = useForm({
    defaultValues: {
      priority: "normal",
      messageType: "general",
      content: ""
    }
  });

  // Reply to message mutation
  const replyMessageMutation = useMutation({
    mutationFn: ({ parentMessageId, replyData }: { parentMessageId: string; replyData: any }) => 
      apiRequest(`/api/messages/${parentMessageId}/reply`, {
        method: "POST",
        body: JSON.stringify(replyData)
      }),
    onSuccess: () => {
      // Invalidate all message-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      // Also invalidate unread count queries
      queryClient.invalidateQueries({ queryKey: ["/api/messages", currentUserId, "unread-count"] });
      setIsReplying(false);
      replyForm.reset();
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Fetch messages - optimized polling
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/messages", currentUserId],
    queryFn: () => apiRequest(`/api/messages/${currentUserId}`),
    refetchInterval: 30000, // Refresh every 30 seconds instead of 5
    staleTime: 25000, // Consider data fresh for 25 seconds
  });

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ["/api/messages", currentUserId, "unread-count"],
    queryFn: () => apiRequest(`/api/messages/${currentUserId}/unread-count`),
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageData: any) => apiRequest("/api/messages", {
      method: "POST",
      body: JSON.stringify(messageData)
    }),
    onSuccess: () => {
      // Invalidate all message-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      // Also invalidate unread count queries
      queryClient.invalidateQueries({ queryKey: ["/api/messages", currentUserId, "unread-count"] });
      setIsComposing(false);
      form.reset();
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: ({ messageId }: { messageId: string }) => 
      apiRequest(`/api/messages/${messageId}/read`, {
        method: "PATCH",
        body: JSON.stringify({ recipientId: currentUserId })
      }),
    onSuccess: () => {
      // Invalidate all message-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      // Also invalidate unread count queries
      queryClient.invalidateQueries({ queryKey: ["/api/messages", currentUserId, "unread-count"] });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => apiRequest(`/api/messages/${messageId}`, {
      method: "DELETE"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setSelectedMessage(null);
      toast({
        title: "Message Deleted",
        description: "The message has been deleted successfully.",
      });
    },
  });

  const onSubmit = (data: MessageFormData) => {
    // Generate recipient ID based on type
    let recipientId = "all_users";
    let recipientName = "All Users";
    let recipientPortal = "all_portals";
    
    if (data.recipientType !== "all_users") {
      // Set specific recipient based on type
      switch (data.recipientType) {
        case "farmer":
          recipientId = "FRM-2024-001";
          recipientName = "Moses Tuah";
          recipientPortal = "farmer_portal";
          break;
        case "field_agent":
          recipientId = "AGT-2024-001";
          recipientName = "Sarah Konneh";
          recipientPortal = "field_agent_portal";
          break;
        case "exporter":
          recipientId = "EXP-2024-001";
          recipientName = "Marcus Bawah";
          recipientPortal = "exporter_portal";
          break;
        case "regulatory_admin":
          recipientId = "admin001";
          recipientName = "System Admin";
          recipientPortal = "regulatory_portal";
          break;
        default:
          recipientId = "all_users";
          recipientName = "All Users";
          recipientPortal = "all_portals";
      }
    }

    const messageData = {
      ...data,
      senderId: currentUserId,
      senderName: currentUserName,
      senderType: currentUserType,
      senderPortal: `${currentUserType}_portal`,
      recipientId,
      recipientName,
      recipientType: data.recipientType,
      recipientPortal,
    };

    console.log("Sending message:", messageData);
    sendMessageMutation.mutate(messageData);
  };

  const onReply = (data: any) => {
    console.log("onReply function called with data:", data);
    if (!selectedMessage) {
      console.log("No selected message found");
      return;
    }

    const replyData = {
      subject: `Re: ${selectedMessage.subject}`,
      content: data.content,
      priority: data.priority,
      messageType: data.messageType,
      senderId: currentUserId,
      senderName: currentUserName,
      senderType: currentUserType,
      senderPortal: `${currentUserType}_portal`,
      recipientId: selectedMessage.senderId,
      recipientName: selectedMessage.senderName,
      recipientType: selectedMessage.senderType,
      recipientPortal: selectedMessage.senderPortal,
      threadId: selectedMessage.threadId,
    };

    console.log("Sending reply:", replyData);
    console.log("To parent message:", selectedMessage.messageId);
    
    replyMessageMutation.mutate({ 
      parentMessageId: selectedMessage.messageId, 
      replyData 
    });
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead && message.recipientId === currentUserId) {
      markAsReadMutation.mutate({ messageId: message.messageId });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "normal": return "bg-blue-500";
      case "low": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertCircle className="h-4 w-4" />;
      case "announcement": return <Users className="h-4 w-4" />;
      case "request": return <MessageCircle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen isms-gradient">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section - ISMS Style */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl isms-icon-bg-blue flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Internal Messaging</h1>
              <p className="text-slate-600 text-lg">Secure cross-portal communication system</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg border border-blue-200">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">{unreadData?.count || 0} Unread</span>
            </div>
            
            <Dialog open={isComposing} onOpenChange={setIsComposing}>
            <DialogTrigger asChild>
              <Button className="isms-button flex items-center gap-2">
                <Send className="h-4 w-4" />
                Compose Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl isms-card border-0 shadow-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-slate-900">
                  <Send className="h-5 w-5 text-blue-600" />
                  Compose New Message
                </DialogTitle>
                <DialogDescription className="text-slate-600">
                  Send a message to users across all portals
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recipientType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select recipient type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all_users">All Users</SelectItem>
                              <SelectItem value="farmer">Farmers</SelectItem>
                              <SelectItem value="field_agent">Field Agents</SelectItem>
                              <SelectItem value="exporter">Exporters</SelectItem>
                              <SelectItem value="regulatory_admin">LACRA Officers</SelectItem>
                              <SelectItem value="director">Directors</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="messageType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select message type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="announcement">Announcement</SelectItem>
                              <SelectItem value="alert">Alert</SelectItem>
                              <SelectItem value="request">Request</SelectItem>
                              <SelectItem value="support">Support</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="recipientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specific User ID (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., FRM-2024-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter message subject" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your message content..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsComposing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={sendMessageMutation.isPending}
                    >
                      {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Messages Section - ISMS Style */}
        <div className="grid grid-cols-12 gap-6">
        {/* Messages List - ISMS Style */}
        <div className="col-span-5">
          <div className="isms-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Messages</h3>
                <p className="text-slate-600">All internal platform communications</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="p-6 text-center text-slate-600">
                  <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="p-6 text-center text-slate-600">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No messages found
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {messages.map((message: Message) => (
                    <div
                      key={message.messageId}
                      className={`p-4 cursor-pointer hover:bg-white transition-colors ${
                        selectedMessage?.messageId === message.messageId ? "bg-white shadow-sm" : "bg-slate-50"
                      } ${!message.isRead && message.recipientId === currentUserId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}
                      onClick={() => handleMessageClick(message)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getMessageTypeIcon(message.messageType)}
                            <span className="text-sm font-medium truncate">
                              {message.subject}
                            </span>
                            <Badge 
                              className={`text-xs ${getPriorityColor(message.priority)} text-white`}
                            >
                              {message.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            From: {message.senderName} ({message.senderType})
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {message.content.substring(0, 100)}...
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.createdAt).toLocaleDateString()} {new Date(message.createdAt).toLocaleTimeString()}
                            </span>
                            {message.isRead && message.recipientId === currentUserId && (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Details - ISMS Style */}
        <div className="col-span-7">
          {selectedMessage ? (
            <div className="isms-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl isms-icon-bg-green flex items-center justify-center">
                    {getMessageTypeIcon(selectedMessage.messageType)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                      {selectedMessage.subject}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(selectedMessage.priority)}`}>
                        {selectedMessage.priority}
                      </div>
                    </h3>
                    <p className="text-slate-600">Message Details</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isReplying} onOpenChange={setIsReplying}>
                      <DialogTrigger asChild>
                        <Button 
                          className="isms-button flex items-center gap-2"
                          size="sm"
                          onClick={() => {
                            console.log("Reply button clicked for message:", selectedMessage?.messageId);
                            replyForm.reset({
                              priority: "normal",
                              messageType: "general",
                              content: ""
                            });
                          }}
                        >
                          <Reply className="h-4 w-4" />
                          Reply
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl isms-card border-0 shadow-xl">
                        <DialogHeader>
                          <DialogTitle>Reply to Message</DialogTitle>
                          <DialogDescription>
                            Replying to: {selectedMessage.subject}
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...replyForm}>
                          <form onSubmit={replyForm.handleSubmit(onReply)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={replyForm.control}
                                name="priority"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={replyForm.control}
                                name="messageType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Message Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select message type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="announcement">Announcement</SelectItem>
                                        <SelectItem value="alert">Alert</SelectItem>
                                        <SelectItem value="request">Request</SelectItem>
                                        <SelectItem value="support">Support</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={replyForm.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Reply Message</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Type your reply here..."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsReplying(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={replyMessageMutation.isPending}
                              >
                                {replyMessageMutation.isPending ? "Sending..." : "Send Reply"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteMessageMutation.mutate(selectedMessage.messageId)}
                      disabled={deleteMessageMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              
              {/* Message Metadata - ISMS Style */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-slate-700">From:</span>
                  <p className="text-slate-900">{selectedMessage.senderName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700">Type:</span>
                  <p className="text-slate-900">{selectedMessage.senderType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700">To:</span>
                  <p className="text-slate-900">{selectedMessage.recipientName || "All Users"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700">Date:</span>
                  <p className="text-slate-900">{new Date(selectedMessage.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Message Content */}
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Message Content</h4>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-slate-700">{selectedMessage.content}</p>
                </div>
                
                {selectedMessage.hasReplies && (
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <h4 className="font-medium mb-3 text-slate-900">Replies</h4>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-600">
                        Reply functionality will be available here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="isms-card">
              <div className="flex items-center justify-center h-96">
                <div className="text-center text-slate-600">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Message Selected</h3>
                  <p>Select a message from the list to view its details</p>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}