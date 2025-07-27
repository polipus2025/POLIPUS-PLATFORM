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
import { MessageCircle, Send, Reply, Trash2, Clock, CheckCircle, AlertCircle, Users, Calendar, Search } from "lucide-react";
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
      content: ""
    }
  });

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/messages", currentUserId],
    queryFn: () => apiRequest(`/api/messages/${currentUserId}`),
  });

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ["/api/messages", currentUserId, "unread-count"],
    queryFn: () => apiRequest(`/api/messages/${currentUserId}/unread-count`),
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageData: any) => apiRequest("/api/messages", "POST", messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
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
      apiRequest(`/api/messages/${messageId}/read`, "PATCH", { recipientId: currentUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => apiRequest(`/api/messages/${messageId}`, "DELETE"),
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
    const messageData = {
      ...data,
      senderId: currentUserId,
      senderName: currentUserName,
      senderType: currentUserType,
      senderPortal: "regulatory_portal",
      recipientId: data.recipientId || "all_users",
      recipientName: data.recipientName || "All Users",
      recipientPortal: data.recipientType === "all_users" ? "all_portals" : `${data.recipientType}_portal`,
    };

    sendMessageMutation.mutate(messageData);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Internal Messaging</h1>
          <p className="text-muted-foreground">
            Communicate with all portal users across the AgriTrace360™ platform
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            {unreadData?.count || 0} Unread
          </Badge>
          <Dialog open={isComposing} onOpenChange={setIsComposing}>
            <DialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Compose Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Compose New Message</DialogTitle>
                <DialogDescription>
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

      <div className="grid grid-cols-12 gap-6">
        {/* Messages List */}
        <div className="col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages
              </CardTitle>
              <CardDescription>
                All internal messages from across the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No messages found
                </div>
              ) : (
                <div className="space-y-1">
                  {messages.map((message: Message) => (
                    <div
                      key={message.messageId}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedMessage?.messageId === message.messageId ? "bg-muted" : ""
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
            </CardContent>
          </Card>
        </div>

        {/* Message Details */}
        <div className="col-span-7">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {getMessageTypeIcon(selectedMessage.messageType)}
                      {selectedMessage.subject}
                      <Badge 
                        className={`${getPriorityColor(selectedMessage.priority)} text-white`}
                      >
                        {selectedMessage.priority}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>From:</strong> {selectedMessage.senderName}
                        </div>
                        <div>
                          <strong>Type:</strong> {selectedMessage.senderType}
                        </div>
                        <div>
                          <strong>To:</strong> {selectedMessage.recipientName || "All Users"}
                        </div>
                        <div>
                          <strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteMessageMutation.mutate(selectedMessage.messageId)}
                      disabled={deleteMessageMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
                
                {selectedMessage.hasReplies && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium mb-3">Replies</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Reply functionality will be available here
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a message to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}