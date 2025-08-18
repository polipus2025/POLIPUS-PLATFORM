import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Send, FileText, User, Calendar, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface CertificateApproval {
  id: number;
  certificateType: string;
  certificateNumber: string;
  requestedBy: string;
  requestedByType: string;
  inspectorReport: any;
  inspectorId: string;
  status: 'pending' | 'approved' | 'rejected' | 'sent';
  directorId?: string;
  approvalDate?: string;
  rejectionReason?: string;
  certificateData: any;
  priority: number;
  workflowId?: number;
  sentDate?: string;
  recipientEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CertificateApprovals() {
  const [selectedApproval, setSelectedApproval] = useState<CertificateApproval | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [directorId] = useState('DIR-LACRA-001'); // In real app, get from auth context
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingApprovals, isLoading: pendingLoading } = useQuery({
    queryKey: ['/api/certificates/approvals/pending'],
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const { data: allApprovals, isLoading: allLoading } = useQuery({
    queryKey: ['/api/certificates/approvals']
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/certificates/approve/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directorId })
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Certificate Approved",
        description: "Certificate has been approved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/certificates/approvals/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/certificates/approvals'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve certificate.",
        variant: "destructive",
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const response = await fetch(`/api/certificates/reject/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directorId, rejectionReason: reason })
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Certificate Rejected",
        description: "Certificate has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/certificates/approvals/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/certificates/approvals'] });
      setRejectionReason('');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject certificate.",
        variant: "destructive",
      });
    }
  });

  const sendMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/certificates/send/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Certificate Sent",
        description: "Certificate has been sent to the requesting party.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/certificates/approvals'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send certificate.",
        variant: "destructive",
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      approved: 'success',
      rejected: 'destructive',
      sent: 'secondary'
    } as const;
    
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      sent: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: number) => {
    const labels = { 1: 'Urgent', 2: 'Normal', 3: 'Low' };
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={colors[priority as keyof typeof colors]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const ApprovalCard = ({ approval }: { approval: CertificateApproval }) => (
    <Card key={approval.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{approval.certificateType}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <FileText className="h-4 w-4" />
              {approval.certificateNumber}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {getStatusBadge(approval.status)}
            {getPriorityBadge(approval.priority)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              Requested by: {approval.requestedBy} ({approval.requestedByType})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {new Date(approval.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {approval.inspectorReport && (
          <div className="bg-gray-50 p-3 rounded mb-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Inspector Report
            </h4>
            <p className="text-sm">
              {approval.inspectorReport.recommendation || 'Report available'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              By: {approval.inspectorId}
            </p>
          </div>
        )}

        {approval.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              onClick={() => approveMutation.mutate(approval.id)}
              disabled={approveMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Certificate</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for rejecting this certificate.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reason">Rejection Reason</Label>
                    <Textarea
                      id="reason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain why this certificate is being rejected..."
                    />
                  </div>
                  <Button
                    onClick={() => rejectMutation.mutate({ id: approval.id, reason: rejectionReason })}
                    disabled={!rejectionReason.trim() || rejectMutation.isPending}
                    variant="destructive"
                    className="w-full"
                  >
                    Confirm Rejection
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Certificate Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Certificate Data:</h4>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
                      {JSON.stringify(approval.certificateData, null, 2)}
                    </pre>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {approval.status === 'approved' && !approval.sentDate && (
          <Button
            onClick={() => sendMutation.mutate(approval.id)}
            disabled={sendMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Send to Requesting Party
          </Button>
        )}

        {approval.rejectionReason && (
          <div className="bg-red-50 p-3 rounded mt-4">
            <h4 className="font-medium text-red-800 mb-2">Rejection Reason:</h4>
            <p className="text-sm text-red-700">{approval.rejectionReason}</p>
          </div>
        )}

        {approval.sentDate && (
          <div className="bg-green-50 p-3 rounded mt-4">
            <p className="text-sm text-green-700">
              ✓ Sent on {new Date(approval.sentDate).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Certificate Approval System</h1>
        <p className="text-gray-600 mt-2">
          Review and approve/reject certificates before sending to requesting parties
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Approvals ({pendingApprovals?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="all">All Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              Loading pending approvals...
            </div>
          ) : pendingApprovals?.length > 0 ? (
            pendingApprovals.map((approval: CertificateApproval) => (
              <ApprovalCard key={approval.id} approval={approval} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No pending approvals</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {allLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              Loading certificates...
            </div>
          ) : allApprovals?.length > 0 ? (
            allApprovals.map((approval: CertificateApproval) => (
              <ApprovalCard key={approval.id} approval={approval} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No certificates found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}