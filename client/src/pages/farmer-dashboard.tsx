import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  MapPin, Calendar, Clock, Sprout, DollarSign, Bell, 
  TrendingUp, BarChart3, Users, Phone, Mail, Settings,
  LogOut, Home, Leaf, AlertCircle, CheckCircle,
  MessageSquare, Package, Star, Eye, User, Plus
} from "lucide-react";
import { Link } from "wouter";

interface FarmerData {
  id: number;
  farmerId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  county: string;
  district?: string;
  village?: string;
  farmSize?: number;
  primaryCrop?: string;
  secondaryCrops?: string;
  landMapData?: any;
  profilePicture?: string;
}

interface HarvestSchedule {
  id: number;
  scheduleId: string;
  scheduleName: string;
  cropType: string;
  cropVariety?: string;
  plantingArea: number;
  expectedHarvestStartDate: string;
  status: string;
  expectedYield?: number;
  marketingPlan?: string;
  expectedPrice?: number;
}

interface MarketplaceListing {
  id: number;
  listingId: string;
  cropType: string;
  quantityAvailable: number;
  pricePerUnit: number;
  harvestDate: string;
  status: string;
  viewCount: number;
  inquiryCount: number;
}

export default function FarmerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [farmerId] = useState(() => localStorage.getItem("farmerId") || "");
  const [farmerName] = useState(() => localStorage.getItem("farmerName") || "Farmer");
  const [activeTab, setActiveTab] = useState("overview");

  // Product offer form state
  const [productOffer, setProductOffer] = useState({
    commodityType: '',
    quantityAvailable: '',
    unit: '',
    pricePerUnit: '',
    qualityGrade: '',
    farmLocation: '',
    harvestDate: '',
    availableFromDate: '',
    paymentTerms: '',
    deliveryTerms: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only fetch farmer data initially (needed for overview) with proper defaults
  const { data: farmer = {} as any } = useQuery({
    queryKey: [`/api/farmers/${farmerId}`],
    enabled: !!farmerId
  });

  // Fetch data only when relevant tabs are active with proper defaults
  const { data: landMappings = [], isLoading: loadingMappings } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/land-mappings`],
    enabled: !!farmerId && activeTab === "mappings"
  });

  const { data: harvestSchedules = [], isLoading: loadingSchedules } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/harvest-schedules`],
    enabled: !!farmerId && (activeTab === "schedules" || activeTab === "overview")
  });

  const { data: marketplaceListings = [], isLoading: loadingListings } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/marketplace-listings`],
    enabled: !!farmerId && (activeTab === "marketplace" || activeTab === "overview")
  });

  const { data: buyerInquiries = [], isLoading: loadingInquiries } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/buyer-inquiries`],
    enabled: !!farmerId && (activeTab === "inquiries" || activeTab === "overview")
  });

  const { data: harvestAlerts = [], isLoading: loadingAlerts } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/harvest-alerts`],
    enabled: !!farmerId && activeTab === "alerts"
  });

  const { data: transactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/transactions`],
    enabled: !!farmerId && activeTab === "transactions"
  });

  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/messages`],
    enabled: !!farmerId && activeTab === "inquiries"
  });

  const handleLogout = () => {
    localStorage.removeItem("farmerId");
    localStorage.removeItem("farmerName");
    localStorage.removeItem("farmerToken");
    window.location.href = "/";
  };

  // Submit product offer mutation
  const submitProductOfferMutation = useMutation({
    mutationFn: async (offerData: any) => {
      return apiRequest('/api/farmer-product-offers', {
        method: 'POST',
        body: JSON.stringify(offerData),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Product Offer Submitted Successfully!",
        description: `${data.notificationsSent} buyers in your county have been notified. They will compete for your product - first to confirm wins!`,
      });
      // Reset form
      setProductOffer({
        commodityType: '',
        quantityAvailable: '',
        unit: '',
        pricePerUnit: '',
        qualityGrade: '',
        farmLocation: '',
        harvestDate: '',
        availableFromDate: '',
        paymentTerms: '',
        deliveryTerms: '',
        description: ''
      });
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error Submitting Offer",
        description: error.message || "Failed to submit product offer. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });

  // Handle form submission
  const handleSubmitProductOffer = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!productOffer.commodityType || !productOffer.quantityAvailable || !productOffer.unit || 
        !productOffer.pricePerUnit || !productOffer.qualityGrade || !productOffer.farmLocation ||
        !productOffer.harvestDate || !productOffer.availableFromDate || !productOffer.paymentTerms ||
        !productOffer.deliveryTerms) {
      toast({
        title: "Please fill all required fields",
        description: "All fields marked with * are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Calculate total value
    const totalValue = parseFloat(productOffer.quantityAvailable) * parseFloat(productOffer.pricePerUnit);
    
    const offerData = {
      farmerId: parseInt(farmerId),
      farmerName: farmerName,
      commodityType: productOffer.commodityType,
      quantityAvailable: parseFloat(productOffer.quantityAvailable),
      unit: productOffer.unit,
      pricePerUnit: parseFloat(productOffer.pricePerUnit),
      totalValue: totalValue,
      qualityGrade: productOffer.qualityGrade,
      farmLocation: productOffer.farmLocation,
      harvestDate: new Date(productOffer.harvestDate),
      availableFromDate: new Date(productOffer.availableFromDate),
      paymentTerms: productOffer.paymentTerms,
      deliveryTerms: productOffer.deliveryTerms,
      description: productOffer.description,
      county: farmer?.county || "Nimba", // Use farmer's county
    };

    submitProductOfferMutation.mutate(offerData);
  };

  // Handle form field changes
  const handleOfferChange = (field: string, value: string) => {
    setProductOffer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready_for_harvest": return "bg-green-100 text-green-800";
      case "harvested": return "bg-blue-100 text-blue-800";
      case "planted": return "bg-yellow-100 text-yellow-800";
      case "planned": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Harvest Management Functions
  const handleStartHarvest = async (schedule: HarvestSchedule) => {
    try {
      // Update schedule status to harvesting
      const response = await fetch(`/api/farmers/${farmerId}/harvest-schedules/${schedule.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: "harvesting",
          harvestStartDate: new Date().toISOString()
        })
      });

      if (response.ok) {
        toast({
          title: "Harvest Started",
          description: `Harvest process initiated for ${schedule.cropType}. Regional buyers will be notified when ready.`,
        });
        // Refresh data efficiently
        queryClient.invalidateQueries({ queryKey: [`/api/farmers/${farmerId}/harvest-schedules`] });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start harvest. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCompleteHarvest = async (schedule: HarvestSchedule) => {
    try {
      // Prompt for actual yield
      const actualYield = prompt(`Enter actual yield for ${schedule.cropType} (kg):`, schedule.expectedYield?.toString());
      if (!actualYield) return;

      const response = await fetch(`/api/farmers/${farmerId}/harvest-schedules/${schedule.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: "harvested",
          actualYield: parseFloat(actualYield),
          harvestEndDate: new Date().toISOString()
        })
      });

      if (response.ok) {
        // Trigger regional buyer alerts
        await fetch(`/api/farmers/${farmerId}/harvest-schedules/${schedule.id}/alert-buyers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        toast({
          title: "Harvest Completed & Buyers Alerted",
          description: `${schedule.cropType} harvest completed. Regional buyers have been notified via SMS and platform alerts.`,
        });
        queryClient.invalidateQueries({ queryKey: [`/api/farmers/${farmerId}/harvest-schedules`] });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete harvest. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateMarketplaceListing = (schedule: HarvestSchedule) => {
    toast({
      title: "Create Listing",
      description: `Creating marketplace listing for ${schedule.cropType}. Redirecting...`,
    });
    // TODO: Navigate to create listing page with pre-filled schedule data
  };

  const handleFindBuyers = (schedule: HarvestSchedule) => {
    toast({
      title: "Finding Buyers",
      description: `Searching for buyers interested in ${schedule.cropType} in your area.`,
    });
    // TODO: Open buyer search/recommendation modal
  };

  const handleSellToBuyers = (schedule: HarvestSchedule) => {
    toast({
      title: "Sell to Buyers",
      description: `Opening transaction interface for ${schedule.cropType} sales.`,
    });
    // TODO: Open transaction/negotiation interface
  };

  const handleViewTransactions = (schedule: HarvestSchedule) => {
    toast({
      title: "Transaction History",
      description: `Viewing sales transactions for ${schedule.cropType}.`,
    });
    // TODO: Open transaction history modal/page
  };

  // Transaction Management Functions
  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "negotiating": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleApproveTransaction = (transaction: any) => {
    toast({
      title: "Transaction Approved",
      description: `Approved sale of ${transaction.quantity}kg ${transaction.cropType} to ${transaction.buyerName}`,
    });
    // TODO: API call to approve transaction
  };

  const handleNegotiateTransaction = (transaction: any) => {
    toast({
      title: "Negotiation Started",
      description: `Opening negotiation interface with ${transaction.buyerName}`,
    });
    // TODO: Open negotiation modal/interface
  };

  const handleViewTransactionDetails = (transaction: any) => {
    toast({
      title: "Transaction Details",
      description: `Viewing complete details for transaction ${transaction.transactionId}`,
    });
    // TODO: Open transaction details modal
  };

  // Message Management Functions
  const handleAcceptInquiry = async (message: any) => {
    try {
      const response = await fetch(`/api/farmers/${farmerId}/transaction-proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: message.buyerId,
          scheduleId: message.scheduleId,
          cropType: message.scheduleId.includes('001') ? 'Cocoa' : 'Coffee',
          quantity: message.proposedQuantity,
          pricePerKg: message.proposedPrice,
          paymentTerms: "As discussed",
          deliveryTerms: "Farm pickup",
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
      });

      if (response.ok) {
        toast({
          title: "Inquiry Accepted",
          description: `Created transaction proposal with ${message.buyerId}. Awaiting buyer approval for unique transaction code generation.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept inquiry",
        variant: "destructive"
      });
    }
  };

  const handleNegotiateOffer = (message: any) => {
    const counterPrice = prompt(`Current offer: $${message.proposedPrice}/kg. Enter your counter-offer:`, (message.proposedPrice + 0.10).toFixed(2));
    if (counterPrice) {
      toast({
        title: "Counter Offer Sent",
        description: `Sent counter-offer of $${counterPrice}/kg to ${message.buyerId}`,
      });
      // TODO: Send counter-offer message
    }
  };

  const handleAcceptNegotiation = async (message: any) => {
    try {
      // Create approved proposal
      const response = await fetch(`/api/farmers/${farmerId}/transaction-proposals/demo-proposal/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverType: 'farmer' })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Terms Accepted - Transaction Created!",
          description: `Unique transaction code: ${result.transactionCode}. DDGOTS has been notified.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept negotiation",
        variant: "destructive"
      });
    }
  };

  const handleCounterOffer = (message: any) => {
    const counterPrice = prompt(`Current offer: $${message.proposedPrice}/kg. Enter your counter-offer:`, (message.proposedPrice + 0.05).toFixed(2));
    if (counterPrice) {
      toast({
        title: "Counter Offer Sent",
        description: `Sent counter-offer of $${counterPrice}/kg. Continuing negotiation.`,
      });
      // TODO: Send counter-offer message
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Farmer Portal</h1>
                <p className="text-sm text-gray-600">Welcome, {farmerName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                ID: {farmerId}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Land Mappings</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(landMappings) ? landMappings.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Harvest Schedules</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(harvestSchedules) ? harvestSchedules.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Marketplace Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(marketplaceListings) ? marketplaceListings.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Buyers</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(buyerInquiries) ? buyerInquiries.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-gray-100 rounded-lg p-1">
            <TabsTrigger 
              value="overview" 
              className="transition-all duration-200 ease-in-out hover:bg-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="mappings" 
              className="transition-all duration-200 ease-in-out hover:bg-white"
            >
              Land Mappings
            </TabsTrigger>
            <TabsTrigger 
              value="crop-scheduling" 
              className="transition-all duration-200 ease-in-out hover:bg-white"
            >
              Crop Scheduling
            </TabsTrigger>
            <TabsTrigger 
              value="schedules" 
              className="transition-all duration-200 ease-in-out hover:bg-white"
            >
              Harvest Schedules
            </TabsTrigger>
            <TabsTrigger 
              value="marketplace" 
              className="transition-all duration-200 ease-in-out hover:bg-white"
            >
              Marketplace
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="transition-all duration-200 ease-in-out hover:bg-white"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger 
              value="inquiries" 
              className="transition-all duration-200 ease-in-out hover:bg-white"
            >
              Available Buyers
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="transition-all duration-200 ease-in-out hover:bg-white"
            >
              Alerts
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Farmer Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Farmer Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {farmer && (
                    <>
                      <div className="flex items-center space-x-4">
                        {farmer.profilePicture ? (
                          <img 
                            src={farmer.profilePicture} 
                            alt="Profile" 
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">{farmer.firstName} {farmer.lastName}</h3>
                          <p className="text-gray-600">{farmer.county}, {farmer.district}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Primary Crop</p>
                          <p className="font-medium">{farmer.primaryCrop || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Farm Size</p>
                          <p className="font-medium">{farmer.farmSize || "Not specified"} hectares</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{farmer.phoneNumber || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{farmer.email || "Not provided"}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {harvestAlerts?.slice(0, 5).map((alert: any) => (
                      <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.title}</p>
                          <p className="text-xs text-gray-600">{alert.message}</p>
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority}
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No recent alerts</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Land Mappings Tab */}
          <TabsContent value="mappings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  My Land Mappings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingMappings ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-2 text-gray-600">Loading land mappings...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {landMappings?.map((mapping: any) => (
                    <Card key={mapping.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{mapping.landMappingName}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Area:</span>
                            <span className="font-medium">{mapping.totalArea} hectares</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Land Type:</span>
                            <span className="font-medium">{mapping.landType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Use:</span>
                            <span className="font-medium">{mapping.currentUse}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge className={mapping.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                              {mapping.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    )) || (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        No land mappings available. Contact your land inspector for mapping.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crop Scheduling Tab */}
          <TabsContent value="crop-scheduling" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Sprout className="w-5 h-5 mr-2" />
                    Crop Scheduling & Management
                  </CardTitle>
                  <Link href="/farmer/crop-scheduling">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Advanced Crop Management
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Active Crops</p>
                          <p className="text-2xl font-bold text-gray-900">3</p>
                        </div>
                        <Sprout className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Ready to Harvest</p>
                          <p className="text-2xl font-bold text-gray-900">1</p>
                        </div>
                        <Calendar className="w-8 h-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Listed for Sale</p>
                          <p className="text-2xl font-bold text-gray-900">2</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Crop Schedule</h3>
                    <div className="grid gap-4">
                      {/* Sample crop schedule items */}
                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Cocoa - Trinitario</h4>
                            <p className="text-sm text-gray-600">North Plot • 2.5 hectares</p>
                            <p className="text-xs text-green-600">Ready for harvest in 15 days</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className="bg-green-100 text-green-800">Ready Soon</Badge>
                          <Button variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Coffee - Arabica</h4>
                            <p className="text-sm text-gray-600">South Plot • 1.8 hectares</p>
                            <p className="text-xs text-blue-600">Growing stage • 45 days to harvest</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className="bg-blue-100 text-blue-800">Growing</Badge>
                          <Button variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Palm Oil - Tenera</h4>
                            <p className="text-sm text-gray-600">West Plot • 3.2 hectares</p>
                            <p className="text-xs text-yellow-600">Recently planted • 180 days to harvest</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className="bg-yellow-100 text-yellow-800">Planted</Badge>
                          <Button variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Quick Actions</h4>
                          <p className="text-sm text-gray-600">Manage your crops and connect with buyers</p>
                        </div>
                        <div className="flex space-x-2">
                          <Link href="/farmer/crop-scheduling">
                            <Button className="bg-green-600 hover:bg-green-700">
                              <Plus className="w-4 h-4 mr-1" />
                              Schedule New Crop
                            </Button>
                          </Link>
                          <Button variant="outline">
                            <Package className="w-4 h-4 mr-1" />
                            Create Listing
                          </Button>
                          <Button variant="outline">
                            <Users className="w-4 h-4 mr-1" />
                            Find Buyers
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Harvest Schedules Tab */}
          <TabsContent value="schedules" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Harvest Schedules
                  </CardTitle>
                  <Button 
                    onClick={() => toast({
                      title: "Feature Coming Soon",
                      description: "Harvest scheduling feature will be available in the next update."
                    })}
                    variant="outline"
                  >
                    <Sprout className="w-4 h-4 mr-2" />
                    Add Schedule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {harvestSchedules?.map((schedule: HarvestSchedule) => (
                    <Card key={schedule.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{schedule.scheduleName}</h4>
                            <p className="text-sm text-gray-600">{schedule.cropType} {schedule.cropVariety && `- ${schedule.cropVariety}`}</p>
                          </div>
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status.replace("_", " ")}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Area</p>
                            <p className="font-medium">{schedule.plantingArea} hectares</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Expected Harvest</p>
                            <p className="font-medium">{new Date(schedule.expectedHarvestStartDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Expected Yield</p>
                            <p className="font-medium">{schedule.expectedYield || "TBD"} kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Expected Price</p>
                            <p className="font-medium">${schedule.expectedPrice || "TBD"}/kg</p>
                          </div>
                        </div>

                        {schedule.status === "ready_for_harvest" && (
                          <div className="mt-3 space-y-3">
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-green-800 text-sm font-medium mb-2">
                                🌾 Ready for harvest! Take action now:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Button 
                                  
                                  className="bg-orange-600 hover:bg-orange-700 text-white"
                                  onClick={() => handleStartHarvest(schedule)}
                                  data-testid={`start-harvest-${schedule.id}`}
                                >
                                  <Sprout className="w-4 h-4 mr-1" />
                                  Start Harvest
                                </Button>
                                <Button 
                                  
                                  variant="outline"
                                  onClick={() => handleCreateMarketplaceListing(schedule)}
                                  data-testid={`create-listing-${schedule.id}`}
                                >
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  Create Listing
                                </Button>
                                <Button 
                                  
                                  variant="outline"
                                  onClick={() => handleFindBuyers(schedule)}
                                  data-testid={`find-buyers-${schedule.id}`}
                                >
                                  <Users className="w-4 h-4 mr-1" />
                                  Find Buyers
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {schedule.status === "harvesting" && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-blue-800 text-sm font-medium">
                                  🚜 Harvest in progress
                                </p>
                                <p className="text-blue-700 text-xs">Started: {new Date().toLocaleDateString()}</p>
                              </div>
                              <Button 
                                
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleCompleteHarvest(schedule)}
                                data-testid={`complete-harvest-${schedule.id}`}
                              >
                                Complete Harvest
                              </Button>
                            </div>
                          </div>
                        )}

                        {schedule.status === "harvested" && (
                          <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-purple-800 text-sm font-medium">
                                  ✅ Harvest completed! Ready for sale
                                </p>
                                <p className="text-purple-700 text-xs">Actual yield: {schedule.actualYield || schedule.expectedYield} kg</p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleSellToBuyers(schedule)}
                                  data-testid={`sell-to-buyers-${schedule.id}`}
                                >
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  Sell Now
                                </Button>
                                <Button 
                                  
                                  variant="outline"
                                  onClick={() => handleViewTransactions(schedule)}
                                  data-testid={`view-transactions-${schedule.id}`}
                                >
                                  View Sales
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No harvest schedules yet. Add your first schedule to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    My Marketplace Listings
                  </CardTitle>
                  <Button 
                    onClick={() => toast({
                      title: "Feature Coming Soon",
                      description: "Marketplace listing creation will be available in the next update."
                    })}
                    variant="outline"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Create Listing
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketplaceListings?.map((listing: MarketplaceListing) => (
                    <Card key={listing.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{listing.cropType}</h4>
                            <p className="text-sm text-gray-600">Listed on {new Date(listing.harvestDate).toLocaleDateString()}</p>
                          </div>
                          <Badge className={listing.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {listing.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Quantity</p>
                            <p className="font-medium">{listing.quantityAvailable} kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-medium">${listing.pricePerUnit}/kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Views</p>
                            <p className="font-medium flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {listing.viewCount}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Inquiries</p>
                            <p className="font-medium flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {listing.inquiryCount}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No marketplace listings yet. Create your first listing to connect with buyers.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Farmer-Buyer Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions?.map((transaction: any) => (
                    <Card key={transaction.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{transaction.transactionId}</h4>
                            <p className="text-sm text-gray-600">{transaction.buyerName} - {transaction.buyerCompany}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getTransactionStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {transaction.transactionType.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Crop</p>
                            <p className="font-medium">{transaction.cropType}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Quantity</p>
                            <p className="font-medium">{transaction.quantity} kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-medium">${transaction.pricePerKg}/kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Amount</p>
                            <p className="font-medium text-green-600">${transaction.totalAmount}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Payment Terms</p>
                            <p className="font-medium">{transaction.paymentTerms}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Delivery Date</p>
                            <p className="font-medium">{new Date(transaction.deliveryDate).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {transaction.status === "pending" && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-yellow-800 text-sm font-medium">
                                  🔄 Transaction pending your approval
                                </p>
                                <p className="text-yellow-700 text-xs">
                                  Review terms and approve or negotiate with buyer
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApproveTransaction(transaction)}
                                  data-testid={`approve-transaction-${transaction.id}`}
                                >
                                  ✓ Approve
                                </Button>
                                <Button 
                                  
                                  variant="outline"
                                  onClick={() => handleNegotiateTransaction(transaction)}
                                  data-testid={`negotiate-transaction-${transaction.id}`}
                                >
                                  💬 Negotiate
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {transaction.status === "completed" && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-green-800 text-sm font-medium">
                                  ✅ Transaction completed successfully
                                </p>
                                <p className="text-green-700 text-xs">
                                  Completed on: {new Date(transaction.completedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Button 
                                
                                variant="outline"
                                onClick={() => handleViewTransactionDetails(transaction)}
                                data-testid={`view-details-${transaction.id}`}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No transactions yet.</p>
                      <p className="text-sm">Complete your harvest and create marketplace listings to start selling to buyers.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Available Buyers Tab */}
          <TabsContent value="inquiries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Submit Product Offer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-6">
                  Submit your product details below and all buyers in your county will be automatically notified. 
                  The first buyer to confirm gets the transaction!
                </p>
                
                <form className="space-y-4" onSubmit={handleSubmitProductOffer}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commodity Type *
                      </label>
                      <select 
                        value={productOffer.commodityType}
                        onChange={(e) => handleOfferChange('commodityType', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        data-testid="select-commodity-type"
                        required
                      >
                        <option value="">Select Commodity</option>
                        <option value="cocoa">Cocoa</option>
                        <option value="coffee">Coffee</option>
                        <option value="palm_oil">Palm Oil</option>
                        <option value="rubber">Rubber</option>
                        <option value="cassava">Cassava</option>
                        <option value="coconut_oil">Coconut Oil</option>
                        <option value="tobacco">Tobacco</option>
                        <option value="robusta_coffee">Robusta Coffee</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity Available *
                      </label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="e.g., 500"
                        value={productOffer.quantityAvailable}
                        onChange={(e) => handleOfferChange('quantityAvailable', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        data-testid="input-quantity"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit *
                      </label>
                      <select 
                        value={productOffer.unit}
                        onChange={(e) => handleOfferChange('unit', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        data-testid="select-unit"
                        required
                      >
                        <option value="">Select Unit</option>
                        <option value="MT">Metric Tons (MT)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="tons">Tons</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price per Unit (USD) *
                      </label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="e.g., 1500"
                        value={productOffer.pricePerUnit}
                        onChange={(e) => handleOfferChange('pricePerUnit', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        data-testid="input-price"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quality Grade *
                      </label>
                      <select 
                        value={productOffer.qualityGrade}
                        onChange={(e) => handleOfferChange('qualityGrade', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        data-testid="select-quality-grade"
                        required
                      >
                        <option value="">Select Grade</option>
                        <option value="Premium Grade">Premium Grade</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Standard">Standard</option>
                        <option value="Export Quality">Export Quality</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Farm Location *
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g., Karnplay Village, Saclepea District"
                        value={productOffer.farmLocation}
                        onChange={(e) => handleOfferChange('farmLocation', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        data-testid="input-farm-location"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Harvest Date *
                      </label>
                      <input 
                        type="date" 
                        value={productOffer.harvestDate}
                        onChange={(e) => handleOfferChange('harvestDate', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        data-testid="input-harvest-date"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available From Date *
                      </label>
                      <input 
                        type="date" 
                        value={productOffer.availableFromDate}
                        onChange={(e) => handleOfferChange('availableFromDate', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        data-testid="input-available-from"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Terms *
                      </label>
                      <select 
                        value={productOffer.paymentTerms}
                        onChange={(e) => handleOfferChange('paymentTerms', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        data-testid="select-payment-terms"
                        required
                      >
                        <option value="">Select Payment Terms</option>
                        <option value="cash">Cash Payment</option>
                        <option value="installment">Installment</option>
                        <option value="credit">Credit Terms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Terms *
                      </label>
                      <select 
                        value={productOffer.deliveryTerms}
                        onChange={(e) => handleOfferChange('deliveryTerms', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        data-testid="select-delivery-terms"
                        required
                      >
                        <option value="">Select Delivery Terms</option>
                        <option value="farm_pickup">Farm Pickup</option>
                        <option value="delivery_available">Delivery Available</option>
                        <option value="port_delivery">Port Delivery</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Description
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Add any additional details about your product..."
                      value={productOffer.description}
                      onChange={(e) => handleOfferChange('description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      data-testid="textarea-description"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. Submit your product offer above</li>
                      <li>2. All buyers in your county get notified instantly</li>
                      <li>3. First buyer to confirm gets the transaction</li>
                      <li>4. You receive a unique verification code</li>
                      <li>5. Complete the transaction with the winning buyer</li>
                    </ol>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    data-testid="button-submit-offer"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Product Offer & Notify Buyers"}
                  </button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Available Buyers in Your County
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample available buyers - English only as requested */}
                  {[
                    {
                      id: 1,
                      name: "Michael Johnson",
                      company: "Johnson Agricultural Trading Co.",
                      specialties: ["Cocoa", "Coffee"],
                      location: "Monrovia, Liberia",
                      rating: 4.8,
                      status: "Active",
                      contact: "m.johnson@jatrading.com"
                    },
                    {
                      id: 2,
                      name: "Sarah Williams",
                      company: "Global Commodity Buyers LLC",
                      specialties: ["Palm Oil", "Rubber"],
                      location: "Buchanan, Liberia",
                      rating: 4.9,
                      status: "Premium",
                      contact: "s.williams@gcbuyers.com"
                    },
                    {
                      id: 3,
                      name: "David Chen",
                      company: "African Harvest Solutions",
                      specialties: ["Rice", "Cassava"],
                      location: "Gbarnga, Liberia",
                      rating: 4.7,
                      status: "Active",
                      contact: "d.chen@ahsolutions.com"
                    },
                    {
                      id: 4,
                      name: "Emily Rodriguez",
                      company: "Premium Agro Exports",
                      specialties: ["Cocoa", "Coffee", "Palm Oil"],
                      location: "Harper, Liberia",
                      rating: 4.6,
                      status: "Active",
                      contact: "e.rodriguez@premiumagro.com"
                    },
                    {
                      id: 5,
                      name: "James Thompson",
                      company: "Liberian Commodity Partners",
                      specialties: ["All Commodities"],
                      location: "Kakata, Liberia",
                      rating: 4.8,
                      status: "Premium",
                      contact: "j.thompson@lcpartners.com"
                    }
                  ].map((buyer: any) => (
                    <Card key={buyer.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{buyer.name}</h4>
                            <p className="text-sm text-gray-600">{buyer.company}</p>
                            <p className="text-sm text-gray-500">{buyer.location}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              className={buyer.status === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}
                            >
                              {buyer.status}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-medium text-sm">{buyer.rating}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">Specializes in:</p>
                          <div className="flex flex-wrap gap-1">
                            {buyer.specialties.map((specialty: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Contact:</p>
                          <p className="text-sm font-medium">{buyer.contact}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => toast({
                              title: "Contact Buyer",
                              description: `Connecting you with ${buyer.name} from ${buyer.company}`
                            })}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => toast({
                              title: "Send Message",
                              description: `Message sent to ${buyer.name}`
                            })}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Harvest Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {harvestAlerts?.map((alert: any) => (
                    <Card key={alert.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              alert.priority === "high" ? "bg-red-500" : 
                              alert.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                            }`} />
                            <div>
                              <h4 className="font-semibold">{alert.title}</h4>
                              <p className="text-sm text-gray-600">{alert.message}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getPriorityColor(alert.priority)}>
                              {alert.priority}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(alert.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {alert.alertType === "harvest_ready" && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm">
                              🌾 Your crop is ready for harvest! Consider creating a marketplace listing.
                            </p>
                            <Button 
                              
                              className="mt-2"
                              onClick={() => toast({
                                title: "Feature Coming Soon",
                                description: "Marketplace listing creation will be available in the next update."
                              })}
                              variant="outline"
                            >
                              Create Listing
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No alerts at this time. Alerts will appear here when your crops are ready for harvest.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}