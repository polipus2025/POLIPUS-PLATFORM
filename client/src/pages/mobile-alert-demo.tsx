import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Smartphone, 
  AlertTriangle, 
  Send, 
  CheckCircle, 
  MapPin, 
  User, 
  Clock 
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function MobileAlertDemo() {
  const [alertForm, setAlertForm] = useState({
    requestType: '',
    farmerId: '',
    agentId: 'AGT-2024-001',
    location: 'Lofa County - Field Location',
    description: '',
    urgencyLevel: 'normal'
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitAlertMutation = useMutation({
    mutationFn: async (alertData: any) => {
      return apiRequest('/api/mobile-alert-requests', {
        method: 'POST',
        body: JSON.stringify(alertData)
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Alert Submitted Successfully',
        description: 'Your mobile alert has been sent to the director dashboard for review.',
      });
      
      // Reset form
      setAlertForm({
        requestType: '',
        farmerId: '',
        agentId: 'AGT-2024-001',
        location: 'Lofa County - Field Location',
        description: '',
        urgencyLevel: 'normal'
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/mobile-alert-requests'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit mobile alert',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!alertForm.requestType || !alertForm.description) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    submitAlertMutation.mutate(alertForm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Mobile Alert Demo - AgriTrace360™</title>
        <meta name="description" content="Mobile alert submission demonstration for field agents" />
      </Helmet>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Smartphone className="h-8 w-8 text-blue-600" />
            Mobile Alert System Demo
          </h1>
          <p className="text-gray-600">
            Simulate mobile app alert submission to director dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mobile Alert Submission Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Submit Mobile Alert
              </CardTitle>
              <p className="text-sm text-gray-600">
                Fill out the form below to simulate a mobile alert submission
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="requestType">Alert Type *</Label>
                  <Select 
                    value={alertForm.requestType} 
                    onValueChange={(value) => setAlertForm({...alertForm, requestType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select alert type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer_registration">Farmer Registration</SelectItem>
                      <SelectItem value="inspection_report">Inspection Report</SelectItem>
                      <SelectItem value="compliance_issue">Compliance Issue</SelectItem>
                      <SelectItem value="quality_concern">Quality Concern</SelectItem>
                      <SelectItem value="urgent_notification">Urgent Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="urgencyLevel">Urgency Level</Label>
                  <Select 
                    value={alertForm.urgencyLevel} 
                    onValueChange={(value) => setAlertForm({...alertForm, urgencyLevel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agentId">Agent ID</Label>
                    <Input
                      id="agentId"
                      value={alertForm.agentId}
                      onChange={(e) => setAlertForm({...alertForm, agentId: e.target.value})}
                      placeholder="AGT-2024-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="farmerId">Farmer ID (Optional)</Label>
                    <Input
                      id="farmerId"
                      value={alertForm.farmerId}
                      onChange={(e) => setAlertForm({...alertForm, farmerId: e.target.value})}
                      placeholder="FRM-2024-001"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={alertForm.location}
                    onChange={(e) => setAlertForm({...alertForm, location: e.target.value})}
                    placeholder="County - District - GPS coordinates"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={alertForm.description}
                    onChange={(e) => setAlertForm({...alertForm, description: e.target.value})}
                    placeholder="Detailed description of the alert or issue..."
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={submitAlertMutation.isPending}
                >
                  {submitAlertMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Alert to Director
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Workflow Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alert Workflow Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">1. Mobile Submission</h4>
                    <p className="text-sm text-gray-600">
                      Field agent submits alert via mobile app with location and urgency level
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">2. Director Dashboard</h4>
                    <p className="text-sm text-gray-600">
                      Alert appears on director dashboard based on urgency rules
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">3. Compliance Review</h4>
                    <p className="text-sm text-gray-600">
                      Compliance officer verifies details and recommends action
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">4. Director Approval</h4>
                    <p className="text-sm text-gray-600">
                      Director approves or rejects with detailed notes for action
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Escalation Rules</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>Emergency:</strong> Immediate director notification</li>
                    <li>• <strong>High:</strong> Within 30 minutes</li>
                    <li>• <strong>Normal:</strong> Within 2 hours</li>
                    <li>• <strong>Low:</strong> Next business day</li>
                  </ul>
                </div>

                <div className="text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('/director-dashboard', '_blank')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    View Director Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}